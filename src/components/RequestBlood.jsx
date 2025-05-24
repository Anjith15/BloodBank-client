import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { FaTint, FaMapMarkerAlt, FaEnvelope, FaUserFriends } from 'react-icons/fa';
import { toast } from 'react-toastify';

const RequestBlood = () => {
  const [bloodType, setBloodType] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [donorsNotified, setDonorsNotified] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setShowSuccess(false);
      const res = await axios.post(`${API_BASE_URL}/request-blood`, {
        bloodType,
        city,
        message,
      });
      if (res.data.success) {
        setDonorsNotified(res.data.donorsNotified);
        setShowSuccess(true);
        toast.success(`Request sent successfully! ${res.data.donorsNotified} donors have been notified.`);
        setBloodType('');
        setCity('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Error sending request. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{ color: '#D32F2F' }}>
                <FaTint className="me-2" />
                Request Blood
              </h2>
              
              {showSuccess && (
                <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                  <FaUserFriends className="me-2" />
                  <div>
                    Request sent successfully! {donorsNotified} matching donor{donorsNotified !== 1 ? 's' : ''} {donorsNotified !== 1 ? 'have' : 'has'} been notified.
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <FaTint className="me-2" />
                    Blood Type Required*
                  </label>
                  <select 
                    className="form-select" 
                    value={bloodType} 
                    onChange={(e) => setBloodType(e.target.value)} 
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <FaMapMarkerAlt className="me-2" />
                    City*
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <FaEnvelope className="me-2" />
                    Message*
                  </label>
                  <textarea 
                    className="form-control"
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                    rows="4"
                    placeholder="Please provide details about the requirement..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn w-100" 
                  disabled={isLoading}
                  style={{ 
                    backgroundColor: '#D32F2F', 
                    color: 'white',
                    borderRadius: '30px',
                    padding: '10px 0',
                    fontWeight: '500'
                  }}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending Request...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBlood;
