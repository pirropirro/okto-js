import { inject, injectable } from 'inversify';

import { IModule } from './IModule';
import { IModuleExtender } from './IModuleExtender';
import { IServiceLocator } from '../ioc/ObjectContainer';

export interface IBeforeRunModule extends IModule {
  beforeRun(serviceLocator: IServiceLocator): void;
}

function hasHook(module: IModule | IBeforeRunModule): module is IBeforeRunModule {
  return !!(module as IBeforeRunModule).beforeRun;
}

@injectable()
export class BeforeRunExtender implements IModuleExtender {
  constructor(@inject(IServiceLocator) private locator: IServiceLocator) { }

  extends(module: IModule | IBeforeRunModule): IBeforeRunModule | IModule {
    if (hasHook(module)) module.beforeRun(this.locator)
    return module;
  }
}
