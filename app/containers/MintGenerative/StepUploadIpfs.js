import style from "./StepUploadIpfs.module.scss";
import layout from "../../styles/Layout.module.scss";
import cs from "classnames";
import { useState, useEffect } from "react";
import { Dropzone } from "../../components/Input/Dropzone";
import { Spacing } from "../../components/Layout/Spacing";
import { ZIP_MIMES } from "../../utils/files";
import { Button } from "../../components/Button";
import useFetch, { CachePolicies } from "use-http";
import { unzip } from "unzipit";
import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";
import path from "path";
// import { MintGenUploadProjectResponse } from "../../types/Responses";
// import { getFileUploadError } from "../../utils/errors";
// import { Error } from "../../components/Error/Error";

export const StepUploadIpfs = ({ onNext }) => {
  const [file, setFile] = useState(null);
  // const [safeData, setSafeData] = useState("")
  const { data, loading, error, post } = useFetch(
    `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/upload`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData = !error && !loading && (data || false);

  const upload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("files", file);
      post(formData);
    }
  };

  useEffect(() => {
    if (safeData) {
      console.log(safeData);
      onNext({
        cidUrlParams: safeData?.data?.Hash,
        authHash1: "",
      });
    }
  }, [safeData]);

  return (
    <div className={cs(layout.y_centered)}>
      <Spacing size="3x-large" sm="x-large" />
      <p>
        The .zip file of your project needs to be uploaded on the{" "}
        <a href="https://ipfs.io/" target="_blank" rel="noreferrer">
          IPFS network
        </a>
        .
      </p>

      <Spacing size="2x-large" sm="regular" />

      <section className={cs(style["btn-cont"])}>
        <Dropzone
          textDefault="Drop your .zip file here (on click to browse)"
          accepted={ZIP_MIMES}
          files={file ? [file] : null}
          onChange={(files) => files && files.length > 0 && setFile(files[0])}
          className={cs(style.dropzone)}
        />

        <Spacing size="4x-large" sm="x-large" />

        {error && <span>{error}</span>}

        <Button
          onClick={upload}
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          disabled={!file}
          size="large"
          className={style.button}
          state={loading ? "loading" : "default"}
        >
          upload
        </Button>
      </section>
      <Spacing size="none" sm="3x-large" />
    </div>
  );
};
