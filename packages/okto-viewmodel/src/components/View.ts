import * as React from "react";
import { Unsubscribable } from "rxjs";
import { interfaces } from "inversify";

import { lazyInject } from "okto-core";
import { IViewModel } from "../viewmodel/IViewModel";
import { IViewModelFactory } from "../registry/IViewModelFactory";

export type ReactView<T, P> = React.Component<P, { viewmodel: T }> & { readonly viewmodel: T };

export function View<P extends object = {}, T extends IViewModel = IViewModel>(Viewmodel: interfaces.Newable<T>)
  : interfaces.Newable<ReactView<T, P>> {
  let subscription: Unsubscribable;
  return class extends React.Component<P, { viewmodel: T }> {
    private factory: IViewModelFactory;

    constructor(props: P) {
      super(props);
      lazyInject(IViewModelFactory)(this, "factory");
      const viewmodel = this.factory.createFrom(Viewmodel, this.props);
      subscription = viewmodel.subscribe(() => this.setState({}));
      this.state = { viewmodel };
    }

    get viewmodel(): T {
      return this.state.viewmodel;
    }

    public componentWillUnmount() {
      const { viewmodel } = this.state;
      if (!!subscription) subscription.unsubscribe();
      if (!!viewmodel) viewmodel.unsubscribe();
    }
  };
}
