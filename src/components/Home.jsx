import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaTint, FaUsers, FaHandHoldingHeart, FaHospital, FaCalendarCheck } from 'react-icons/fa'

function Home() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollY = window.scrollY;
        scrollRef.current.style.transform = `translateX(-${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <div 
        className="py-5" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(211, 47, 47, 0.8), rgba(211, 47, 47, 0.9)), url(https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white'
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Donate Blood, Save Lives</h1>
              <p className="lead mb-4">Your donation can make a difference in someone's life. Join our community of donors and help save lives today.</p>
              <div className="d-flex gap-3">
                <Link 
                  to="/register" 
                  className="btn px-4 py-2" 
                  style={{ 
                    backgroundColor: 'white', 
                    color: '#D32F2F',
                    borderRadius: '30px',
                    fontWeight: '500',
                    fontSize: '1.1rem'
                  }}
                >
                  Register as Donor
                </Link>
                <Link 
                  to="/request" 
                  className="btn px-4 py-2" 
                  style={{ 
                    backgroundColor: 'transparent', 
                    borderColor: 'white',
                    color: 'white',
                    borderRadius: '30px',
                    fontWeight: '500',
                    fontSize: '1.1rem'
                  }}
                >
                  Request Blood
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <FaTint size={150} className="mb-3" />
              <h2 className="h4 fw-bold">Every Drop Counts</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section with Horizontal Scroll */}
      <div className="py-5 bg-light overflow-hidden">
        <div className="container py-3">
          <h2 className="text-center mb-5" style={{ color: '#D32F2F', fontWeight: '600' }}>Making a Difference Together</h2>
          
          <div ref={scrollRef} className="d-flex" style={{ width: 'max-content', transition: 'transform 0.1s ease-out' }}>
            {[
              { icon: FaUsers, title: "5,000+", description: "Registered Donors" },
              { icon: FaTint, title: "10,000+", description: "Successful Donations" },
              { icon: FaHandHoldingHeart, title: "8,500+", description: "Lives Saved" },
              { icon: FaHospital, title: "100+", description: "Partner Hospitals" },
              { icon: FaUsers, title: "1,200+", description: "Monthly Donors" },
              { icon: FaTint, title: "500+", description: "Emergency Requests" },
              { icon: FaHandHoldingHeart, title: "15+", description: "Blood Drives Monthly" },
              { icon: FaHospital, title: "25+", description: "Cities Covered" }
            ].map((stat, index) => (
              <div key={index} className="me-4" style={{ width: '300px' }}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <stat.icon className="mb-3" size={40} style={{ color: '#D32F2F' }} />
                    <h3 className="h4 mb-2">{stat.title}</h3>
                    <p className="text-muted mb-0">{stat.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-muted small">Scroll down to explore more</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img 
                src="https://images.unsplash.com/photo-1615461065929-4f8fffc28908?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Blood Donation" 
                className="img-fluid rounded shadow"
              />
            </div>
            
            <div className="col-lg-6">
              <h2 className="mb-4" style={{ color: '#D32F2F', fontWeight: '600' }}>Why Donate Blood?</h2>
              
              {[
                { 
                  icon: FaTint, 
                  title: "Save Lives", 
                  description: "A single donation can save up to three lives. Your contribution matters." 
                },
                { 
                  icon: FaCalendarCheck, 
                  title: "Regular Need", 
                  description: "Blood is needed every day for surgeries, cancer treatments, and emergencies." 
                },
                { 
                  icon: FaHandHoldingHeart, 
                  title: "Community Support", 
                  description: "Your donation strengthens the healthcare system and supports your community." 
                }
              ].map((item, index) => (
                <div className="d-flex mb-3" key={index}>
                  <div className="me-3">
                    <item.icon size={24} style={{ color: '#D32F2F' }} />
                  </div>
                  <div>
                    <h4 className="h5 mb-2">{item.title}</h4>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
              
              <div>
                <Link 
                  to="/register" 
                  className="btn mt-3 px-4 py-2" 
                  style={{ 
                    backgroundColor: '#D32F2F', 
                    color: 'white',
                    borderRadius: '30px',
                    fontWeight: '500'
                  }}
                >
                  Become a Donor Today
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 