import { differenceInSeconds } from "date-fns";
import { getIpfsSlash, ipfsUrlWithHashAndParams } from "./ipfs";
import { clamp } from "./math";
import { tagsFromString } from "./strings";
import { transformPricingFixedInputToNumbers } from "./transformers/pricing";
import { fxParamsAsQueryParams } from "../components/FxParams/utils";
// import { isUserOrCollaborator } from "./user"

export function getGenerativeTokenUrl(generative) {
  return generative.slug
    ? `/generative/slug/${generative.slug}`
    : `/generative/${generative.id}`;
}

export function getGenerativeTokenMarketplaceUrl(generative) {
  return `/marketplace/generative/${generative.id}`;
}

/**
 * Some "fake" data to be use for a fake Generative Token
 */
export const fakeGenerativeToken = {
  id: 0,
  name: "FXHASH Generative Logo",
  metadata: {
    name: "FXHASH Generative Logo",
    description:
      'This Generative Token is the first GT minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a "Dividing-Aggregating Walkers" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash',
    childrenDescription:
      'Unique iteration of the first Generative Token minted on fxhash.\n\nIt also servers as the actual logo of the platform. It represents the generative processes driving fxhash tokens. Generative Tokens are fed with a unique hash to produce unique outputs based on the hash — they are functions with a hash as single input.\n\nThe growth that comes out of the text is driven by a "Dividing-Aggregating Walkers" (DAW) algorithm. The hash drives all the DAW settings, as well as a mutation factor which is responsible for changes in each Walker parameters as they divide.\n\nSome iterations will produce very simple outputs whereas others might be more chaotic.\n\nPiece by @ciphrd for fxhash',
    tags: ["fxhash", "logo", "first", "mycelium", "walkers", "dividing"],
    artifactUri: "ipfs://QmV17ZnUHxwjHRjVT3mHMPs4oNfFtA2bAHxq3C4HNkvZtM",
    displayUri: "ipfs://QmW6WBRx5M69kPx6CbSjsS4fcTVy21117pwwsU8iAMhBqX",
    thumbnailUri: "ipfs://QmWiqH6gw8vZT4VZ58gLCSNRxumJTVfJpe6q6mCZGzRNCo",
    generativeUri: "ipfs://Qmc4tMDF2ff8efhi7ybAZTWucQXbuUk9z7DozAUfFgWDZB",
    authenticityHash:
      "4e1f469734487086a67ee25ba1d5e4edd0346c449533505055b74f62f7fd66fe",
    symbol: "FXGEN",
    decimals: 0,
  },
  price: 100.5,
  originalSupply: 600,
  supply: 256,
  balance: 0,
  enabled: true,
  author: {
    id: "tz1fepn7jZsCYBqCDhpM63hzh9g2Ytqk4Tpv",
    name: "fxhash",
    avatarUri: "ipfs://QmURUAU4YPa6Wwco3JSVrcN7WfCrFBZH7hY51BLrc87WjM",
  },
};

/**
 * A function to turn call settings into a fake Generative Token, for the
 * purpose of display
 */
export function generativeFromMintParams(
  params,
  metadata,
  metadataUri,
  author,
  usersLoaded
) {
  return {
    id: 0,
    version: "V3",
    author: author,
    name: metadata.name,
    flag: "NONE",
    metadata: metadata,
    metadataUri: metadataUri,
    thumbnailUri: metadata.thumbnailUri,
    displayUri: metadata.displayUri,
    tags: metadata.tags,
    labels: metadata.tags,
    pricingFixed:
      params.pricing.pricing_id === 0
        ? {
            price: params.pricing.details.price,
            opensAt: params.pricing.details.opens_at,
          }
        : undefined,
    // todo
    pricingDutchAuction:
      params.pricing.pricing_id === 1
        ? {
            levels: params.pricing.details.levels,
            opensAt: params.pricing.details.opens_at,
            decrementDuration: params.pricing.details.decrement_duration,
          }
        : undefined,
    // todo: remove
    price: 0,
    originalSupply: params.amount,
    supply: params.amount,
    balance: params.amount,
    enabled: params.enabled,
    royalties: params.royalties,
    splitsPrimary: params.primary_split.map((split) => ({
      pct: split.pct,
      user: usersLoaded.find((u) => u.id === split.address) || {
        id: split.address,
      },
    })),
    splitsSecondary: params.royalties_split.map((split) => ({
      pct: split.pct,
      user: usersLoaded.find((u) => u.id === split.address) || {
        id: split.address,
      },
    })),
    // todo
    reserves: params.reserves,
    lockedSeconds: 0,
    lockEnd: new Date(0).toISOString(),
    objkts: [],
    actions: [],
    createdAt: new Date().toISOString(),
    redeemables: [],
    underAuctionMintTickets: [],
    mintTickets: [],
    mintTicketSettings: null,
    inputBytesSize: 0,
    gentkContractAddress: "",
  };
}

