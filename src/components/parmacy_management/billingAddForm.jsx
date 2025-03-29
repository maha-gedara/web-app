import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Save } from "lucide-react";
import inventory5 from "../../assets/inventory_images/inventory5.jpg";

const BillingForm = () => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [medicines, setMedicines] = useState([{ medName: '', quantity: '', price: '' }]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState(null);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setDate(currentDate);

        // Fetch inventory to validate stock
        axios.get('http://localhost:5000/inventory/in')
            .then(response => {
                setInventoryItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching inventory:", error);
                toast.error("Could not fetch inventory data");
            });
    }, []);

    const handleMedicineNameChange = (index, value) => {
        const newMedicines = [...medicines];
        newMedicines[index].medName = value;
        setMedicines(newMedicines);

        // Filter inventory items based on input
        if (value) {
            const filtered = inventoryItems.filter(item => 
                item.medicineName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMedicines(filtered);
        } else {
            setFilteredMedicines([]);
        }
    };

    // Select medicine from autocomplete
    const selectMedicine = (index, medicine) => {
        const newMedicines = [...medicines];
        newMedicines[index].medName = medicine.medicineName;
        newMedicines[index].price = medicine.price.toString();
        setMedicines(newMedicines);
        setFilteredMedicines([]); // Clear filtered list
    };

    // Validate stock before submission
    const validateStock = () => {
        for (let medicine of medicines) {
            const inventoryItem = inventoryItems.find(
                item => item.medicineName === medicine.medName
            );

            if (!inventoryItem) {
                setError(`Medicine ${medicine.medName} not found in inventory`);
                return false;
            }

            const requestedQuantity = parseInt(medicine.quantity);
            if (requestedQuantity > inventoryItem.quantity) {
                setError(`Insufficient stock for ${medicine.medName}. Available: ${inventoryItem.quantity}`);
                return false;
            }
        }
        return true;
    };

    const handleAddMedicine = () => {
        setMedicines([...medicines, { medName: '', quantity: '', price: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const newMedicines = [...medicines];
        newMedicines.splice(index, 1);
        setMedicines(newMedicines);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const calculateTotal = () => {
        // If no medicines are added or medicines are empty, return 0.00
        if (medicines.length === 0 || medicines.every(med => !med.medName)) {
            return "0.00";
        }

        // Calculate total only for medicines with valid quantity and price
        return medicines.reduce((total, med) => {
            // Only calculate if both quantity and price are valid numbers
            const quantity = parseFloat(med.quantity) || 0;
            const price = parseFloat(med.price) || 0;
            return total + (quantity * price);
        }, 0).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const stockValidation = validateStock();
        if (!stockValidation) return;

        const newBilling = {
            customerName,
            medicines,
            paymentMethod,
            date,
            total: calculateTotal()
        };

        axios.post(`http://localhost:5000/billing/addbi`, newBilling)
            .then(() => {
                toast.success('Billing added successfully');
                navigate('/billingDetails');
            })
            .catch((err) => {
                let errorMessage = "Failed to add billing. Please try again.";
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                toast.error(errorMessage);
                setError(errorMessage);
            });
    };

    const resetForm = () => {
        setCustomerName('');
        setMedicines([{ medName: '', quantity: '', price: '' }]);
        setPaymentMethod('');
        const currentDate = new Date().toISOString().split('T')[0];
        setDate(currentDate);
        setError(null);
    };

    return (
        <div 
            className="min-h-screen flex justify-center items-center p-4 relative bg-cover bg-center bg-no-repeat" 
            style={{
                backgroundImage: `url(${inventory5})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Blurred overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-200">
                    <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
                        Create New Billing Entry
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Name */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter customer name"
                            />
                        </div>

                        {/* Medicines Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-blue-700">Medicines</h2>
                            {medicines.map((medicine, index) => (
                                <div key={index} className="relative">
                                    <div className="flex space-x-3 items-center">
                                        <div className="w-1/3 relative">
                                            <input
                                                type="text"
                                                value={medicine.medName}
                                                onChange={(e) => handleMedicineNameChange(index, e.target.value)}
                                                required
                                                placeholder="Medicine Name"
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                            {/* Autocomplete Dropdown */}
                                            {filteredMedicines.length > 0 && (
                                                <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                                    {filteredMedicines.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            onClick={() => selectMedicine(index, item)}
                                                            className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                                        >
                                                            {item.medicineName} - ${item.price}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="number"
                                            value={medicine.quantity}
                                            onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                                            required
                                            min="1"
                                            placeholder="Quantity"
                                            className="w-1/3 px-3 py-2 border rounded-lg"
                                        />
                                        <input
                                            type="number"
                                            value={medicine.price}
                                            onChange={(e) => handleMedicineChange(index, 'price', e.target.value)}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="Price"
                                            className="w-1/3 px-3 py-2 border rounded-lg"
                                        />
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedicine(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddMedicine}
                                className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                            >
                                <PlusCircle className="mr-2" /> Add More Medicines
                            </button>
                        </div>

                        {/* Total Amount Display */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <span className="font-semibold text-blue-800">Total Amount: </span>
                            <span className="text-xl font-bold text-green-600">LKR{calculateTotal()}</span>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Cash">Cash</option>
                                <option value="Debit">Debit Card</option>
                                <option value="Credit">Credit Card</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-blue-700 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-1/2 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
                            >
                                <Trash2 className="mr-2" /> Reset
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                            >
                                <Save className="mr-2" /> Save Billing
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm mt-2 text-center bg-red-50 p-2 rounded-lg">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BillingForm;