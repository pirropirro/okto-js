import { interfaces } from "inversify";

import { IViewModel } from "../viewmodel/IViewModel";
import { ViewModelRegistryEntry } from "../entries/EntryBuilder";

export const IViewModelFactory = Symbol("IViewModelFactory");
export interface IViewModelFactory {
  createFrom<T extends IViewModel, P extends object = {}>(constr: interfaces.Newable<T>, parameters?: P): T;
}

export const IViewModelFactoryExtender = Symbol("IViewModelFactoryExtender");
export interface IViewModelFactoryExtender {
  // tslint:disable-next-line: max-line-length
  extend<T extends IViewModel, P extends object = {}>(viewmodel: T, entry: ViewModelRegistryEntry, parameters?: P): void;
}
