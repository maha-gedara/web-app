import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AIPrediction = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [symptomDate, setSymptomDate] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [predictedDisease, setPredictedDisease] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      if (searchTerm.trim() === '') {
        setPatients([]);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/patients/');
        const filteredPatients = response.data.filter(patient => 
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.patientID.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setPatients(filteredPatients);
      } catch (error) {
        toast.error('Failed to search patients');
        console.error(error);
      }
    };

    // Add a small delay to reduce unnecessary API calls
    const timeoutId = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePredictDisease = async () => {
    if (!symptomDate || !symptoms) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/patients/predict', { 
        symptoms: symptoms.split(',').map(s => s.trim()) 
      });

      setPredictedDisease(response.data.assumedDisease);
    } catch (error) {
      toast.error('Failed to predict disease');
      console.error(error);
    }
  };

  const handleSubmitSymptoms = async () => {
    if (!predictedDisease) {
      toast.error('Please predict the disease first');
      return;
    }

    try {
      // Prepare symptom entry
      const symptomEntry = {
        date: symptomDate,
        symptoms: symptoms.split(',').map(s => s.trim()),
        assumedDisease: predictedDisease
      };

      // Update patient record
      await axios.put(`http://localhost:5000/patients/update/${selectedPatient._id}`, symptomEntry);
      
      toast.success('Symptoms and predicted disease added successfully');
      resetForm();
    } catch (error) {
      toast.error('Failed to submit symptoms');
      console.error(error);
    }
  };

  const resetForm = () => {
    setSelectedPatient(null);
    setPatients([]);
    setSearchTerm('');
    setShowSymptomModal(false);
    setSymptomDate('');
    setSymptoms('');
    setPredictedDisease('');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-[#233066]">
            AI Disease Prediction
          </h2>
          <button
            onClick={handleBackToHome}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Patient by Name or Patient ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2026]"
            />
          </div>

          {patients.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#ec2026] to-[#233066] text-white">
                  <tr>
                    <th className="p-3 text-left">Patient ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Telephone</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{patient.patientID}</td>
                      <td className="p-3">{patient.name}</td>
                      <td className="p-3">{patient.telephoneNumber}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowSymptomModal(true);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Add Symptoms
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Symptom Modal */}
        {showSymptomModal && selectedPatient && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
              <button 
                onClick={resetForm}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-4 text-[#233066]">
                Add Symptoms for {selectedPatient.name}
              </h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Patient ID</label>
                <input
                  type="text"
                  value={selectedPatient.patientID}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={symptomDate}
                  onChange={(e) => setSymptomDate(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2026]"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Symptoms (comma-separated)</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. fever, cough, headache"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2026]"
                ></textarea>
              </div>
              <div className="mb-4">
                <button
                  onClick={handlePredictDisease}
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
                >
                  Predict Disease
                </button>
              </div>
              {predictedDisease && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Predicted Disease</label>
                  <input
                    type="text"
                    value={predictedDisease}
                    disabled
                    className="w-full p-2 border rounded-md bg-green-100 cursor-not-allowed"
                  />
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={handleSubmitSymptoms}
                  disabled={!predictedDisease}
                  className={`w-full ${
                    predictedDisease 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                  } text-white px-4 py-2 rounded`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPrediction;