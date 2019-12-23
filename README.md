# react-container

## How it works? 
`react-container` brings `IoC` functionality into React.

## How to use it

- Create a service 
```typescript
import { inject, injectable } from "inversify";

export const IConfigRetriever = Symbol("IConfigRetriever");
export interface IConfigRetriever {
  retrieve(): any;
}

@injectable()
export class ConfigRetriever extends IConfigRetriever{
  constructor(@inject("Config") private config: any) {}

  public retrieve(): any {
    return this.config;
  }
}
```

- Create a module and register the service in it.
```typescript
import { interfaces } from "inversify";
import { IModule } from "react-container";

import { IConfigRetriever,  ConfigRetriever } from './ConfigRetriever';

export class ConfigModule implements IModule, IViewModelsModule {
 modules(container: interfaces.Container): void { 
    container.bind<IConfigRetriever>(IConfigRetriever).to(ConfigRetriever);
  }
}
```


- Create a component where use the service
```tsx
import { useState, useEffect } from "react";
import { useContainer } from "react-container";

import { IConfigRetriever } from './ConfigRetriever';

export function Config = () => {
  const retriever = useContainer<IConfigRetriever>(IConfigRetriever);
  const [config, setConfig] = useState<any>({});

  useEffect(() => setConfig(retriever.retrieve()), [retriever]);

  return <div>{JSON.stringify(config)}</div>
}
```

- Register and run the app
```tsx
import "reflect-metadata";
import * as React from "react";
import { Application } from "react-container";

import { Config } from "./Config";
import { ConfigModule } from "./ConfigModule";

const app = new Application();
app.register(new ConfigModule());

// Here you can add as many Module as you want :)

app.run(() => <Config />);
```