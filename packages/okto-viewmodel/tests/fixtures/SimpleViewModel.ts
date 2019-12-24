import { ViewModel } from "../../src/viewmodel/ViewModel";
import { Refresh } from "../../src/viewmodel/RefreshDecorator";

export class SimpleViewModel extends ViewModel {
  public counter = 0;
  public isDisposed = false;

  @Refresh
  public increase() {
    this.counter++;
  }

  public decrease() {
    this.counter--;
  }

  public unsubscribe() {
    this.isDisposed = true;
  }
}
