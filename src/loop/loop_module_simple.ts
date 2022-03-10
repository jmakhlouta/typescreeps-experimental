import { ILoopModule } from "./loop_module.interface";

export class SimpleLoopModule implements ILoopModule {
  public constructor(private stepCallback: () => void) {}

  public invoke(): void {
    this.stepCallback();
  }
}
