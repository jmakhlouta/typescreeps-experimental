import { ILoopModule } from "loop/loop_module.interface";
import { ISpawnProvider } from "../../../contracts/spawn_provider.interface";
import { ManagedSpawn } from "../managed_spawn";
import { SpawnQueue } from "../spawn_queue";

export class ProcessSpawnQueues implements ILoopModule {
  public constructor(private spawnProvider: ISpawnProvider) {}

  public invoke(): void {
    const iterator = this.createSpawnerQueuesIterator(this.spawnProvider.spawnNames);

    let current = iterator.next();
    while (!current.done) {
      const spawnQueue = current.value;

      this.processQueue(spawnQueue);

      current = iterator.next();
    }
  }

  private processQueue(queue: SpawnQueue) {
    if (queue.empty) {
      return;
    }

    const [success, result] = queue.trySpawnNext();

    if (!success) {
      console.log(JSON.stringify({ op: "ProcessSpawnQueues.processQueues", success, result }));
    }
  }

  private *createSpawnerQueuesIterator(spawnNames: string[]): IterableIterator<SpawnQueue> {
    for (const spawnName of spawnNames) {
      const spawn = ManagedSpawn.LoadByName(spawnName);
      yield spawn.queue;
    }
  }
}
