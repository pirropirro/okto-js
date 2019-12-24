import { IModule } from "./IModule";

export const IModuleExtender = Symbol("IModuleExtender");
export interface IModuleExtender {
  extends<T extends IModule = IModule>(module: T | IModule): T | IModule;
}
