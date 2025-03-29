import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MedizLogo from '../../../public/mediz-logo.png'; 

const PPage = () => {
  const [recentPatients, setRecentPatients] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Fetch recent patients
    const fetchRecentPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patients/');
        // Sort by most recent symptoms and take top 5
        const sortedPatients = response.data
          .sort((a, b) => {
            const lastSymptomA = a.symptoms.length > 0 
              ? new Date(a.symptoms[a.symptoms.length - 1].date) 
              : new Date(0);
            const lastSymptomB = b.symptoms.length > 0 
              ? new Date(b.symptoms[b.symptoms.length - 1].date) 
              : new Date(0);
            return lastSymptomB - lastSymptomA;
          })
          .slice(0, 5);
        setRecentPatients(sortedPatients);
      } catch (error) {
        toast.error('Failed to fetch recent patients');
        console.error(error);
      }
    };

    fetchRecentPatients();

    // Real-time clock update
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Logo and Header with White Background */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex justify-center items-center p-6">
            <img 
              src="/mediz-logo.png" 
              alt="Mediz Hospital Administration System Logo" 
              className="h-32 w-auto mr-8"
            />
            <div>
              <h1 className="text-5xl font-bold text-left text-[#233066] mb-2">
                WELCOME BACK!
              </h1>
              <h2 className="text-4xl text-left text-[#233066] font-semibold">
                Patient Management
              </h2>
            </div>
          </div>

          {/* Date and Time Display */}
          <div className="text-center pb-6 text-xl text-[#233066]">
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

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          {[
            { 
              title: 'Add Patient', 
              icon: '➕', 
              link: '/add-patient',
              color: 'bg-gradient-to-r from-[#ec2026] to-[#233066]'
            },
            { 
              title: 'Patient List', 
              icon: '📋', 
              link: '/patient-list',
              color: 'bg-gradient-to-r from-[#ec2026] to-[#233066]'
            },
            { 
              title: 'Use AI', 
              icon: '🤖', 
              link: '/ai-prediction',
              color: 'bg-gradient-to-r from-[#ec2026] to-[#233066]'
            },
            { 
              title: 'Patient Report', 
              icon: '📄', 
              link: '/patient-report',
              color: 'bg-gradient-to-r from-[#ec2026] to-[#233066]'
            }
          ].map((button, index) => (
            <Link 
              key={index} 
              to={button.link} 
              className={`${button.color} text-white p-4 rounded-lg shadow-lg text-center hover:opacity-90 transition-all`}
            >
              <div className="text-3xl mb-2">{button.icon}</div>
              <div className="font-semibold">{button.title}</div>
            </Link>
          ))}
        </div>

        {/* Recent Patients Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-[#ec2026] to-[#233066] text-white p-4 rounded-t-lg">
            <h3 className="text-xl font-bold">Recent Patients</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 text-left font-semibold">Patient ID</th>
                <th className="p-4 text-left font-semibold">Patient Name</th>
                <th className="p-4 text-left font-semibold">Telephone</th>
                <th className="p-4 text-left font-semibold">Last Symptoms Date</th>
                <th className="p-4 text-left font-semibold">Predicted Disease</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((patient, index) => (
                <tr 
                  key={patient._id} 
                  className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-4 text-[#233066] font-medium">{patient.patientID}</td>
                  <td className="p-4 text-[#233066] font-medium">{patient.name}</td>
                  <td className="p-4 text-[#233066] font-medium">{patient.telephoneNumber}</td>
                  <td className="p-4 text-[#233066] font-medium">
                    {patient.symptoms.length > 0 
                      ? new Date(patient.symptoms[patient.symptoms.length - 1].date).toLocaleDateString()
                      : 'No symptoms recorded'}
                  </td>
                  <td className="p-4 text-[#233066] font-medium">
                    {patient.symptoms.length > 0 
                      ? patient.symptoms[patient.symptoms.length - 1].assumedDisease
                      : 'No prediction available'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PPage;