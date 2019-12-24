import { interfaces } from "inversify";
import { IViewModel } from "../viewmodel/IViewModel";

export type ViewModelRegistryEntry<T extends object = {}> = T & {
  constr: interfaces.Newable<IViewModel>;
};

export class EntryBuilder<T extends object = {}> {
  private entry: ViewModelRegistryEntry<T>;

  constructor(constr: interfaces.Newable<IViewModel>, options?: T) {
    this.entry = { constr, ...options } as ViewModelRegistryEntry<T>;
  }

  public build(): ViewModelRegistryEntry<T> {
    return this.entry;
  }
}
