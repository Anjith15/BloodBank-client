import React, { useState, useContext } from 'react'
import { FaTint, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { AuthContext } from '../contexts/AuthContext'

function Donate() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [donationForm, setDonationForm] = useState({
    donationDate: '',
    donationTime: '',
    donationCenter: '',
    healthDeclaration: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDonationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!donationForm.donationDate || !donationForm.donationTime || !donationForm.donationCenter) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!donationForm.healthDeclaration) {
      toast.error('You must confirm the health declaration');
      return;
    }
    
    if (!isLoggedIn) {
      toast.error('Please log in to schedule a donation');
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      // Prepare appointment data
      const appointmentData = {
        date: donationForm.donationDate,
        time: donationForm.donationTime,
        center: donationCenters.find(c => c.id.toString() === donationForm.donationCenter)?.name || '',
        address: donationCenters.find(c => c.id.toString() === donationForm.donationCenter)?.address || '',
        status: 'Scheduled'
      };
      
      // Make API call
      const response = await axios.post(
        `${API_BASE_URL}/donation-api/appointments`, 
        appointmentData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data && !response.data.error) {
        toast.success('Donation appointment scheduled successfully!');
        // Reset form
        setDonationForm({
          donationDate: '',
          donationTime: '',
          donationCenter: '',
          healthDeclaration: false
        });
      } else {
        toast.error(response.data?.message || 'Failed to schedule appointment');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to schedule appointment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const donationCenters = [
    { id: 1, name: 'City Hospital Blood Bank', address: '123 Main St, City Center' },
    { id: 2, name: 'Red Cross Donation Center', address: '456 Park Ave, Downtown' },
    { id: 3, name: 'Community Health Center', address: '789 Oak Rd, Suburb Area' },
    { id: 4, name: 'Central Medical Institute', address: '101 Pine Blvd, Uptown' }
  ];

  return (
    <div 
      className="container py-4" 
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div style={{ position: 'sticky', top: '100px' }}>
            <h2 
              className="mb-4" 
              style={{ color: '#D32F2F', fontWeight: '600' }}
            >
              Schedule a Blood Donation
            </h2>
            
            <div className="mb-4">
              <h5 className="mb-3">Why Donate Blood?</h5>
              <p className="text-muted">
                Blood donation is a simple process that takes about an hour of your time but can save up to three lives. 
                Every day, patients in hospitals across the country need blood for surgeries, cancer treatment, and emergencies.
              </p>
            </div>
            
            <div 
              className="card border-0 shadow-sm mb-4"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <div className="card-body">
                <h5 className="mb-3" style={{ color: '#D32F2F' }}>Donation Requirements</h5>
                <ul className="list-group list-group-flush">
                  {[
                    "Be at least 18 years old",
                    "Weigh at least 50 kg",
                    "Be in good health",
                    "Haven't donated in the last 3 months"
                  ].map((requirement, index) => (
                    <li 
                      key={index}
                      className="list-group-item border-0 d-flex align-items-center px-0"
                    >
                      <div>
                        <FaCheckCircle className="me-2" style={{ color: '#D32F2F' }} />
                      </div>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div 
              className="card border-0 shadow-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <div className="card-body">
                <h5 className="mb-3" style={{ color: '#D32F2F' }}>What to Expect</h5>
                <p className="text-muted">
                  The donation process is simple and safe:
                </p>
                <ol className="ps-3">
                  {[
                    "Registration and health check",
                    "The actual donation takes only 8-10 minutes",
                    "Rest and refreshments after donation",
                    "The entire process takes about 1 hour"
                  ].map((step, index) => (
                    <li key={index} className="mb-2">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div 
            className="card border-0 shadow-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <div className="card-body p-4">
              <h3 className="card-title mb-4" style={{ color: '#D32F2F' }}>
                Book Your Appointment
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="donationDate" className="form-label d-flex align-items-center">
                    <FaCalendarAlt className="me-2" style={{ color: '#D32F2F' }} />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="donationDate"
                    name="donationDate"
                    value={donationForm.donationDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="donationTime" className="form-label d-flex align-items-center">
                    <FaCalendarAlt className="me-2" style={{ color: '#D32F2F' }} />
                    <span>Preferred Time</span>
                  </label>
                  <select
                    className="form-select"
                    id="donationTime"
                    name="donationTime"
                    value={donationForm.donationTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="donationCenter" className="form-label d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2" style={{ color: '#D32F2F' }} />
                    <span>Donation Center</span>
                  </label>
                  <select
                    className="form-select"
                    id="donationCenter"
                    name="donationCenter"
                    value={donationForm.donationCenter}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Center</option>
                    {donationCenters.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name} - {center.address}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="healthDeclaration"
                      name="healthDeclaration"
                      checked={donationForm.healthDeclaration}
                      onChange={handleInputChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="healthDeclaration">
                      I declare that I am in good health, haven't had any recent illnesses, and meet all the requirements for blood donation.
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn w-100"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#D32F2F',
                    color: 'white',
                    borderRadius: '30px',
                    padding: '10px 0',
                    fontWeight: '500'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Scheduling...
                    </>
                  ) : (
                    'Schedule Donation'
                  )}
                </button>
                
                <div className="mt-3 small text-center text-muted">
                  <FaTint className="me-1" />
                  Thank you for your commitment to saving lives!
                </div>
              </form>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-muted">
              Need to reschedule or have questions?<br />
              Contact us at <a href="mailto:support@bloodbank.com" className="text-decoration-none" style={{ color: '#D32F2F' }}>support@bloodbank.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donate;