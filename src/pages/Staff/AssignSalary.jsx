import { useState } from "react";
import axios from "axios";
import StaffSidebar from "../../components/staff/StaffSidebar";
import Swal from "sweetalert2";

const AssignSalary = () => {
  const [formData, setFormData] = useState({
    employeeID: "",
    name: "",
    salary: "",
    month: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { employeeID, name, salary, month } = formData;
    if (!employeeID || !name || !salary || !month) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "All fields are required!",
      });
      return false;
    }
    if (isNaN(salary) || salary <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid Salary",
        text: "Salary must be a positive number!",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:5000/Salary/add", formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: response.data,
      });
      setFormData({ employeeID: "", name: "", salary: "", month: "" });
    } catch (error) {
      console.error("Error adding salary:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to assign salary",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f2f2f2]">
      {/* Sidebar Section */}
      <StaffSidebar />

      {/* Main Content Section */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-[#1d3a76] mb-6 text-center">Assign Salary</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Employee ID */}
            <div>
              <label className="block text-[#1d3a76] font-medium">Employee ID</label>
              <input
                type="text"
                name="employeeID"
                placeholder="Enter Employee ID"
                value={formData.employeeID}
                onChange={handleChange}
                className="w-full p-3 border border-[#a7a8aa] rounded-lg focus:ring focus:ring-[#1d3a76]"
                required
              />
            </div>

            {/* Employee Name */}
            <div>
              <label className="block text-[#1d3a76] font-medium">Employee Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter Employee Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-[#a7a8aa] rounded-lg focus:ring focus:ring-[#1d3a76]"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-[#1d3a76] font-medium">Salary Amount</label>
              <input
                type="number"
                name="salary"
                placeholder="Enter Salary Amount"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-3 border border-[#a7a8aa] rounded-lg focus:ring focus:ring-[#1d3a76]"
                required
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-[#1d3a76] font-medium">Month</label>
              <input
                type="text"
                name="month"
                placeholder="Enter Month"
                value={formData.month}
                onChange={handleChange}
                className="w-full p-3 border border-[#a7a8aa] rounded-lg focus:ring focus:ring-[#1d3a76]"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#c92c41] text-white p-3 rounded-lg font-semibold hover:bg-[#a72a35] transition duration-300"
            >
              Assign Salary
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignSalary;
