import { useMemo } from "react";
import { useLocation } from "react-router";

import { Tabs } from "../../components/Layout/Tabs";
import style from "./Tabs.module.scss";
import cs from "classnames";

export function MintGenerativeTabs({ steps }) {
  const location = useLocation();

  const [paths, tabs] = useMemo(() => {
    const filter = steps.filter((step) => !step.hideTabs);
    return [
      filter.map((step) => step.path),
      filter.map((step, idx) => ({
        name: step.title,
        props: {
          idx: idx,
        },
      })),
    ];
  }, [steps]);

  const tabIndex = useMemo(() => {
    return paths.indexOf(location.pathname);
  }, [location, paths]);

  return tabIndex >= 0 ? (
    <>
    
      <Tabs
        tabDefinitions={tabs}
        activeIdx={tabIndex}
        tabsLayout="full-width"
        tabsClassName={cs(style.tab)}
        tabWrapperComponent={(props) => (
          <div
            {...props}
            style={{
              flexGrow: tabIndex === props.idx ? 2.5 : 1,
            }}
          >
            <span>{props.idx + 1}</span>
            {tabIndex === props.idx && <span>. {props.children}</span>}
          </div>
        )}
      />
     
    </>
  ) : null;
}
