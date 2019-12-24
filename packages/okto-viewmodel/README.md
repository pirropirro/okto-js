# react-viewmodel

## How to use it

- Create a viewmodel 
```typescript
import { ViewModel, Refresh } from "react-viewmodel";

@ViewModel.nameAs("Vegeta")
export class VegetaViewModel extends ViewModel {
  constructor(@inject(IUserRetriever) private retriever: IUserRetriever) {
    super();
    retriever.retrieve().then(user => setUser(user))
  }

  private counter: number = 0;
  
  @Refresh
  private setUser(user: User) {
    this.user = user;
  }

  public get value(): number {
    return this.counter;
  }

  // The Refresh decorator let the component re-rendering when the function is called
  @Refresh
  increase() {
    this.counter++;
  }

  isOver9000(): boolean {
    return this.counter >= 9000;
  }
}
```

- Create a component 
    - or using the `useViewmodel` hook
    ```tsx
    import * as React from "react";
    import { useViewmodel } from "react-viewmodel";

    import { VegetaViewModel } from "./VegetaViewModel";

    export const VegetaComponent = function () {
      const viewmodel = useViewmodel(VegetaViewModel);

      return <div>
          <h2>Counter {viewmodel.value}</h2>
          {viewmodel.isOver9000() && <h1>OVER</h1>}
          <button onClick={React.useCallback(() => viewmodel.increase(), [])}>Increase</button>
      </div>
    }
    ```

    - or extends the `View` component factory
    ```tsx
    import * as React from "react";
    import { View } from "react-viewmodel";

    import { VegetaViewModel } from "./VegetaViewModel";

    export class VegetaComponent extends View(VegetaViewModel) {
      render() {
        const {viewmodel} = this;
        
        return <div>
            <h2>Counter {viewmodel.value}</h2>
            {viewmodel.isOver9000() && <h1>IS OVER 9000!</h1>}
            <button onClick={React.useCallback(() => viewmodel.increase(), [])}>Increase</button>
        </div>
      }
    }
    ```

- Create a module and register the viewmodel in it.
```typescript
import { interfaces } from "inversify";
import { IViewModelsModule } from "react-viewmodel";
import { IModule, IViewModelRegistry } from "react-container";

import { VegetaViewModel } from './VegetaViewModel';

export class MainModule implements IModule, IViewModelsModule {
 modules(container: interfaces.Container): void { 
    /* Here you can bind services into the IOC container
    **
    ** es.
    ** container.bind<ISimpleService>(ISimpleService).to(SimpleService);
    **
    ** For more info check the inversifyJs documentation
    */
  }

  viewmodels(registry: IViewModelRegistry): void {
    registry.add(VegetaViewModel);
  }
}
```

- Register and run the app
```tsx
import "reflect-metadata";
import * as React from "react";
import { Application } from "react-container";
import { ViewModelModule } from "react-viewmodel";

import { MainModule } from './MainModule';
import { VegetaComponent } from "./VegetaComponent";

const app = new Application();
app.register(new ViewModelModule());

app.register(new MainModule());

// Here you can add as many Module as you want :)

app.run(() => <VegetaComponent />);
```