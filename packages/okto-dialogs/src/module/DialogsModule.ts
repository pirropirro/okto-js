import { interfaces } from "inversify";
import { IModule, IModuleExtender } from "okto-core";

import { DialogService } from "../service/DialogService";
import { IDialogService } from "../service/IDialogService";
import { DialogRegistry } from "../registry/DialogsRegistry";
import { DialogsModuleExtender } from "./DialogsModuleExtender";
import { IDialogStatusSubscriber } from "../service/IDialogStatusSubscriber";
import { IDialogsRegistry, IDialogsRetriever } from "../registry/IDialogsRegistry";

export class DialogsModule implements IModule {
  public modules(container: interfaces.Container): void {
    container.bind<IModuleExtender>(IModuleExtender).to(DialogsModuleExtender);

    container.bind<IDialogsRegistry>(IDialogsRegistry).to(DialogRegistry).inSingletonScope();
    container.bind<IDialogsRetriever>(IDialogsRetriever).toDynamicValue(() =>
      container.get<DialogRegistry>(IDialogsRegistry)).inSingletonScope();

      container.bind<IDialogService>(IDialogService).to(DialogService).inSingletonScope();
      container.bind<IDialogStatusSubscriber>(IDialogStatusSubscriber).toDynamicValue(() =>
        container.get<DialogService>(IDialogService)).inSingletonScope();
  }
}
