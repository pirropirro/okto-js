import { interfaces } from "inversify";
import getDecorators from "inversify-inject-decorators";

import * as React from "react";
import { render } from "react-dom";

import { IModule } from "../module/IModule";
import { AppModule } from "./AppModule";
import { container } from "./container";
import { IModuleExtender } from "../module/IModuleExtender";

export type lazyInjectType = (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
export type lazyMultiInjectType = (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;

let decorators = getDecorators(container);
export let lazyInject: lazyInjectType = decorators.lazyInject;
export let lazyMultiInject: lazyMultiInjectType = decorators.lazyMultiInject;

export class Application {
  private modules: IModule[] = [];

  constructor() {
    decorators = getDecorators(container);
    lazyInject = decorators.lazyInject;
    lazyMultiInject = decorators.lazyMultiInject;

    this.register(new AppModule());
  }

  register(module: IModule): boolean {
    if (module.modules) module.modules(container);
    this.modules.push(module);
    return true;
  }

  run(rootComponent: () => React.ReactElement<any>) {
    this.boot();
    render(rootComponent(), document.getElementById("root"));
  }

  boot() {
    let extenders = container.getAll<IModuleExtender>(IModuleExtender) || [];
    extenders.forEach(e => this.modules.forEach(m =>e.extends(m)));
  }
}
