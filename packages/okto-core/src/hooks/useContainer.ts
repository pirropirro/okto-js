import { Container } from "inversify";
import { useState as UseState, useMemo as UseMemo } from "react";

import { container as BaseContainer } from "../bootstrapper/container";

export function UseContainerFactory(container: Container, useState: typeof UseState, useMemo: typeof UseMemo) {
  return function <T>(identifier: string | symbol): T {
    const [instance] = useState<T>(
      useMemo(() => container.get<T>(identifier), [identifier]));
    return instance;
  };
}

export const useContainer = UseContainerFactory(BaseContainer, UseState, UseMemo);
