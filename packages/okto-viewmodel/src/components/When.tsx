import * as React from "react";
import { useState, useEffect } from "react";
import { isFunction } from "lodash";

export function When({ predicate, children }: { predicate: boolean | (() => boolean), children: React.ReactNode }) {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => setShow(isFunction(predicate) ? predicate() : predicate), []);

  return show && <>{children}</>;
}
