import { useContext, useMemo } from 'react'
import { VenomWalletContext } from '@/context/VenomWalletProvider'

export function useVenomWallet() {


  const venomWalletContext = useContext(VenomWalletContext)


  if (venomWalletContext === null) {
    throw new Error(
      'useVenomWallet cannot be called without a VenomWalletProvider',
    )
  }


  return useMemo(() => {
    return { ...venomWalletContext }
  }, [venomWalletContext])
}
