import * as React from "react";
import classnames from "classnames";
import { useContainer } from "okto-core";
import { useState, useEffect } from "react";

import { IDialogsRetriever } from "../registry/IDialogsRegistry";
import { IDialogStatusSubscriber, DialogConfig } from "../service/IDialogStatusSubscriber";

export function Dialogs() {
  const [[config, dialog], setState] = useState<[DialogConfig, React.ReactNode]>([] as any);
  const retriever = useContainer<IDialogsRetriever>(IDialogsRetriever);
  const subscriber = useContainer<IDialogStatusSubscriber>(IDialogStatusSubscriber);

  useEffect(() => {
    const notifications = subscriber.subscribe(c => {
      if (!c) return setState([] as any);

      const Component = retriever.retrieve(c.identifier);
      setState([c, <Component {...c.props} />]);
    });

    return () => notifications.unsubscribe();
  }, [subscriber, retriever]);

  const cancel = () => config && config.props.cancel();
  const preventClick = (ev) => ev.stopPropagation();

  return <div className={classnames("dialogs-container", !!dialog ? "dialogs-container__active" : "")} onClick={cancel}>
    <div className="dialogs-container--modal" onClick={preventClick}>
      {dialog}
    </div>
  </div>;
}
