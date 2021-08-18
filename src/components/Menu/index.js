import React, { useState, useEffect } from 'react';

import {
  MenuButton,
  MenuContainer,
  BlackOverlay
} from './styles'

export default function Menu() {

  const [isOpened, setIsOpened] = useState(false)

  const toggleMenu = () => {
    setIsOpened(!isOpened)
  }

  const closeMenu = () => {
    setIsOpened(false)
  }

  useEffect(() => {
    if (isOpened)
      document.body.classList.add("is-menu-opened")
    else
      document.body.classList.remove("is-menu-opened")
  }, [isOpened])


  return (
    <>
      <BlackOverlay onClick={closeMenu}/>
      <MenuContainer/>
      <MenuButton onClick={toggleMenu}>
        <img src={require('@/assets/icons/icon-menu-white.svg').default} />
        <img src={require('@/assets/icons/icon-menu-black.svg').default} />
      </MenuButton>
    </>
  )

}



