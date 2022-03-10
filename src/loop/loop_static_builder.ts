import { CleanCreepsMemory } from "memory/modules/clean_creeps_memory";
import { ILoopModule } from "./loop_module.interface";
import { LoopBuilder } from "./loop_builder";

export class StaticLoopModules {
  public static get modules(): ILoopModule[] {
    const builder = new LoopBuilder();

    builder.addLoopModule(new CleanCreepsMemory());
    builder.addLoopStep(logCpu);

    return builder.build();
  }
}

function logCpu() {
  console.log(JSON.stringify(Game.cpu));
}
