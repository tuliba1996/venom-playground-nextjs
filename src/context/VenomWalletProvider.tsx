import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { ConnectionProperties, EverscaleStandaloneClient } from 'everscale-standalone-client'
import { INIT_THEME, NETWORKS, THEME_LIST } from '@/constant'
import { VenomConnect } from 'venom-connect'
import { ProviderRpcClient } from 'everscale-inpage-provider'
import { ThemeNameList } from 'venom-connect/src/themes'
import { ToggledNetworks } from '@/types'

type VenomWalletContextValue = {
  venomConnect: any,
  venomProvider: any,
  address?: string,
  balance: number | null,
  publicKey?: string,
  theme: string | null,
  currentNetworkId: ToggledNetworks
  onChangeNetwork: (id: ToggledNetworks) => void,
  onToggleTheme: () => void,
  onConnectWallet: () => void,
  onDisconnectWallet: () => void,
  getNetWorkData: (checkNetworkId: number, field: keyof typeof NETWORKS.venom) => any,
};

export const VenomWalletContext = createContext<VenomWalletContextValue | null>(null)


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
    theme: INIT_THEME,
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


type VenomWalletProviderProps = {
  children: React.ReactNode;
};

export function VenomWalletProvider({ children }: VenomWalletProviderProps) {
  const [address, setAddress] = useState<string>()
  const [venomConnect, setVenomConnect] = useState<VenomConnect | undefined>()
  const [theme, setTheme] = useState<ThemeNameList | string>(INIT_THEME)

  const [balance, setBalance] = useState<number | null>(null)
  const [publicKey, setPublicKey] = useState<string | undefined>()

  const [venomProvider, setVenomProvider] = useState<any>()


  const [currentNetworkId, setCurrentNetworkId] = useState<ToggledNetworks>(
    1000)


  const onChangeNetwork = useCallback(async (networkId: ToggledNetworks) => {
    setCurrentNetworkId(networkId)
  }, [currentNetworkId])

  const getTheme = () => venomConnect?.getInfo()?.themeConfig?.name?.toString?.() || '...'

  const onToggleTheme = useCallback(async () => {
    const currentTheme = getTheme()

    const lastIndex = THEME_LIST.length - 1

    const currentThemeIndex = THEME_LIST.findIndex((item) => item === currentTheme)

    const theme =
      currentThemeIndex >= lastIndex || !~currentThemeIndex || !~lastIndex
        ? THEME_LIST[0]
        : THEME_LIST[currentThemeIndex + 1]

    await venomConnect?.updateTheme(theme)

    setTheme(getTheme())
  }, [venomConnect])

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

  const getBalance = async (provider: any, _address: string) => {
    try {
      return await provider?.getBalance?.(_address)
    } catch (error) {
      return undefined
    }
  }

  const getPublicKey = async (provider: any) => {
    const providerState = await provider?.getProviderState?.()

    return providerState?.permissions.accountInteraction?.publicKey.toString()
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


  const onConnectWallet = useCallback(async () => {
    venomConnect?.connect()
  }, [venomConnect, venomProvider])

  const onDisconnectWallet = useCallback(async () => {
    venomProvider?.disconnect()
  }, [venomConnect, venomProvider])


  useEffect(() => {
    onInitButtonClick()
  }, [currentNetworkId])

  const onConnect = async (provider: any) => {
    setVenomProvider(provider)

    await check(provider)
  }

  const getNetWorkData = useCallback((checkNetworkId: number, field: keyof typeof NETWORKS.venom) => {
    return getNetworkData(checkNetworkId, field)
  }, [])

  useEffect(() => {
    const off = venomConnect?.on('connect', onConnect)

    return () => {
      off?.()
    }
  }, [venomConnect])


  const value = useMemo(
    () => ({
      venomConnect,
      venomProvider,
      address,
      balance,
      theme,
      publicKey,
      currentNetworkId,
      onChangeNetwork,
      onToggleTheme,
      onConnectWallet,
      onDisconnectWallet,
      getNetWorkData,
    }),
    [venomConnect, venomProvider, address, theme, publicKey, onToggleTheme, onConnectWallet, onDisconnectWallet, onChangeNetwork, getNetWorkData],
  )

  return (
    <VenomWalletContext.Provider value={value}>
      {children}
    </VenomWalletContext.Provider>
  )
}
