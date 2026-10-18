import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, CloudSyncStatus } from './components/Header';
import { IncidentExecutivePanel } from './components/IncidentExecutivePanel';
import { OperationsActionPanel } from './components/OperationsActionPanel';
import { PersonalInfoModal } from './components/PersonalInfoModal';
import { FirebaseDiagnosticsModal } from './components/FirebaseDiagnosticsModal';
import { LoginPage } from './components/LoginPage';
import { LeftSidebarMenu } from './components/LeftSidebarMenu';
import { UserManualModal } from './components/UserManualModal';
import { AdminUserRegistryModal } from './components/AdminUserRegistryModal';
import { FirebaseRulesModal } from './components/FirebaseRulesModal';
import { ForcePasswordChangeModal } from './components/ForcePasswordChangeModal';
import {
  ShieldAlert,
  X,
  LayoutGrid,
  Shield,
  Compass,
  History,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  initialIncident,
  initialTimeline,
  initialActionItems,
  initialVessels,
  initialHelicopter,
  initialWeather,
  initialAuditRecords,
  initialUsers,
  fieldCoordinates
} from './data/initialData';
import {
  IncidentDetails,
  TimelineEvent,
  ActionItem,
  Vessel,
  Helicopter,
  WeatherData,
  AuditRecord,
  User
} from './types';
import {
  subscribeToDashboardState,
  saveDashboardState,
  resetDashboardStateInFirestore,
  testFirestoreConnection,
  fetchLiveDashboardState,
  fetchUsersRegistry,
  saveUsersRegistry,
  updateUserInRegistry,
  EMTDashboardFirestoreState,
  FirestoreErrorInfo
} from './firebase';

// Local storage fallback helpers
const getSavedState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`drsb_emt_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
  }
  return fallback;
};

const saveState = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(`drsb_emt_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
};

export type MobileTab = 'all' | 'overview' | 'operations' | 'audit';

