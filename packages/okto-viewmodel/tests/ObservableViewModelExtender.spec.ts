// tslint:disable: no-string-literal
import * as sinon from "sinon";
import { Observable } from "rxjs";
import expect = require("expect.js");
import { IMock, Mock, Times, It } from "typemoq";

import { SimpleViewModel } from "./fixtures/SimpleViewModel";
import { ObserverViewModel } from "./fixtures/ObserverViewModel";
import { IObservableController } from "../src/observable/IObservableController";
import { ObservableViewModelExtender, ObservableEntry } from "../src/observable/ObservableViewModelExtender";

describe("The ObservableViewModelExtender", () => {
  let subject: ObservableViewModelExtender;

  let obs: IMock<Observable<number>>;
  let viewmodel: ObserverViewModel;
  let controller: IObservableController<number>;
  let refreshObs: sinon.SinonSpy;

  let entry: ObservableEntry;

  beforeEach(() => {
    refreshObs = sinon.fake();
    viewmodel = new ObserverViewModel();
    obs = Mock.ofType<Observable<number>>();
    controller = { model: obs.object, refresh: refreshObs };

    entry = { constr: ObserverViewModel, source: () => controller };

    subject = new ObservableViewModelExtender();
  });

  context("when extend a viewmodel", () => {
    context("and it is an ObservableViewModel", () => {
      beforeEach(() => {
        subject.extend(viewmodel, entry);
      });

      it("should set the controller", () => {
        viewmodel.refreshWith({ some: "params" });
        expect(refreshObs.callCount).to.be.equal(1);
        expect(refreshObs.lastCall.args[0]).to.be.eql({ some: "params" });
      });

      it("should start to observe controller updates", () => {
        obs.verify(o => o.subscribe(It.isAny(), It.isAny()), Times.once());
      });
    });

    context("and it is NOT an ObservableViewModel", () => {
      it("should do nothing", () => {
        subject.extend(new SimpleViewModel(), entry);
        expect(subject["controller"]).to.not.be.ok();
        expect(subject["subscription"]).to.not.be.ok();
      });
    });
  });
});
