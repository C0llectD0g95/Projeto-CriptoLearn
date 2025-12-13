// Contract addresses on the network
export const CONTRACT_ADDRESSES = {
  TEA_TOKEN: "0x83dc1E40D60d0b96109139364f892E46Bea96876",
  TEA_STAKING: "0xeB2C8496f5D2F444F0a01659b5f290897255434b",
  TEA_GOVERNOR: "0x5D6a74EBda0F762fbdd3b2A990DA774B9b6bEF5B",
} as const;

// Network configuration - Polygon Amoy Testnet
export const NETWORK_CONFIG = {
  chainId: 80002,
  chainName: "Polygon Amoy Testnet",
  rpcUrl: "https://rpc-amoy.polygon.technology",
  blockExplorerUrl: "https://amoy.polygonscan.com",
} as const;
