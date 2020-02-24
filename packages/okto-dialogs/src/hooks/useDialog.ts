import { useContainer } from "okto-core";
import { useState, useMemo } from "react";
import { DialogIdentifier, DialogResponse, IDialogService } from "../service/IDialogService";

type DialogController<T> = {
  show(options?: any): Promise<DialogResponse<T>>;
  hide(): Promise<void>;
};

export function useDialog<T>(identifier: DialogIdentifier): DialogController<T> {
  const service = useContainer<IDialogService>(IDialogService);

  const [dialog] = useState<DialogController<T>>(useMemo(() => ({
    show: (options?: any) => service.show<T>(identifier, options),
    hide: () => service.hide(),
  }), [identifier]));

  return dialog;
}
