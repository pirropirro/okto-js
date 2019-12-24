import { interfaces } from "inversify";
import { IModule, IModuleExtender } from "@okto/core";

import { ViewModelRegistry } from "../registry/ViewModelRegistry";
import { IViewModelFactory } from "../registry/IViewModelFactory";
import { IViewModelRegistry } from "../registry/IViewModelRegistry";
import { IViewModelFactoryExtender } from "../registry/IViewModelFactory";
import { ViewModelModuleExtender } from "../viewmodel/ViewModelModuleExtender";
import { ParametersViewModelExtender } from "../entries/ParametersViewModelExtender";
import { ObservableViewModelExtender } from "../observable/ObservableViewModelExtender";

export class ViewModelModule implements IModule {
  public modules(container: interfaces.Container): void {
    container.bind<IModuleExtender>(IModuleExtender).to(ViewModelModuleExtender);

    container.bind<IViewModelRegistry>(IViewModelRegistry).to(ViewModelRegistry).inSingletonScope();
    container.bind<IViewModelFactory>(IViewModelFactory).toDynamicValue(() =>
      container.get<ViewModelRegistry>(IViewModelRegistry));

    container.bind<IViewModelFactoryExtender>(IViewModelFactoryExtender).to(ObservableViewModelExtender);
    container.bind<IViewModelFactoryExtender>(IViewModelFactoryExtender).to(ParametersViewModelExtender);
  }

}
