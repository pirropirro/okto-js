import { Subscribable, Unsubscribable } from "rxjs";

export const IViewModel = Symbol("IViewModel");
export interface IViewModel extends Subscribable<void>, Unsubscribable { }
