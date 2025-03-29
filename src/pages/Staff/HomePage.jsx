import StaffSidebar from "../../components/staff/StaffSidebar";
import { Users, DollarSign, FileText, Calendar } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex min-h-screen bg-[#f2f2f2]">
      {/* Sidebar - Fixed Width */}
      <div className="w-64">
        <StaffSidebar />
      </div>

      {/* Main Content - Takes Remaining Space */}
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-[#1d3a76] mb-6 text-center">
          Staff Management Dashboard
        </h1>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 border-l-4 border-[#1d3a76]">
            <Users size={40} className="text-[#1d3a76]" />
            <div>
              <p className="text-lg font-semibold text-[#a7a8aa]">Total Staff</p>
              <p className="text-2xl font-bold text-[#1d3a76]">120</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 border-l-4 border-[#c92c41]">
            <DollarSign size={40} className="text-[#c92c41]" />
            <div>
              <p className="text-lg font-semibold text-[#a7a8aa]">Total Salary Paid</p>
              <p className="text-2xl font-bold text-[#c92c41]">$50,000</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4 border-l-4 border-[#a7a8aa]">
            <FileText size={40} className="text-[#a7a8aa]" />
            <div>
              <p className="text-lg font-semibold text-[#a7a8aa]">Pending Salaries</p>
              <p className="text-2xl font-bold text-[#1d3a76]">15</p>
            </div>
          </div>
        </div>

        {/* Upcoming Salary Payments - Responsive Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-[#1d3a76] mb-4">Upcoming Salary Payments</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#d3d4d6]">
              <thead>
                <tr className="bg-[#d3d4d6]">
                  <th className="border p-2 text-left">Employee ID</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Amount</th>
                  <th className="border p-2 text-left">Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[#f2f2f2]">
                  <td className="border p-2">EMP001</td>
                  <td className="border p-2">John Doe</td>
                  <td className="border p-2">$3,500</td>
                  <td className="border p-2">April 5, 2025</td>
                </tr>
                <tr className="hover:bg-[#f2f2f2]">
                  <td className="border p-2">EMP002</td>
                  <td className="border p-2">Sarah Smith</td>
                  <td className="border p-2">$4,000</td>
                  <td className="border p-2">April 10, 2025</td>
                </tr>
                <tr className="hover:bg-[#f2f2f2]">
                  <td className="border p-2">EMP003</td>
                  <td className="border p-2">David Johnson</td>
                  <td className="border p-2">$2,800</td>
                  <td className="border p-2">April 15, 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Staff Activity */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-[#1d3a76] mb-4">Recent Staff Activity</h2>
          <ul className="divide-y divide-[#d3d4d6]">
            <li className="p-3 flex items-center">
              <Calendar size={24} className="text-[#1d3a76] mr-4" />
              <p className="text-[#a7a8aa]">John Doe was added to the system on March 28, 2025</p>
            </li>
            <li className="p-3 flex items-center">
              <Calendar size={24} className="text-[#c92c41] mr-4" />
              <p className="text-[#a7a8aa]">Sarah Smith's salary of $4,000 was assigned for April</p>
            </li>
            <li className="p-3 flex items-center">
              <Calendar size={24} className="text-[#a7a8aa] mr-4" />
              <p className="text-[#a7a8aa]">David Johnson's salary was updated on March 25, 2025</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
