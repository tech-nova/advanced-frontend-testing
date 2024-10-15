export interface ValidationErrors {
  [key: string]: string;
}

export interface Spacecraft {
  id: string; // Unique identifier for the spacecraft
  name: string; // Name of the spacecraft
  type: string; // Type or model of the spacecraft
  captain: string; // Name of the captain of the spacecraft
}

export interface Docking {
  id: string; // Unique identifier for the docking event
  dockingTime: string; // Timestamp of when the docking occurred
  bayId: number; // Identifier of the docking bay
  status: string; // Status of the docking (e.g., "docked", "undocked")
  scan?: Blob; // Store the video scan
}

export interface DockingWithSpacecraft extends Docking {
  spacecraftId: string; // Unique identifier for the spacecraft
}

export interface Notification {
  id: string; // Unique identifier for the notification
  message: string; // Message content of the notification
  timestamp: string; // Timestamp of when the notification was created
}
