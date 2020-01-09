import { Container } from "inversify";
import { useState as UseState } from "react";

import { container as BaseContainer } from "../bootstrapper/container";

export function UseContainerFactory(container: Container, useState: typeof UseState) {
  return function <T>(identifier: string | symbol): T {
    const [instance] = useState<T>(container.get<T>(identifier));
    return instance;
  };
}

export const useContainer = UseContainerFactory(BaseContainer, UseState);
