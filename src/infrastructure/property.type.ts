type NestedProperty = string | number | boolean | Property[] | Property;

export interface Property {
  [key: string]: NestedProperty;
}
