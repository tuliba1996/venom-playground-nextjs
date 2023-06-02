import { Inter } from 'next/font/google'
import { XMarkIcon } from '@heroicons/react/24/outline'

import Header from '@/components/Header'
import ConnectWallet from '@/components/ConnectWallet.tsx'
import { useVenomWallet } from '@/context/useVenomWallet'
import Button from '@/components/Button'
import { useState } from 'react'
import { methods } from '@/methods'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [filter, setFilter] = useState<string>('')
  const {
    venomConnect,
    venomProvider,
    address,
    theme,
    onToggleTheme,
    currentNetworkId,
    onChangeNetwork,
    balance,
    publicKey,
    getNetWorkData,
  } = useVenomWallet()
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-10 ${inter.className}`}
    >
      <div className='bg-image relative flex min-h-screen w-full flex-col bg-black text-white'>
        <div>
          <Header />
          <div className='flex flex-col items-center justify-between'>
            <h1 className='text-center text-3xl font-bold lg:text-5xl'>Sau Wolf</h1>
            <h1 className='mt-2 text-center text-xl text-gray-500 lg:text-2xl'>Inpage Provider Playground</h1>
            <ConnectWallet />

          </div>
        </div>

        <div className='flex flex-col mx-auto'>
          <div className='mt-16 text-sm lg:text-base'>
            <div className='flex w-full items-center'>
              <span className='mr-16 w-1/2 shrink-0 text-gray-400'>Venom Connect theme</span>
              <span className='mr-4'>{theme}</span>
              <Button onClick={onToggleTheme} icon={false}>
                Toggle theme
              </Button>
            </div>
          </div>

          <div className='mt-4 flex w-full items-center'>
            <span className='mr-16 w-1/2 shrink-0 text-gray-400'>NetworkId</span>
            <span className='mr-4'>{currentNetworkId}</span>
            <Button
              onClick={() => {
                onChangeNetwork(currentNetworkId === 1 ? 1000 : 1)
              }}
              icon={false}
            >
              Toggle Network
            </Button>
          </div>
          <div className='flex mt-4 w-full items-center'>
            <span className='mr-16 w-1/2 shrink-0 text-gray-400'>Network</span>
            {getNetWorkData(currentNetworkId, 'name') as string}
          </div>
          <div className='flex mt-4 w-full items-center break-all'>
            <span className='mr-16 w-1/2 shrink-0 text-gray-400'>Address</span>
            {address}
          </div>
          <div className='flex mt-4 w-full items-center'>
            <span className='mr-16 w-1/2 shrink-0 text-gray-400'>Balance</span>
            {balance ? (balance / 10 ** 9).toFixed(10) : undefined}
          </div>
        </div>

        {venomConnect && !!address && (
          <div className='mt-16 mx-40'>
            <div className='group relative mt-1 rounded-md shadow-sm'>
              <input
                type='text'
                className='m-0 block h-10 w-full cursor-text overflow-visible overflow-ellipsis rounded-lg border border-solid border-gray-700 bg-transparent py-0 pl-3 pr-10 text-sm font-normal leading-5 tracking-wide text-white hover:shadow-[0_0_5px_1px_#9297e2] focus:shadow-[0_0_5px_1px_#9297e2] focus:outline-none'
                // box-shadow: 0 0 5px 1px var(--input-border-ring);
                placeholder='Filter methods by name'
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value)
                }}
                // style='box-shadow: none; outline: none; transition: all 0.25s ease 0s;'
              />
              <div className='absolute inset-y-0 right-0 z-10 flex items-center pr-3'>
                <XMarkIcon
                  className='h-5 w-5 text-gray-800 hover:cursor-pointer group-focus-within:text-[#9297e2] group-hover:text-[#9297e2]'
                  aria-hidden='true'
                  onClick={() => setFilter('')}
                />
              </div>
            </div>

            <div className='my-10 overflow-hidden bg-white bg-opacity-5 shadow sm:rounded-md'>
              <ul role='list' className='divide-y divide-gray-200 divide-opacity-10'>
                {methods?.map((element, i) => {
                  const Element = element.method
                  if (!filter || element.name.toLowerCase().includes(filter.toLowerCase())) {
                    return (
                      <li key={i} className=''>
                        <Element
                          provider={venomProvider}
                          networkId={currentNetworkId}
                          address={address}
                          publicKey={publicKey}
                        />
                      </li>
                    )
                  } else return null
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

    </main>
  )
}
