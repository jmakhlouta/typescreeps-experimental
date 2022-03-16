import { TickCodec } from "infrastructure/tick_codec";

export class AssetIdentifiers {
  private static tickers: Record<string, number> = {};

  public static GenerateName(prefix: string, birthTick: number | null = null): string {
    if (birthTick === null) {
      birthTick = Game.time;
    }

    const tickId = TickCodec.encode(birthTick);
    return `${prefix}#${tickId}.${AssetIdentifiers.getIterationId(prefix)}`;
  }

  private static getIterationId(prefix: string): number {
    if (!(prefix in this.tickers)) {
      this.tickers[prefix] = 0;
    }

    return ++this.tickers[prefix];
  }
}
