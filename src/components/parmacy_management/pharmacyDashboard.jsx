import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-red-100 via-black-500 to-blue-100 p-6">
      <div className=" text-blue-900 text-center p-6 w-full rounded-lg shadow-lg  ">
        <h1 className="text-5xl font-bold ">Pharmacy Management System</h1>
        <p className="text-3xl font-bold mt-10 ">WELCOME BACK!</p>
      </div>

      <div className="grid grid-cols-2 gap-20 mt-20 ">
        <NavCard link="/inventory" color="bg-gradient-to-br from-red-800 via-blue-800 to-purple-800 w-60 h-40 "  text="Add Medicine" icon="💊" />
        <NavCard link="/inventoryDetails" color="bg-gradient-to-br from-red-800 via-blue-800 to-purple-800 w-60 h-40" text="Medicine List" icon="💊📝" />
        <NavCard link="/billing" color="bg-gradient-to-br from-red-800 via-blue-800 to-purple-800 w-60 h-40" text="Add Bill" icon="💵" />
        <NavCard link="/billingDetails" color="bg-gradient-to-br from-red-800 via-blue-800 to-purple-800 w-60 h-40" text="Bill Reports" icon="💵📝" />
      </div>
    </div>
  );
}

const NavCard = ({ link, color, text, icon }) => {
  return (
    <Link
      to={link}
      className={`${color} p-6 text-white font-semibold text-center rounded-lg w-48 flex flex-col items-center shadow-lg hover:scale-105 transition-transform hover:bg-gradient-to-r hover:from-red-500 hover:via-blue-500 hover:to-purple-500`}
    >
      <span className="text-4xl">{icon}</span>
      <p className="mt-2">{text}</p>
    </Link>
  );
};

export default Dashboard;
