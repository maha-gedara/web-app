import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';

// Updated color palette with proper red integration
const colors = {
  navy: "#1d3a6e",      // Dark blue from palette
  red: "#cf2b41",       // Red from palette (properly utilized throughout)
  silver: "#b0b6bd",    // Silver/gray from palette
  lightGray: "#e5e7e9", // Light gray from palette
  white: "#ffffff",
  darkText: "#2e3749",
  lightText: "#6b7280",
  success: "#047857",
  error: "#cf2b41",     // Using the palette's red for error states
  highlight: "#dbeafe"
};

const specializations = [
  "Cardiologist", "Dermatologist", "Neurologist", "Oncologist", "Orthopedic",
  "Pediatrician", "Psychiatrist", "Radiologist", "Surgeon", "Urologist"
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorDisForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [editDoctor, setEditDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  // Update date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format the current date and time
  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Fetch doctor data from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/doctor")
      .then((response) => {
        setDoctors(response.data);
        setFilteredDoctors(response.data); // Initialize filtered doctors with all doctors
      })
      .catch((error) => {
        toast.error("Error fetching doctor data!");
        console.error(error);
      });
  }, []);

  // Updated search function that handles both name and specialty
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors);
      return;
    }
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = doctors.filter(doctor => {
      // Check doctor's name
      const nameMatch = doctor.fName && doctor.fName.toLowerCase().includes(lowerCaseSearch);
      
      // Check doctor's specialty
      let specialtyMatch = false;
      if (doctor.special) {
        // Handle both string and array types for special field
        if (typeof doctor.special === 'string') {
          specialtyMatch = doctor.special.toLowerCase().includes(lowerCaseSearch);
        } else if (Array.isArray(doctor.special)) {
          specialtyMatch = doctor.special.some(spec => 
            spec.toLowerCase().includes(lowerCaseSearch)
          );
        }
      }
      
      // Return true if either name or specialty matches
      return nameMatch || specialtyMatch;
    });
    
    setFilteredDoctors(filtered);
  }, [searchTerm, doctors]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  //Delete Doctor
  const handleDeleteDoctor = async (id, doctorName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete doctor ${doctorName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log('Attempting to delete doctor:', id);
          const response = await axios.delete(`http://localhost:5000/doctor/${id}`);
          
          console.log('Delete response:', response);
          
          // Remove the deleted doctor from local state
          const updatedDoctors = doctors.filter(doctor => doctor._id !== id);
          setDoctors(updatedDoctors);
          
          Swal.fire({
            title: "Deleted!",
            text: `Doctor ${doctorName} has been deleted.`,
            icon: "success"
          });
        } catch (error) {
          console.error('Delete doctor error:', error.response ? error.response.data : error.message);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Failed to delete doctor: ${error.response?.data?.message || error.message}`
          });
        }
      }
    });
  };

  const handleEditClick = (doctor) => {
    setEditDoctor({ ...doctor });
    setSelectedDay(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (day, index, timeType, value) => {
    setEditDoctor((prev) => {
      const updatedAvailability = [...prev.availability];
      const dayIndex = updatedAvailability.findIndex((avail) => avail.day === day);

      if (dayIndex !== -1) {
        updatedAvailability[dayIndex].timeSlots[index][timeType] = value;
      }

      return { ...prev, availability: updatedAvailability };
    });
  };

  const handleAddTimeSlot = (day) => {
    const dayIndex = editDoctor.availability.findIndex((avail) => avail.day === day);

    if (editDoctor.availability[dayIndex].timeSlots.length === 0) {
      const updatedAvailability = [...editDoctor.availability];
      updatedAvailability[dayIndex].timeSlots.push({ startTime: "", endTime: "" });
      setEditDoctor({ ...editDoctor, availability: updatedAvailability });
    } else {
      toast.error("This day already has a time slot.");
    }
  };

  const handleAddDay = (selectedDay) => {
    if (!editDoctor.availability.some((avail) => avail.day === selectedDay)) {
      const newDay = { day: selectedDay, timeSlots: [{ startTime: "", endTime: "" }] };
      setEditDoctor((prev) => ({
        ...prev,
        availability: [...prev.availability, newDay],
      }));
    } else {
      toast.error("This day is already added.");
    }
  };

  const handleUpdateDoctor = () => {
    axios
      .put(`http://localhost:5000/doctor/${editDoctor._id}`, editDoctor)
      .then((response) => {
        setDoctors(
          doctors.map((doctor) =>
            doctor._id === editDoctor._id ? editDoctor : doctor
          )
        );
        toast.success("Doctor updated successfully!");
        setEditDoctor(null);
        setSelectedDay(null);
      })
      .catch((error) => {
        toast.error("Error updating doctor!");
        console.error(error);
      });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Refined button style with smaller padding to avoid horizontal overflow
  const buttonStyle = (bgColor, textColor = colors.white) => ({
    backgroundColor: bgColor,
    color: textColor,
    padding: "0.5rem 0.75rem",
    borderRadius: "0.375rem",
    fontWeight: "600",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease-in-out",
    border: "none",
    cursor: "pointer",
    textTransform: "uppercase",
    fontSize: "0.75rem", 
    letterSpacing: "0.025em"
  });

  // Smaller input style to prevent overflow
  const inputStyle = {
    border: `1px solid ${colors.silver}`,
    borderRadius: "0.375rem",
    padding: "0.5rem", 
    width: "100%",
    fontSize: "0.875rem", 
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    transition: "border-color 0.2s ease-in-out",
    outline: "none"
  };

  // Table row styles
  const tableRowStyle = {
    borderBottom: `1px solid ${colors.lightGray}`,
    transition: "background-color 0.2s ease"
  };

  // Smaller badge style
  const badgeStyle = {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "9999px",
    fontWeight: "600",
    fontSize: "0.75rem", 
    backgroundColor: `${colors.navy}20`,
    color: colors.navy,
    letterSpacing: "0.025em"
  };

  // Smaller action buttons
  const actionButtonStyle = (color, bgColor) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.4rem",
    borderRadius: "9999px",
    backgroundColor: bgColor,
    color: color,
    transition: "all 0.2s ease-in-out",
    border: "none",
    cursor: "pointer",
    width: "2rem", 
    height: "2rem"
  });

  // Optimized time slot container
  const timeSlotContainerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.25rem 0", 
    borderRadius: "0.375rem",
    marginBottom: "0.5rem"
  };

  // Optimized day container
  const dayContainerStyle = {
    padding: "0.5rem",
    borderRadius: "0.375rem",
    backgroundColor: `${colors.lightGray}50`,
    marginBottom: "0.5rem"
  };

  const downloadPDF = () => {
    const doc = new jsPDF('portrait');
  
    // Define the title and styles
    const title = "Doctors Directory Report";
    const titleFontSize = 20;
    const lineHeight = 12;
    const leftMargin = 5;
    const topMargin = 20;
    let currentY = topMargin;
  
    // Add the title to the right side of the page
    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("black");
    const titleWidth = doc.getStringUnitWidth(title) * titleFontSize;
    const titleX = doc.internal.pageSize.getWidth() - titleWidth + 40;  // 10 for padding from the right edge
    doc.text(title, titleX, currentY);
    currentY += lineHeight * 2;
  
    // Table Header
    const headers = ["Doctor Name", "Specialty", "Contact", "Email Address", "Availability"];
    const tableColumnWidth = [30, 30, 30, 50, 50];
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
  
    // Draw Table Header with Borders
    let startX = leftMargin;
    headers.forEach((header, index) => {
      doc.rect(startX, currentY, tableColumnWidth[index], lineHeight);
      doc.text(header, startX + 5, currentY + 8);
      startX += tableColumnWidth[index];
    });
  
    currentY += lineHeight;
  
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
  
    // Draw Table Data for each doctor
    doctors.forEach((doctor, doctorIndex) => {
      const availabilityText = doctor.availability.map(avail =>
        `${avail.day}: ${avail.timeSlots.map(slot => `${slot.startTime} - ${slot.endTime}`).join(', ')}`
      ).join("\n") || "N/A";
  
      const availabilityLines = doc.splitTextToSize(availabilityText, tableColumnWidth[4] - 10);
      const rowHeight = Math.max(lineHeight, lineHeight * availabilityLines.length);
  
      startX = leftMargin;
      const doctorData = [
        doctor.fName || "N/A",
        Array.isArray(doctor.special) ? doctor.special.join(', ') : "N/A",
        doctor.cNumber || "N/A",
        doctor.email || "N/A",
        availabilityText
      ];
  
      doctorData.forEach((data, index) => {
        doc.rect(startX, currentY, tableColumnWidth[index], rowHeight);
        const textLines = doc.splitTextToSize(data, tableColumnWidth[index] - 10);
        const textStartY = currentY + (rowHeight - (textLines.length * lineHeight * 0.6)) / 2 + lineHeight * 0.5;
        doc.text(textLines, startX + 5, textStartY);
        startX += tableColumnWidth[index];
      });
  
      currentY += rowHeight;
  
      if (currentY > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        currentY = topMargin;
      }
    });
    doc.save('Doctors_Directory_Report.pdf');
  };

  const searchContainerStyle = {
    position: "relative",
    width: "100%",
    maxWidth: "300px",
    marginBottom: "1rem"
  };
  
  const searchInputStyle = {
    ...inputStyle,
    paddingLeft: "2.5rem",
    backgroundColor: colors.white,
    width: "100%",
    border: `1px solid ${colors.silver}`,
    height: "2.5rem"
  };
  
  const searchIconStyle = {
    position: "absolute",
    left: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: colors.silver
  };
  
  return (
    <div style={{
      backgroundColor: colors.lightGray,
      minHeight: "100vh",
      padding: "1rem", // Reduced padding
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', sans-serif"
    }}>
      <ToastContainer position="top-center" reverseOrder={false} />
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Welcome Header with Date/Time */}
        <div style={{
          backgroundColor: colors.navy,
          borderRadius: "0.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          marginBottom: "1rem", // Reduced margin
          padding: "1rem 1.5rem", // Reduced padding
          color: colors.white,
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: "1.75rem", // Smaller heading
            fontWeight: "700",
            margin: "0 0 0.5rem 0" // Reduced margin
          }}>
            Welcome to Doctor Management
          </h1>
          <p style={{
            fontSize: "0.95rem", // Smaller text
            margin: 0,
            opacity: 0.9
          }}>
            {formatDate(currentDateTime)}
          </p>
        </div>

        {/* Control Panel */}
        <div style={{ backgroundColor: colors.white,borderRadius: "0.5rem",boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          marginBottom: "1rem", padding: "1rem", borderBottom: `4px solid ${colors.navy}`}}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",flexWrap: "wrap", gap: "0.75rem"}}>
            
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: colors.navy, margin: 0 }}>Doctors Directory
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexGrow: 1,marginTop:"20px",marginLeft:"30px" }}>
              <div style={searchContainerStyle}>
                <div style={searchIconStyle}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search doctors by name or specialty..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  style={searchInputStyle}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link to="/doctors">
                <button style={buttonStyle(colors.navy)}>
                  Add Doctor
                </button>
              </Link>
              <button className="custom-button" onClick={downloadPDF}
                  style={{
                    ...buttonStyle(colors.red),
                    padding: "0.5rem 0.75rem",
                  }} > Report
              </button>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div style={{ backgroundColor: colors.white, borderRadius: "0.5rem", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          overflow: "auto",  border: `1px solid ${colors.lightGray}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem"  }}>

            <thead style={{ backgroundColor: colors.lightGray, borderBottom: `2px solid ${colors.silver}` }}>
              <tr>
                {["Name", "Specialty", "Contact", "Email", "Availability", "Actions"].map((header, index) => (
                  <th key={index} style={{ padding: "0.75rem",  textAlign: index === 5 ? "right" : "left", fontSize: "0.75rem", // Smaller header
                    fontWeight: "600", color: colors.navy, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Replace the entire tbody section with this code */}
            <tbody>
              {filteredDoctors.map((doctor) => (
                <React.Fragment key={doctor._id}>
                  <tr style={{
                    ...tableRowStyle,
                    backgroundColor: editDoctor && editDoctor._id === doctor._id ? `${colors.highlight}70` : colors.white
                  }}>

                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: "500", color: colors.darkText, fontSize: "0.875rem" }}>
                        {editDoctor && editDoctor._id === doctor._id ? (
                          <input type="text" name="fName" value={editDoctor.fName} onChange={handleInputChange} style={inputStyle} />
                            ) : (
                            doctor.fName
                        )}
                      </div>
                    </td>

                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap" }}>
                      <span style={badgeStyle}>
                        {editDoctor && editDoctor._id === doctor._id ? (
                          <select name="special" value={editDoctor.special} onChange={handleInputChange}
                            style={{
                              ...inputStyle, width: "auto", backgroundColor: "transparent",
                              border: "none", color: colors.navy, fontWeight: "600", fontSize: "0.75rem", padding: "0.25rem" }} >
                            {specializations.map((spec) => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        ) : (
                          doctor.special
                        )}
                      </span>
                    </td>

                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap", color: colors.lightText, fontSize: "0.875rem" }}>
                      {editDoctor && editDoctor._id === doctor._id ? (
                        <input type="text" name="cNumber" value={editDoctor.cNumber} onChange={handleInputChange} style={inputStyle}
                        />
                      ) : (
                        doctor.cNumber
                      )}
                    </td>

                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap", color: colors.lightText, fontSize: "0.875rem" }}>
                      {editDoctor && editDoctor._id === doctor._id ? (
                        <input type="text" name="email" value={editDoctor.email} onChange={handleInputChange} style={inputStyle}
                        />
                      ) : (
                        doctor.email
                      )}
                    </td>

                    <td style={{ padding: "0.75rem", maxWidth: "250px" }}>
                      {editDoctor && editDoctor._id === doctor._id ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>

                          {/* Render Days */}
                          {editDoctor.availability.map((avail, dayIndex) => (
                            <div key={avail.day} style={dayContainerStyle}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                                
                                {/* Day Name */}
                                <select value={avail.day}
                                  onChange={(e) => {
                                    const newAvailability = [...editDoctor.availability];
                                    newAvailability[dayIndex].day = e.target.value;
                                    setEditDoctor({ ...editDoctor, availability: newAvailability });
                                  }}
                                  style={{...inputStyle, width: "auto", fontWeight: "600", color: colors.navy, fontSize: "0.875rem"}}>
                                  {daysOfWeek.map((day) => (
                                    <option key={day} value={day}>
                                      {day}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Time Slots for the Day */}
                              {avail.timeSlots.map((slot, slotIndex) => (
                                <div key={slotIndex} style={timeSlotContainerStyle}>
                                  <input type="time" value={slot.startTime} onChange={(e) =>
                                      handleTimeChange(avail.day, slotIndex, "startTime", e.target.value)
                                    }
                                    style={{
                                      ...inputStyle, flex: "1", fontSize: "0.875rem" // Smaller font
                                    }}
                                  />
                                  <span style={{ color: colors.silver, fontSize: "0.75rem" }}>to</span>
                                  <input type="time" value={slot.endTime}
                                    onChange={(e) =>
                                      handleTimeChange(avail.day, slotIndex, "endTime", e.target.value)
                                    }
                                    style={{ ...inputStyle, flex: "1", fontSize: "0.875rem"  }}
                                  />
                                </div>
                              ))}

                              {/* Add Time Slot Button */}
                              {avail.timeSlots.length === 0 && (
                                <button onClick={() => handleAddTimeSlot(avail.day)}
                                  style={{ color: colors.navy, backgroundColor: "transparent", border: `1px dashed ${colors.navy}`, borderRadius: "0.375rem",
                                    padding: "0.4rem 0.75rem",  cursor: "pointer", fontSize: "0.75rem",  fontWeight: "600",
                                    display: "flex", alignItems: "center", gap: "0.4rem", width: "100%", justifyContent: "center" }} >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                  </svg> Add Time
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Dropdown to select a new day */}
                          <div style={{ marginTop: "0.5rem" }}>
                            <label htmlFor="newDay"
                              style={{ display: "block", fontSize: "0.75rem",  fontWeight: "500", color: colors.darkText,
                                marginBottom: "0.25rem" }} > Add Day
                            </label>
                            <select id="newDay" value={selectedDay || ""}
                              style={{ ...inputStyle, display: "block", width: "100%", fontSize: "0.875rem" // Smaller font
                              }}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleAddDay(e.target.value);
                                }
                              }}
                            >
                              <option value="">Select</option>
                              {daysOfWeek
                                .filter(day => !editDoctor.availability.some(avail => avail.day === day))
                                .map((day) => (
                                  <option key={day} value={day}>
                                    {day}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          {doctor.availability.map((avail) => (
                            <div key={avail.day} style={{ marginBottom: "0.25rem" }}>
                              <div style={{ fontWeight: "600", color: colors.navy, marginBottom: "0.1rem", fontSize: "0.875rem"  }}>
                                {avail.day}
                              </div>
                              {avail.timeSlots.map((slot, idx) => (
                                <div
                                  key={idx}
                                  style={{ fontSize: "0.8rem",  color: colors.lightText, padding: "0.15rem 0" // Reduced padding
                                  }}
                                >
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: "0.75rem", whiteSpace: "nowrap", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem"  }}>
                        {editDoctor && editDoctor._id === doctor._id ? (
                          <button
                            onClick={handleUpdateDoctor}
                            style={{
                              ...buttonStyle(colors.navy),
                              padding: "0.4rem 0.75rem", // Reduced padding
                              fontSize: "0.75rem" // Smaller font
                            }}
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(doctor)}
                            style={actionButtonStyle(colors.navy, `${colors.navy}15`)} title="Edit" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
                              stroke="currentColor" >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteDoctor(doctor._id, doctor.fName)}
                          style={actionButtonStyle(colors.red, `${colors.red}15`)} // Using palette red
                          title="Delete" >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDisForm;