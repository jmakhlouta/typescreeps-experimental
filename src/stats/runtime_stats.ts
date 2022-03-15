import { RecentStatsEntry, StatsMemory } from "./stats_memory";
import { LoopStatsMemory } from "./loop_stats_memory";
import { ServerStatsMemory } from "./server_stats_memory";

const MaxRecent = 10;
export class RuntimeStats {
  public static recycleTick: number = Game.time;
  public static recycleTime = Date.now();
  public static loopStartTime: number;
  public static loopEndTime: number;

  public static wrapLoop(loop: () => void): () => void {
    return () => {
      RuntimeStats.beginLoop();
      try {
        loop();
      } finally {
        RuntimeStats.endLoop();
      }
    };
  }

  public static get ticksSinceRecycle(): number {
    return Game.time - RuntimeStats.recycleTick;
  }

  public static get millisecondsSinceRecycle(): number {
    return Date.now() - RuntimeStats.recycleTime;
  }

  public static get isNewCycle(): boolean {
    return RuntimeStats.ticksSinceRecycle === 0;
  }

  private static beginLoop(): void {
    RuntimeStats.createStatsMemory();

    // Only capture server stats during recycles
    if (RuntimeStats.isNewCycle) {
      // At this point, millisecondsSinceRecycle measures
      // from cycle start time to start of loop, making
      // it a good candidate for an approximate recycle stat
      RuntimeStats.addServerStatsEntry(RuntimeStats.millisecondsSinceRecycle);
    }

    RuntimeStats.loopStartTime = Date.now();
  }

  private static endLoop(): void {
    RuntimeStats.createStatsMemory();
    RuntimeStats.loopEndTime = Date.now();
    RuntimeStats.addLoopStatsEntry();
    RuntimeStats.purgeOldStats();
  }

  private static addServerStatsEntry(recycleDuration: number): void {
    Memory.stats.server.recent.unshift({
      dateRecorded: new Date(),
      tickRecorded: Game.time,
      cpuUsed: Game.cpu.getUsed(),
      recycleDuration
    });
  }

  private static addLoopStatsEntry(): void {
    Memory.stats.loop.recent.unshift({
      dateRecorded: new Date(),
      tickRecorded: Game.time,
      loopDuration: RuntimeStats.loopEndTime - RuntimeStats.loopStartTime,
      cpuUsed: Game.cpu.getUsed()
    });
  }

  private static purgeOldStats() {
    RuntimeStats.purgeRecent(Memory.stats.server.recent);
    RuntimeStats.purgeRecent(Memory.stats.loop.recent);
  }

  private static purgeRecent(recent: RecentStatsEntry[]) {
    recent.length = Math.min(recent.length, Memory?.stats?.maxRecent ?? MaxRecent);
  }

  private static createStatsMemory() {
    if (!("stats" in Memory)) {
      Memory.stats = {} as StatsMemory;
    }

    if (!("maxRecent" in Memory.stats)) {
      Memory.stats.maxRecent = MaxRecent;
    }

    if (!("server" in Memory.stats)) {
      Memory.stats.server = {} as ServerStatsMemory;
    }

    if (!("recent" in Memory.stats.server)) {
      Memory.stats.server.recent = [];
    }

    if (!("loop" in Memory.stats)) {
      Memory.stats.loop = {} as LoopStatsMemory;
    }

    if (!("recent" in Memory.stats.loop)) {
      Memory.stats.loop.recent = [];
    }
  }
}
