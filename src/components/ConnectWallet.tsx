import React from 'react'
import Button from '@/components/Button'
import { useVenomWallet } from '@/context/useVenomWallet'

function ConnectWallet() {

  const { venomConnect, address, onConnectWallet, onDisconnectWallet } = useVenomWallet()

  const onConnectButtonClick = async () => {
    await onConnectWallet()
  }

  const onDisconnectButtonClick = async () => {
    onDisconnectWallet()
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
