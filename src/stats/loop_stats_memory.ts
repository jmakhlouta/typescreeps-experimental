import { RecentStatsEntry } from "./stats_memory";

export interface LoopStatsMemory {
  recent: RecentLoopStatsEntry[];
}

export interface RecentLoopStatsEntry extends RecentStatsEntry {
  loopDuration: number;
  cpuUsed: number;
}
