import React, { useRef, useEffect, useContext, useState } from 'react'
import { Container, Row, Button } from 'reactstrap'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import "./header.css"

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

import { AuthContext } from '../../context/AuthContext'
import { Avatar } from '@mui/material';

const nav__links = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/about',
    display: 'About'
  },
  {
    path: '/flights',
    display: 'Flights'
  },
  {
    path: '/stays',
    display: 'Stays'
  },
  {
    path: '/tours',
    display: 'Tours'
  },
  {
    path: '/blog',
    display: 'Blog'
  },
  {
    path: '/history',
    display: 'History'
  },
  {
    path: '/suggestion',
    display: 'Suggestion'
  }
]

const Header = () => {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { user, dispatch } = useContext(AuthContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    navigate('/')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const stickyHeaderFunc = () => {
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current.classList.add('sticky__header')
      }
      else {
        headerRef.current.classList.remove('sticky__header')
      }
    })
  }

  useEffect(() => {
    stickyHeaderFunc()

    return window.removeEventListener('scroll', stickyHeaderFunc)
  })

  const toggleMenu = () => {
    menuRef.current.classList.toggle('show__menu')
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-container")) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return <header className='header' ref={headerRef}>
    <Container>
      <Row>
        <div className='nav__wrapper d-flex align-items-center
        justify-content-between'>

          {/* logo */}
          {/* <div className='logo'>
            <img src={logo} alt="" />
          </div> */}

          {/* menu */}
          <div className='navigation' ref={menuRef} onClick={toggleMenu}>
            <ul className="menu d-flex align-items-center gap-5">
              {
                nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink to={item.path} className={navClass =>
                      navClass.isActive ? "active__link" : ""
                    }>{item.display}</NavLink>
                  </li>
                ))
              }
            </ul>
          </div>


          <div className='nav__right d-flex align-items-center gap-4'>
            <div className="nav__btns d-flex align-items-center gap-4">

              {
                user ? (<>

                  <div className="profile-container" onClick={toggleDropdown}>
                    <div className="profile-button">
                      {user.photo ? (
                        <Avatar src={user.photo} sx={{ width: 40, height: 40 }} />
                      ) : (
                        <span className="profile-initial">{user.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                      <div className="profile-dropdown">
                        <Link to="/profile" className="dropdown-item">
                          <AccountCircleIcon className="dropdown-icon" /> Profile
                        </Link>
                        <button className="dropdown-item logout-btn" onClick={logout}>
                          <ExitToAppIcon className="dropdown-icon" /> Log out
                        </button>
                      </div>
                    )}
                  </div>
                </>

                ) : (
                  <>
                    <Button className='btn secondary__btn'>
                      <Link to='/login'>Login</Link>
                    </Button>
                    <Button className='btn primary__btn'>
                      <Link to='/register'>Register</Link>
                    </Button>
                  </>
                )
              }

            </div>

            <span className='mobile__menu' onClick={toggleMenu}>
              <i class="ri-menu-line"></i>
            </span>
          </div>

        </div>
      </Row>
    </Container>

  </header>
}

export default Header