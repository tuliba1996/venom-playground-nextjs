import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import ConnectWallet from '@/components/ConnectWallet.tsx'
import Button from '@/components/Button'
import { useInitVenomConnect } from '@/hooks/useInitVenomConnect'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { address, balance } = useInitVenomConnect()
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-10 ${inter.className}`}
    >
      <div className='bg-image relative flex min-h-screen w-full flex-col bg-black text-white'>
        <Header />
        <div className='flex flex-col items-center justify-between'>
          <h1 className='text-center text-3xl font-bold lg:text-5xl'>The&nbsp;Bull</h1>
          <h1 className='mt-2 text-center text-xl text-gray-500 lg:text-2xl'>Inpage Provider Playground</h1>
          <ConnectWallet />

        </div>

        <div className='mt-16 text-sm lg:text-base'>
          <div className='flex w-full items-center'>
            <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Venom Connect theme</span>
            {/*<span className='mr-4'>{theme}</span>*/}
            {/*<Button onClick={onToggleThemeButtonClick} icon={false}>*/}
            {/*  Toggle theme*/}
            {/*</Button>*/}
          </div>

          <div className='mt-4 flex w-full items-center'>
            <span className='mr-4 w-1/4 shrink-0 text-gray-400'>NetworkId</span>
            {/*<span className='mr-4'>{currentNetworkId}</span>*/}
            {/*<Button*/}
            {/*  onClick={() => {*/}
            {/*    setCurrentNetworkId(currentNetworkId === 1 ? 1000 : 1)*/}
            {/*  }}*/}
            {/*  icon={false}*/}
            {/*>*/}
            {/*  Toggle Network*/}
            {/*</Button>*/}
          </div>
          <div className='flex w-full items-center'>
            <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Network</span>
            {/*{getNetworkData(currentNetworkId, 'name') as string}*/}
          </div>
          <div className='flex w-full items-center break-all'>
            <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Address</span>
            {address}
          </div>
          <div className='flex w-full items-center'>
            <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Balance</span>
            {balance ? (balance / 10 ** 9).toFixed(10) : undefined}
          </div>
        </div>
      </div>

    </main>
  )
}
