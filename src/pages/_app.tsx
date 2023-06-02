import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { VenomWalletProvider } from '@/context/VenomWalletProvider'


export default function App({ Component, pageProps }: AppProps) {

  return (
    <VenomWalletProvider>
      <Component {...pageProps} />
    </VenomWalletProvider>
  )

}
