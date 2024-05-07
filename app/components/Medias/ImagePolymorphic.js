import { HTMLProps, useMemo } from "react"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { isUriIpfs } from "../../utils/ipfs"


/**
 * The ImagePolymorphic component can be used to display an image and adapts
 * the URL which is fed to the <img> element based on the input source
 */
export function ImagePolymorphic(props) {
  // if the URL is an IPFS one, target the gateway otherwise just use uri
  const url = useMemo(
    () =>
      props.uri && isUriIpfs(props.uri) ? ipfsGatewayUrl(props.uri) : props.uri,
    [props.uri]
  )

  // remove the "uri" property from the props
  const imgProps = useMemo(() => {
    const P = { ...props }
    delete P.uri
    return P
  }, [props])

  return <img {...imgProps} src={url} />
}
