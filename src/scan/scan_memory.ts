import { Property } from "../infrastructure/property.type";

export interface FactMemory {
  [key: string]: FactMemoryEntry;
}

export type FactMemoryEntry = Property;
