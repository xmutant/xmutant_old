import { useState, useEffect, useMemo, useRef } from "react";
import { Switch, Route, useHistory, useLocation } from "react-router-dom";
import { StepHome } from "./StepHome";
import { MintGenerativeTabs } from "./Tabs";
import { StepUploadIpfs } from "./StepUploadIpfs";
import { StepCheckFiles } from "./StepCheckFiles";
import { StepConfigureCapture } from "./StepConfigureCapture";
import { StepVerification } from "./StepVerification";
import { StepInformations } from "./StepInformations";
import { StepSuccess } from "./StepSuccess";
import { StepExtraSettings } from "./StepExtraSettings/StepExtraSettings";
import { StepAuthoring } from "./StepAuthoring";
import { StepDistribution } from "./StepDistribution";
import { StepPreviewMint } from "./StepPreviewMint";

const STEPS = [
  {
    path: "/",
    component: StepHome,
    hideTabs: true,
    requiredProps: ["minted"],
  },
  {
    path: "/authoring",
    component: StepAuthoring,
    title: "Authoring",
    requiredProps: [],
  },
  {
    path: "/upload-ipfs",
    component: StepUploadIpfs,
    title: "Upload to IPFS",
    requiredProps: ["collaboration"],
  },
  {
    path: "/check-files",
    component: StepCheckFiles,
    title: "Check files",
    requiredProps: ["cidUrlParams", "authHash1"],
  },
  {
    path: "/capture-settings",
    component: StepConfigureCapture,
    title: "Configure capture",
    requiredProps: [
      "previewHash",
      "previewIteration",
      "previewMinter",
      "previewInputBytes",
      "params",
      "snippetVersion",
    ],
  },
  {
    path: "/verifications",
    component: StepVerification,
    title: "Verifications",
    requiredProps: [
      "cidPreview",
      "authHash2",
      "captureSettings",
      "cidThumbnail",
    ],
  },
  {
    path: "/distribution",
    component: StepDistribution,
    title: "Distribution",
    requiredProps: [],
  },
  {
    path: "/extra-settings",
    component: StepExtraSettings,
    title: "Extra settings",
    requiredProps: ["distribution"],
  },
  {
    path: "/informations",
    component: StepInformations,
    title: "Project details",
    requiredProps: ["settings"],
  },
  {
    path: "/preview-mint",
    component: StepPreviewMint,
    title: "Preview & Mint",
    requiredProps: ["informations"],
  },
  {
    path: "/success",
    component: StepSuccess,
    hideTabs: true,
    requiredProps: [],
  },
];

function validateState(state, props) {
  for (const prop of props) {
    if (typeof state[prop] === "undefined") {
      return false;
    }
  }
  return true;
}

function clearDataDown(state, props) {
  const nstate = {};
  for (const prop of props) {
    nstate[prop] = state[prop];
  }
  return nstate;
}

export const MintGenerativeController = ({ anchor }) => {
  const [state, setState] = useState({
    minted: false,
  });
  const history = useHistory();
  const location = useLocation();

  const stepIndex = useMemo(() => {
    const S = STEPS.find((step) => step.path === location.pathname);
    const idx = S ? STEPS.indexOf(S) : 0;
    return idx !== -1 ? idx : 0;
  }, [location]);

  const onNext = (update) => {
    setState({
      ...state,
      ...update,
    });
    history.push(STEPS[stepIndex + 1].path);
  };

  useEffect(() => {
    if (stepIndex !== 0 && anchor?.current) {
      window.scrollTo({
        top: anchor.current.offsetTop - 30,
        left: 0,
        behavior: "smooth",
      });
    }

    const requiredProps = STEPS.slice(0, stepIndex + 1)
      .map((step) => step.requiredProps)
      .reduce((prev, props) => prev.concat(props), []);

    if (validateState(state, requiredProps)) {
      const keepProps = STEPS.slice(0, stepIndex + 2)
        .map((step) => step.requiredProps)
        .reduce((prev, props) => prev.concat(props), []);

      setState(clearDataDown(state, keepProps));
    } else {
      const previous = STEPS[stepIndex - 1];
      history.replace(previous.path);
    }
  }, [stepIndex]);

  useEffect(() => {
    if (state.minted && location.pathname !== "/success") {
      history.replace(STEPS[STEPS.length - 1].path);
    }
  }, [state]);

  return (
    <>
      <MintGenerativeTabs steps={STEPS} />

      <Switch>
        {STEPS.map((step, idx) => (
          <Route key={idx} path={step.path} exact>
            <step.component onNext={onNext} state={state} />
          </Route>
        ))}
        <Route path="/">
          <StepHome onNext={onNext} state={state} />
        </Route>
      </Switch>
    </>
  );
};
