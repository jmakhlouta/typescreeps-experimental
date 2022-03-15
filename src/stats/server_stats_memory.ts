import { RecentStatsEntry } from "./stats_memory";

export interface ServerStatsMemory {
  recent: RecentServerStatsEntry[];
}

export interface RecentServerStatsEntry extends RecentStatsEntry {
  recycleDuration: number;
  cpuUsed: number;
}
