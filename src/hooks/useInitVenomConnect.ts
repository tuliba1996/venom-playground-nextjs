import { VenomConnect } from 'venom-connect'
import { ProviderRpcClient } from 'everscale-inpage-provider'
import { ConnectionProperties, EverscaleStandaloneClient } from 'everscale-standalone-client'
import { useEffect, useState } from 'react'


const initTheme = 'light' as const

const NETWORKS = {
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

type ToggledNetworks = 1 | 1000 // | 1010;

const getNetworkData = (checkNetworkId: number, field: keyof typeof NETWORKS.venom) => {
  switch (checkNetworkId) {
    case 1000:
      return NETWORKS.venomTestnet[field]

    case 1:
    default:
      return NETWORKS.venom[field]
  }
}

const standaloneFallback = (checkNetworkId: number = 1000) =>
  EverscaleStandaloneClient.create({
    connection: getNetworkData(checkNetworkId, 'connection') as ConnectionProperties,
  })

const initVenomConnect = async (checkNetworkId: number = 1000) => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: checkNetworkId,
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('venomwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          'mobile',
          'ios',
          'android',
        ],
      },
      // everwallet: {
      //   links: {
      //     qr: null,
      //   },
      //   walletWaysToConnect: [
      //     {
      //       // NPM package
      //       package: ProviderRpcClient,
      //       packageOptions: {
      //         fallback: VenomConnect.getPromise('everwallet', 'extension') || (() => Promise.reject()),
      //         forceUseFallback: true,
      //       },
      //       packageOptionsStandalone: {
      //         fallback: standaloneFallback,
      //         forceUseFallback: true,
      //       },
      //       id: 'extension',
      //       type: 'extension',
      //     },
      //   ],
      //   defaultWalletWaysToConnect: [
      //     // List of enabled options
      //     'mobile',
      //     'ios',
      //     'android',
      //   ],
      // },
      oxychatwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('oxychatwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          'mobile',
          'ios',
          'android',
        ],
      },
    },
  })
}


export const useInitVenomConnect = () => {
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>()
  const [balance, setBalance] = useState()
  const [publicKey, setPublicKey] = useState()

  const [venomProvider, setVenomProvider] = useState<any>()

  const [address, setAddress] = useState()

  const [currentNetworkId, setCurrentNetworkId] = useState<ToggledNetworks>(
    1000,
  )

  const getPublicKey = async (provider: any) => {
    const providerState = await provider?.getProviderState?.()

    return providerState?.permissions.accountInteraction?.publicKey.toString()
  }

  const getBalance = async (provider: any, _address: string) => {
    try {
      return await provider?.getBalance?.(_address)
    } catch (error) {
      return undefined
    }
  }

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined
    const _balance = _provider && _address ? await getBalance(_provider, _address) : undefined
    const _publicKey = _provider ? await getPublicKey(_provider) : undefined

    setAddress(_address)
    setBalance(_balance)
    setPublicKey(_publicKey)

    if (_provider && _address)
      setTimeout(() => {
        check(_provider)
      }, 100)
  }

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.()

    return providerState?.permissions.accountInteraction?.address.toString()
  }

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth()
    if (auth) await getAddress(_venomConnect)
  }

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect(currentNetworkId)
    setVenomConnect(initedVenomConnect)

    await checkAuth(initedVenomConnect)
  }

  const onConnect = async (provider: any) => {
    setVenomProvider(provider)

    await check(provider)
  }

  useEffect(() => {
    onInitButtonClick()
  }, [currentNetworkId])

  useEffect(() => {
    const off = venomConnect?.on('connect', onConnect)

    return () => {
      off?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect])

  return {
    venomConnect,
    address,
    venomProvider,
    balance,
    publicKey,
  }
}
