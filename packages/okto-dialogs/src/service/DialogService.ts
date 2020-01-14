import { Subject } from "rxjs";
import { isFunction } from "lodash";
import { injectable } from "inversify";

import { IDialogStatusSubscriber, DialogConfig } from "./IDialogStatusSubscriber";
import { IDialogService, DialogIdentifier, DialogResponse } from "./IDialogService";

@injectable()
export class DialogService implements IDialogService, IDialogStatusSubscriber {
  private subject = new Subject<DialogConfig>();

  public show<T>(identifier: DialogIdentifier, options?: any): Promise<DialogResponse<T>> {
    return new Promise<DialogResponse<T>>(res => {
      this.subject.next({
        identifier,
        props: {
          options,
          confirm: (data: T) => { res(DialogResponse.Confirm<T>(data)); this.hide(); },
          reject: () => { res(DialogResponse.Reject()); this.hide(); },
          cancel: () => { res(DialogResponse.Cancel()); this.hide(); },
        },
      });
    });
  }

  public async hide(): Promise<void> {
    this.subject.next(null);
  }

  public subscribe(observerOrOnNext?: any, error?: (error: any) => void, complete?: () => void) {
    if (!isFunction(observerOrOnNext))
      return this.subject.subscribe(observerOrOnNext);
    else
      return this.subject.subscribe(observerOrOnNext, error, complete);
  }
}
