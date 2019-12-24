import { Refresh } from "../../src/viewmodel/RefreshDecorator";
import { ObservableViewModel } from "../../src/observable/ObservableViewModel";

export class ObserverViewModel extends ObservableViewModel<number> {
  public models: number[];
  public error: Error;
  public async = false;
  public disposed = false;

  public onData(model: number) {
    if (!this.models) this.models = [];
    this.models.push(model);
  }

  public onError(error: Error) {
    this.error = error;
  }

  @Refresh
  // tslint:disable-next-line: no-empty
  public doSomething() { }

  @Refresh
  public async doSomethingAsync() {
    await Promise.resolve();
    this.async = true;
  }

  public unsubscribe() {
    super.unsubscribe();
    this.disposed = true;
  }
}

export class ErrorViewModel extends ObservableViewModel<number> {
  public error: Error;

  public onData(model: number) {
    throw new Error();
  }

  public onError(error: Error) {
    this.error = error;
  }
}
