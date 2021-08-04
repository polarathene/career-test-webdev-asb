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
        <MenuToggle isOpen={isOpen} onClick={toggleMenu} />
        <div style={{display: isOpen ? "block" : "none" }}>
          <p>This is menu content.</p>
        </div>
      </nav>
    </header>
  )
}

const MenuToggle: React.FC<ButtonProps> = ({isOpen, onClick, className}) => (
  <button
    onClick={onClick}
    aria-label={`${isOpen ? "Close" : "Open"} navigation menu`}
    aria-expanded={isOpen}
  >
    {isOpen
      ? <FaArrowLeft aria-hidden="true" />
      : <FaHamburger aria-hidden="true" />
    }
  </button>
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean
}

type HTMLProps = React.HTMLAttributes<HTMLElement>

export default NavMenu