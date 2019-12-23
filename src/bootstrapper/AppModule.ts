import { interfaces } from "inversify";

import { IModule } from "../module/IModule";
import { ObjectContainer } from "../ioc/ObjectContainer";
import { IObjectContainer } from "../ioc/ObjectContainer";
import { IServiceLocator } from '../ioc/ObjectContainer';
import { IModuleExtender } from '../module/IModuleExtender';
import { BeforeRunExtender } from "../module/BeforeRunExtender";

export class AppModule implements IModule {
  modules(container: interfaces.Container): void {
    container.bind<IObjectContainer>(IObjectContainer).to(ObjectContainer).inSingletonScope();
    container.bind<IServiceLocator>(IServiceLocator).toDynamicValue(() =>
      container.get<ObjectContainer>(IObjectContainer)
    ).inSingletonScope();

    container.bind<IModuleExtender>(IModuleExtender).to(BeforeRunExtender);
  }
}
