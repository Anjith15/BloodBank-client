import React from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaGoogle, FaTint } from 'react-icons/fa'

function Footer() {
  return (
    <footer style={{ backgroundColor: '#f5f5f5', fontFamily: 'Poppins, sans-serif' }}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <FaTint size={28} style={{ color: '#D32F2F' }} className="me-2" />
              <h5 className="mb-0" style={{ fontWeight: '600', color: '#D32F2F' }}>LifeDrop</h5>
            </div>
            <p className="text-muted">
              Connecting blood donors and recipients efficiently for a healthier community.
              Every donation helps save lives.
            </p>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3" style={{ color: '#D32F2F', fontWeight: '600' }}>Contact Us</h5>
            <div className="mb-2 d-flex align-items-center">
              <FaEnvelope className="me-2" style={{ color: '#D32F2F' }} />
              <span>blooddonor@gmail.com</span>
            </div>
            <div className="mb-2 d-flex align-items-center">
              <FaPhone className="me-2" style={{ color: '#D32F2F' }} />
              <span>987654321</span>
            </div>
            <div className="mb-2 d-flex align-items-center">
              <FaMapMarkerAlt className="me-2" style={{ color: '#D32F2F' }} />
              <span>Hyderabad</span>
            </div>
            <div className="mb-2 d-flex align-items-center">
              <FaGlobe className="me-2" style={{ color: '#D32F2F' }} />
              <span>India</span>
            </div>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3" style={{ color: '#D32F2F', fontWeight: '600' }}>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <FaFacebook size={24} style={{ color: '#D32F2F' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaGoogle size={24} style={{ color: '#D32F2F' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaInstagram size={24} style={{ color: '#D32F2F' }} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaTwitter size={24} style={{ color: '#D32F2F' }} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#D32F2F' }} className="py-3">
        <div className="container">
          <div className="text-center text-white">
            <p className="mb-0">© {new Date().getFullYear()} LifeDrop Blood Bank. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer