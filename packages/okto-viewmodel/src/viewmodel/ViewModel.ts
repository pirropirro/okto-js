import { isFunction } from "lodash";
import { Subject, Observer, from } from "rxjs";
import { injectable, interfaces, decorate } from "inversify";

import { IViewModel } from "./IViewModel";

@injectable()
export abstract class ViewModel implements IViewModel {
  private subject = new Subject<void>();

  public subscribe(observerOrOnNext?: any, error?: (error: any) => void, complete?: () => void) {
    if (isObserver(observerOrOnNext))
      return this.subject.subscribe(observerOrOnNext);
    else
      return this.subject.subscribe(observerOrOnNext, error, complete);
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
    return function(target: any) {
      decorate(injectable(), target);
      Reflect.defineMetadata(VIEWMODEL_NAME, name, target);
      return target;
    };
  }
}
