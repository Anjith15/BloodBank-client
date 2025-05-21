import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTint, FaCalendarAlt, FaMapMarkerAlt, FaHospital, FaCheckCircle, FaUserAlt, FaHistory, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { API_BASE_URL } from '../config';

function MyDonations() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    livesSaved: 0,
    lastDonation: null
  });
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in to view your donations");
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch user's donations
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchDonations();
      fetchAppointments();
    }
  }, [isLoggedIn, user]);

  const fetchDonations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      // API endpoint for donations history
      const response = await axios.get(`${API_BASE_URL}/donation-api/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if request was successful
      if (response.data && !response.data.error) {
        const donationData = response.data.payload || [];
        
        // Sort by date (most recent first)
        donationData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setDonations(donationData);
        
        // Calculate stats
        setStats({
          totalDonations: donationData.length,
          livesSaved: donationData.length * 3, // Each donation can save up to 3 lives
          lastDonation: donationData.length > 0 ? new Date(donationData[0].date) : null
        });
      } else {
        // Handle API error response
        setError("Could not retrieve donation history");
        toast.error("Failed to load donation history");
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError("Connection error. Please try again later.");
      toast.error("Failed to load your donation history");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      // API endpoint for appointments
      const response = await axios.get(`${API_BASE_URL}/donation-api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if request was successful
      if (response.data && !response.data.error) {
        const appointmentData = response.data.payload || [];
        setUpcomingAppointments(appointmentData);
      } else {
        console.error("Error in appointment data:", response.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // Get authentication token
      const token = localStorage.getItem('token');
      
      // Make DELETE request to cancel appointment
      await axios.delete(`${API_BASE_URL}/donation-api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update UI by removing the canceled appointment
      setUpcomingAppointments(prev => 
        prev.filter(appointment => appointment._id !== appointmentId)
      );
      
      toast.success('Appointment canceled successfully');
    } catch (error) {
      console.error('Error canceling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  if (error && !isLoading) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center">
          <FaExclamationTriangle className="me-3 fs-4" />
          <div>
            <h5>Error loading donations</h5>
            <p className="mb-0">{error}</p>
            <button 
              className="btn btn-sm btn-outline-danger mt-2" 
              onClick={fetchDonations}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="text-center" style={{ color: '#D32F2F', fontWeight: '600' }}>
            My Blood Donation History
          </h2>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your donation history...</p>
        </div>
      ) : (
        <>
          {/* User Profile Summary */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div 
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      backgroundColor: '#D32F2F',
                      color: 'white'
                    }}
                  >
                    <FaUserAlt size={30} />
                  </div>
                  <h5 className="card-title">{user?.username || 'Donor'}</h5>
                  <p className="card-text mb-1">
                    <FaTint className="me-2 text-danger" />
                    Blood Group: {user?.bloodGroup || 'Not specified'}
                  </p>
                  <p className="card-text text-muted">
                    <FaMapMarkerAlt className="me-2" />
                    {user?.city || 'City'}{user?.state ? `, ${user.state}` : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-8">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Your Donation Impact</h5>
                  <div className="row text-center g-3">
                    <div className="col-4">
                      <div className="p-3 rounded bg-light">
                        <h2 className="mb-0" style={{ color: '#D32F2F' }}>{stats.totalDonations}</h2>
                        <p className="small mb-0">Donations</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded bg-light">
                        <h2 className="mb-0" style={{ color: '#D32F2F' }}>{stats.livesSaved}</h2>
                        <p className="small mb-0">Lives Saved</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded bg-light">
                        <h2 className="mb-0" style={{ color: '#D32F2F' }}>
                          {stats.lastDonation ? 
                            format(stats.lastDonation, 'MMM dd') : 
                            '–'}
                        </h2>
                        <p className="small mb-0">Last Donation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <FaCalendarAlt className="me-2 text-danger" />
                    Upcoming Appointments
                  </h5>
                  
                  {upcomingAppointments.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Date & Time</th>
                            <th>Location</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingAppointments.map(appointment => (
                            <tr key={appointment._id}>
                              <td>
                                <div className="fw-medium">
                                  {format(new Date(appointment.date), 'MMMM d, yyyy')}
                                </div>
                                <div className="small text-muted">
                                  {appointment.time}
                                </div>
                              </td>
                              <td>
                                <div className="fw-medium">{appointment.center}</div>
                                <div className="small text-muted">{appointment.address}</div>
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger me-2"
                                  onClick={() => cancelAppointment(appointment._id)}
                                >
                                  Cancel
                                </button>
                                <Link 
                                  to="/donate" 
                                  className="btn btn-sm btn-outline-secondary"
                                >
                                  Reschedule
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-3 text-muted">You don't have any upcoming donation appointments.</p>
                      <Link 
                        to="/donate" 
                        className="btn" 
                        style={{ 
                          backgroundColor: '#D32F2F', 
                          color: 'white',
                          borderRadius: '30px',
                          padding: '8px 20px'
                        }}
                      >
                        Schedule a Donation
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Donation History */}
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">
                    <FaHistory className="me-2 text-danger" />
                    Donation History
                  </h5>
                  
                  {donations.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Blood Group</th>
                            <th>Units</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.map(donation => (
                            <tr key={donation._id}>
                              <td>
                                <div className="fw-medium">
                                  {format(new Date(donation.date), 'MMMM d, yyyy')}
                                </div>
                              </td>
                              <td>
                                <div className="fw-medium">{donation.center}</div>
                                <div className="small text-muted">{donation.address}</div>
                              </td>
                              <td>
                                <span className="badge bg-danger rounded-pill">
                                  {donation.bloodGroup || user?.bloodGroup}
                                </span>
                              </td>
                              <td>{donation.units || 1}</td>
                              <td>
                                <span className="badge bg-success rounded-pill">
                                  <FaCheckCircle className="me-1" />
                                  {donation.status || 'Completed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="mb-3 text-muted">You haven't made any blood donations yet.</p>
                      <Link 
                        to="/donate" 
                        className="btn" 
                        style={{ 
                          backgroundColor: '#D32F2F', 
                          color: 'white',
                          borderRadius: '30px',
                          padding: '8px 20px'
                        }}
                      >
                        Make Your First Donation
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Donation Tips */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm bg-light">
                <div className="card-body p-4">
                  <h5 className="card-title" style={{ color: '#D32F2F' }}>Tips for Your Next Donation</h5>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex align-items-start mb-2">
                      <FaCheckCircle className="me-2 mt-1 text-success" />
                      <span>Get a good night's sleep and have a healthy meal before your donation.</span>
                    </li>
                    <li className="d-flex align-items-start mb-2">
                      <FaCheckCircle className="me-2 mt-1 text-success" />
                      <span>Stay hydrated - drink plenty of water before and after donating.</span>
                    </li>
                    <li className="d-flex align-items-start mb-2">
                      <FaCheckCircle className="me-2 mt-1 text-success" />
                      <span>Avoid strenuous physical activity for 24 hours after donating blood.</span>
                    </li>
                    <li className="d-flex align-items-start">
                      <FaCheckCircle className="me-2 mt-1 text-success" />
                      <span>You're eligible to donate again 3 months after your last whole blood donation.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MyDonations; 