import { Subscription } from "rxjs";
import { injectable, interfaces } from "inversify";

import { ViewModel } from "../viewmodel/ViewModel";
import { EntryBuilder } from "../entries/EntryBuilder";
import { Refresh } from "../viewmodel/RefreshDecorator";
import { ObservableParams } from "./ObservableViewModelExtender";
import { IObservableController, ObservableControllerFactory } from "./IObservableController";

@injectable()
export abstract class ObservableViewModel<T = any> extends ViewModel {
  private subscription: Subscription;
  private controller: IObservableController<T>;

  public refreshWith<P extends object = {}>(parameters: P): void {
    if (this.controller) this.controller.refresh(parameters);
  }

  public unsubscribe() {
    super.unsubscribe();
    if (this.subscription) this.subscription.unsubscribe();
  }

  public observe() {
    this.subscription = this.controller.model.subscribe(
      model => {
        try {
          this.onUpdate(model);
        } catch (error) {
          this.onErrorReceived(error);
        }
      },
      error => this.onError(error),
    );
  }

  protected abstract onData(data: T): void;
  protected abstract onError(error: Error): void;

  @Refresh
  private onUpdate(model: T) {
    this.onData(model);
  }

  @Refresh
  private onErrorReceived(error: any) {
    this.onError(error);
  }
}

export namespace ObservableViewModel {
  export function From<T>(constr: interfaces.Newable<ObservableViewModel<T>>,
    source?: ObservableControllerFactory<T>): EntryBuilder<ObservableParams<T>> {
    return new EntryBuilder(constr, { source });
  }
}
