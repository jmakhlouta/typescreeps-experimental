export class TickCodec {
  public static encode(tick: number): string {
    const rebasedTick = tick.toString(36);
    return rebasedTick;
  }

  public static decode(code: string): number {
    return parseInt(code, 36);
  }
}
