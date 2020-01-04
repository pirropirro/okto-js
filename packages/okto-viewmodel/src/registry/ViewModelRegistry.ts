import { Dictionary } from "lodash";
import { IObjectContainer, IServiceLocator } from "okto-core";
import { injectable, interfaces, multiInject, inject, optional } from "inversify";

import { ViewModel } from "../viewmodel/ViewModel";
import { IViewModel } from "../viewmodel/IViewModel";
import { IViewModelRegistry } from "./IViewModelRegistry";
import { ViewModelRegistryEntry, EntryBuilder } from "../entries/EntryBuilder";
import { IViewModelFactory, IViewModelFactoryExtender } from "./IViewModelFactory";

@injectable()
export class ViewModelRegistry implements IViewModelRegistry, IViewModelFactory {
  private entries: Dictionary<ViewModelRegistryEntry> = {};
  constructor(@inject(IObjectContainer) private container: IObjectContainer & IServiceLocator,
    @multiInject(IViewModelFactoryExtender) @optional() private extenders: IViewModelFactoryExtender[] = []) { }

  public createFrom<T extends IViewModel, P extends object = {}>(constr: interfaces.Newable<T>, parameters?: P): T {
    const name = ViewModel.nameFrom(constr);
    const viewmodel = this.container.get<T>(name);
    this.extenders.forEach(ext => ext.extend(viewmodel, this.entries[name], parameters));

    return viewmodel;
  }

  public add(viewmodel: interfaces.Newable<IViewModel>): IViewModelRegistry;
  public add<T extends object = undefined>(builder: EntryBuilder<T>): IViewModelRegistry;
  public add<T extends object = undefined>(entry: ViewModelRegistryEntry<T>): IViewModelRegistry;
  // tslint:disable-next-line: max-line-length
  public add<T extends object = undefined>(entryOrConstr: interfaces.Newable<IViewModel> | ViewModelRegistryEntry<T>): IViewModelRegistry {
    let entry: ViewModelRegistryEntry<T>;
    if (isEntry(entryOrConstr)) entry = entryOrConstr;
    else entry = isBuilder(entryOrConstr) ? entryOrConstr.build() : { constr: entryOrConstr };

    const name = ViewModel.nameFrom(entry.constr);
    this.entries[name] = entry;
    this.container.set<IViewModel>(name, entry.constr);
    return this;
  }
}

// tslint:disable-next-line: max-line-length
function isEntry(entryOrConstr: interfaces.Newable<IViewModel> | ViewModelRegistryEntry): entryOrConstr is ViewModelRegistryEntry {
  return !!(entryOrConstr as ViewModelRegistryEntry).constr;
}

// tslint:disable-next-line: max-line-length
function isBuilder(entryOrConstr: interfaces.Newable<IViewModel> | EntryBuilder<any>): entryOrConstr is EntryBuilder<any> {
  return !!(entryOrConstr as EntryBuilder).build;
}
