import { Observable, EMPTY } from "rxjs";

export interface IModelController<T> {
  refresh(parameters?: object): void;
  updates?(): Observable<T>;
}

export interface IObservableController<T> extends IModelController<T> {
  model: Observable<T>;
}

export type ObservableControllerFactory<T> = (parameters: any) => IObservableController<T>;

// tslint:disable-next-line: interface-name
export interface ControllableViewModel<T> {
  onControllerReceived(controller: IModelController<T>): void;
}

export function controllerFromObservable<T>(observable: Observable<T>): IObservableController<T> {
  return { model: observable, refresh: () => null, updates: () => EMPTY };
}
