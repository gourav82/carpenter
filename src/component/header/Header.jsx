import Image from 'next/image'
import React, { useContext } from 'react'
import Menu from './Menu'
import Link from 'next/link'
import { ApplicationCtx } from '../../context/ApplicatonCtx'
import useCheckMobileScreen from '../../../hooks/useCheckMobileScreen'
import MobileMenu from './MobileMenu'

const Header = () => {
  const {isMobile, isIpad } = useCheckMobileScreen();
  const {isUserLoggedIn} = useContext(ApplicationCtx)

  return (
    <div className="header bg--maroon ">
    <div className='header--nav container--responsive flex flex--justify-content-between flex--align-items-center'>
      <Link href={"/"}>
    <Image src="/assets/images/logo.png" width={100} height={100} alt='' className='mt--10' />
    </Link>
  {isUserLoggedIn &&  (isMobile || isIpad? <MobileMenu/> :<Menu/>)}
   </div>
   </div>
  )
}

export default Header