import logo from '../img/logo.svg'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='my-8 mx-6 flex flex-row items-center lg:my-6'>
      <Link className='h-4 w-20 lg:h-6 lg:w-28' href='/'>
        <img src='/logo.svg' alt='' />
      </Link>
    </header>
  )
}

export default Header
