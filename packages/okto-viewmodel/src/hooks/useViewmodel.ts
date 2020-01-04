import { interfaces } from "inversify";
import { useState as UseState, useEffect as UseEffect } from "react";

import { IViewModel } from "../viewmodel/IViewModel";
import { IViewModelFactory } from "../registry/IViewModelFactory";
import { useContainer as UseContainer } from "okto-core";

// tslint:disable-next-line: max-line-length
export function UseViewmodelFactory(useContainer: typeof UseContainer, useState: typeof UseState, useEffect: typeof UseEffect) {
  return function <T extends IViewModel>(constr: interfaces.Newable<T>, options?: any): T {
    const [_, update] = useState(0);
    const [viewmodel, setViewmodel] = useState<T>();
    const factory = useContainer<IViewModelFactory>(IViewModelFactory);

    useEffect(() => {
      if (!factory) return;

      const vm = factory.createFrom(constr, options);
      const subscription = vm.subscribe(() => update(count => count + 1));
      setViewmodel(vm);

      return () => {
        if (!!subscription) subscription.unsubscribe();
        if (!!viewmodel) viewmodel.unsubscribe();
      };
    }, [factory]);

    return viewmodel;
  };
}

export const useViewmodel = UseViewmodelFactory(UseContainer, UseState, UseEffect);
