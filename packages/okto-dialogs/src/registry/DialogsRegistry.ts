import { injectable } from "inversify";
import { Dictionary, isSymbol } from "lodash";

import { DialogIdentifier } from "../service/IDialogService";
import { IDialogsRegistry, IDialogsRetriever, DialogComponent } from "./IDialogsRegistry";

@injectable()
export class DialogRegistry implements IDialogsRegistry, IDialogsRetriever {
  private dialogs: Dictionary<DialogComponent> = {};

  public add(identifier: DialogIdentifier, component: DialogComponent): IDialogsRegistry {
    const id = isSymbol(identifier) ? identifier.toString() : identifier as string;
    this.dialogs[id] = component;
    return this;
  }

  public retrieve(identifier: DialogIdentifier): DialogComponent {
    const id = isSymbol(identifier) ? identifier.toString() : identifier as string;
    return this.dialogs[id];
  }
}
