import React from 'react'
import { useInitVenomConnect } from '@/hooks/useInitVenomConnect'
import Button from '@/components/Button'

function ConnectWallet() {
  const { venomConnect, address, venomProvider } = useInitVenomConnect()

  const onConnectButtonClick = async () => {
    await venomConnect?.connect()
  }

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect()
  }

  return (
    <div className='mt-6'>
      {venomConnect && !address && (
        <Button onClick={onConnectButtonClick} icon={false}>
          Connect via pop up
          <br />
          (requestPermissions method)
        </Button>
      )}
      {venomConnect && !!address && (

        <Button onClick={onDisconnectButtonClick} icon={false}>
          Disconnect
          <br />
          (Disconnect method)
        </Button>
      )}
    </div>
  )
}

export default ConnectWallet
