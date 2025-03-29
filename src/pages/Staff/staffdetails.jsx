import { useState, useEffect } from "react";
import axios from "axios";
import StaffSidebar from "../../components/staff/StaffSidebar";
import Swal from "sweetalert2";

const StaffDetails = () => {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    employeeID: "",
    name: "",
    age: "",
    gender: "",
    nic: "",
    email: "",
    address: "",
    jobtype: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    setFilteredStaff(
      staff.filter(
        (member) =>
          member.employeeID.includes(searchQuery) ||
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, staff]);

  const fetchStaff = async () => {
    try {
      const response = await axios.get("http://localhost:5000/StaffMember");
      setStaff(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c92c41",
      cancelButtonColor: "#a7a8aa",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/StaffMember/delete/${id}`);
          fetchStaff();
          Swal.fire("Deleted!", "Staff member has been removed.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete staff member.", "error");
        }
      }
    });
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember._id);
    setFormData(staffMember);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.employeeID || !formData.name || !formData.email || !formData.jobtype) {
      Swal.fire("Error!", "All fields are required!", "error");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/StaffMember/update/${editingStaff}`, formData);
      setEditingStaff(null);
      fetchStaff();
      Swal.fire("Success!", "Staff member updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to update staff member.", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-[#f2f2f2] md:ml-64">
        <h2 className="text-3xl font-bold text-[#1d3a76] mb-6 text-center">Staff Members</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search by Employee ID or Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-[#c92c41]"
        />

        {/* Staff Table */}
        {filteredStaff.length === 0 ? (
          <p className="text-gray-500 text-center">No staff members found.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-[#1d3a76] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Employee ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Job Type</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((member, index) => (
                  <tr key={member._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="py-3 px-4">{member.employeeID}</td>
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.email}</td>
                    <td className="py-3 px-4">{member.jobtype}</td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="bg-[#1d3a76] text-white px-3 py-1 rounded-md hover:bg-[#a7a8aa]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="bg-[#c92c41] text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Form */}
        {editingStaff && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-[#1d3a76] mb-4">Edit Staff Member</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <label className="block text-gray-700">Employee ID</label>
                <input
                  type="text"
                  name="employeeID"
                  value={formData.employeeID}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />

                <label className="block text-gray-700 mt-3">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>

              {/* Right Column */}
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />

                <label className="block text-gray-700 mt-3">Job Type</label>
                <input
                  type="text"
                  name="jobtype"
                  value={formData.jobtype}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2 flex justify-end">
                <button type="submit" className="bg-[#1d3a76] text-white px-4 py-2 rounded-md hover:bg-[#a7a8aa]">
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDetails;
