"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";

import bittorrentchainTestnet from "@/config";

const { wallets } = getDefaultWallets();

const config = getDefaultConfig({
  appName: "Xmutant | NFT Marketplace",
  projectId: "YOUR_PROJECT_ID",
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [bittorrentchainTestnet],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#8358ff",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "rounded",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
