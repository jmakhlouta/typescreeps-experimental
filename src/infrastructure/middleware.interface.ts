export interface IMiddleware<TSource, TResult> {
  (source: TSource, result: TResult, next: () => void): void;
}
