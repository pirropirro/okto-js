import expect = require("expect.js");
import * as sinon from "sinon";
import * as React from "react";
import { isNumber, isFunction } from "lodash";
import { IMock, Mock, It, Times } from "typemoq";
import { useContainer as UseContainer } from "okto-core";

import { SimpleViewModel } from "./fixtures/SimpleViewModel";
import { useViewmodel as UseViewmodel, UseViewmodelFactory } from "../src/hooks/useViewmodel";
import { IViewModelFactory } from "../src/registry/IViewModelFactory";

describe("The useViewmodel hook", () => {
  let subject: typeof UseViewmodel;

  let factory: IMock<IViewModelFactory>;
  let useContainer: typeof UseContainer;
  let useState: typeof React.useState;
  let useEffect: typeof React.useEffect;

  let viewmodel: SimpleViewModel;
  let updateView: sinon.SinonSpy;
  let updateViewmodel: sinon.SinonSpy;

  let useEffectCallback: React.EffectCallback;

  beforeEach(() => {
    viewmodel = new SimpleViewModel();

    updateView = sinon.fake();
    updateViewmodel = sinon.fake();

    factory = Mock.ofType<IViewModelFactory>();
    factory.setup(f => f.createFrom(It.isValue(SimpleViewModel), It.isAny())).returns(() => viewmodel);

    useContainer = () => factory.object as any;

    useState = sinon.fake((state?: any) => {
      if (isNumber(state)) return [state, updateView];
      return [viewmodel, updateViewmodel];
    });

    useEffect = (effect) => useEffectCallback = effect;

    subject = UseViewmodelFactory(useContainer, useState, useEffect);
  });

  context("when is used in a component via constructor", () => {
    beforeEach(() => {
      subject(SimpleViewModel, {some: "params"});
    });

    it("should retrieve the viewmodel", () => {
      factory.verify(f => f.createFrom(It.isValue(SimpleViewModel), It.isValue({some: "params"})), Times.once());
    });

    context(("and it is mount"), () => {
      let disposeCallback: void | (() => void);
      beforeEach(() => {
        disposeCallback = useEffectCallback();
      });

      it("should subscribe the component to the viewmodel updates", () => {
        viewmodel.increase();
        viewmodel.increase();
        expect(updateView.callCount).to.be(2);

        viewmodel.decrease();
        expect(updateView.callCount).to.be(2);
      });

      context("when is going to unmount", () => {
        beforeEach(() => {
          if (isFunction(disposeCallback)) disposeCallback();
        });
        it("should unsubscribe the component", () => {
          viewmodel.increase();
          expect(updateView.callCount).to.be(0);

        });
        it("should dispose the viewmodel", () => {
          expect(viewmodel.isDisposed).to.be.ok();
        });
      });
    });
  });

  context("when is used in a component via instance", () => {
    beforeEach(() => {
      subject(viewmodel, {some: "params"});
    });

    it("should NOT retrieve the viewmodel", () => {
      factory.verify(f => f.createFrom(It.isAny(), It.isValue({some: "params"})), Times.never());
    });

    context(("and it is mount"), () => {
      let disposeCallback: void | (() => void);
      beforeEach(() => {
        disposeCallback = useEffectCallback();
      });

      it("should subscribe the component to the viewmodel updates", () => {
        viewmodel.increase();
        viewmodel.increase();
        expect(updateView.callCount).to.be(2);

        viewmodel.decrease();
        expect(updateView.callCount).to.be(2);
      });

      context("when is going to unmount", () => {
        beforeEach(() => {
          if (isFunction(disposeCallback)) disposeCallback();
        });
        it("should unsubscribe the component", () => {
          viewmodel.increase();
          expect(updateView.callCount).to.be(0);

        });
        it("should dispose the viewmodel", () => {
          expect(viewmodel.isDisposed).to.be.ok();
        });
      });
    });
  });
});
