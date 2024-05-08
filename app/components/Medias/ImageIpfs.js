// import style from "./ImageIpfs.module.scss"
import cs from "classnames";
import { EGatewayIpfs, ipfsGatewayUrl } from "../../services/Ipfs";

export function ImageIpfs({
  src,
  hasPlaceholder = false,
  gateway = EGatewayIpfs.XMHASH_SAFE,
  ...props
}) {
  return <img {...props} src={ipfsGatewayUrl(src, gateway)} />;
}
