import { ILoopModule } from "loop/loop_module.interface";

export class CleanCreepsMemory implements ILoopModule {
  public invoke(): void {
    const iterator = this.createCreepMemoryKeyIterator();

    let currentMemoryKey = iterator.next();
    while (!currentMemoryKey.done) {
      this.clean(currentMemoryKey.value);
      currentMemoryKey = iterator.next();
    }
  }

  private *createCreepMemoryKeyIterator(): IterableIterator<string> {
    for (const name in Memory.creeps) {
      yield name;
    }
  }

  private clean(key: string): void {
    if (!(key in Game.creeps)) {
      this.delete(key);
      return;
    }
  }

  private delete(key: string): void {
    delete Memory.creeps[key];
  }
}
