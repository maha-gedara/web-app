import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import MedizLogo from '../../public/mediz-logo.png'; 

const users = [
  { username: 'mediz.j', password: 'Doc123', path: '/disdoctors', role: 'Doctor' },
  { username: 'mediz.s', password: 'pharm123', path: '/parmacyhome', role: 'Pharmacist' },
  { username: 'mediz.l', password: 'staff123', path: '/HomePage', role: 'Lab Staff' },
  { username: 'mediz.p', password: 'patient123', path: '/pp', role: 'Patient' },
];

// System security PIN for quick access
const SECURITY_PIN = '2025';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Pin verification states
  const [showPinModal, setShowPinModal] = useState(false);
  const [securityPin, setSecurityPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedUserType, setSelectedUserType] = useState(null);

  useEffect(() => {
    // Real-time clock update
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        title: 'Error!',
        text: 'Please enter both username and password.',
        icon: 'error',
        confirmButtonColor: '#d33',
        timer: 2000
      });
      return;
    }
    
    setLoading(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      const user = users.find(
        (u) => u.username === username.trim() && u.password === password.trim()
      );

      if (user) {
        Swal.fire({
          title: 'Success!',
          text: `Welcome back, ${user.role}!`,
          icon: 'success',
          confirmButtonColor: '#1e3a8a',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Navigate to the appropriate path
          navigate(user.path);
        });
      } else {
        Swal.fire({
          title: 'Invalid Credentials',
          text: 'Invalid username or password. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        setLoading(false);
      }
    }, 800);
  };

  // Function to open pin verification modal
  const openPinVerification = (userType) => {
    setSelectedUserType(userType);
    setSecurityPin('');
    setPinError('');
    setShowPinModal(true);
  };

  // Function to verify PIN and auto-fill credentials if correct
  const verifyPin = () => {
    if (securityPin === SECURITY_PIN) {
      const demoUser = users.find(u => u.role.toLowerCase() === selectedUserType.toLowerCase());
      if (demoUser) {
        setUsername(demoUser.username);
        setPassword(demoUser.password);
        setShowPinModal(false);
        Swal.fire({
          title: 'Auto-filled!',
          text: `Credentials for ${demoUser.role} auto-filled. Click Sign In to continue.`,
          icon: 'info',
          confirmButtonColor: '#1e3a8a',
          timer: 2000
        });
      }
    } else {
      setPinError('Incorrect security PIN. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header with Date/Time */}
      <div className="bg-white p-4 shadow-md text-center">
        <div className="text-lg text-blue-900 font-medium">
          {currentDateTime.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })}
        </div>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo and Hospital Name */}
          <div className="flex justify-center mb-8">
            <div className="text-center">
              <img src={MedizLogo} alt="MEDIZ Logo" className="h-16 w-28 mx-auto mb-2" />
              <p className="text-gray-600">Hospital Management System</p>
            </div>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-red-600 to-blue-900 p-4">
              <h2 className="text-xl font-bold text-white text-center">Staff Login</h2>
            </div>
            
            {/* Login Form */}
            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-900 focus:ring-red-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-red-600 hover:text-blue-900">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-blue-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Quick Access Demo Section */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Quick access (PIN protected)</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => openPinVerification('doctor')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Doctor
                  </button>
                  <button
                    type="button"
                    onClick={() => openPinVerification('pharmacist')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Pharmacist
                  </button>
                  <button
                    type="button"
                    onClick={() => openPinVerification('lab staff')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Lab Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => openPinVerification('patient')}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-blue-900 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Patient
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} MEDIZ Hospital Management System</p>
            <p className="mt-1">Need help? Contact system administrator</p>
          </div>
        </div>
      </div>

      {/* PIN Verification Modal with backdrop blur */}
      {showPinModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Security Verification</h3>
              <button 
                onClick={() => setShowPinModal(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Enter security PIN to access {selectedUserType} credentials
            </p>
            
            {pinError && (
              <div className="mb-4 p-2 bg-red-100 text-red-800 text-sm rounded-md">
                {pinError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Security PIN</label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter PIN"
                value={securityPin}
                onChange={(e) => setSecurityPin(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowPinModal(false)}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={verifyPin}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-blue-900 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}