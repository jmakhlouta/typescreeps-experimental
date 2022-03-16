import { ExtendedSpawnOptions } from "../../options/extended_spawn_options";
import { IEnergySupply } from "./energy_supply.interface";

export interface ISpawner {
  get energySupplies(): IEnergySupply[];
  get totalAvailableEnergy(): number;
  canSpawnCreep(body: BodyPartConstant[]): [boolean, ScreepsReturnCode];
  spawnCreep(body: BodyPartConstant[], options: ExtendedSpawnOptions): ScreepsReturnCode;
}
