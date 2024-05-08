"use client";

import style from "./Sandbox.module.scss";
import cs from "classnames";
import { useState, useMemo, useRef, useEffect } from "react";
import { generateXmHash } from "../../utils/hash";
import { Dropzone } from "../../components/Input/Dropzone";
import { Button } from "../../components/Button";
import { FileList } from "./FileList";
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame";
import SandboxPreview from "../../components/Artwork/SandboxPreview";
import { useRuntimeController } from "../../hooks/useRuntimeController";
import { processZipSandbox } from "../../utils/sandbox";
import { ButtonFile } from "../../components/Button/ButtonFile";
import { HashTest } from "../../components/Testing/HashTest";
import { IterationTest } from "../../components/Testing/IterationTest";
import { RawFeatures } from "../../components/Features/RawFeatures";
import { fxParamsAsQueryParams } from "../../components/FxParams/utils";
import sha1 from "sha1";
import { ControlsTest } from "../../components/Testing/ControlsTest";

export default function Sandbox() {
  const artworkIframeRef = useRef(null);

  const [file, setFile] = useState(null);
  const [filesRecord, setFilesRecord] = useState(null);
  const [error, setError] = useState(null);

  // Stores the sandbox state
  const [sandboxId, setSandboxId] = useState("0");
  const lastUrl = useRef("");
  const lastId = useRef(sandboxId);

  // The sandbox connector is used to give a particular control of the sandbox
  // iframe to the runtime controller. Because the sandbox is an edge case, we
  // need such a module to fine-tune how the sandbox iframe behaves.
  const sandboxConnector = useMemo(
    () => (iframeRef) => {
      return {
        getUrl(state) {
          console.log("state", state);
          const base = `/something/preview.html?id=${sandboxId}`;
          const hash = sandboxId === "0" ? generateXmHash() : state.hash || "";
          const minter = state.minter || "";
          const params = state.inputBytes;
          let url = `${base}&xmhash=${hash}&fxminter=${minter}`;
          if (params) {
            if (fxParamsAsQueryParams(state.snippetVersion)) {
              url += `&fxparams=${params}`;
            } else {
              url += `&fxparamsUpdate=${sha1(params)}`;
              url += `#0x${params}`;
            }
          }
          return url;
        },
        useSync(runtimeUrl, controlsUrl) {
          // Every time the runtime URL changes, refresh the iframe.
          useEffect(() => {
            if (sandboxId === "0") return;
            const iframe = iframeRef.current?.getHtmlIframe();
            console.log("iframe", iframe);
            console.log("lastUrl.current", lastUrl.current);
            console.log("runtimeUrl", runtimeUrl);
            if (iframe && lastUrl.current !== runtimeUrl) {
              iframe.contentWindow?.location.replace(runtimeUrl);
              lastUrl.current = runtimeUrl;
              lastId.current = sandboxId;
            }
          }, [runtimeUrl, sandboxId]);
        },
      };
    },
    [sandboxId]
  );

  const { runtime, controls, details } = useRuntimeController(
    artworkIframeRef,
    {
      cid: "", // In this case, the URL is constructed with the connector above.
      snippetVersion: "",
    },
    {
      contextConnector: sandboxConnector,
    }
  );

  const fileList = useMemo(
    () => (filesRecord ? Object.keys(filesRecord) : null),
    [filesRecord]
  );

  const processFile = async (file) => {
    try {
      const record = await processZipSandbox(file);
      setFilesRecord(record);
    } catch (err) {
      // TODO: Process error
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (file) {
      processFile(file);
      // Hack: Forces a refresh of the iframe
      setTimeout(() => {
        runtime.state.update({ hash: generateXmHash() });
      }, 100);
    }
  };

  const updateFile = async (file) => {
    if (file) {
      setFile(file);
      processFile(file);
    }
  };

  return (
    <section
      className={`${style.container} ${
        filesRecord ? style["artwork-view"] : ""
      }`}
    >
      <div>
        {error && (
          <>
            <div className={style.error}>
              <i aria-hidden className="fas fa-exclamation-triangle" />
              <span>
                <strong>An error occurred when uploading your project</strong>
                <p>{error}</p>
              </span>
            </div>
          </>
        )}

        {filesRecord ? (
          <div className={style.testing}>
            <div className={style["files-header"]}>
              <h5>Files</h5>
              <span>
                <i aria-hidden className="fas fa-file-archive" /> {file?.name}
              </span>
            </div>
            <FileList files={fileList} />

            <ButtonFile
              state={"default"}
              accepted={["application/zip", "application/x-zip-compressed"]}
              onFile={updateFile}
              size="small"
              style={{
                alignSelf: "flex-start",
              }}
            >
              update .zip
            </ButtonFile>

            <div>
              <h5>Testing</h5>
              <p>You need to verify that:</p>
              <ul>
                <li>
                  a same hash will <strong>always</strong> generate the same
                  output
                </li>
                <li>
                  different hashes generate <strong>different</strong> outputs
                </li>
              </ul>

              <HashTest
                autoGenerate={false}
                value={runtime.state.hash}
                onHashUpdate={(hash) => runtime.state.update({ hash })}
                onRetry={controls.refresh}
              />

              <IterationTest
                autoGenerate={false}
                value={runtime.state.iteration}
                onIterationUpdate={(iteration) =>
                  runtime.state.update({ iteration })
                }
              />
            </div>
            {controls.state.params.definition && (
              <div>
                <h5>Params</h5>

                <ControlsTest
                  params={controls.state.params.values}
                  definition={controls.state.params.definition}
                  onSubmit={controls.hardSync}
                  updateParams={controls.updateParams}
                />
              </div>
            )}

            <div>
              <h5>Features</h5>

              <RawFeatures rawFeatures={runtime.definition.features} />
            </div>
          </div>
        ) : (
          <div className={style["drag-container"]}>
            <Dropzone
              className={style.drag}
              textDefault="Drag 'n' drop your ZIP file here"
              accepted={["application/zip", "application/x-zip-compressed"]}
              onChange={(files) => {
                setFile(files && files.length > 0 ? files[0] : null);
              }}
              files={file ? [file] : null}
            />
            <Button
              color="primary"
              state={"default"}
              className={style.button}
              disabled={!file}
              onClick={() => uploadFile()}
            >
              start tests
            </Button>
          </div>
        )}
      </div>
      <div className={cs(style.artworkWrapper)}>
        <div className={cs(style.artwork)}>
          <div className={cs(style["iframe-container"])}>
            <div className={cs(style["iframe-wrapper"])}>
              <ArtworkFrame>
                <SandboxPreview
                  id={sandboxId}
                  setId={setSandboxId}
                  ref={artworkIframeRef}
                  record={filesRecord || undefined}
                  textWaiting="Waiting for content to be reachable"
                />
              </ArtworkFrame>
            </div>
          </div>
          {details.activeUrl && (
            <Button
              isLink
              // @ts-ignore
              href={details.activeUrl}
              target="_blank"
              size="small"
              className={style.button}
              iconComp={<i aria-hidden className="fas fa-external-link-alt" />}
              iconSide="right"
            >
              open live
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
