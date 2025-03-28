import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

// Import your logo (replace with actual path)
import MedizLogo from '../../../public/mediz-logo.png'; 

const PatientReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reportPreview, setReportPreview] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    try {
      const response = await axios.get('http://localhost:5000/patients/');
      const filteredPatients = response.data.filter(patient => 
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.patientID.toLowerCase().includes(value.toLowerCase())
      );
      
      if (filteredPatients.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Patients Found',
          text: 'No patients match your search criteria.'
        });
      }
      
      setPatients(filteredPatients);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Search Error',
        text: 'Failed to search patients'
      });
      console.error(error);
    }
  };

  const previewReport = () => {
    try {
      if (!selectedPatient) {
        Swal.fire({
          icon: 'warning',
          title: 'Select a Patient',
          text: 'Please select a patient to generate a report'
        });
        return;
      }

      if (!selectedPatient.symptoms || selectedPatient.symptoms.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Symptoms',
          text: 'This patient has no symptom records to include in the report'
        });
        return;
      }

      const doc = new jsPDF();
      
      // Add logo
      doc.addImage(MedizLogo, 'PNG', 10, 10, 50, 20);

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Medical Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

      // Patient Personal Details in a more elegant layout
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Left column
      doc.text(`Patient Details`, 20, 60, { underline: true });
      doc.text(`Name: ${selectedPatient.name}`, 20, 70);
      doc.text(`Patient ID: ${selectedPatient.patientID}`, 20, 80);
      doc.text(`Date of Birth: ${new Date(selectedPatient.dateOfBirth).toLocaleDateString()}`, 20, 90);

      // Right column
      doc.text(`Contact Information`, 140, 60, { underline: true });
      doc.text(`Address: ${selectedPatient.address}`, 140, 70);
      doc.text(`Telephone: ${selectedPatient.telephoneNumber}`, 140, 80);

      // Symptoms Table
      const symptomData = selectedPatient.symptoms.map(symptom => [
        new Date(symptom.date).toLocaleDateString(),
        symptom.symptoms.join(', '),
        symptom.assumedDisease
      ]);

      autoTable(doc, {
        startY: 110,
        head: [['Date', 'Symptoms', 'Assumed Disease']],
        body: symptomData,
        theme: 'striped'
      });

      // Footer
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Date: ${currentDate}`, 20, doc.internal.pageSize.getHeight() - 30);
      doc.text('Patient Management,\nEVENZ Hospital Management System', 
        doc.internal.pageSize.getWidth() - 20, 
        doc.internal.pageSize.getHeight() - 30, 
        { align: 'right' }
      );

      // Convert PDF to Blob for preview
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setReportPreview(pdfUrl);
    } catch (error) {
      console.error('Report Preview Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Report Preview Error',
        text: 'Failed to preview report. Please try again.'
      });
    }
  };

  const downloadReport = () => {
    try {
      const doc = new jsPDF();
      
      // Add logo
      doc.addImage(MedizLogo, 'PNG', 10, 10, 50, 20);

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Patient Medical Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

      // Patient Personal Details in a more elegant layout
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Left column
      doc.text(`Patient Details`, 20, 60, { underline: true });
      doc.text(`Name: ${selectedPatient.name}`, 20, 70);
      doc.text(`Patient ID: ${selectedPatient.patientID}`, 20, 80);
      doc.text(`Date of Birth: ${new Date(selectedPatient.dateOfBirth).toLocaleDateString()}`, 20, 90);

      // Right column
      doc.text(`Contact Information`, 140, 60, { underline: true });
      doc.text(`Address: ${selectedPatient.address}`, 140, 70);
      doc.text(`Telephone: ${selectedPatient.telephoneNumber}`, 140, 80);

      // Symptoms Table
      const symptomData = selectedPatient.symptoms.map(symptom => [
        new Date(symptom.date).toLocaleDateString(),
        symptom.symptoms.join(', '),
        symptom.assumedDisease
      ]);

      autoTable(doc, {
        startY: 110,
        head: [['Date', 'Symptoms', 'Assumed Disease']],
        body: symptomData,
        theme: 'striped'
      });

      // Footer
      const currentDate = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.text(`Date: ${currentDate}`, 20, doc.internal.pageSize.getHeight() - 30);
      doc.text('Patient Management,\nMEDIZ Hospital Management System', 
        doc.internal.pageSize.getWidth() - 20, 
        doc.internal.pageSize.getHeight() - 30, 
        { align: 'right' }
      );

      doc.save(`${selectedPatient.name}_medical_report.pdf`);
      
      Swal.fire({
        icon: 'success',
        title: 'Report Generated',
        text: 'Medical report has been successfully created'
      });

      // Reset the state
      setSearchTerm('');
      setPatients([]);
      setSelectedPatient(null);
      setReportPreview(null);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'PDF Generation Error',
        text: 'Failed to generate PDF. Please try again.'
      });
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-[#233066]">
            Patient Report
          </h2>
          <button
            onClick={handleHomeClick}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            ← Back to Home
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Patient by Name or ID"
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value) {
                  handleSearch(value);
                } else {
                  setPatients([]);
                }
              }}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ec2026]"
            />
          </div>

          {patients.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Select Patient</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.map(patient => (
                  <div 
                    key={patient._id} 
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border rounded-md cursor-pointer ${
                      selectedPatient?._id === patient._id 
                        ? 'bg-[#ec2026] text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Patient ID:</strong> {patient.patientID}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedPatient && (
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Selected Patient: {selectedPatient.name}
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={previewReport}
                  className="flex-1 bg-transparent border-2 border-[#ec2026] text-[#ec2026] p-3 rounded-md hover:bg-[#ec2026] hover:text-white transition-colors duration-300"
                >
                  Preview Report
                </button>
                <button
                  onClick={downloadReport}
                  className="flex-1 bg-gradient-to-r from-[#ec2026] to-[#233066] text-white p-3 rounded-md hover:opacity-90"
                >
                  Download Report
                </button>
              </div>
            </div>
          )}

          {reportPreview && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Report Preview</h3>
              <iframe 
                src={reportPreview} 
                width="100%" 
                height="500" 
                className="border rounded-md"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReport;