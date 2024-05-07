import css from "./Image.module.scss"
import cs from "classnames"
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  EGatewayIpfs,
  ipfsCidFromUriOrCid,
  ipfsGatewayUrl,
} from "../../services/Ipfs"


export const OG_IMAGE_SIZE = 1200

// a list of common sizes which will be used to fetch the resource, ensuring
// we hit the cache as often as possible
const sizes = [8, 16, 32, 64, 128, 256, 512, 768, 1024, 1400]

// the image display mode, depends on the context of the parent and how the
// image should be displayed, required to display a proper blur effect
// - contain: wrapper takes full width and height available, and image is set
//            to be contained in the available area
// - cover: same as above, but cover
// - responsive: image will take the full available width, and the height
//               proportionnal to its size


export const getImageApiUrl = (cid, width) =>
  `${process.env.NEXT_PUBLIC_API_MEDIA_ROOT}/w_${width}/${cid}`

export function Image(props) {
  const { image, ipfsUri, alt, mode, position, style } = props

  // top condition to avoid any computations if there is no img
  if (!image && !ipfsUri) return null

  // if there is no image element available (or if not processed yet), just
  // display the image from the source directly
  if (!image || !image.width || !image.height || !image.placeholder) {
    return (
      <SimpleImage
        ipfsUri={ipfsUri}
        alt={alt}
        mode={mode}
        style={style}
        position={position}
      />
    )
  }

  return <ReactiveImage {...props} />
}

function SimpleImage({
  ipfsUri,
  alt,
  mode = "contain",
  style,
  position,
  ...restProps
}) {
  const gatewayUrl = useMemo(
    () => ipfsGatewayUrl(ipfsUri, "FXHASH"),
    [ipfsUri]
  )

  return (
    <div
      className={cs(css.wrapper, css[`wrapper_${mode}`])}
      style={{
        position: position,
      }}
    >
      <img src={gatewayUrl} alt={alt} {...restProps} loading="lazy" />
    </div>
  )
}



function ReactiveImage({
  image,
  ipfsUri,
  alt,
  trueResolution,
  mode = "contain",
  onLoadingComplete,
  onError,
  style,
  position,
  ...restProps
}) {
  const ref = useRef(null)
  const [url, setUrl] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const gatewayUrl = useMemo(
    () => ipfsGatewayUrl(ipfsUri, "FXHASH"),
    [ipfsUri]
  )

  // keep a reference to the image loaded (cid & highest width)
  const imageLoaded = useRef(null)

  // returns the viewport available space based on the wrapper viewport
  // dimensions, or [1, 1] if ref doesn't exist
  const getViewportSpace = useCallback(() => {
    if (ref.current) {
      const bounds = ref.current.getBoundingClientRect();
      const devicePixelRatio =
        (window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio) || 1;
      return {
        width: bounds.width * devicePixelRatio,
        height: bounds.height * devicePixelRatio,
      };
    }
    return {
      width: 1,
      height: 1,
    };
  }, []);
  

  const updateImageUrl = useCallback(() => {
    // no media element = pull image from IPFS directly
    if (!image || trueResolution) {
      setUrl(gatewayUrl)
      return
    }

    // compute available space and load the appropriate image accordingly
    const space = getViewportSpace()
    // find the best width based on available space
    let width = sizes[sizes.length - 1]
    for (const w of sizes) {
      if (w > space.width) {
        width = w
        break
      }
    }

    // if target size is greater than the highest size loaded, or if there is no
    // image currently loaded or if CIDs don't match
    const loaded = imageLoaded.current
    if (!loaded || loaded.cid !== image.cid || loaded.highestWidth < width) {
      imageLoaded.current = {
        cid: image.cid,
        highestWidth: width,
      }
      if (loaded?.cid !== image.cid) setLoaded(false)
      setUrl(getImageApiUrl(image.cid, width))
    }
  }, [getViewportSpace, image, ipfsUri])

  // attach a resize observer to the element, which will eventually fetch a
  // higher resolution image if needed
  useEffect(() => {
    // if we want to keep the original image media, just set URL to IPFS
    if (trueResolution) {
      setUrl(gatewayUrl)
      return
    }

    if (ref.current) {
      const observer = new ResizeObserver(() => {
        updateImageUrl()
      })
      observer.observe(ref.current)

      return () => {
        ref.current && observer.disconnect()
      }
    }
  }, [image, ipfsUri, gatewayUrl, trueResolution, updateImageUrl])

  // triggers an error if an image has not yet been loaded
  const triggerError = useCallback(() => {
    !loaded && onError?.()
  }, [loaded, onError])

  // when the image is loaded
  const isLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <div
      ref={ref}
      className={cs(css.wrapper, css[`wrapper_${mode}`], {
        [css.loading]: !loaded,
      })}
      style={{
        backgroundImage: loaded ? undefined : `url("${image?.placeholder}")`,
        position: position,
        paddingTop:
          mode === "responsive"
            ? `${(image.height / image.width) * 100}%`
            : undefined,
      }}
    >
      {url && (
        <img
          src={url}
          alt={alt}
          {...restProps}
          onLoad={isLoaded}
          onError={triggerError}
          loading="lazy"
        />
      )}
    </div>
  )
}
