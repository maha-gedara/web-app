import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import StaffSidebar from "../../components/staff/StaffSidebar";

const SalaryDetails = () => {
  const [salaries, setSalaries] = useState([]);
  const [editingSalary, setEditingSalary] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    employeeID: "",
    name: "",
    salary: "",
    month: "",
  });

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get("http://localhost:5000/Salary");
      setSalaries(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch salary details", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c92c41",
      cancelButtonColor: "#a7a8aa",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/Salary/delete/${id}`);
          setSalaries(salaries.filter((salary) => salary._id !== id));
          Swal.fire("Deleted!", "Salary record has been removed.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete salary record", "error");
        }
      }
    });
  };

  const handleEdit = (salary) => {
    setEditingSalary(salary._id);
    setFormData({
      employeeID: salary.employeeID,
      name: salary.name,
      salary: salary.salary,
      month: salary.month,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.employeeID || !formData.name || !formData.salary || !formData.month) {
      Swal.fire("Warning", "All fields are required!", "warning");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/Salary/update/${editingSalary}`, formData);
      fetchSalaries();
      setEditingSalary(null);
      setFormData({ employeeID: "", name: "", salary: "", month: "" });
      Swal.fire("Updated!", "Salary record has been updated.", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update salary record", "error");
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Salary Report", 14, 15);

    const tableColumn = ["Employee ID", "Name", "Salary", "Month"];
    const tableRows = [];

    salaries.forEach((salary) => {
      const salaryData = [salary.employeeID, salary.name, salary.salary, salary.month];
      tableRows.push(salaryData);
    });

    autoTable(doc, { 
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save("Salary_Report.pdf");
  };

  const filteredSalaries = salaries.filter(
    (salary) =>
      salary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salary.employeeID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="md:ml-64 w-full p-6 bg-[#f2f2f2] min-h-screen">
        <h2 className="text-3xl font-bold text-[#1d3a76] text-center mb-6">Salary Details</h2>

        {/* Search Box */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by Employee ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 border border-[#d3d4d6] rounded-lg focus:ring focus:ring-[#c92c41] shadow-sm"
          />
          <button 
            onClick={generatePDF} 
            className="bg-[#c92c41] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a7a8aa] transition duration-300"
          >
            Download Report
          </button>
        </div>

        {/* Editing Form */}
        {editingSalary && (
          <form onSubmit={handleUpdate} className="mb-4 p-4 bg-white shadow-lg rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="employeeID"
                value={formData.employeeID}
                onChange={(e) => setFormData({ ...formData, employeeID: e.target.value })}
                className="w-full p-3 border border-[#d3d4d6] rounded-md"
                required
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-[#d3d4d6] rounded-md"
                required
              />
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full p-3 border border-[#d3d4d6] rounded-md"
                required
              />
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                className="w-full p-3 border border-[#d3d4d6] rounded-md"
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#1d3a76] text-white p-3 rounded-md mt-4 font-semibold">
              Update Salary
            </button>
          </form>
        )}

        {/* Salary Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-lg bg-white rounded-md">
            <thead>
              <tr className="bg-[#1d3a76] text-white">
                <th className="p-3 text-left">Employee ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Salary</th>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((salary) => (
                  <tr key={salary._id} className="hover:bg-[#d3d4d6] transition duration-200">
                    <td className="p-3 border">{salary.employeeID}</td>
                    <td className="p-3 border">{salary.name}</td>
                    <td className="p-3 border">{salary.salary}</td>
                    <td className="p-3 border">{salary.month}</td>
                    <td className="p-3 border flex gap-2">
                      <button onClick={() => handleEdit(salary)} className="bg-[#1d3a76] text-white px-3 py-1 rounded-lg">Edit</button>
                      <button onClick={() => handleDelete(salary._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-3 text-center">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
