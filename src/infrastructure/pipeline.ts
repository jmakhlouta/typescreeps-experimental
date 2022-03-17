import { ArrayIterator } from "./array_iterator";
import { IMiddleware } from "./middleware.interface";

export class Pipeline<TContext> {
  private stages: IMiddleware<TContext>[];

  public constructor(...middleware: IMiddleware<TContext>[]) {
    this.stages = [];
    this.use(...middleware);
  }

  public use(...middleware: IMiddleware<TContext>[]): Pipeline<TContext> {
    this.stages.push(...middleware);
    return this;
  }

  public invoke(context: TContext): void {
    // Special case: Pipeline with no stages
    if (this.stages.length === 0) {
      return;
    }

    const iterator = new ArrayIterator(this.stages);

    const invokeNext = () => {
      // Set-up a callback for this iteration
      // that requests the next stage
      let requestReceived = false;
      const nextCallback = () => {
        // If the current stage's middleware has
        // requested the next stage multiple times
        // drop subsequent requests
        if (requestReceived) {
          return;
        }

        // Mark the request received for this iteration
        requestReceived = true;

        // If there are no more middleware we're
        // done and the request stack should resolve
        if (iterator.done) {
          return;
        }

        // Move on to the next stage
        invokeNext();
      };

      // Invoke the middleware for the current stage
      const currentStage = iterator.next();
      currentStage.call(this, context, nextCallback);
    };

    // Start the pipeline by priming the first stage
    invokeNext();
  }
}
