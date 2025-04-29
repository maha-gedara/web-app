import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Centralized Axios Instance
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientID.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/patients/');
      setPatients(response.data);
      setFilteredPatients(response.data);
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch patients!'
      });
      console.error('Fetch patients error:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (patientID, patientName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete patient ${patientName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log('Attempting to delete patient:', patientID);
          const response = await axiosInstance.delete(`/patients/delete/${patientID}`);
          
          console.log('Delete response:', response);
          
          // Remove the deleted patient from local state
          const updatedPatients = patients.filter(patient => patient.patientID !== patientID);
          setPatients(updatedPatients);
          setFilteredPatients(updatedPatients);
          
          Swal.fire({
            title: "Deleted!",
            text: `Patient ${patientName} has been deleted.`,
            icon: "success"
          });
        } catch (error) {
          console.error('Delete patient error:', error.response ? error.response.data : error.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Failed to delete patient: ${error.response?.data?.message || error.message}`
          });
        }
      }
    });
  };

  // New method to handle patient update navigation
  const handleUpdatePatient = (patientId) => {
    navigate(`/patient-edit/${patientId}`);
  };

  const handleBackToHome = () => {
    navigate('/pp');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-[#233066]">
            Patient List
          </h2>
          <button
            onClick={handleBackToHome}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
          >
            ← Back to Home
          </button>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Name or Patient ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2026]"
          />
        </div>

        {isLoading ? (
          <div className="text-center text-xl text-gray-500">Loading patients...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No patients found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div 
                key={patient._id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#233066]">{patient.name}</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    ID: {patient.patientID}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.042 11.042 0 005.668 5.668l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{patient.telephoneNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDate(patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{patient.address}</span>
                  </div>
                </div>

                {patient.symptoms && patient.symptoms.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-[#233066] mb-2">Recent Symptoms</h4>
                    {patient.symptoms.slice(-3).map((symptomEntry, index) => (
                      <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                        <p className="text-sm">
                          <strong>Date:</strong> {formatDate(symptomEntry.date)}
                        </p>
                        <p className="text-sm">
                          <strong>Symptoms:</strong> {symptomEntry.symptoms.join(', ')}
                        </p>
                        <p className="text-sm text-blue-600">
                          <strong>Assumed Disease:</strong> {symptomEntry.assumedDisease}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdatePatient(patient._id)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(patient.patientID, patient.name)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;