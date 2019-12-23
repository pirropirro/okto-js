import { isFunction } from "lodash";
import { interfaces, injectable } from "inversify";
import { container } from "../bootstrapper/container";

export const IServiceLocator = Symbol("IServiceLocator");
export interface IServiceLocator {
  get<T>(key: string | symbol, name?: string | symbol): T;
}

export const IObjectContainer = Symbol("IObjectContainer");
export interface IObjectContainer {
  set<T>(key: string | symbol, object: interfaces.Newable<T> | T, parent?: string): void;
}

@injectable()
export class ObjectContainer implements IObjectContainer, IServiceLocator {
  get<T>(key: string, name?: string): T {
    return !name ? container.get<T>(key) : container.getNamed<T>(key, name);
  }

  set<T>(key: string | symbol, object: T | interfaces.Newable<T>, parent?: string): void {
    let binding = isFunction(object)
      ? container.bind<T>(key).to(object as interfaces.Newable<T>)
      : container.bind<T>(key).toConstantValue(object as T);
    if (parent)
      binding.whenInjectedInto(parent);
  }

  contains(key: string): boolean {
    return container.isBound(key);
  }

  remove(key: string): void {
    container.unbind(key);
  }
}
