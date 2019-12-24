import { interfaces } from "inversify";

import { IViewModel } from "../viewmodel/IViewModel";
import { EntryBuilder, ViewModelRegistryEntry } from "../entries/EntryBuilder";

export const IViewModelRegistry = Symbol("IViewModelRegistry");
export interface IViewModelRegistry {
  add(viewmodel: interfaces.Newable<IViewModel>): IViewModelRegistry;
  add<T extends object = undefined>(builder: EntryBuilder<T>): IViewModelRegistry;
  add<T extends object = undefined>(entry: ViewModelRegistryEntry<T>): IViewModelRegistry;
}
