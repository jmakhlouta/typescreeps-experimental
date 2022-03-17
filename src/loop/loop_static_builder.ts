import { CleanCreepsMemory } from "memory/modules/clean_creeps_memory";
import { DefaultSpawnProvider } from "assets/providers/default_spawn_provider";
import { GlobalSourceProvider } from "resources/providers/global_source_provider";
import { ILoopModule } from "./loop_module.interface";
import { LoopBuilder } from "./loop_builder";
import { ProcessSpawnQueues } from "assets/structures/spawn/modules/process_spawn_queues";
import { ScanPipelineModule } from "scan/modules/scan_pipeline_module";

export class StaticLoopModules {
  public static get modules(): ILoopModule[] {
    const builder = new LoopBuilder();

    const providers = {
      defaultSpawnProvider: new DefaultSpawnProvider(),
      defaultSourceProvider: new GlobalSourceProvider()
    };

    builder.addLoopModule(new CleanCreepsMemory());
    builder.addLoopModule(new ScanPipelineModule([providers.defaultSourceProvider]));
    builder.addLoopModule(new ProcessSpawnQueues(providers.defaultSpawnProvider));

    return builder.build();
  }
}
