export interface IMiddleware<TContext> {
  (context: TContext, next: () => void): void;
}
