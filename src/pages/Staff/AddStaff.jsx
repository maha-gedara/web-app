import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Users, UserPlus, DollarSign, FileText, Home } from "lucide-react";
import Swal from "sweetalert2";

const StaffSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#1d3a76] text-white flex flex-col p-6 shadow-lg fixed">
      <h2 className="text-2xl font-extrabold mb-8 text-center">Mediz Staff</h2>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all text-lg font-medium hover:bg-[#c92c41] ${
              isActive ? "bg-[#c92c41] shadow-md" : ""
            }`
          }
        >
          <Home size={24} />
          Home
        </NavLink>
        <NavLink
          to="/staffdetails"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all text-lg font-medium hover:bg-[#c92c41] ${
              isActive ? "bg-[#c92c41] shadow-md" : ""
            }`
          }
        >
          <Users size={24} />
          Staff List
        </NavLink>
        <NavLink
          to="/AddStaff"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all text-lg font-medium hover:bg-[#c92c41] ${
              isActive ? "bg-[#c92c41] shadow-md" : ""
            }`
          }
        >
          <UserPlus size={24} />
          Add Staff
        </NavLink>
        <NavLink
          to="/AssignSalary"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all text-lg font-medium hover:bg-[#c92c41] ${
              isActive ? "bg-[#c92c41] shadow-md" : ""
            }`
          }
        >
          <DollarSign size={24} />
          Assign Salary
        </NavLink>
        <NavLink
          to="/SalaryDetails"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all text-lg font-medium hover:bg-[#c92c41] ${
              isActive ? "bg-[#c92c41] shadow-md" : ""
            }`
          }
        >
          <FileText size={24} />
          Salary Details
        </NavLink>
      </nav>
    </div>
  );
};

const AddStaff = () => {
  const [staff, setStaff] = useState({
    employeeID: "",
    name: "",
    age: "",
    gender: "",
    nic: "",
    email: "",
    address: "",
    jobtype: "",
  });

  const handleChange = (e) => {
    setStaff({ ...staff, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/StaffMember/add", staff);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Staff member added successfully!",
      });
      setStaff({
        employeeID: "",
        name: "",
        age: "",
        gender: "",
        nic: "",
        email: "",
        address: "",
        jobtype: "",
      });
    } catch (error) {
      console.error("Error adding staff member:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add staff member.",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="md:ml-64 w-full p-10 bg-[#f2f2f2] min-h-screen flex justify-center items-center">
        <div className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-md">
          <h2 className="text-3xl font-semibold mb-6 text-center text-[#1d3a76]">
            Add Staff Member
          </h2>

          {/* Staff Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <label className="block text-sm font-medium text-[#1d3a76]">Employee ID</label>
              <input
                type="text"
                name="employeeID"
                value={staff.employeeID}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Name</label>
              <input
                type="text"
                name="name"
                value={staff.name}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Age</label>
              <input
                type="number"
                name="age"
                value={staff.age}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Gender</label>
              <select
                name="gender"
                value={staff.gender}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-[#1d3a76]">NIC</label>
              <input
                type="text"
                name="nic"
                value={staff.nic}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Email</label>
              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Address</label>
              <input
                type="text"
                name="address"
                value={staff.address}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />

              <label className="block text-sm font-medium text-[#1d3a76] mt-4">Job Type</label>
              <input
                type="text"
                name="jobtype"
                value={staff.jobtype}
                onChange={handleChange}
                className="mt-1 p-3 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
                required
              />
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-center">
              <button type="submit" className="w-full md:w-1/2 bg-[#c92c41] text-white py-3 rounded-md font-semibold hover:bg-[#a7a8aa] transition-all">
                Add Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
