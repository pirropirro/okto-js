import { isFunction } from "lodash";
import { interfaces } from "inversify";
import { useContainer as UseContainer } from "okto-core";
import { useState as UseState, useEffect as UseEffect, useMemo as UseMemo } from "react";

import { IViewModel } from "../viewmodel/IViewModel";
import { IViewModelFactory } from "../registry/IViewModelFactory";

function isInstance<T extends IViewModel>(viewmodel: interfaces.Newable<T> | T): viewmodel is T {
  return viewmodel && !isFunction(viewmodel);
}

// tslint:disable-next-line: max-line-length
export function UseViewmodelFactory(useContainer: typeof UseContainer, useState: typeof UseState, useEffect: typeof UseEffect, useMemo: typeof UseMemo) {
  return function <T extends IViewModel>(constr: interfaces.Newable<T> | T, options?: any): T {
    const [_, update] = useState(0);
    const factory = useContainer<IViewModelFactory>(IViewModelFactory);
    const [viewmodel] = useState<T>(
      useMemo(() => isInstance(constr) ? constr : factory.createFrom(constr, options), []));

    useEffect(() => {
      const subscription = viewmodel.subscribe(() => update(count => count + 1));

      return () => {
        if (!!subscription) subscription.unsubscribe();
        if (!!viewmodel) viewmodel.unsubscribe();
      };
    }, [viewmodel]);

    return viewmodel;
  };
}

export const useViewmodel = UseViewmodelFactory(UseContainer, UseState, UseEffect, UseMemo);
