import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const DoctorAddForm = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist', 'Oncologist', 'Orthopedic',
    'Pediatrician', 'Psychiatrist', 'Radiologist', 'Surgeon', 'Urologist'
  ];

  const [formData, setFormData] = useState({
    fName: '',
    special: [],
    cNumber: '',
    email: '',
    availability: {
      Monday: { sTime: '', eTime: '' },
      Tuesday: { sTime: '', eTime: '' },
      Wednesday: { sTime: '', eTime: '' },
      Thursday: { sTime: '', eTime: '' },
      Friday: { sTime: '', eTime: '' },
      Saturday: { sTime: '', eTime: '' },
      Sunday: { sTime: '', eTime: '' },
    },
    days: [],
  });

  const [loading, setLoading] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [errorMessages, setErrorMessages] = useState({
    fName: '',
    cNumber: '',
    email: '',
    special: '',
    days: '',
    timeSlots: '',
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle time input for each day
  const handleTimeChange = (day, timeType, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [timeType]: value,
        },
      },
    }));
  };

  // Toggle days
  const handleDayToggle = (day) => {
    setFormData((prev) => {
      if (prev.days.includes(day)) {
        return {
          ...prev,
          days: prev.days.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          days: [...prev.days, day],
        };
      }
    });
  };

  // Add specialty to the list
  const addSpecialty = () => {
    const trimmedSpecialty = specialtyInput.trim();
    if (trimmedSpecialty && !formData.special.includes(trimmedSpecialty)) {
      setFormData({
        ...formData,
        special: [...formData.special, trimmedSpecialty],
      });
      setSpecialtyInput('');
      toast.success(`Specialty '${trimmedSpecialty}' added!`);
    } else {
      toast.error('Please enter a valid and unique specialty.');
    }
  };

  // Remove a specialty from the list
  const removeSpecialty = (specialty) => {
    setFormData({
      ...formData,
      special: formData.special.filter((s) => s !== specialty),
    });
    toast.success(`Specialty '${specialty}' removed!`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Build availability in the required format
    const availabilityData = daysOfWeek.map((day) => {
      if (formData.days.includes(day)) {
        const { sTime, eTime } = formData.availability[day];
        if (sTime && eTime) {
          return {
            day,
            timeSlots: [{ startTime: sTime, endTime: eTime }]
          };
        }
      }
      return null;
    }).filter(Boolean); // Remove null values
  
    // Basic validation for empty fields
    const newErrorMessages = {
      fName: '',
      cNumber: '',
      email: '',
      special: '',
      days: '',
      timeSlots: '',
    };
  
    if (!formData.fName) newErrorMessages.fName = 'Full Name is required.';
    if (!formData.cNumber) newErrorMessages.cNumber = 'Contact Number is required.';
    if (!formData.email) newErrorMessages.email = 'Email is required.';
    if (formData.special.length === 0) newErrorMessages.special = 'Specialization is required.';
    if (availabilityData.length === 0) newErrorMessages.days = 'At least one day must be selected.';
    if (availabilityData.some((slot) => !slot.timeSlots[0].startTime || !slot.timeSlots[0].endTime)) newErrorMessages.timeSlots = 'All selected days must have valid time slots.';
  
    setErrorMessages(newErrorMessages);
  
    if (Object.values(newErrorMessages).some((msg) => msg !== '')) {
      setLoading(false);
      return;
    }
  
    // Full Name Validation: Must have at least 2 words
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    if (!nameRegex.test(formData.fName)) {
      setErrorMessages((prev) => ({
        ...prev,
        fName: 'Full Name must contain at least a first and last name.',
      }));
      setLoading(false);
      return;
    }
  
    // Contact Number Validation: Only numbers and max 10 digits
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(formData.cNumber)) {
      setErrorMessages((prev) => ({
        ...prev,
        cNumber: 'Contact Number must be a valid 10-digit number.',
      }));
      setLoading(false);
      return;
    }
  
    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessages((prev) => ({
        ...prev,
        email: 'Please enter a valid email.',
      }));
      setLoading(false);
      return;
    }
  
    // Ensure at least one day and valid time are selected
    if (availabilityData.length === 0) {
      setErrorMessages((prev) => ({
        ...prev,
        days: 'Please select at least one available day with valid times.',
      }));
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/doctor/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          availability: availabilityData,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Doctor added successfully!');
        setFormData({
          fName: '',
          special: [],
          cNumber: '',
          email: '',
          availability: {
            Monday: { sTime: '', eTime: '' },
            Tuesday: { sTime: '', eTime: '' },
            Wednesday: { sTime: '', eTime: '' },
            Thursday: { sTime: '', eTime: '' },
            Friday: { sTime: '', eTime: '' },
            Saturday: { sTime: '', eTime: '' },
            Sunday: { sTime: '', eTime: '' },
          },
          days: [],
        });
      } else {
        toast.error(data.error || 'Failed to add doctor');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleClear = () => {
    setFormData({
      fName: '',
      special: [],
      cNumber: '',
      email: '',
      availability: {
        Monday: { sTime: '', eTime: '' },
        Tuesday: { sTime: '', eTime: '' },
        Wednesday: { sTime: '', eTime: '' },
        Thursday: { sTime: '', eTime: '' },
        Friday: { sTime: '', eTime: '' },
        Saturday: { sTime: '', eTime: '' },
        Sunday: { sTime: '', eTime: '' },
      },
      days: [],
    });
    setErrorMessages({
      fName: '',
      cNumber: '',
      email: '',
      special: '',
      days: '',
      timeSlots: '',
    });
    toast.success('Form cleared successfully!');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl border border-gray-200">
        <h2 className="text-3xl font-bold text-[#1A3B5C] mb-8 text-center uppercase tracking-wider">
          Add New Doctor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Full Name and Specialization */}
          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="fName" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fName"
                name="fName"
                value={formData.fName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#1A3B5C]/30 
                  transition duration-300 text-[#2C3E50]
                  ${errorMessages.fName 
                    ? 'border-[#C0392B] focus:border-[#C0392B]' 
                    : 'border-gray-300 focus:border-[#1A3B5C]'}`}
                placeholder="Enter Full Name"
                required
              />
              {errorMessages.fName && (
                <p className="text-[#C0392B] text-sm mt-1 font-medium">
                  {errorMessages.fName}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Specialization
              </label>
              <select
                name="special"
                value={formData.special}
                onChange={(e) => {
                  const selectedSpecialty = e.target.value;
                  if (selectedSpecialty && !formData.special.includes(selectedSpecialty)) {
                    setFormData({
                      ...formData,
                      special: [...formData.special, selectedSpecialty],
                    });
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#1A3B5C]/30 
                  transition duration-300 text-[#2C3E50]
                  ${errorMessages.special 
                    ? 'border-[#C0392B] focus:border-[#C0392B]' 
                    : 'border-gray-300 focus:border-[#1A3B5C]'}`}
                required
              >
                <option value="" disabled>Select Specialization</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
              {errorMessages.special && (
                <p className="text-[#C0392B] text-sm mt-1 font-medium">
                  {errorMessages.special}
                </p>
              )}
            </div>
          </div>

          {/* Contact Number and Email */}
          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="cNumber" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Contact Number
              </label>
              <input
                type="text"
                id="cNumber"
                name="cNumber"
                value={formData.cNumber}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/[^0-9]/g, '');
                  if (newValue.length <= 10) {
                    setFormData((prev) => ({ ...prev, cNumber: newValue }));
                  }
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#1A3B5C]/30 
                  transition duration-300 text-[#2C3E50]
                  ${errorMessages.cNumber 
                    ? 'border-[#C0392B] focus:border-[#C0392B]' 
                    : 'border-gray-300 focus:border-[#1A3B5C]'}`}
                placeholder="Enter Phone Number"
                maxLength="10"
                required
              />
              {errorMessages.cNumber && (
                <p className="text-[#C0392B] text-sm mt-1 font-medium">
                  {errorMessages.cNumber}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="email" className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-[#1A3B5C]/30 
                  transition duration-300 text-[#2C3E50]
                  ${errorMessages.email 
                    ? 'border-[#C0392B] focus:border-[#C0392B]' 
                    : 'border-gray-300 focus:border-[#1A3B5C]'}`}
                placeholder="Enter Email"
                required
              />
              {errorMessages.email && (
                <p className="text-[#C0392B] text-sm mt-1 font-medium">
                  {errorMessages.email}
                </p>
              )}
            </div>
          </div>

          {/* Available Days */}
            <div>
              <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                Available Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition duration-300 text-center 
                      ${formData.days.includes(day)
                        ? 'bg-[#1A3B5C] text-white border-[#1A3B5C]'
                        : 'bg-white text-[#2C3E50] border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errorMessages.days && <p className="text-[#C0392B] text-sm mt-1">{errorMessages.days}</p>}
            </div>



          {/* Time Slots for Each Day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {daysOfWeek.map((day) => (
              formData.days.includes(day) && (
                <div key={day} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-semibold text-[#2C3E50] mb-2">
                    {day} Time Slots
                  </label>

                  {/* Start Time Row */}
                  <div className="flex items-center mb-3">
                    <label htmlFor={`sTime-${day}`} className="text-sm text-[#2C3E50] mr-2 w-12">
                      From
                    </label>
                    <input
                      type="time"
                      id={`sTime-${day}`}
                      value={formData.availability[day]?.sTime || ''}
                      onChange={(e) => handleTimeChange(day, 'sTime', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg 
                        focus:outline-none focus:border-[#1A3B5C] focus:ring-2 focus:ring-[#1A3B5C]/30 
                        transition duration-300 text-[#2C3E50]"
                    />
                  </div>

                  {/* End Time Row */}
                  <div className="flex items-center">
                    <label htmlFor={`eTime-${day}`} className="text-sm text-[#2C3E50] mr-2 w-12">
                      To
                    </label>
                    <input
                      type="time"
                      id={`eTime-${day}`}
                      value={formData.availability[day]?.eTime || ''}
                      onChange={(e) => handleTimeChange(day, 'eTime', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg 
                        focus:outline-none focus:border-[#1A3B5C] focus:ring-2 focus:ring-[#1A3B5C]/30 
                        transition duration-300 text-[#2C3E50]"
                    />
                  </div>

                  {errorMessages.timeSlots && (
                    <p className="text-[#C0392B] text-sm mt-1 font-medium">
                      {errorMessages.timeSlots}
                    </p>
                  )}
                </div>
              )
            ))}
          </div>

         {/* Buttons */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-4 w-full max-w-[300px]">
              <button
                type="button"
                onClick={handleClear}
                className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg 
                  hover:bg-gray-500 transition duration-300"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A3B5C] text-white px-6 py-3 rounded-lg 
                  hover:bg-[#2C3E50] transition duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button
  type="button"
  onClick={handleClear}
  className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg 
    hover:bg-gray-500 transition duration-300"
>
  <Link to="/disdoctors" className="w-full text-white">
    Back
  </Link>
</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorAddForm;
