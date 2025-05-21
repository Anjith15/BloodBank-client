import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { FaHome, FaTint, FaHandHoldingMedical, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaHistory } from 'react-icons/fa'

function Header() {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  
  function handleLogout() {
    logout()
    navigate('/')
  }
  
  return (
    <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ 
      backgroundColor: '#D32F2F', 
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center text-white">
          <FaTint className="me-2" size={24} />
          <span style={{ fontWeight: '600', fontSize: '1.4rem' }}>LifeDrop</span>
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          style={{ borderColor: 'rgba(255,255,255,0.5)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white d-flex align-items-center">
                <FaHome className="me-2" />
                Home
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/donate" className="nav-link text-white d-flex align-items-center">
                    <FaTint className="me-2" />
                    Donate Blood
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/request" className="nav-link text-white d-flex align-items-center">
                    <FaHandHoldingMedical className="me-2" />
                    Request Blood
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-donations" className="nav-link text-white d-flex align-items-center">
                    <FaHistory className="me-2" />
                    My Donations
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn nav-link text-white d-flex align-items-center"
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="nav-link text-white d-flex align-items-center">
                    <FaUserPlus className="me-2" />
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white d-flex align-items-center">
                    <FaSignInAlt className="me-2" />
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header