import { Property } from "../../infrastructure/property.type";

export interface ScanContext {
  facts: Property;
}

export class ScanArtifact<T> implements ScanContext {
  public facts: Property = {};

  public constructor(public artifact: T) {}
}
