import { ArrayIterator } from "./array_iterator";
import { IMiddleware } from "./middleware.interface";

export class Pipeline<TSource, TResult> {
  private stages: IMiddleware<TSource, TResult>[];
  private defaultResultFactory: () => TResult;

  public constructor(defaultResultFactory: () => TResult, ...middleware: IMiddleware<TSource, TResult>[]) {
    this.defaultResultFactory = defaultResultFactory;
    this.stages = middleware;
  }

  public use(...middleware: IMiddleware<TSource, TResult>[]): Pipeline<TSource, TResult> {
    middleware.push(...middleware);
    return this;
  }

  public post(sourceInput: TSource): TResult {
    const source = _.clone(sourceInput, true);
    const result = this.defaultResultFactory();

    // Special case: Pipeline with no stages
    if (this.stages.length === 0) {
      return result;
    }

    const iterator = new ArrayIterator(this.stages);

    const nextStage = () => {
      // Set-up a callback for this iteration
      // that requests the next stage
      let requestReceived = false;
      const requestNext = () => {
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
        nextStage();
      };

      // Invoke the middleware for the current stage
      const currentStage = iterator.next();
      currentStage.call(this, source, result, requestNext);
    };

    // Start the pipeline by priming the first stage
    nextStage();

    // Return the result
    return result;
  }
}
