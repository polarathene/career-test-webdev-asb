import React, { useState } from 'react'
import { FaHamburger, FaArrowLeft } from 'react-icons/fa';
import styles from './styles.module.scss'

export const NavMenu: React.FC<HTMLProps> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className={styles.header}>
      <h1>{isOpen ? "Menu" : "Register Card Form"}</h1>
      <nav className={styles.navbar}>
        <button onClick={toggleMenu}>
        {isOpen
          ? <FaArrowLeft aria-hidden="true" />
          : <FaHamburger aria-hidden="true" />
        }
        </button>
        <div style={{display: isOpen ? "block" : "none" }}>
          <p>This is menu content.</p>
        </div>
      </nav>
    </header>
  )
}

type HTMLProps = React.HTMLAttributes<HTMLElement>

export default NavMenu