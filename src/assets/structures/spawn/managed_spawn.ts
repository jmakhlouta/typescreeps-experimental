import { AssetIdentifiers } from "assets/asset_identifiers";
import { ExtendedSpawnOptions } from "../../../options/extended_spawn_options";
import { IEnergySupply } from "../../contracts/energy_supply.interface";
import { ISpawner } from "../../contracts/spawner.interface";
import { SpawnQueue } from "./spawn_queue";

export class ManagedSpawn implements ISpawner, IEnergySupply {
  public queue: SpawnQueue;

  public constructor(public structure: StructureSpawn) {
    this.queue = new SpawnQueue(structure.memory, this);
  }

  public get availableEnergy(): number {
    return this.structure.room.energyAvailable;
  }

  public get energySupplies(): IEnergySupply[] {
    return [this as IEnergySupply];
  }

  public get totalAvailableEnergy(): number {
    return _.sum(_.map(this.energySupplies, ep => ep.availableEnergy));
  }

  public canSpawnCreep(body: BodyPartConstant[]): [boolean, ScreepsReturnCode] {
    const options = { baseName: "dryRun", dryRun: true } as ExtendedSpawnOptions;
    const result = this.spawnCreep(body, options);
    return [result === OK, result];
  }

  public spawnCreep(body: BodyPartConstant[], options = {} as ExtendedSpawnOptions): ScreepsReturnCode {
    const idPrefix = options.baseName ?? "creep";
    const result = this.structure.spawnCreep(body, AssetIdentifiers.GenerateName(idPrefix), options);
    return result;
  }

  public static LoadByName(spawnName: string): ManagedSpawn {
    return new ManagedSpawn(Game.spawns[spawnName]);
  }
}
