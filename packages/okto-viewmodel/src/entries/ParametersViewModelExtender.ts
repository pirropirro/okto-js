
import { injectable } from "inversify";
import { IViewModel } from "../viewmodel/IViewModel";
import { IViewModelFactoryExtender } from "../registry/IViewModelFactory";
import { ViewModelRegistryEntry } from "./EntryBuilder";

export interface IParametersViewModel<T> extends IViewModel {
  onParametersReceived(parameters: T): void;
}

@injectable()
export class ParametersViewModelExtender implements IViewModelFactoryExtender {
  public extend(viewmodel: IViewModel, _: ViewModelRegistryEntry, parameters?: any): void {
    if (!isParametersViewModel(viewmodel)) return;

    viewmodel.onParametersReceived(parameters);
  }
}

function isParametersViewModel(vm: IViewModel | IParametersViewModel<any>): vm is IParametersViewModel<any> {
  return !!(vm as IParametersViewModel<any>).onParametersReceived;
}
