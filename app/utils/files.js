import { unzip } from "unzipit"
import FileType from "file-type/browser"

export const ZIP_MIMES = [
  "application/zip",
  "application/x-zip-compressed",
  "multipart/x-zip",
]

const naiveMimes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
  csv: "text/csv",
  vtt: "text/vtt",
}

/**
 * Given a file name, outputs its mime type if it is a naive file (ie text file), otherwise returns null
 * @param filename filename/fullpath of the file
 */
export function getNaiveMimeType(filename) {
  const ext = filename.split(".").pop()
  return (ext && naiveMimes[ext]) || false
}

/**
 * Unzips a file, and create Blobs with the correct mime type
 * @param file the file to unzip, can be user-uploaded contents
 * @returns a record of the blobs, mapped by their path
 */
export async function unzipFile(file){
  const { entries } = await unzip(file)

  // go through each entry, and create a blob with the correct mime type
  const blobs = {}
  for (const name in entries) {
    // can we get a naive mime type ?
    let mime = getNaiveMimeType(name)
    // if we don't have a mime, we need to find it through magic number
    if (!mime) {
      const buffer = await entries[name].arrayBuffer()
      const type = await FileType.fromBuffer(buffer)
      if (type) {
        mime = type.mime
      }
    }
    // add the blob to the record
    blobs[name] = await entries[name].blob(mime || undefined)
  }

  return blobs
}

/**
 * Is an URL a local object url ?
 */
export function isUrlLocal(url) {
  return url.startsWith("blob:")
}

export const downloadTextAsGeneratedFile = (filename, text) => {
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    `data:text/calendar;charset=utf-8,${encodeURIComponent(text)}`
  )
  element.setAttribute("download", filename)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