export default function App() {
  // --- 0. Authentication State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('drsb_emt_authenticated') === 'true';
  });

  const [usersRegistry, setUsersRegistry] = useState<User[]>(() =>
    getSavedState<User[]>('users_registry', initialUsers)
  );

  const [currentUser, setCurrentUser] = useState<User>(() =>
    getSavedState<User>('currentUser', initialUsers[0])
  );

  // Force password change on first login with Dialog123
  const [pendingPasswordChangeUser, setPendingPasswordChangeUser] = useState<User | null>(null);

  // Modals & Drawers
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isUserRegistryOpen, setIsUserRegistryOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [dismissWarningBanner, setDismissWarningBanner] = useState(false);

  // --- 1. Global Public Dashboard State ---
  const [incident, setIncident] = useState<IncidentDetails>(() =>
    getSavedState<IncidentDetails>('incident', initialIncident)
  );
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    getSavedState<TimelineEvent[]>('timeline', initialTimeline)
  );
  const [actions, setActions] = useState<ActionItem[]>(() =>
    getSavedState<ActionItem[]>('actions', initialActionItems)
  );
  const [vessels, setVessels] = useState<Vessel[]>(() =>
    getSavedState<Vessel[]>('vessels', initialVessels)
  );
  const [helicopter, setHelicopter] = useState<Helicopter>(() =>
    getSavedState<Helicopter>('helicopter', initialHelicopter)
  );
  const [weather, setWeather] = useState<WeatherData>(() =>
    getSavedState<WeatherData>('weather', initialWeather)
  );
  const [auditTrail, setAuditTrail] = useState<AuditRecord[]>(() =>
    getSavedState<AuditRecord[]>('auditTrail', initialAuditRecords)
  );

  // --- 2. Infront Direct Editing & Draft State ---
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [draftIncident, setDraftIncident] = useState<IncidentDetails>(incident);
  const [draftTimeline, setDraftTimeline] = useState<TimelineEvent[]>(timeline);
  const [draftActions, setDraftActions] = useState<ActionItem[]>(actions);
  const [draftVessels, setDraftVessels] = useState<Vessel[]>(vessels);
  const [draftHelicopter, setDraftHelicopter] = useState<Helicopter>(helicopter);
  const [draftWeather, setDraftWeather] = useState<WeatherData>(weather);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [modifiedSections, setModifiedSections] = useState<Set<string>>(new Set());

  // Toast Feedback Banner
  const [publicPushToast, setPublicPushToast] = useState<{
    visible: boolean;
    message: string;
    user: string;
  } | null>(null);

  // --- 3. Cloud Sync Status & Diagnostics State ---
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>({
    isConnected: true,
    isSyncing: false,
    isPermissionError: false,
    lastUpdated: 'Connecting...'
  });
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  // Mobile layout navigation tab
  const [mobileTab, setMobileTab] = useState<MobileTab>('all');

  // Last update meta
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Live');
  const [lastUpdatedByUser, setLastUpdatedByUser] = useState<string>(initialUsers[0].name);

  // Ref to hold the latest public state
  const stateRef = useRef<EMTDashboardFirestoreState>({
    incident,
    timeline,
    actions,
    vessels,
    helicopter,
    weather,
    auditTrail
  });

  useEffect(() => {
    stateRef.current = {
      incident,
      timeline,
      actions,
      vessels,
      helicopter,
      weather,
      auditTrail
    };
  }, [incident, timeline, actions, vessels, helicopter, weather, auditTrail]);

  // Load and subscribe to users registry from Firestore
  useEffect(() => {
    fetchUsersRegistry().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setUsersRegistry(loaded);
        saveState('users_registry', loaded);
      }
    });
  }, []);

  // Synchronize drafts whenever entering edit mode
  const handleToggleEditMode = () => {
    if (!isEditMode) {
      setDraftIncident(incident);
      setDraftTimeline(timeline);
      setDraftActions(actions);
      setDraftVessels(vessels);
      setDraftHelicopter(helicopter);
      setDraftWeather(weather);
      setHasUnsavedChanges(false);
      setModifiedSections(new Set());
      setIsEditMode(true);
    } else {
      if (hasUnsavedChanges) {
        if (window.confirm('You have unsaved draft modifications. Discard and exit Edit Mode?')) {
          handleCancelEditMode();
        }
      } else {
        setIsEditMode(false);
      }
    }
  };

  const markChanged = (section: string) => {
    setHasUnsavedChanges(true);
    setModifiedSections((prev) => new Set(prev).add(section));
  };

  // Re-test connection
  const checkCloudConnectivity = useCallback(async () => {
    const res = await testFirestoreConnection();
    setCloudSyncStatus((prev) => ({
      ...prev,
      isConnected: res.ok,
      isPermissionError: res.isPermissionError || false,
      errorMessage: res.message
    }));
    if (!res.ok) {
      setLastSyncError(res.message);
    }
  }, []);

  // --- Real-Time Firebase Firestore Subscription ---
  useEffect(() => {
    checkCloudConnectivity();

    const unsubscribe = subscribeToDashboardState(
      (remoteState) => {
        if (remoteState) {
          if (remoteState.incident) {
            setIncident(remoteState.incident);
            saveState('incident', remoteState.incident);
          }
          if (remoteState.timeline) {
            setTimeline(remoteState.timeline);
            saveState('timeline', remoteState.timeline);
          }
          if (remoteState.actions) {
            setActions(remoteState.actions);
            saveState('actions', remoteState.actions);
          }
          if (remoteState.vessels && remoteState.vessels.length > 0) {
            setVessels(remoteState.vessels);
            saveState('vessels', remoteState.vessels);
          }
          if (remoteState.helicopter) {
            setHelicopter(remoteState.helicopter);
            saveState('helicopter', remoteState.helicopter);
          }
          if (remoteState.weather) {
            setWeather(remoteState.weather);
            saveState('weather', remoteState.weather);
          }
          if (remoteState.auditTrail && remoteState.auditTrail.length > 0) {
            setAuditTrail(remoteState.auditTrail);
            saveState('auditTrail', remoteState.auditTrail);
          }

          if (remoteState.lastUpdated) {
            setLastUpdatedTime(remoteState.lastUpdated);
          }
          if (remoteState.updatedBy) {
            setLastUpdatedByUser(remoteState.updatedBy);
          }

          setCloudSyncStatus({
            isConnected: true,
            isSyncing: false,
            isPermissionError: false,
            lastUpdated: remoteState.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          setLastSyncError(null);
        }
      },
      (error: FirestoreErrorInfo) => {
        const isPerm = error.code === 'permission-denied' || error.error.toLowerCase().includes('permission');
        setCloudSyncStatus((prev) => ({
          ...prev,
          isConnected: false,
          isSyncing: false,
          isPermissionError: isPerm,
          errorMessage: error.error
        }));
        setLastSyncError(error.error);
      }
    );

    return () => unsubscribe();
  }, [checkCloudConnectivity]);

  // --- Smooth Telemetry & Map Coordinate Drift Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Smooth movement of Vessel FCB-01
      setVessels((prev) =>
        prev.map((v) => {
          if (v.id === 'FCB-01') {
            const startLat = fieldCoordinates.moccShoreBase.lat;
            const startLng = fieldCoordinates.moccShoreBase.lng;
            const targetLat = fieldCoordinates.sldpA.lat;
            const targetLng = fieldCoordinates.sldpA.lng;

            let nextLat = v.coordinates[0] + (targetLat - startLat) * 0.012;
            let nextLng = v.coordinates[1] + (targetLng - startLng) * 0.012;

            if (Math.abs(nextLat - targetLat) < 0.005) {
              nextLat = startLat;
              nextLng = startLng;
            }

            return {
              ...v,
              coordinates: [nextLat, nextLng]
            };
          }
          return v;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // --- Direct Infront Editing Handlers (Modifying Draft State) ---

  const handleUpdateIncidentField = <K extends keyof IncidentDetails>(
    field: K,
    value: IncidentDetails[K]
  ) => {
    setDraftIncident((prev) => ({ ...prev, [field]: value }));
    markChanged('Incident SITREP & Objectives');
  };

  const handleUpdateWeatherField = <K extends keyof WeatherData>(
    field: K,
    value: WeatherData[K]
  ) => {
    setDraftWeather((prev) => ({ ...prev, [field]: value }));
    markChanged('Weather Telemetry');
  };

  const handleAddPriority = () => {
    setDraftIncident((prev) => ({
      ...prev,
      currentPriorities: [...prev.currentPriorities, 'New priority statement']
    }));
    markChanged('Command Priorities');
  };

  const handleUpdatePriority = (index: number, value: string) => {
    setDraftIncident((prev) => {
      const next = [...prev.currentPriorities];
      next[index] = value;
      return { ...prev, currentPriorities: next };
    });
    markChanged('Command Priorities');
  };

  const handleDeletePriority = (index: number) => {
    setDraftIncident((prev) => ({
      ...prev,
      currentPriorities: prev.currentPriorities.filter((_, i) => i !== index)
    }));
    markChanged('Command Priorities');
  };

  const handleAddObjective = () => {
    setDraftIncident((prev) => ({
      ...prev,
      incidentObjectives: [...prev.incidentObjectives, 'New response objective']
    }));
    markChanged('Strategic Objectives');
  };

  const handleUpdateObjective = (index: number, value: string) => {
    setDraftIncident((prev) => {
      const next = [...prev.incidentObjectives];
      next[index] = value;
      return { ...prev, incidentObjectives: next };
    });
    markChanged('Strategic Objectives');
  };

  const handleDeleteObjective = (index: number) => {
    setDraftIncident((prev) => ({
      ...prev,
      incidentObjectives: prev.incidentObjectives.filter((_, i) => i !== index)
    }));
    markChanged('Strategic Objectives');
  };

  const handleAddSitrepBullet = () => {
    setDraftIncident((prev) => ({
      ...prev,
      latestSitrepText: [...prev.latestSitrepText, 'Operational SITREP update bullet']
    }));
    markChanged('SITREP Bullets');
  };

  const handleUpdateSitrepBullet = (index: number, value: string) => {
    setDraftIncident((prev) => {
      const next = [...prev.latestSitrepText];
      next[index] = value;
      return { ...prev, latestSitrepText: next };
    });
    markChanged('SITREP Bullets');
  };

  const handleDeleteSitrepBullet = (index: number) => {
    setDraftIncident((prev) => ({
      ...prev,
      latestSitrepText: prev.latestSitrepText.filter((_, i) => i !== index)
    }));
    markChanged('SITREP Bullets');
  };

  const handleAddAction = () => {
    const nextId =
      draftActions.length > 0 ? Math.max(...draftActions.map((a) => a.id)) + 1 : 1;
    setDraftActions((prev) => [
      ...prev,
      {
        id: nextId,
        action: 'New emergency action task',
        responsible: currentUser.name.split(' ')[0] || 'MOCC',
        status: 'In Progress'
      }
    ]);
    markChanged('Action Items Tracker');
  };

  const handleUpdateAction = (id: number, field: keyof ActionItem, value: any) => {
    setDraftActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
    markChanged('Action Items Tracker');
  };

  const handleDeleteAction = (id: number) => {
    setDraftActions((prev) => prev.filter((a) => a.id !== id));
    markChanged('Action Items Tracker');
  };

  // Quick action status toggle in live view
  const handleToggleActionStatus = async (id: number) => {
    const targetList = isEditMode ? draftActions : actions;
    const updated = targetList.map((a) => {
      if (a.id === id) {
        const nextStatus: 'Completed' | 'In Progress' | 'Pending' =
          a.status === 'Completed'
            ? 'In Progress'
            : a.status === 'In Progress'
            ? 'Completed'
            : 'Completed';
        return { ...a, status: nextStatus };
      }
      return a;
    });

    if (isEditMode) {
      setDraftActions(updated);
      markChanged('Action Items Tracker');
    } else {
      setActions(updated);
      saveState('actions', updated);

      const targetAction = targetList.find((a) => a.id === id);
      const newStatus = targetAction?.status === 'Completed' ? 'In Progress' : 'Completed';
      const auditEntry: AuditRecord = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        userName: currentUser.name,
        userRole: currentUser.role,
        staffId: currentUser.staffId,
        summary: `Updated Action #${id} status to "${newStatus}"`,
        changeCount: 1
      };

      const updatedAudit = [auditEntry, ...auditTrail].slice(0, 50);
      setAuditTrail(updatedAudit);
      saveState('auditTrail', updatedAudit);

      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      try {
        await saveDashboardState(
          {
            ...stateRef.current,
            actions: updated,
            auditTrail: updatedAudit
          },
          currentUser.name,
          auditEntry
        );
        setCloudSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          isConnected: true,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      } catch (e: any) {
        console.error('Error saving action status to Firestore:', e);
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      }
    }
  };

  const handleAddTimeline = () => {
    const newEntry: TimelineEvent = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'New milestone / communication recorded',
      category: 'response'
    };
    setDraftTimeline((prev) => [...prev, newEntry]);
    markChanged('Incident Timeline');
  };

  const handleUpdateTimeline = (id: string, field: keyof TimelineEvent, value: any) => {
    setDraftTimeline((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
    markChanged('Incident Timeline');
  };

  const handleDeleteTimeline = (id: string) => {
    setDraftTimeline((prev) => prev.filter((t) => t.id !== id));
    markChanged('Incident Timeline');
  };

  const handleAddVessel = () => {
    const newVessel: Vessel = {
      id: `VESSEL-${Date.now().toString().slice(-4)}`,
      name: 'MV Crest Support',
      status: 'Standby',
      eta: '16:00',
      speedKnots: 15,
      coordinates: [fieldCoordinates.moccShoreBase.lat + 0.02, fieldCoordinates.moccShoreBase.lng - 0.03],
      heading: 320
    };
    setDraftVessels((prev) => [...prev, newVessel]);
    markChanged('Marine Logistics');
  };

  const handleUpdateVessel = (id: string, field: keyof Vessel, value: any) => {
    setDraftVessels((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
    markChanged('Marine Logistics');
  };

  const handleDeleteVessel = (id: string) => {
    setDraftVessels((prev) => prev.filter((v) => v.id !== id));
    markChanged('Marine Logistics');
  };

  const handleUpdateHelicopter = (field: keyof Helicopter, value: any) => {
    setDraftHelicopter((prev) => ({ ...prev, [field]: value }));
    markChanged('Aviation Asset');
  };

  // --- Cancel Edit Mode & Revert Drafts ---
  const handleCancelEditMode = () => {
    setDraftIncident(incident);
    setDraftTimeline(timeline);
    setDraftActions(actions);
    setDraftVessels(vessels);
    setDraftHelicopter(helicopter);
    setDraftWeather(weather);
    setHasUnsavedChanges(false);
    setModifiedSections(new Set());
    setIsEditMode(false);
  };

  // --- SAVE & PUSH PUBLIC ---
  const handleSaveAndPushPublic = async () => {
    const timeString = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const changedSectionsArr = Array.from(modifiedSections);
    const summaryText =
      changedSectionsArr.length > 0
        ? `Modified: ${changedSectionsArr.join(', ')}`
        : 'Emergency Management Dashboard details synchronized';

    const newAuditEntry: AuditRecord = {
      id: `aud-${Date.now()}`,
      timestamp: timeString,
      userName: currentUser.name,
      userRole: currentUser.role,
      staffId: currentUser.staffId,
      summary: summaryText,
      changeCount: Math.max(1, changedSectionsArr.length)
    };

    const nextAuditTrail = [newAuditEntry, ...auditTrail].slice(0, 50);

    // 1. Commit to live React state
    setIncident(draftIncident);
    setTimeline(draftTimeline);
    setActions(draftActions);
    setVessels(draftVessels);
    setHelicopter(draftHelicopter);
    setWeather(draftWeather);
    setAuditTrail(nextAuditTrail);
    setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setLastUpdatedByUser(currentUser.name);

    // 2. Persist to localStorage
    saveState('incident', draftIncident);
    saveState('timeline', draftTimeline);
    saveState('actions', draftActions);
    saveState('vessels', draftVessels);
    saveState('helicopter', draftHelicopter);
    saveState('weather', draftWeather);
    saveState('auditTrail', nextAuditTrail);

    // 3. Reset edit flags
    setHasUnsavedChanges(false);
    setModifiedSections(new Set());
    setIsEditMode(false);

    // 4. Trigger sleek Apple feedback toast
    setPublicPushToast({
      visible: true,
      message: 'Changes saved & pushed public to live emergency dashboard',
      user: currentUser.name
    });
    setTimeout(() => {
      setPublicPushToast(null);
    }, 4500);

    // 5. Broadcast to Firebase Firestore
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      await saveDashboardState(
        {
          incident: draftIncident,
          timeline: draftTimeline,
          actions: draftActions,
          vessels: draftVessels,
          helicopter: draftHelicopter,
          weather: draftWeather,
          auditTrail: nextAuditTrail
        },
        currentUser.name,
        newAuditEntry
      );
      setCloudSyncStatus({
        isConnected: true,
        isSyncing: false,
        isPermissionError: false,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setLastSyncError(null);
    } catch (err: any) {
      console.error('Failed to broadcast to Firebase Firestore:', err);
      const isPerm = err?.code === 'permission-denied' || String(err?.error || err).includes('permission');
      setCloudSyncStatus((prev) => ({
        ...prev,
        isSyncing: false,
        isConnected: false,
        isPermissionError: isPerm
      }));
      setLastSyncError(err?.error || String(err));
    }
  };

  // Personal Info Save Handler (Saves to state, local storage & Firestore database)
  const handleSaveUser = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    saveState('currentUser', updatedUser);

    // Update in users registry
    try {
      const nextUsers = await updateUserInRegistry(updatedUser);
      setUsersRegistry(nextUsers);
      saveState('users_registry', nextUsers);
    } catch (e) {
      console.warn('Could not update user in remote Firestore registry:', e);
    }
  };

  // Add User from Admin Registry
  const handleAddUserFromAdmin = async (newUser: User) => {
    const nextUsers = await updateUserInRegistry(newUser);
    setUsersRegistry(nextUsers);
    saveState('users_registry', nextUsers);
  };

  // Delete User
  const handleDeleteUserFromAdmin = async (userId: string) => {
    const nextUsers = usersRegistry.filter(u => u.id !== userId);
    setUsersRegistry(nextUsers);
    await saveUsersRegistry(nextUsers);
  };

  // Authentication Handlers
  const handleLoginSuccess = (user: User) => {
    // If first login with Dialog123, require password change
    if (user.needsPasswordChange || user.password === 'Dialog123') {
      setPendingPasswordChangeUser(user);
    } else {
      finalizeLogin(user);
    }
  };

  const finalizeLogin = async (user: User) => {
    setCurrentUser(user);
    saveState('currentUser', user);
    setIsAuthenticated(true);
    localStorage.setItem('drsb_emt_authenticated', 'true');

    // Update last login in registry
    await updateUserInRegistry(user);
  };

  const handlePasswordChanged = async (newPassword: string) => {
    if (!pendingPasswordChangeUser) return;
    const updated: User = {
      ...pendingPasswordChangeUser,
      password: newPassword,
      needsPasswordChange: false,
      lastLoginAt: new Date().toLocaleString('en-GB')
    };

    setPendingPasswordChangeUser(null);
    await finalizeLogin(updated);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('drsb_emt_authenticated');
    setIsLeftMenuOpen(false);
  };

  // Pull fresh state from Cloud
  const handleRefreshFromCloud = useCallback(async () => {
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const data = await fetchLiveDashboardState();
      if (data) {
        if (data.incident) {
          setIncident(data.incident);
          saveState('incident', data.incident);
        }
        if (data.timeline) {
          setTimeline(data.timeline);
          saveState('timeline', data.timeline);
        }
        if (data.actions) {
          setActions(data.actions);
          saveState('actions', data.actions);
        }
        if (data.vessels && data.vessels.length > 0) {
          setVessels(data.vessels);
          saveState('vessels', data.vessels);
        }
        if (data.helicopter) {
          setHelicopter(data.helicopter);
          saveState('helicopter', data.helicopter);
        }
        if (data.weather) {
          setWeather(data.weather);
          saveState('weather', data.weather);
        }
        if (data.auditTrail && data.auditTrail.length > 0) {
          setAuditTrail(data.auditTrail);
          saveState('auditTrail', data.auditTrail);
        }

        setCloudSyncStatus({
          isConnected: true,
          isSyncing: false,
          isPermissionError: false,
          lastUpdated: data.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setLastSyncError(null);
      } else {
        await checkCloudConnectivity();
      }
    } catch (e: any) {
      console.error('Error fetching live dashboard state:', e);
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      setLastSyncError(e?.message || String(e));
    }
  }, [checkCloudConnectivity]);

  const handleToggleGlobalFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // --- IF NOT AUTHENTICATED: RENDER LOGIN PAGE ---
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onOpenManual={() => setIsManualOpen(true)}
          usersRegistry={usersRegistry}
          onOpenRulesGuide={() => setIsRulesModalOpen(true)}
        />

        {/* Force Password Change Modal if first time user */}
        {pendingPasswordChangeUser && (
          <ForcePasswordChangeModal
            isOpen={true}
            user={pendingPasswordChangeUser}
            onPasswordChanged={handlePasswordChanged}
          />
        )}

        {/* Platform User Manual */}
        <UserManualModal
          isOpen={isManualOpen}
          onClose={() => setIsManualOpen(false)}
        />

        {/* Firebase Rules Guide */}
        <FirebaseRulesModal
          isOpen={isRulesModalOpen}
          onClose={() => setIsRulesModalOpen(false)}
        />
      </>
    );
  }

  // Active display data: drafts if editing, otherwise live public state
  const displayIncident = isEditMode ? draftIncident : incident;
  const displayTimeline = isEditMode ? draftTimeline : timeline;
  const displayActions = isEditMode ? draftActions : actions;
  const displayVessels = isEditMode ? draftVessels : vessels;
  const displayHelicopter = isEditMode ? draftHelicopter : helicopter;
  const displayWeather = isEditMode ? draftWeather : weather;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white pb-24 md:pb-8">
      {/* 1. TOP HEADER NAVIGATION (With Left-Side Menu Trigger) */}
      <Header
        incident={displayIncident}
        currentUser={currentUser}
        cloudSyncStatus={cloudSyncStatus}
        isEditMode={isEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        onToggleLeftMenu={() => setIsLeftMenuOpen(true)}
        onToggleEditMode={handleToggleEditMode}
        onOpenPersonalInfo={() => setIsPersonalInfoOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onRefreshSync={handleRefreshFromCloud}
        onToggleGlobalFullscreen={handleToggleGlobalFullscreen}
      />

      {/* 2. LEFT SIDEBAR MENU DRAWER (Access Menu, Profile Details & Registry) */}
      <LeftSidebarMenu
        isOpen={isLeftMenuOpen}
        onClose={() => setIsLeftMenuOpen(false)}
        currentUser={currentUser}
        onEditProfile={() => setIsPersonalInfoOpen(true)}
        activeTab={mobileTab}
        onSelectTab={setMobileTab}
        onOpenManual={() => setIsManualOpen(true)}
        onOpenUserRegistry={() => setIsUserRegistryOpen(true)}
        onOpenRulesGuide={() => setIsRulesModalOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onLogout={handleLogout}
        cloudSyncStatus={cloudSyncStatus}
      />

      {/* 3. SECURITY RULES DIAGNOSTICS BANNER */}
      {cloudSyncStatus.isPermissionError && !dismissWarningBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white px-4 py-2 text-xs shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="font-bold shrink-0">Cloud Database Rules:</span>
            <span className="text-amber-100 truncate">
              Firestore rules are rejecting writes. Local changes remain saved on this device.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRulesModalOpen(true)}
              className="px-2.5 py-1 rounded bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-xs cursor-pointer text-[11px]"
            >
              Copy Firebase Rules
            </button>
            <button
              onClick={() => setDismissWarningBanner(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. SUCCESS / AUDIT BROADCAST TOAST */}
      {publicPushToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[90] max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-2xl text-white rounded-2xl px-4 py-3 shadow-2xl border border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Changes Pushed Public</span>
                <span className="text-[10px] text-emerald-400 font-normal">· Live Synced</span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                Updated by <strong>{publicPushToast.user}</strong>. All connected responders updated.
              </p>
            </div>
            <button
              onClick={() => setPublicPushToast(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. MAIN COMMAND LAYOUT CONTAINER */}
      <main className="flex-1 p-2.5 md:p-4 max-w-[1720px] w-full mx-auto">
        {/* Mobile View Selector Bar (Apple Segmented Control, < lg) */}
        <div className="lg:hidden mb-3 bg-white/90 backdrop-blur-xl p-1 rounded-2xl border border-black/[0.06] shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setMobileTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mobileTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Unified View</span>
          </button>
          <button
            onClick={() => setMobileTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mobileTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Overview & Map</span>
          </button>
          <button
            onClick={() => setMobileTab('operations')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mobileTab === 'operations'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Actions & Logistics</span>
          </button>
          <button
            onClick={() => setMobileTab('audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              mobileTab === 'audit'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit & Profile</span>
          </button>
        </div>

        {/* Seamless Apple 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* LEFT / CENTRAL PRIMARY COLUMN (lg:col-span-7) */}
          {(mobileTab === 'all' || mobileTab === 'overview') && (
            <div className="lg:col-span-7 space-y-3">
              <IncidentExecutivePanel
                incident={displayIncident}
                weather={displayWeather}
                vessel={displayVessels[0] || initialVessels[0]}
                isEditMode={isEditMode}
                onUpdateIncidentField={handleUpdateIncidentField}
                onUpdateWeatherField={handleUpdateWeatherField}
                onAddPriority={handleAddPriority}
                onUpdatePriority={handleUpdatePriority}
                onDeletePriority={handleDeletePriority}
                onAddObjective={handleAddObjective}
                onUpdateObjective={handleUpdateObjective}
                onDeleteObjective={handleDeleteObjective}
                onAddSitrepBullet={handleAddSitrepBullet}
                onUpdateSitrepBullet={handleUpdateSitrepBullet}
                onDeleteSitrepBullet={handleDeleteSitrepBullet}
              />
            </div>
          )}

          {/* RIGHT OPERATIONAL & AUDIT COLUMN (lg:col-span-5) */}
          {(mobileTab === 'all' || mobileTab === 'operations' || mobileTab === 'audit') && (
            <div className="lg:col-span-5 space-y-3">
              <OperationsActionPanel
                currentUser={currentUser}
                actions={displayActions}
                timeline={displayTimeline}
                vessels={displayVessels}
                helicopter={displayHelicopter}
                auditTrail={auditTrail}
                lastUpdated={lastUpdatedTime}
                updatedBy={lastUpdatedByUser}
                isEditMode={isEditMode}
                onEditProfile={() => setIsPersonalInfoOpen(true)}
                onAddAction={handleAddAction}
                onUpdateAction={handleUpdateAction}
                onDeleteAction={handleDeleteAction}
                onToggleActionStatus={handleToggleActionStatus}
                onAddTimeline={handleAddTimeline}
                onUpdateTimeline={handleUpdateTimeline}
                onDeleteTimeline={handleDeleteTimeline}
                onAddVessel={handleAddVessel}
                onUpdateVessel={handleUpdateVessel}
                onDeleteVessel={handleDeleteVessel}
                onUpdateHelicopter={handleUpdateHelicopter}
              />
            </div>
          )}
        </div>
      </main>

      {/* 6. FLOATING APPLE COMMAND BAR (Appears during Infront Direct Edit Mode) */}
      {isEditMode && (
        <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-2xl text-white rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Infront Direct Edit Active</span>
                  {hasUnsavedChanges && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                      {modifiedSections.size} section{modifiedSections.size > 1 ? 's' : ''} modified
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  Changes live in draft preview until published by <strong>{currentUser.name}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCancelEditMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndPushPublic}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md active:scale-95 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Save & Push Public</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PERSONAL INFORMATION PROFILE UPDATE MODAL */}
      <PersonalInfoModal
        isOpen={isPersonalInfoOpen}
        onClose={() => setIsPersonalInfoOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveUser}
        onSwitchUser={handleSaveUser}
      />

      {/* 8. PLATFORM USER MANUAL & SOP GUIDE */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
      />

      {/* 9. ADMIN RESPONDER REGISTRY MODAL */}
      <AdminUserRegistryModal
        isOpen={isUserRegistryOpen}
        onClose={() => setIsUserRegistryOpen(false)}
        users={usersRegistry}
        onAddUser={handleAddUserFromAdmin}
        onDeleteUser={handleDeleteUserFromAdmin}
        currentUser={currentUser}
      />

      {/* 10. FIREBASE RULES COPY GUIDE MODAL */}
      <FirebaseRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* 11. FIREBASE DIAGNOSTICS MODAL */}
      <FirebaseDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        lastError={lastSyncError}
        onRefreshSync={handleRefreshFromCloud}
      />
    </div>
  );
}
