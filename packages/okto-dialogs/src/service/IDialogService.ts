export const IDialogService = Symbol("IDialogService");

export enum DialogStatus {
  CONFIRMED,
  REJECTED,
  CANCELLED,
}

export type DialogResponse<T = any> = {
  status: DialogStatus,
  data?: T,
};

export namespace DialogResponse {
  export function Confirm<T>(data: T): DialogResponse<T> {
    return { status: DialogStatus.CONFIRMED, data };
  }
  export function Reject(): DialogResponse {
    return { status: DialogStatus.REJECTED };
  }
  export function Cancel(): DialogResponse {
    return { status: DialogStatus.CANCELLED };
  }
}

export type DialogIdentifier = string | symbol;

export interface IDialogService {
  show<T>(dialog: DialogIdentifier, options?: any): Promise<DialogResponse<T>>;
  hide(): Promise<void>;
}
