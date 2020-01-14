import { JSXElementConstructor } from "react";

import { DialogIdentifier } from "../service/IDialogService";

export type DialogComponentProps<T> = {
  options?: any;
  confirm(data: T): void;
  reject(): void;
  cancel(): void;
};

export type DialogComponent<T = any> = JSXElementConstructor<DialogComponentProps<T>>;

export const IDialogsRegistry = Symbol("IDialogsRegistry");
export interface IDialogsRegistry {
  add(identifier: DialogIdentifier, component: DialogComponent): IDialogsRegistry;
}

export const IDialogsRetriever = Symbol("IDialogsRetriever");
export interface IDialogsRetriever {
  retrieve(identifier: DialogIdentifier): DialogComponent;
}
