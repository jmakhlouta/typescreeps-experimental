import { Property } from "infrastructure/property.type";

export interface IFactFinder<T> {
  evaluate(artifact: T): Property;
}
