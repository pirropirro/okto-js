import { inject, injectable } from "inversify";

import { IViewModelRegistry } from "../registry/IViewModelRegistry";
import { IServiceLocator, IModule, IModuleExtender } from "okto-core";

export interface IViewModelsModule extends IModule {
  viewmodels(registry: IViewModelRegistry, serviceLocator: IServiceLocator): void;
}

function hasHook(module: IModule | IViewModelsModule): module is IViewModelsModule {
  return !!(module as IViewModelsModule).viewmodels;
}

@injectable()
export class ViewModelModuleExtender implements IModuleExtender {
  constructor(@inject(IServiceLocator) private locator: IServiceLocator,
              @inject(IViewModelRegistry) private registry: IViewModelRegistry) { }

  public extends(module: IModule | IViewModelsModule): IViewModelsModule | IModule {
    if (hasHook(module)) module.viewmodels(this.registry, this.locator);
    return module;
  }
}
