import { ILoopModule } from "./loop_module.interface";
import { SimpleLoopModule } from "./loop_module_simple";

export class LoopBuilder {
  private modules: ILoopModule[] = [];

  public clear(): void {
    this.modules = [];
  }

  public build(): ILoopModule[] {
    return this.modules;
  }

  public addLoopStep(step: () => void): LoopBuilder {
    this.addLoopModule(new SimpleLoopModule(step));
    return this;
  }

  public addLoopModule(module: ILoopModule): LoopBuilder {
    this.modules.push(module);
    return this;
  }
}
