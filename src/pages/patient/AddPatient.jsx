import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddPatient = () => {
  // Initial state for patient data
  const initialPatientState = {
    patientID: '',
    name: '',
    address: '',
    telephoneNumber: '',
    dateOfBirth: ''
  };

  const [patientData, setPatientData] = useState(initialPatientState);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Generate unique patient ID
  const generatePatientID = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 random digits
    return `P${randomDigits}`;
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    // Validate Name (non-empty and only letters)
    if (!patientData.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(patientData.name)) {
      errors.name = "Name should contain only letters";
    }

    // Validate Address (non-empty)
    if (!patientData.address.trim()) {
      errors.address = "Address is required";
    }

    // Validate Telephone Number (10 digits only)
    if (!patientData.telephoneNumber) {
      errors.telephoneNumber = "Telephone number is required";
    } else if (!/^\d{10}$/.test(patientData.telephoneNumber)) {
      errors.telephoneNumber = "Telephone number must be 10 digits";
    }

    // Validate Date of Birth (not future date)
    if (!patientData.dateOfBirth) {
      errors.dateOfBirth = "Date of Birth is required";
    } else {
      const selectedDate = new Date(patientData.dateOfBirth);
      const today = new Date();
      if (selectedDate > today) {
        errors.dateOfBirth = "Date of Birth cannot be in the future";
      }
    }

    return errors;
  };

  // Auto-generate Patient ID on component mount
  useEffect(() => {
    setPatientData(prev => ({
      ...prev,
      patientID: generatePatientID()
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for telephone number (only numbers)
    if (name === 'telephoneNumber') {
      const numbersOnly = value.replace(/\D/g, '');
      setPatientData(prev => ({
        ...prev,
        [name]: numbersOnly
      }));
    } else {
      setPatientData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      try {
        await axios.post('http://localhost:5000/patients/add', patientData);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Patient added successfully',
          confirmButtonColor: '#3085d6'
        });
        
        // Reset the form
        setPatientData({
          ...initialPatientState,
          patientID: generatePatientID() // Generate new ID after successful submission
        });
        setFormErrors({});
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add patient',
          confirmButtonColor: '#d33'
        });
        console.error(error);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleClear = () => {
    Swal.fire({
      title: 'Clear Form?',
      text: 'Are you sure you want to clear all fields?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setPatientData({
          ...initialPatientState,
          patientID: generatePatientID()
        });
        setFormErrors({});
        Swal.fire({
          icon: 'info',
          title: 'Form Cleared',
          text: 'All fields have been reset',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  // Memoized form validation
  const isFormValid = useMemo(() => {
    const errors = validateForm();
    return Object.keys(errors).length === 0;
  }, [patientData]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#233066] mb-6">
          Add New Patient
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Patient ID</label>
            <input
              type="text"
              name="patientID"
              value={patientData.patientID}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={patientData.name}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                formErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#ec2026]'
              }`}
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={patientData.address}
              onChange={handleChange}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                formErrors.address ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#ec2026]'
              }`}
            />
            {formErrors.address && <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Telephone Number</label>
            <input
              type="tel"
              name="telephoneNumber"
              value={patientData.telephoneNumber}
              onChange={handleChange}
              maxLength="10"
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                formErrors.telephoneNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#ec2026]'
              }`}
            />
            {formErrors.telephoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.telephoneNumber}</p>}
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={patientData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              required
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                formErrors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'focus:ring-[#ec2026]'
              }`}
            />
            {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{formErrors.dateOfBirth}</p>}
          </div>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-3 rounded-md transition-all ${
              isFormValid 
                ? 'bg-gradient-to-r from-[#ec2026] to-[#233066] text-white hover:opacity-90' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Add Patient
          </button>
        </form>

        <div className="flex justify-between mt-4 space-x-4">
          <button 
            onClick={handleBack}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>
          <button 
            onClick={handleClear}
            className="flex-1 bg-red-100 text-red-800 px-4 py-2 rounded-md hover:bg-red-200 transition-all"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;