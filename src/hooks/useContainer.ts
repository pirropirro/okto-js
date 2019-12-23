import { Container } from "inversify";
import { useState as ReactUseState, useEffect as ReactUseEffect } from "react";

import { container as BaseContainer } from "../bootstrapper/container";

export function UseContainerFactory(container: Container, useState: typeof ReactUseState, useEffect: typeof ReactUseEffect) {
  return function <T>(identifier: string | symbol): T {
    const [instance, setInstance] = useState<T>();

    useEffect(() => {
      setInstance(container.get<T>(identifier));
    }, []);

    return instance;
  }
}

export const useContainer = UseContainerFactory(BaseContainer, ReactUseState, ReactUseEffect);
