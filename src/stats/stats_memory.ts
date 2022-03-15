import { LoopStatsMemory } from "./loop_stats_memory";
import { ServerStatsMemory } from "./server_stats_memory";

export interface StatsMemory {
  maxRecent: number;
  server: ServerStatsMemory;
  loop: LoopStatsMemory;
}

export interface RecentStatsEntry {
  tickRecorded: number;
  dateRecorded: Date;
}
