
// tslint:disable: no-string-literal
import { injectable } from "inversify";
import { IViewModel } from "../viewmodel/IViewModel";
import { ObservableViewModel } from "./ObservableViewModel";
import { ObservableControllerFactory } from "./IObservableController";
import { IViewModelFactoryExtender } from "../registry/IViewModelFactory";
import { ViewModelRegistryEntry } from "../entries/EntryBuilder";

export type ObservableParams<T> = { source: ObservableControllerFactory<T> };
export type ObservableEntry<T = any> = ViewModelRegistryEntry<ObservableParams<T>>;
@injectable()
export class ObservableViewModelExtender implements IViewModelFactoryExtender {
  public extend(viewmodel: IViewModel, entry: ObservableEntry, parameters?: any): void {
    if (!isObservableViewModel(viewmodel)) return;

    viewmodel["controller"] = entry.source(parameters);
    viewmodel["observe"]();
  }
}

function isObservableViewModel(viewmodel: IViewModel | ObservableViewModel): viewmodel is ObservableViewModel {
  return !!(viewmodel as ObservableViewModel)["observe"];
}
