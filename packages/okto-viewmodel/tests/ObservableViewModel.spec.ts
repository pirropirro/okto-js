import "reflect-metadata";
import expect = require("expect.js");
import { Subject, Subscription } from "rxjs";
import { ObserverViewModel, ErrorViewModel } from "./fixtures/ObserverViewModel";

describe("The ObservableViewModel", () => {
  let subject: ObserverViewModel;
  let modelSubject: Subject<number>;
  let notifications: void[];
  let subscription: Subscription;

  beforeEach(() => {
    modelSubject = new Subject<number>();
    subject = new ObserverViewModel();
    subject["controller" as any] = { model: modelSubject };
    subject.observe();

    notifications = [];
    subscription = subject.subscribe(() => notifications.push(null));
  });

  context("when it receives a new model", () => {
    beforeEach(() => {
      modelSubject.next(10);
    });

    it("should notify that new data is available", () => {
      expect(subject.models[0]).to.be(10);
    });

    it("should notify that data has been changed", () => {
      expect(notifications).to.not.be.empty();
    });

    context("and there is an error while processing it", () => {
      let crashViewModel: ErrorViewModel;

      beforeEach(() => {
        crashViewModel = new ErrorViewModel();
        subscription.unsubscribe();
        notifications = [];
        crashViewModel["controller" as any] = { model: modelSubject };
        crashViewModel.observe();
        crashViewModel.subscribe(() => notifications.push(null));
      });

      it("the error should be propagated to the system", () => {
        modelSubject.next(15);
        expect(crashViewModel.error).not.to.be(null);
      });
    });
  });

  context("when it is not needed anymore", () => {
    beforeEach(() => {
      modelSubject.next(10);
      subject.unsubscribe();
    });

    it("should dispose all the resources", () => {
      expect(subject.disposed).to.be(true);
    });

    context("and when subsequent notifications are sent", () => {
      it("should ignore them", () => {
        expect(() => {
          modelSubject.next(20);
          expect(notifications.length).to.be(1);
        }).not.to.throwError();
      });
    });
  });

  context("when it receives an error from the model", () => {
    it("should notify the error to the subscribers", () => {
      modelSubject.error(new Error());

      expect(subject.error).not.to.be(null);
    });
  });

  context("when a method is marked with a refresh annotation", () => {
    context("and the method is not async", () => {
      it("should notify that the model has been changed", () => {
        subject.doSomething();

        expect(notifications).to.have.length(1);
      });
    });

    context("and the method is async", () => {
      it("should notify that the model has been changed correctly", async () => {
        await subject.doSomethingAsync();

        expect(subject.async).to.be(true);
        expect(notifications).to.have.length(1);
      });
    });
  });
});
