import { Container } from "inversify";
import { useState as UseState, useEffect as UseEffect } from "react";

import { container as BaseContainer } from "../bootstrapper/container";

export function UseContainerFactory(container: Container, useState: typeof UseState, useEffect: typeof UseEffect) {
  return function <T>(identifier: string | symbol): T {
    const [instance, setInstance] = useState<T>();

    useEffect(() => {
      setInstance(container.get<T>(identifier));
    }, []);

    return instance;
  };
}

export const useContainer = UseContainerFactory(BaseContainer, UseState, UseEffect);
