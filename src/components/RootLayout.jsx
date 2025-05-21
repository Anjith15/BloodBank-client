import React from 'react'
import Header from './Header'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'

function RootLayout() {
  return (
    <div style={{ 
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: '#FAFAFA',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
        <Header />
        <main style={{ flex: 1 }}>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default RootLayout