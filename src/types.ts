export type IncidentLevel = 'LEVEL 1 (LOCAL)' | 'LEVEL 2 (STABILISING)' | 'LEVEL 3 (CRISIS)';

export type UserRole =
  | 'Incident Commander (IC)'
  | 'Operations Section Chief (OSC)'
  | 'Planning Section Chief (PSC)'
  | 'Logistics Lead (LOG)'
  | 'HSSE & Safety Officer (SO)'
  | 'Duty EMT Observer';

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  staffId?: string;
  phone?: string;
  dutyStation?: string;
  callSign?: string;
  avatar?: string;
  password?: string;
  needsPasswordChange?: boolean;
  isAdmin?: boolean;
  registeredAt?: string;
  lastLoginAt?: string;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  staffId?: string;
  summary: string;
  changeCount?: number;
}

export interface IncidentDetails {
  id: string;
  title: string;
  clusterName: string;
  companyName: string;
  level: IncidentLevel;
  location: string;
  field: string;
  accountedPersonnel: number;
  totalPersonnel: number;
  missingPersons: number;
  receivingMedical: number;
  evacuated: number;
  medicalTransferStatus: string;
  currentPriorities: string[];
  incidentObjectives: string[];
  latestSitrepNumber: string;
  latestSitrepText: string[];
  nextSitrepTime: string;
  statusText: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  event: string;
  category?: 'alarm' | 'response' | 'muster' | 'ecc' | 'isolation' | 'sitrep';
}

export interface ActionItem {
  id: number;
  action: string;
  responsible: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface Vessel {
  id: string;
  name: string;
  status: 'En route' | 'On site' | 'Standby' | 'Docked';
  eta: string;
  speedKnots: number;
  coordinates: [number, number]; // [lat, lng]
  heading: number;
}

export interface Helicopter {
  id: string;
  name: string;
  status: 'Available' | 'Mobilised' | 'Grounded';
  conditions: string;
  mobilisationTime: string;
}

export interface WeatherData {
  temperatureC: number;
  windSpeedKt: number;
  windDirection: string;
  seaStateM: number;
  conditions: string;
  pressureHpa: number;
  humidityPct: number;
  updatedAt: string;
  isLiveApi: boolean;
  locationName: string;
}

// Retained for backward data compatibility
export interface Participant {
  id: string;
  name: string;
  roleShort: string;
  department: string;
  status: string;
  videoOn?: boolean;
  micOn?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  time: string;
  text: string;
}
