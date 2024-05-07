import { useLazyImage } from "../../utils/hookts"



export function LazyImage({ url, alt, onLoad, onError }) {
  const loaded = useLazyImage(url, { onLoad, onError })
  return <>{url && loaded && <img src={url} alt={alt} />}</>
}
