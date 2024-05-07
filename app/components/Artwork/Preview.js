import { ArtworkFrame } from "./ArtworkFrame"
import { Image } from "../Image"
import { LazyImage } from "../Image/LazyImage"
// import { MediaImage } from "../../types/entities/MediaImage"



export function ArtworkPreview({
  image,
  ipfsUri,
  url,
  alt = "Generative Token preview",
}) {
  return (
    <ArtworkFrame>
      {url ? (
        <LazyImage url={url} alt={alt} />
      ) : (
        <Image image={image} ipfsUri={ipfsUri} alt={alt} />
      )}
    </ArtworkFrame>
  )
}
