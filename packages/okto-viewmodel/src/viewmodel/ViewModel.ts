import { isFunction } from "lodash";
import { Subject, Observer } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { injectable, interfaces, decorate } from "inversify";

import { IViewModel } from "./IViewModel";

@injectable()
export abstract class ViewModel implements IViewModel {
  protected useDebounce = true;
  private subject = new Subject<void>();

  public subscribe(observerOrOnNext?: any, error?: (error: any) => void, complete?: () => void) {
    const subject = this.useDebounce ? this.subject.pipe(debounceTime(1)) : this.subject;

    if (isObserver(observerOrOnNext))
      return subject.subscribe(observerOrOnNext);
    else
      return subject.subscribe(observerOrOnNext, error, complete);
  }

  // tslint:disable-next-line: no-empty
  public unsubscribe(): void { }

  private __update__() {
    this.subject.next(undefined);
  }
}

function isObserver<T>(observerOrOnNext: (Observer<T>) | ((value: T) => void)): observerOrOnNext is Observer<T> {
  return !isFunction(observerOrOnNext);
}

export namespace ViewModel {
  const VIEWMODEL_NAME = "viewmodel:name";

  export function nameFrom(constr: interfaces.Newable<IViewModel>): string {
    return Reflect.getMetadata(VIEWMODEL_NAME, constr);
  }

  export function nameAs(name: string) {
    return function (target: any) {
      decorate(injectable(), target);
      Reflect.defineMetadata(VIEWMODEL_NAME, name, target);
      return target;
    };
  }
}
