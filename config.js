const bittorrentchainTestnet = {
  id: 1029,
  name: "BitTorrent Chain Donau",
  nativeCurrency: {
    decimals: 18,
    name: "BitTorrent Chain Donau",
    symbol: "BTT",
  },
  rpcUrls: {
    default: { http: ["https://pre-rpc.bittorrentchain.io/"] },
  },
  blockExplorers: {
    default: { name: "bttc scan", url: "https://testscan.bittorrentchain.io/" },
  },
  testnet: true,
};

export default bittorrentchainTestnet;