/**
 * Given some MintGenerativeData, built with the mint pipeline, outputs a JSON
 * object which corresponds to the metadata which needs to be uploaded to IPFS
 * and associated with the token on chain.
 */
export function generativeMetadataFromMintForm(data) {
  console.log("data", data);
  // build the capture settings
  const capture = {
    mode: "VIEWPORT",
    triggerMode: "FN_TRIGGER",
    gpu: false,
  };
  // set settings based on the capture mode
  // if (data.captureSettings.mode === "VIEWPORT") {
  capture.resolution = {
    x: data.captureSettings.resX,
    y: data.captureSettings.resY,
  };
  // } else if (data.captureSettings.mode === "CANVAS") {
  //   capture.canvasSelector = data.captureSettings.canvasSelector
  // }
  // set settings based on the trigger mode
  // if (data.captureSettings.triggerMode === "DELAY") {
  //   capture.delay = data.captureSettings.delay
  // } else if (
  data.captureSettings.triggerMode === "FN_TRIGGER";
  // ) {
  // we don't need to add anything
  // }

  return {
    name: data.informations.name,
    description: data.informations.description,
    childrenDescription:
      data.informations.childrenDescription || data.informations.description,
    mintingInstructions: data.informations.mintingInstructions,
    tags: tagsFromString(data.informations.tags),
    artifactUri: ipfsUrlWithHashAndParams(
      data.cidUrlParams,
      {
        xmhash: data.previewHash,
        xmiteration: data.previewIteration,
        xmminter: data.previewMinter,
        xmparams: data.previewInputBytes,
        xmParamsAsQueryParams: fxParamsAsQueryParams(data.snippetVersion),
        noFxParamsUpdateQuery: true,
      },
      (cid) => `ipfs://${cid}`
    ),
    displayUri: getIpfsSlash(data.cidPreview),
    thumbnailUri: getIpfsSlash(data.cidThumbnail),
    generativeUri: getIpfsSlash(data.cidUrlParams),
    authenticityHash: data.authHash2,
    previewHash: data.previewHash,
    previewIteration: data.previewIteration,
    previewMinter: data.previewMinter,
    previewInputBytes: data.previewInputBytes,
    capture,
    settings: data.settings ?? null,
    symbol: "XMGEN",
    decimals: 0,
    version: "1.0.0",
    params: data.params,
    snippetVersion: data.snippetVersion,
  };
}

/**
 * Given some MintGenerativeData, built with the mint pipeline, outputs a
 * GenerativeToken object instance which can be used for previsualisation
 * purposes
 */
export function generativeFromMintForm(data, metadata, user) {
  const dist = data.distribution;
  const pricing = dist.pricing;

  // we need to * 60 the decrement duration from the form

  console.log("generativeFromMintForm", data, metadata, user);
  return {
    id: 0,
    version: "V3",
    author: data.collaboration ?? user,
    name: data.informations.name,
    flag: "NONE",
    metadata: metadata,
    metadataUri: "ipfs://not-uploaded-to-ipfs-yet",
    thumbnailUri: metadata.thumbnailUri,
    displayUri: metadata.displayUri,
    tags: metadata.tags,
    labels: data.informations?.labels,
    pricingFixed:
      pricing.pricingMethod === "FIXED"
        ? transformPricingFixedInputToNumbers(pricing.pricingFixed)
        : undefined,
    pricingDutchAuction: 0,
    // todo: remove
    price: 0,
    originalSupply: parseInt(dist.editions),
    supply: parseInt(dist.editions),
    balance: parseInt(dist.editions),
    enabled: dist.enabled,
    royalties: Math.floor(parseFloat(dist.royalties) * 10),
    splitsPrimary: dist.splitsPrimary.map((split) => ({
      pct: split.pct,
      user:
        split.address === user.id
          ? user
          : (data.collaboration &&
              data.collaboration.collaborators.find(
                (user) => user.id === split.address
              )) || {
              id: split.address,
            },
    })),
    splitsSecondary: dist.splitsSecondary.map((split) => ({
      pct: split.pct,
      user:
        split.address === user.id
          ? user
          : (data.collaboration &&
              data.collaboration.collaborators.find(
                (user) => user.id === split.address
              )) || {
              id: split.address,
            },
    })),
    reserves: [],
    lockedSeconds: 0,
    lockEnd: new Date(0).toISOString(),
    objkts: [],
    actions: [],
    createdAt: new Date().toISOString(),
    redeemables: [],
    underAuctionMintTickets: [],
    mintTickets: [],
    mintTicketSettings: null,
    inputBytesSize: 0,
    gentkContractAddress: "",
  };
}

