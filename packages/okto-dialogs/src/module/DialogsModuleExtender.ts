import { inject, injectable } from "inversify";
import { IServiceLocator, IModule, IModuleExtender } from "okto-core";

import { IDialogsRegistry } from "../registry/IDialogsRegistry";

export interface IDialogsModule extends IModule {
  dialogs(registry: IDialogsRegistry, serviceLocator: IServiceLocator): void;
}

function hasHook(module: IModule | IDialogsModule): module is IDialogsModule {
  return !!(module as IDialogsModule).dialogs;
}

@injectable()
export class DialogsModuleExtender implements IModuleExtender {
  constructor(@inject(IServiceLocator) private locator: IServiceLocator,
              @inject(IDialogsRegistry) private registry: IDialogsRegistry) { }

  public extends(module: IModule | IDialogsModule): IDialogsModule | IModule {
    if (hasHook(module)) module.dialogs(this.registry, this.locator);
    return module;
  }
}
