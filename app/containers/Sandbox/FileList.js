'use client'
import style from "./FileList.module.scss";

import React, { useMemo, Fragment } from "react";

function StructureRenderer({ structure }) {
  const keys = Object.keys(structure);
  return (
    <>
      {keys.map((key) =>
        structure[key] ? (
          <Fragment key={key}>
            <li>{key}</li>
            <ul>
              <StructureRenderer structure={structure[key]} />
            </ul>
          </Fragment>
        ) : (
          <li key={key}>{key}</li>
        )
      )}
    </>
  );
}

function FileList({ files }) {
  // Parse the files to turn them into a directory structure
  const structure = useMemo(() => {
    const S = {};
    if (files) {
      files.forEach((file) => {
        const dirs = file.split("/");
        let pos = S;
        // Build directories
        for (let i = 0; dirs.length - 1; i++) {
          if (pos[dirs[i]] === undefined) {
            pos[dirs[i]] = {};
          }
          pos = pos[dirs[i]];
        }
        // Add file
        pos[dirs[dirs.length - 1]] = false;
      });
    }
    return S;
  }, [files]);

  return (
    <ul className={style.container}>
      <StructureRenderer structure={structure} />
    </ul>
  );
}

export { FileList };