/**
 * Maps the labels integers to their definition
 */
export const genTokLabelDefinitions = {
  0: {
    label: "Epileptic trigger",
    shortLabel: "Epileptic trigger",
    group: "WARNING",
    description:
      "Contains flashes or light that could trigger seizures for people with visual sensitivities",
    icon: "fa-solid fa-bolt",
    showWarningSetting: "epilepsy",
    showWarningOn: "run",
  },
  1: {
    label: "Sexual content",
    shortLabel: "Sexual content",
    group: "WARNING",
    description: "Nudity",
    icon: "fa-solid fa-eye-slash",
    showWarningSetting: "nsfw",
    showWarningOn: "preview",
  },
  2: {
    label: "Sensitive content (blood, gore,...)",
    shortLabel: "Sensitive content",
    group: "WARNING",
    description: "Violence and Sensitive content",
    icon: "fa-solid fa-eye-slash",
    showWarningSetting: "nsfw",
    showWarningOn: "preview",
  },
  100: {
    label: "Image composition",
    shortLabel: "Image composition",
    group: "DETAILS",
  },
  101: {
    label: "Animated",
    shortLabel: "Animated",
    group: "DETAILS",
  },
  102: {
    label: "Interactive",
    shortLabel: "Interactive",
    group: "DETAILS",
  },
  103: {
    label: "Profile Picture (PFP)",
    shortLabel: "PFP",
    group: "DETAILS",
  },
  104: {
    label: "Audio",
    shortLabel: "Audio",
    group: "DETAILS",
  },
  105: {
    label: "Includes prerendered components",
    shortLabel: "Prerendered components",
    group: "DETAILS",
  },
  106: {
    label: "Custom minting interface",
    shortLabel: "Custom UI",
    group: "DETAILS",
  },
  302023: {
    label: "FXHACKATHON2023",
    shortLabel: "FXHACKATHON2023",
    group: "DETAILS",
  },
};

export const getGenTokLabelDefinition = (label) =>
  //@ts-ignore
  genTokLabelDefinitions[label];

export const getGenTokLabelDefinitions = (labels) =>
  labels.map((label) => getGenTokLabelDefinition(label)).filter((res) => !!res);

export const getGenTokWarning = (labels, settings, on) => {
  const warning = labels.reduce(
    (acc, label) => {
      const def = getGenTokLabelDefinition(label);
      if (!def) return acc;
      const showWarning =
        def.showWarningSetting !== undefined &&
        !!settings[def.showWarningSetting];
      const filterByOn = on ? on === def.showWarningOn : true;
      if (def.group === "WARNING" && showWarning && filterByOn) {
        if (def.icon && !acc.icons.includes(def.icon)) {
          acc.icons.push(def.icon);
        }
        acc.labels.push(def.shortLabel);
        if (def.description) {
          acc.descriptions.push(def.description);
        }
      }
      return acc;
    },
    { icons: [], labels: [], descriptions: [] }
  );
  return warning.labels.length > 0 ? warning : null;
};

export const mapGenTokPricingToId = {
  FIXED: 0,
  DUTCH_AUCTION: 1,
};

/**
 * Maps a Pricing enum to its corresponding ID
 */
export function genTokPricingToId(pricingEnum) {
  return mapGenTokPricingToId[pricingEnum];
}

/**
 * Outputs the current price of a Generative Token based on its pricing
 * settings and based on the current time
 */
export function genTokCurrentPrice(token) {
  let price = 0;
  if (token.pricingFixed) {
    price = token.pricingFixed.price;
  } else if (token.pricingDutchAuction) {
    const da = token.pricingDutchAuction;
    // if there's a final price for the auction, we set it
    if (da.finalPrice) {
      price = da.finalPrice;
    }
    // otherwise we compute price based on timer
    else {
      const diff = differenceInSeconds(new Date(), new Date(da.opensAt));
      const idx = clamp(
        Math.floor(diff / da.decrementDuration),
        0,
        da.levels.length - 1
      );
      price = da.levels[idx];
    }
  }
  return price;
}

/**
 * Is the user the author of a Generative Token ?
 * Looks for author as a member of authoring collaboration if any.
 */
export function isGenerativeAuthor(token, user) {
  return isUserOrCollaborator(user, token.author);
}

// maps reserves to their definition
export const mapReserveDefinition = {
  WHITELIST: {
    id: 0,
    label: "Access List",
    description: "A list of users to whom a number of editions is reserved",
    inputComponent: "",
    renderComponent: "",
    initialValue: [],
  },
  MINT_PASS: {
    id: 1,
    label: "Mint Pass",
    description:
      "[For Live Events] A Smart Contract which controls whether a user can mint or not.",
    inputComponent: "",
    renderComponent: "",
    initialValue: "",
  },
};

