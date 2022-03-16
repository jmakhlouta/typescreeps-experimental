/* eslint-disable sort-imports */
// Server stats must be the first import so that it is at the top of the rollup output
import { RuntimeStats } from "stats/runtime_stats";
import { ErrorMapper } from "utils/ErrorMapper";
import { LoopAuthority } from "loop/loop_authority";
import { StatsMemory } from "stats/stats_memory";

declare global {
  interface Memory {
    stats: StatsMemory;
  }

  interface CreepMemory {
    role: string;
  }

  // Syntax for adding proprties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = RuntimeStats.wrapLoop(
  ErrorMapper.wrapLoop(() => {
    LoopAuthority.current.invoke();
  })
);
