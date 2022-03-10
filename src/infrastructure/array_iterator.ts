export class ArrayIterator<T> {
  private array: T[];
  private index = 0;

  public constructor(array: T[]) {
    this.array = array;
  }

  public get current(): T {
    return this.array[this.index];
  }

  public get done(): boolean {
    return this.index >= this.array.length;
  }

  public next(): T {
    const current = this.current;
    this.index++;
    return current;
  }

  public reset(): void {
    this.index = 0;
  }
}
