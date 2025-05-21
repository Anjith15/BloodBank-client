import React, { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { AuthContext } from "../contexts/AuthContext"
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import { API_BASE_URL } from '../config'

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await axios.post(
        `${API_BASE_URL}/user-api/login`,
        formData
      )
      const { message, token, payload } = res.data

      if (message === "login success") {
        localStorage.setItem("token", token) // save JWT token
        localStorage.setItem("user", JSON.stringify(payload)) // optional
        login(token, payload)
        navigate("/") // adjust the route as needed
      } 
    } catch (err) {
      console.error("Login error", err)
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || "Invalid credentials")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#FAFAFA' }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow rounded bg-white" style={{ border: 'none', overflow: 'hidden' }}>
            <div className="card-header text-white py-3" style={{ backgroundColor: '#D32F2F' }}>
              <h3 className="mb-0">Login</h3>
              <p className="mb-0">Access your blood donor account</p>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="form-label">
                    <FaLock className="me-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="text-center mt-4">
                  <button 
                    type="submit" 
                    className="btn px-5 py-2" 
                    disabled={isLoading}
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
                        Logging in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" />
                        Login
                      </>
                    )}
                  </button>
                  
                  <div className="mt-3">
                    Don't have an account? <Link to="/register" style={{ color: '#D32F2F', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
