import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import inventory6 from "../../assets/inventory_images/inventory6.jpg";
import Swal from "sweetalert2";


const InventoryForm = () => {
    const [medicineName, setMedicineName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [supplier, setSupplier] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

 
    // Category options
    const categoryOptions = [
        { value: 'Antibiotics', label: 'Antibiotics' },
        { value: 'Painkillers', label: 'Painkillers' },
        { value: 'Vitamins', label: 'Vitamins' },
        { value: 'Cardiovascular', label: 'Cardiovascular' },
        { value: 'Respiratory', label: 'Respiratory' },
        { value: 'Gastrointestinal', label: 'Gastrointestinal' }
    ];

    // Supplier options
    const supplierOptions = [
        { value: 'Pharma Inc.', label: 'Pharma Inc.' },
        { value: 'MediSupply', label: 'MediSupply' },
        { value: 'HealthLife', label: 'HealthLife' },
        { value: 'Global Meds', label: 'Global Meds' },
        { value: 'Local Distributors', label: 'Local Distributors' }
    ];

    // Minimum date should be current date
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zero if month or day is less than 10
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };

    const validatePrice = (value) => {
        // Allow only numbers with up to 2 decimal places
        return /^\d+(\.\d{0,2})?$/.test(value) || value === '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirm before adding inventory if all details match
        try {
            // Check for existing inventory with same medicine, price, and expiry date
            const checkResponse = await axios.get('http://localhost:5000/inventory/checkin', {
                params: {
                    medicineName,
                    price: parseFloat(price),
                    expiryDate
                }
            });

            if (checkResponse.data.exists) {
                // Show confirmation dialog
                const result = await Swal.fire({
                    title: 'Duplicate Medicine Detected',
                    text: 'A similar medicine already exists. Do you want to add to the existing quantity?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, update quantity!'
                });

                if (!result.isConfirmed) {
                    return; // Stop if user cancels
                }
            }

            // Prepare medicine data
            const newMedicine = {
                medicineName,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                expiryDate,
                supplier
            };

            // Submit to backend
            const response = await axios.post(`http://localhost:5000/inventory/addin`, newMedicine);

            // Success handling
            toast.success(response.data.message);
            
            Swal.fire({
                icon: 'success',
                title: 'Inventory Updated',
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500
            });

            // Reset form and navigate
            resetForm();
            navigate('/inventoryDetails');

        } catch (err) {
            // Error handling
            let errorMessage = "Failed to add to inventory. Please try again.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }

            toast.error(errorMessage);
            setError(errorMessage);

            Swal.fire({
                icon: 'error',
                title: 'Inventory Update Failed',
                text: errorMessage,
                showConfirmButton: true
            });
        }
    };
    
    const resetForm = () => {
        setMedicineName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setExpiryDate('');
        setSupplier('');
        setError(null);
    };

    return (
                <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center p-4 " 
            style={{
                backgroundImage: `url(${inventory6})`, // Corrected template literal
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
                
            }}
        >
            <div className="absolute inset-0  bg-opacity-50 backdrop-blur"></div>

            <div className="relative bg-white bg-opacity-95 rounded-lg shadow-2xl p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Pharmacy Inventory Management
                </h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Medicine Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medicine Name
                        </label>
                        <input
                            type="text"
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter medicine name"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select category</option>
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (LKR)
                        </label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (validatePrice(value)) {
                                    setPrice(value);
                                }
                            }}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity
                        </label>
                        <input
                            
                            type="number"
                            id = "quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter quantity"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            id = "eDate"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                            min={getCurrentDate()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Supplier */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier
                        </label>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>Select supplier</option>
                            {supplierOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="w-1/2 bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Add to Inventory
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default InventoryForm;
