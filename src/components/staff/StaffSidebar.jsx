import { NavLink } from "react-router-dom";
import { Users, UserPlus, DollarSign, FileText, Home } from "lucide-react";

const StaffSidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#1d3a76] text-white flex flex-col p-6 shadow-lg fixed">
      <h2 className="text-2xl font-extrabold mb-8 text-center">Mediz Staff</h2>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/HomePage"
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

export default StaffSidebar;
