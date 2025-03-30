export type ErrorType =
  | string
  | { errorsMessages: { message: string; field: string }[] };

export class ToResult<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    readonly error?: ErrorType,
    readonly value?: T,
  ) {}

  public getValue(): T {
    if (!this._isSuccess) {
      throw new Error("Can't get value from error result");
    }
    return this.value!;
  }

  public getError(): ErrorType {
    if (this._isSuccess) {
      throw new Error("Can't get error from success result");
    }
    return this.error!;
  }

  public isFailure(): boolean {
    return !this._isSuccess;
  }

  public isSuccess(): boolean {
    return this._isSuccess;
  }

  public static ok<T>(value: T): ToResult<T> {
    return new ToResult<T>(true, undefined, value);
  }

  public static fail<T>(error: ErrorType): ToResult<T> {
    return new ToResult<T>(false, error, undefined);
  }
}