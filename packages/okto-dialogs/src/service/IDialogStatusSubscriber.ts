import { Subscribable } from "rxjs";
import { DialogComponentProps } from "../registry/IDialogsRegistry";
import { DialogIdentifier } from "./IDialogService";

export type DialogConfig<T = any> = {
  identifier: DialogIdentifier;
  props: DialogComponentProps<T>;
};

export const IDialogStatusSubscriber = Symbol("IDialogStatusSubscriber");
export interface IDialogStatusSubscriber extends Subscribable<DialogConfig> {}
