import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "axios";
import Swal from "sweetalert2";


export default function AllInventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]); // New state for filtered results
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    price: "",
    quantity: "",
    expiryDate: "",
    supplier: ""
  });


  // Predefined options for dropdowns
  const CATEGORY_OPTIONS = [
    "Gastrointestinal",
    "Respiratory", 
    "Cardiovascular", 
    "Vitamins", 
    "Painkillers", 
    "Antibiotics"
  ];

  const SUPPLIER_OPTIONS = [
    "Local Distributors",
    "Global Meds", 
    "HealthLife", 
    "MediSupply", 
    "Pharma Inc"
  ];

  useEffect(() => {
    axios
      .get(`http://localhost:5000/inventory/in`)
      .then((response) => {
        const inventoryData = response.data;
        setInventory(inventoryData);
        setFilteredInventory(inventoryData); // Initialize filtered inventory with all items
        
        // Identify low stock items
        const lowStock = inventoryData.filter(item => item.quantity < 25);
        setLowStockItems(lowStock);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      });
  }, []);

  // New effect to handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredInventory(inventory); // Show all items when search is empty
    } else {
      const searchResults = inventory.filter(item => 
        item.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(searchResults);
    }
  }, [searchTerm, inventory]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/inventory/deletein/${id}`)
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this medicine?  ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
  })
      .then(() => {
        const updatedInventory = inventory.filter(item => item._id !== id);
        setInventory(updatedInventory);
        setFilteredInventory(updatedInventory); // Update filtered inventory too

        Swal.fire({
          icon: 'success',
          title: 'Inventory Deleted',
          showConfirmButton: false
          
      });
        
        // Update low stock items
        const updatedLowStock = updatedInventory.filter(item => item.quantity < 25);
        setLowStockItems(updatedLowStock);
      })
      .catch(error => console.error("Error deleting inventory:", error));
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setFormData({ 
      ...item, 
      expiryDate: item.expiryDate.split('T')[0],
      price: item.price.toString(),
      quantity: item.quantity.toString()
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/inventory/updatein/${editingItem}`, formData)
      .then(() => {
        const updatedInventory = inventory.map(item => 
          item._id === editingItem ? { ...item, ...formData } : item
        );
        setInventory(updatedInventory);
        setFilteredInventory(updatedInventory); // Update filtered inventory too
        
        // Update low stock items
        const updatedLowStock = updatedInventory.filter(item => item.quantity < 25);
        setLowStockItems(updatedLowStock);
        
        setEditingItem(null);

        Swal.fire({
          icon: 'success',
          title: 'Inventory Updated',
          showConfirmButton: false
          
      });
      })
      .catch(error => console.error("Error updating inventory:", error));
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  // Update to use filteredInventory instead of inventory
  const groupedInventory = filteredInventory.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="bg-gradient-to-br from-red-200 via-white to-blue-200 p-6 min-h-screen">
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-xl relative">
      
      
      
      {/* Attractive Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-red-500 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-3xl font-bold text-white text-center">
          Inventory Management
        </h2>
        <div className="w-24 h-1 bg-white mx-auto mt-2 mb-3 rounded-full"></div>
        <p className="text-white text-center text-lg">Efficiently manage your pharmacy's medicine stock</p>
      </div>

      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center space-x-4">
        
          <div>
            <h3 className="text-lg font-semibold text-red-700">Low Stock Alert!</h3>
            <p className="text-red-600">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below 25 in stock
            </p>
            <ul className="text-red-500 text-sm mt-2 space-y-1 ">
              {lowStockItems.map(item => (
                <li key={item._id} className="flex items-center">
                  <span className="mr-3">•</span>
                  {item.medicineName} - Current Stock: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Add Search Bar */}
      <div className="mb-6">
        <div className="relative drop-shadow-md">
          <input
            type="text"
            placeholder="Search medicine by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-4 pl-12 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all duration-300"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
              title="Clear search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Edit Form */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-blur">
          <form 
            className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-lg relative"
            onSubmit={handleUpdate}
          >
            <button 
              type="button"
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">Update Inventory Item</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Medicine Name</label>
                <input 
                  name="medicineName" 
                  value={formData.medicineName} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                >
                  {CATEGORY_OPTIONS.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Price (LKR)</label>
                <input 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Quantity</label>
                <input 
                  name="quantity" 
                  type="number" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Expiry Date</label>
                <input 
                  name="expiryDate" 
                  type="date" 
                  value={formData.expiryDate} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Supplier</label>
                <select 
                  name="supplier" 
                  value={formData.supplier} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required 
                >
                  {SUPPLIER_OPTIONS.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-center space-x-4">
              <button 
                type="submit" 
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                Save Changes
              </button>
              <button 
                type="button"
                onClick={() => setEditingItem(null)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Rest of the component remains the same */}
      <div className={`${editingItem ? 'filter blur-sm pointer-events-none' : ''}`}>
        {/* Loading and Empty State (updated) */}
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? `No medicines matching "${searchTerm}"` : "No inventory items available."}
            </p>
            {searchTerm && (
              <div className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          // Inventory Table (using filteredInventory now)
          Object.keys(groupedInventory).map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-xl font-bold mb-2 text-blue-600">{category}</h3>
              <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg table-fixed">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-left">Medicine Name</th>
                      <th className="py-3 px-4 text-left">Price</th>
                      <th className="py-3 px-4 text-left">Quantity</th>
                      <th className="py-3 px-4 text-left">Expiry Date</th>
                      <th className="py-3 px-4 text-left">Supplier</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedInventory[category].map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.medicineName}</td>
                        <td className="py-3 px-4">LKR {item.price}</td>
                        <td className="py-3 px-4">
                          {item.quantity}
                          {item.quantity < 25 && (
                            <span className="ml-2 inline-block w-5 h-5 bg-red-500 rounded-full animate-pulse"></span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">{item.supplier}</td>
                        <td className="py-3 px-4 flex space-x-2">
                          <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() => handleEdit(item)}
                          >
                            Update
                          </button>
                          <button 
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
        {/* Back to Home Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/parmacyhome")}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Back to Home
        </button>
      </div>
      </div>
    </div>
    </div>
  );
}