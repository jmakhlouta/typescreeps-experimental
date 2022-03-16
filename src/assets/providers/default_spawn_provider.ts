import { ISpawnProvider } from "assets/contracts/spawn_provider.interface";

export class DefaultSpawnProvider implements ISpawnProvider {
  public get spawnNames(): string[] {
    return Object.keys(Game.spawns);
  }
}