// maps the reserve IDs to their enum
export const mapReserveIdtoEnum = Object.fromEntries(
  Object.keys(mapReserveDefinition).map((K) => [mapReserveDefinition[K].id, K])
);

/**
 * How many editions are left in the reserve ?
 */
export function reserveSize(token, eligibleReserves) {
  let size = 0;
  const reserves = eligibleReserves
    ? token.reserves.filter((res) => eligibleReserves.includes(res.method))
    : token.reserves;
  for (const reserve of reserves) {
    size += reserve.amount;
  }
  return Math.min(token.balance, size);
}

/**
 * Maps a reserve method with its function to compute how many can be consumed
 * from the reserve
 */
const mapReserveToEligiblity = {
  WHITELIST: (reserve, user) => {
    return reserve.data[user.id] || 0;
  },
  MINT_PASS: (reserve, _, passCtx) => {
    return reserve.data
      ? passCtx?.mintPass?.group?.address === reserve.data
        ? 1
        : 0
      : 0;
  },
};

/**
 * Given a token and the live minting context, checks whether the project is
 * part of the event and whether the user has an auth token to mint. We won't
 * know until the user tries to mint whether the token is valid.
 */
export const checkIsEligibleForMintWithAutoToken = (
  token,
  liveMintingContext
) => {
  if (!liveMintingContext || !liveMintingContext.event) return false;

  const isProjectIncludedInEvent =
    liveMintingContext.event.projectIds?.includes(token.id);
  const isEligibleToMint = !!liveMintingContext.authToken;

  return isProjectIncludedInEvent && isEligibleToMint;
};

/**
 * Is a user elligible to mint from the reserve of a token ?
 */
export function reserveEligibleAmount(
  user,
  token,
  liveMintingContext,
  eligibleReserves
) {
  let eligibleFor = 0;

  if (checkIsEligibleForMintWithAutoToken(token, liveMintingContext)) return 1;

  const reserves = eligibleReserves
    ? token.reserves.filter((res) => eligibleReserves.includes(res.method))
    : token.reserves;
  if (reserves && user && user.id) {
    for (const reserve of reserves) {
      if (reserve.amount > 0 && reserve.method) {
        eligibleFor += Math.min(
          mapReserveToEligiblity[reserve.method](
            reserve,
            user,
            liveMintingContext
          ),
          reserve.amount
        );
      }
    }
  }
  return eligibleFor;
}

/**
 * Returns the size of the reserves
 */
export function getReservesAmount(reserves) {
  return reserves && reserves.length > 0
    ? reserves.reduce((a, b) => a + b.amount, 0)
    : 0;
}

/**
 * Get the best reserve consumption method to consume, or null if no reserve
 * can be consumed
 */
export function getReserveConsumptionMethod(
  token,
  user,
  liveMintingContext,
  eligibleReserves
) {
  let consumption = null;

  const reserves = eligibleReserves
    ? token.reserves?.filter((res) => eligibleReserves.includes(res.method))
    : token.reserves;

  // only if a token has a reserve we check
  if (reserves) {
    // we sort the reserve, MINT_PASS is last
    const sorted = reserves.sort((a, b) =>
      a.method === EReserveMethod.MINT_PASS ? -1 : 1
    );

    // we parse the reserve and check for a match
    for (const reserve of reserves) {
      if (reserve.amount > 0) {
        if (
          mapReserveToEligiblity[reserve.method](
            reserve,
            user,
            liveMintingContext
          ) > 0
        ) {
          consumption = {
            method: reserve.method,
            data: {
              event: liveMintingContext.event?.id,
              token: liveMintingContext.mintPass?.token,
              address: user.id,
              project: token.id,
              reserveData: reserve.data,
            },
          };
          break;
        }
      }
    }
  }

  return consumption;
}

export const isTokenFullyMinted = (token) => {
  const usesParams = token.inputBytesSize > 0;
  /**
   * if the project uses params, it is fully minted when all tickets have been
   * used (iterations count is equal to supply)
   */
  if (usesParams) return token.iterationsCount === token.supply;
  return token.balance === 0;
};

export const getExploreSet = (token) => token.metadata.settings?.exploration;

export const getActiveExploreSet = (token) => {
  const fullyMinted = isTokenFullyMinted(token);
  const exploreSet = getExploreSet(token);

  return fullyMinted ? exploreSet?.postMint : exploreSet?.preMint;
};

export const isExplorationDisabled = (token) => {
  const exploreSet = getActiveExploreSet(token);
  return exploreSet?.enabled === false;
};
