import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePatient = () => {
  const { id } = useParams(); // Get patient ID from URL
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState({
    patientID: '',
    name: '',
    address: '',
    telephoneNumber: '',
    dateOfBirth: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Format date to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    // Create a Date object from the input string
    const date = new Date(dateString);
    
    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Return in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  };

  // Fetch existing patient details
  useEffect(() => {
    axios.get(`http://localhost:5000/patients/${id}`)
      .then(response => {
        // Format the date before setting state
        const formattedPatientData = {
          ...response.data,
          dateOfBirth: formatDateForInput(response.data.dateOfBirth)
        };
        setPatientData(formattedPatientData);
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch patient data',
        });
        console.error(error);
      });
  }, [id]);

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!patientData.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(patientData.name)) {
      errors.name = "Name should contain only letters";
    }

    if (!patientData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!patientData.telephoneNumber) {
      errors.telephoneNumber = "Telephone number is required";
    } else if (!/^\d{10}$/.test(patientData.telephoneNumber)) {
      errors.telephoneNumber = "Telephone number must be 10 digits";
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({
      ...prev,
      [name]: name === 'telephoneNumber' ? value.replace(/\D/g, '') : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      try {
        await axios.put(`http://localhost:5000/patients/edit/${id}`, patientData);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Patient data updated successfully',
        });
        navigate('/patient-list'); // Redirect to patient list
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Could not update patient data',
        });
        console.error(error);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#233066] mb-6">
          Update Patient
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
              className={`w-full p-2 border rounded-md ${formErrors.name ? 'border-red-500' : ''}`}
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
              className={`w-full p-2 border rounded-md ${formErrors.address ? 'border-red-500' : ''}`}
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
              className={`w-full p-2 border rounded-md ${formErrors.telephoneNumber ? 'border-red-500' : ''}`}
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
              className={`w-full p-2 border rounded-md ${formErrors.dateOfBirth ? 'border-red-500' : ''}`}
            />
            {formErrors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{formErrors.dateOfBirth}</p>}
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-gradient-to-r from-[#ec2026] to-[#233066] text-white rounded-md hover:opacity-90"
          >
            Update Patient
          </button>
        </form>

        <div className="flex justify-between mt-4 space-x-4">
          <button
            onClick={() => navigate('/patient-list')}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatient;