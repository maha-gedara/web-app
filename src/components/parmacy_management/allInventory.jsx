import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import axios from "axios";
import Swal from "sweetalert2";


export default function AllInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const navigate = useNavigate();  // Initialize useNavigate

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
      .get("http://localhost:5000/inventory/in")
      .then((response) => {
        const inventoryData = response.data;
        setInventory(inventoryData);
        
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

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/inventory/deletein/${id}`)
      .then(() => {
        const updatedInventory = inventory.filter(item => item._id !== id);
        setInventory(updatedInventory);

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

  const groupedInventory = inventory.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  



  return (
    <div className="bg-gradient-to-br from-red-200 via-black-700 to-blue-200 p-6">
    <div className="p-6 max-w-6xl mx-auto bg-gray-100 relative">
      
      {/* Low Stock Alert Section */}
      {lowStockItems.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center space-x-4">
        
          <div>
            <h3 className="text-lg font-semibold text-red-700">Low Stock Alert!</h3>
            <p className="text-red-600">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below 25 in stock
            </p>
            <ul className="text-red-500 text-sm mt-2 space-y-1">
              {lowStockItems.map(item => (
                <li key={item._id} className="flex items-center">
                  <span className="mr-2">•</span>
                  {item.medicineName} - Current Stock: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-semibold mb-4">Inventory Management</h2>
      
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
        {/* Loading and Empty State (unchanged) */}
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-600">No inventory items found.</p>
          </div>
        ) : (
          // Inventory Table (unchanged)
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
          onClick={() => navigate("/parmacyhome")}  // Navigate to home page
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