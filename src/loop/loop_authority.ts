import { ILoopModule } from "./loop_module.interface";
import { StaticLoopModules } from "./loop_static_builder";

export class LoopAuthority implements ILoopModule {
  public constructor(private modules: ILoopModule[]) {}

  public invoke(): void {
    this.invokeAllSteps();
  }

  private invokeAllSteps() {
    this.modules.forEach(module => module.invoke());
  }

  private static instance: LoopAuthority | null = null;

  public static get current(): LoopAuthority {
    return LoopAuthority.instance ?? (LoopAuthority.instance = this.createDefault());
  }

  public static createDefault(): LoopAuthority {
    return new LoopAuthority(StaticLoopModules.modules);
  }
}
