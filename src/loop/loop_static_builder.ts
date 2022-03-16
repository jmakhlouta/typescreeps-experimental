import { CleanCreepsMemory } from "memory/modules/clean_creeps_memory";
import { DefaultSpawnProvider } from "assets/providers/default_spawn_provider";
import { ILoopModule } from "./loop_module.interface";
import { LoopBuilder } from "./loop_builder";
import { ManagedSpawn } from "assets/structures/spawn/managed_spawn";
import { ProcessSpawnQueues } from "assets/structures/spawn/modules/process_spawn_queues";

export class StaticLoopModules {
  public static get modules(): ILoopModule[] {
    const builder = new LoopBuilder();

    const providers = {
      defaultSpawnProvider: new DefaultSpawnProvider()
    };

    builder.addLoopModule(new CleanCreepsMemory());
    builder.addLoopStep(() => {
      const targetNumberOfCreeps = 5;
      const creepsInPlay = Object.keys(Game.creeps).length;

      if (creepsInPlay < targetNumberOfCreeps) {
        const creepsNeeded = targetNumberOfCreeps - creepsInPlay;

        const spawn = ManagedSpawn.LoadByName(Object.keys(Game.spawns)[0]);
        for (let i = 0; i < creepsNeeded; i++) {
          spawn.queue.add([MOVE, MOVE, WORK, CARRY], { role: "test" } as CreepMemory);
        }
      }
    });
    builder.addLoopModule(new ProcessSpawnQueues(providers.defaultSpawnProvider));

    return builder.build();
  }
}
