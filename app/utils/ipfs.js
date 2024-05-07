import { ipfsGatewayUrl } from "../services/Ipfs.js";
import { generateRandomStringSequence } from "./getRandomStringSequence";
import sha1 from "sha1";

export function getIpfsSlash(cid) {
  return `ipfs://${cid}`;
}

/**
 * Generic method to get a display url based on a CID and a hash.
 * This function also accepts a transform method so that the base URL can be
 * formed in any way using the cid
 */
export function ipfsUrlWithHash(cid, hash, transform = ipfsGatewayUrl) {
  return `${transform(cid)}/?xmhash=${hash}`;
}

export function ipfsUrlWithHashAndParams(
  cid,
  urlParams = {
    xmhash: "",
    xmiteration: "",
    xmminter: "",
    xmparams: "",
    xmParamsAsQueryParams: false,
    xmcontext: undefined,
    noFxParamsUpdateQuery: false,
  },
  transform = ipfsGatewayUrl
) {
  let url = `${transform(cid)}/?xmhash=${urlParams.xmhash}&xmiteration=${
    urlParams.xmiteration
  }&xmminter=${urlParams.xmminter}`;
  if (urlParams.xmcontext) url += `&xmcontext=${urlParams.xmcontext}`;
  if (urlParams.xmparams) {
    if (urlParams.xmParamsAsQueryParams) {
      url += `&xmparams=${urlParams.xmparams}`;
    } else {
      if (!urlParams.noFxParamsUpdateQuery) {
        url += `&xmparamsUpdate=${sha1(urlParams.xmparams)}`;
      }
      url += `#0x${urlParams.xmparams}`;
    }
  }
  return url;
}

/**
 * Is an URI an IPFS uri ?
 */
export function isUriIpfs(uri) {
  return uri.startsWith("ipfs://");
}
