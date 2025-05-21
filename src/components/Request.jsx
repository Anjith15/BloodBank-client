import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { FaUserAlt, FaTint, FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaHospital, FaInfoCircle } from "react-icons/fa";
import { differenceInDays, format } from 'date-fns';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config';

function Request() {
    // Tab state - 'search' for Find Donor, 'create' for Request Blood
    const [activeTab, setActiveTab] = useState('search');
    
    // Find Donor form state
    const [bloodGroup, setBloodGroup] = useState("");
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cityFilter, setCityFilter] = useState("");
    const [cities, setCities] = useState([]);
    
    // Request Blood form state
    const [requestForm, setRequestForm] = useState({
      requesterName: '',
      bloodGroup: '',
      units: 1,
      location: '',
      city: '',
      state: '',
      contactNumber: '',
      contactEmail: '',
      urgency: 'Within 24 hours',
      hospital: '',
      additionalInfo: ''
    });
    
    // States list for dropdown
    const indianStates = [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
      "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
      "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
      "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
      "Uttarakhand", "West Bengal"
    ];
    
    const { isLoggedIn, user } = useContext(AuthContext);
    
    // Load cities for blood donor filtering
    useEffect(() => {
      const fetchCities = async () => {
        try {
          setIsLoading(true);
          const res = await axios.get(`${API_BASE_URL}/user-api/users`);
          if (res.data && res.data.payload) {
            // Extract unique cities from users
            const uniqueCities = [...new Set(res.data.payload.map(user => user.city))].filter(Boolean);
            setCities(uniqueCities.sort());
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
          toast.error("Failed to load cities. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchCities();
    }, []);

    // Prefill form with user data if logged in
    useEffect(() => {
      if (isLoggedIn && user) {
        setRequestForm(prev => ({
          ...prev,
          requesterName: user.username || '',
          contactNumber: user.phoneNumber || '',
          contactEmail: user.email || '',
          city: user.city || '',
          state: user.state || ''
        }));
      }
    }, [isLoggedIn, user, activeTab]);
    
    // Form change handler for Request Blood form
    const handleRequestFormChange = (e) => {
      const { name, value } = e.target;
      setRequestForm(prev => ({
        ...prev,
        [name]: value
      }));
    };
    
    // Handle search for donors
    async function handleSearch() {
        if (!bloodGroup) {
          toast.error("Please select a blood group");
          return;
        }
        
        try {
          setIsLoading(true);
          // Clear previous results
          setMatchedUsers([]);
          
          let url = `${API_BASE_URL}/user-api/users/${bloodGroup}`;
          const res = await axios.get(url);
          
          if (res.data.message === "Users found") {
            let filteredUsers = res.data.payload;
            
            // Apply city filter if selected
            if (cityFilter) {
              filteredUsers = filteredUsers.filter(user => user.city === cityFilter);
            }
            
            setMatchedUsers(filteredUsers);
            
            if (filteredUsers.length > 0) {
              toast.success(`Found ${filteredUsers.length} donor(s) with ${bloodGroup} blood group`);
            } else {
              toast.info(`No donors found with ${bloodGroup} blood group ${cityFilter ? `in ${cityFilter}` : ''}`);
            }
          } else {
            toast.info("No donors with this blood group found");
          }
        } catch (error) {
          console.error("Search error:", error);
          toast.error("Error fetching donors. Please try again.");
        } finally {
          setIsLoading(false);
        }
    }
    
    // Handle blood request submission
    const handleRequestSubmit = async (e) => {
      e.preventDefault();
      
      // Validate form
      if (!requestForm.requesterName || !requestForm.bloodGroup || !requestForm.city || !requestForm.state 
          || !requestForm.contactNumber || !requestForm.contactEmail) {
        toast.error("Please fill all required fields");
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Check if user is logged in
        if (!token) {
          toast.error("You must be logged in to make a blood request");
          setIsLoading(false);
          return;
        }
        
        // Create request
        const response = await axios.post(
          `${API_BASE_URL}/request-api/create`,
          requestForm,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data && !response.data.error) {
          const { notifiedDonors } = response.data.payload._doc || {};
          
          toast.success("Blood request created successfully!");
          
          if (notifiedDonors && notifiedDonors > 0) {
            toast.info(`${notifiedDonors} matching donors have been notified via email`);
          } else {
            toast.info("No matching donors were found to notify");
          }
          
          // Reset form
          setRequestForm({
            requesterName: user?.username || '',
            bloodGroup: '',
            units: 1,
            location: '',
            city: user?.city || '',
            state: user?.state || '',
            contactNumber: user?.phoneNumber || '',
            contactEmail: user?.email || '',
            urgency: 'Within 24 hours',
            hospital: '',
            additionalInfo: ''
          });
          
          // Switch to search tab
          setActiveTab('search');
        }
      } catch (error) {
        console.error("Request creation error:", error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error creating blood request. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };
      
    return (
      <div className="container py-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-center" style={{ color: '#D32F2F', fontWeight: '600' }}>Blood Donation Hub</h2>
          <p className="text-center text-muted">Find donors or create blood requests in your area</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="d-flex justify-content-center mb-4">
          <ul className="nav nav-pills">
            <li className="nav-item me-2">
              <button 
                className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
                style={{ 
                  backgroundColor: activeTab === 'search' ? '#D32F2F' : 'transparent',
                  color: activeTab === 'search' ? 'white' : '#D32F2F',
                  border: `1px solid ${activeTab === 'search' ? '#D32F2F' : '#dee2e6'}`,
                  borderRadius: '30px',
                  padding: '8px 20px'
                }}
                onClick={() => setActiveTab('search')}
              >
                <FaSearch className="me-2" />
                Find Donors
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'create' ? 'active' : ''}`}
                style={{ 
                  backgroundColor: activeTab === 'create' ? '#D32F2F' : 'transparent',
                  color: activeTab === 'create' ? 'white' : '#D32F2F',
                  border: `1px solid ${activeTab === 'create' ? '#D32F2F' : '#dee2e6'}`,
                  borderRadius: '30px',
                  padding: '8px 20px'
                }}
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.warning("Please log in to create a blood request");
                    return;
                  }
                  setActiveTab('create');
                }}
              >
                <FaTint className="me-2" />
                Request Blood
              </button>
            </li>
          </ul>
        </div>
        
        {/* Find Donors Tab Content */}
        {activeTab === 'search' && (
          <div className="row mb-5">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="mb-3" style={{ color: '#D32F2F' }}>Search for Donors</h4>
                  <p className="text-muted mb-4">
                    Search for blood donors by selecting the required blood group and location.
                    Our system will match you with available donors in your area.
                  </p>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium">Blood Group*</label>
                    <select 
                      className="form-select mb-3" 
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    
                    <label className="form-label fw-medium">City (Optional)</label>
                    <select 
                      className="form-select mb-3" 
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    
                    <button 
                      type="button" 
                      className="btn btn-block w-100 mt-2" 
                      onClick={handleSearch}
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
                          Searching...
                        </>
                      ) : (
                        <>
                          <FaSearch className="me-2" />
                          Search Donors
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Search Results */}
              {!isLoading && bloodGroup && matchedUsers.length === 0 && (
                <div className="alert alert-info text-center" role="alert">
                  <FaInfoCircle className="me-2" />
                  No donors found with {bloodGroup} blood group {cityFilter && `in ${cityFilter}`}.
                  <br />
                  <button 
                    className="btn btn-sm mt-2" 
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.warning("Please log in to create a blood request");
                        return;
                      }
                      setActiveTab('create');
                    }}
                    style={{ 
                      backgroundColor: '#D32F2F', 
                      color: 'white',
                      borderRadius: '30px'
                    }}
                  >
                    <FaTint className="me-1" />
                    Create a blood request
                  </button>
                </div>
              )}
              
              {matchedUsers.length > 0 && (
                <div className="mt-4">
                  <h5 className="mb-4" style={{ color: '#D32F2F' }}>
                    <FaUserAlt className="me-2" /> 
                    Available Donors ({matchedUsers.length})
                  </h5>
                  
                  <div className="row row-cols-1 row-cols-md-2 g-4">
                    {matchedUsers.map((user, index) => (
                      <div className="col" key={index}>
                        <div 
                          className="card h-100 border-0 shadow-sm"
                          style={{ borderRadius: '10px' }}
                        >
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div 
                                className="me-3 d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: '50px', 
                                  height: '50px', 
                                  borderRadius: '50%', 
                                  backgroundColor: '#D32F2F',
                                  color: 'white',
                                  fontSize: '1.2rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                {user.bloodGroup}
                              </div>
                              <div>
                                <h5 className="card-title mb-0">{user.username}</h5>
                                <p className="card-text text-muted mb-0">
                                  <FaMapMarkerAlt className="me-1" size={14} />
                                  {user.city}
                                  {user.state && `, ${user.state}`}
                                </p>
                              </div>
                            </div>
                            
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item border-0 px-0 py-2">
                                <FaPhone className="me-2 text-muted" />
                                {user.phoneNumber}
                              </li>
                              <li className="list-group-item border-0 px-0 py-2">
                                <FaEnvelope className="me-2 text-muted" />
                                {user.email}
                              </li>
                              {user.lastDonationDate && (
                                <li className="list-group-item border-0 px-0 py-2">
                                  <FaCalendarAlt className="me-2 text-muted" />
                                  Last donated: {format(new Date(user.lastDonationDate), 'PP')}
                                  {' '}
                                  ({differenceInDays(new Date(), new Date(user.lastDonationDate))} days ago)
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Request Blood Tab Content */}
        {activeTab === 'create' && (
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h4 className="card-title mb-4" style={{ color: '#D32F2F' }}>Create Blood Request</h4>
                  
                  <form onSubmit={handleRequestSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaUserAlt className="me-2 text-muted" size={14} />
                          Your Name*
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="requesterName"
                          value={requestForm.requesterName}
                          onChange={handleRequestFormChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaTint className="me-2 text-muted" size={14} />
                          Blood Group Required*
                        </label>
                        <select 
                          className="form-select" 
                          name="bloodGroup"
                          value={requestForm.bloodGroup}
                          onChange={handleRequestFormChange}
                          required
                        >
                          <option value="">Select Blood Group</option>
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
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaTint className="me-2 text-muted" size={14} />
                          Units Required
                        </label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="units"
                          min="1"
                          max="10"
                          value={requestForm.units}
                          onChange={handleRequestFormChange}
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaHospital className="me-2 text-muted" size={14} />
                          Hospital Name
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="hospital"
                          value={requestForm.hospital}
                          onChange={handleRequestFormChange}
                        />
                      </div>
                      
                      <div className="col-md-12">
                        <label className="form-label fw-medium">
                          <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                          Hospital/Location Address
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="location"
                          value={requestForm.location}
                          onChange={handleRequestFormChange}
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                          City*
                        </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="city"
                          value={requestForm.city}
                          onChange={handleRequestFormChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaMapMarkerAlt className="me-2 text-muted" size={14} />
                          State*
                        </label>
                        <select 
                          className="form-select" 
                          name="state"
                          value={requestForm.state}
                          onChange={handleRequestFormChange}
                          required
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaPhone className="me-2 text-muted" size={14} />
                          Contact Number*
                        </label>
                        <input 
                          type="tel" 
                          className="form-control" 
                          name="contactNumber"
                          pattern="[0-9]{10}"
                          placeholder="10-digit mobile number"
                          value={requestForm.contactNumber}
                          onChange={handleRequestFormChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaEnvelope className="me-2 text-muted" size={14} />
                          Contact Email*
                        </label>
                        <input 
                          type="email" 
                          className="form-control" 
                          name="contactEmail"
                          value={requestForm.contactEmail}
                          onChange={handleRequestFormChange}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label className="form-label fw-medium">
                          <FaCalendarAlt className="me-2 text-muted" size={14} />
                          Required Within
                        </label>
                        <select 
                          className="form-select" 
                          name="urgency"
                          value={requestForm.urgency}
                          onChange={handleRequestFormChange}
                        >
                          <option value="Within 24 hours">Within 24 hours</option>
                          <option value="Within 48 hours">Within 48 hours</option>
                          <option value="Within a week">Within a week</option>
                        </select>
                      </div>
                      
                      <div className="col-12">
                        <label className="form-label fw-medium">
                          <FaInfoCircle className="me-2 text-muted" size={14} />
                          Additional Information
                        </label>
                        <textarea 
                          className="form-control" 
                          name="additionalInfo"
                          rows="3"
                          value={requestForm.additionalInfo}
                          onChange={handleRequestFormChange}
                          placeholder="Any additional details that might be helpful..."
                        ></textarea>
                      </div>
                      
                      <div className="col-12 mt-4">
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
                              Submitting Request...
                            </>
                          ) : (
                            'Submit Blood Request'
                          )}
                        </button>
                        
                        <p className="mt-3 mb-0 text-muted small text-center">
                          <FaInfoCircle className="me-1" />
                          Your request will be visible to matching donors in your area.
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default Request;