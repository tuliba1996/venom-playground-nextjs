export const INIT_THEME = 'light' as const
export const NETWORKS = {
  venom: {
    name: 'Venom Mainnet',
    checkNetworkId: 1,
    connection: {
      id: 1,
      group: 'venom_mainnet',
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc.venom.foundation/rpc',
      },
    },
  },
  venomTestnet: {
    name: 'Venom Testnet',
    checkNetworkId: 1000,
    connection: {
      id: 1000,
      group: 'venom_testnet',
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc-testnet.venom.foundation/rpc',
      },
    },
  },
}


export const THEME_LIST = ['light', 'dark', 'venom'] as const
