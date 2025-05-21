import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserAlt, FaEnvelope, FaLock, FaPhone, FaWeight, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phoneNumber: "",
    weight: "",
    city: "",
    state: "",
    pinCode: "",
    lastDonationDate: "",
    hasDonatedBefore: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
  ];

  // Validation function
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "username":
        if (!value) error = "Username is required";
        else if (value.length < 3) error = "Username must be at least 3 characters";
        break;
      
      case "email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email format is invalid";
        break;
      
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Password must be at least 8 characters";
        break;
      
      case "age":
        if (!value) error = "Age is required";
        else if (isNaN(value) || value < 18) error = "Age must be at least 18";
        else if (value > 65) error = "Age must be 65 or less";
        break;
      
      case "gender":
        if (!value) error = "Gender is required";
        break;
      
      case "bloodGroup":
        if (!value) error = "Blood Group is required";
        break;
      
      case "phoneNumber":
        if (!value) error = "Phone Number is required";
        else if (!/^\d{10}$/.test(value)) error = "Phone Number must be 10 digits";
        break;
      
      case "weight":
        if (!value) error = "Weight is required";
        else if (isNaN(value) || value < 50) error = "Weight must be at least 50 kg";
        break;
      
      case "city":
        if (!value) error = "City is required";
        break;
      
      case "state":
        if (!value) error = "State is required";
        break;
      
      case "pinCode":
        if (!value) error = "Pin Code is required";
        else if (!/^\d{6}$/.test(value)) error = "Pin Code must be 6 digits";
        break;
      
      default:
        break;
    }
    
    return error;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // Validate all fields on value change
  useEffect(() => {
    const newErrors = {};
    
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        const errorMessage = validateField(field, formData[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
        }
      }
    });
    
    setErrors(newErrors);
  }, [formData, touched]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Touch all fields to show validation errors
    const allFields = {};
    Object.keys(formData).forEach(field => {
      allFields[field] = true;
    });
    setTouched(allFields);
    
    // Check all fields for validation errors
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });
    
    setErrors(newErrors);
    
    // If there are errors, don't submit the form
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).join(", ");
      toast.error(`Please fix the following errors: ${errorMessages}`);
      return;
    }
    
    // Submit the form
    try {
      setIsLoading(true);
      const res = await axios.post(`${API_BASE_URL}/user-api/user`, formData);
      
      if (!res.data.error) {
        toast.success("Registration successful! You can now log in");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#FAFAFA' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow rounded bg-white" style={{ border: 'none', overflow: 'hidden' }}>
            <div className="card-header text-white py-3" style={{ backgroundColor: '#D32F2F' }}>
              <h3 className="mb-0">Register as Blood Donor</h3>
              <p className="mb-0">Join our community and help save lives</p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Personal Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Personal Information</h5>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaUserAlt className="me-2" />
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`form-control ${errors.username ? 'is-invalid' : (touched.username ? 'is-valid' : '')}`}
                      />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaEnvelope className="me-2" />
                        Email Address*
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-control ${errors.email ? 'is-invalid' : (touched.email ? 'is-valid' : '')}`}
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaLock className="me-2" />
                        Password*
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-control ${errors.password ? 'is-invalid' : (touched.password ? 'is-valid' : '')}`}
                      />
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Age*</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`form-control ${errors.age ? 'is-invalid' : (touched.age ? 'is-valid' : '')}`}
                      />
                      {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Gender*</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`form-control ${errors.gender ? 'is-invalid' : (touched.gender ? 'is-valid' : '')}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                    </div>
                  </div>
                  
                  {/* Medical Information */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-dark">Medical Details</h5>
                    
                    <div className="mb-3">
                      <label className="form-label">Blood Group*</label>
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className={`form-control ${errors.bloodGroup ? 'is-invalid' : (touched.bloodGroup ? 'is-valid' : '')}`}
                      >
                        <option value="">Select Blood Group</option>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ))}
                      </select>
                      {errors.bloodGroup && <div className="invalid-feedback">{errors.bloodGroup}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaPhone className="me-2" />
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : (touched.phoneNumber ? 'is-valid' : '')}`}
                        placeholder="10-digit number"
                      />
                      {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaWeight className="me-2" />
                        Weight (kg)*
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className={`form-control ${errors.weight ? 'is-invalid' : (touched.weight ? 'is-valid' : '')}`}
                      />
                      {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Have you donated before?</label>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="hasDonatedBefore"
                          checked={formData.hasDonatedBefore}
                          onChange={handleInputChange}
                          className="form-check-input"
                          id="hasDonatedBefore"
                          style={{ borderColor: '#D32F2F' }}
                        />
                        <label className="form-check-label" htmlFor="hasDonatedBefore">
                          Yes, I have donated blood before
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">
                        <FaCalendarAlt className="me-2" />
                        Last Donation Date
                      </label>
                      <input
                        type="date"
                        name="lastDonationDate"
                        value={formData.lastDonationDate}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled={!formData.hasDonatedBefore}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Address Information */}
                <div className="row mt-3">
                  <div className="col-12">
                    <h5 className="mb-3 text-dark">
                      <FaMapMarkerAlt className="me-2" />
                      Address Information
                    </h5>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">City*</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`form-control ${errors.city ? 'is-invalid' : (touched.city ? 'is-valid' : '')}`}
                      />
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">State*</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`form-control ${errors.state ? 'is-invalid' : (touched.state ? 'is-valid' : '')}`}
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Pin Code*</label>
                      <input
                        type="text"
                        name="pinCode"
                        value={formData.pinCode}
                        onChange={handleInputChange}
                        className={`form-control ${errors.pinCode ? 'is-invalid' : (touched.pinCode ? 'is-valid' : '')}`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pinCode && <div className="invalid-feedback">{errors.pinCode}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    type="submit" 
                    className="btn px-5 py-2" 
                    disabled={isLoading || Object.keys(errors).length > 0}
                    style={{ 
                      backgroundColor: '#D32F2F', 
                      color: 'white',
                      borderRadius: '30px',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registering...
                      </>
                    ) : (
                      'Register as Donor'
                    )}
                  </button>
                  
                  <div className="mt-3">
                    Already have an account? <a href="/login" style={{ color: '#D32F2F', textDecoration: 'none', fontWeight: '500' }}>Login here</a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
