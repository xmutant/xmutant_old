import FileType from "file-type/browser";
import { unzipFile, ZIP_MIMES } from "./files";

export async function processZipSandbox(file) {
  // assert that the file is ZIP
  // console.log("Hello from sanbox file");
  const type = await FileType.fromBlob(file);
  if (!type || !ZIP_MIMES.includes(type.mime)) {
    throw SandboxFileError.WRONG_FORMAT;
  }

  // unzip the file
  let files;
  try {
    files = await unzipFile(file);
  } catch (err) {
    throw SandboxFileError.FAILED_UNZIP;
  }

  // assert there is an index.html
  if (!files["index.html"]) {
    throw SandboxFileError.NO_INDEX_HTML;
  }

  // parse the contents of the HTML using DOMParser API
  const indexContents = await files["index.html"].text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(indexContents, "text/html");

  // go through the files to create object URLS
  const record = {};
  for (const name in files) {
    // if the file is a SVG file, we force the blob to take correct MIME type
    if (name.slice(-4) === ".svg") {
      files[name] = files[name].slice(0, files[name].size, "image/svg+xml");
    }
    record[name] = {
      url: URL.createObjectURL(files[name]),
    };
    if (name === "index.html") {
      record[name].blob = files[name];
    }
  }
  console.log("record", record);

  return record;
}
