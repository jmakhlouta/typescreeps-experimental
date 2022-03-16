import { ISpawner } from "../../contracts/spawner.interface";

export interface ISpawnable {
  get body(): BodyPartConstant[];
  get baseName(): string;
  get memory(): CreepMemory;
  get cost(): number;
}

export interface SpawnQueueMemory extends SpawnMemory {
  queue: ISpawnable[];
}

export class SpawnQueue {
  private queue: ISpawnable[];

  public constructor(spawnMemory: SpawnMemory, private spawner: ISpawner) {
    const queueMemory = SpawnQueue.createSpawnQueueMemoryIfNotExists(spawnMemory);
    this.queue = queueMemory.queue;
  }

  public get empty(): boolean {
    return this.queue.length === 0;
  }

  public get next(): ISpawnable {
    return this.queue[0];
  }

  public add(body: BodyPartConstant[], memory: CreepMemory, baseName = "creep"): void {
    const cost = _.sum(_.map(body, b => BODYPART_COST[b]));
    this.queue.push({ body, baseName, memory, cost } as ISpawnable);
  }

  public trySpawnNext(): [boolean, ScreepsReturnCode] {
    if (!this.isNextAffordable()) {
      return [false, ERR_NOT_ENOUGH_ENERGY];
    }

    const spawnableResult = this.isNextSpawnable();
    if (!spawnableResult[0]) {
      return spawnableResult;
    }

    const result = this.spawn();
    return [result === OK, result];
  }

  public isNextAffordable(): boolean {
    return this.spawner.totalAvailableEnergy > this.next.cost;
  }

  public isNextSpawnable(): [isSpawnable: boolean, dryRunResult: ScreepsReturnCode] {
    return this.spawner.canSpawnCreep(this.next.body);
  }

  private spawn(): ScreepsReturnCode {
    return this.spawner.spawnCreep(this.next.body, { baseName: this.next.baseName, memory: this.next.memory });
  }

  public static createSpawnQueueMemoryIfNotExists(memoryStructure: SpawnMemory): SpawnQueueMemory {
    const asSpawnQueueMemory = memoryStructure as SpawnQueueMemory;
    if (!("queue" in asSpawnQueueMemory)) {
      asSpawnQueueMemory.queue = [];
    }

    return asSpawnQueueMemory;
  }
}
