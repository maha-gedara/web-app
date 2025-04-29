import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Save, X, Printer } from 'lucide-react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AllBills = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBilling, setEditBilling] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    paymentMethod: "",
    medicines: [],
    totalAmount: 0,
  });
  const [previousTotal, setPreviousTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState(null);
  

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/billing/bi");
      setBillings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch billing data',
      });
    }
  };

  const deleteBilling = async (id) => {
    try {
      // Show confirmation BEFORE deleting
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this receipt? ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No'
      });
  
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/billing/deletebi/${id}`);
        
        // Update UI
        setBillings(billings.filter((billing) => billing._id !== id));
  
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Bill Deleted',
          showConfirmButton: false,
          timer: 1500
        });
      }
  
    } catch (error) {
      console.error("Error deleting billing:", error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Unable to delete the bill',
      });
    }
  };
  

  const handleEdit = (billing) => {
    setEditBilling(billing._id);
    setPreviousTotal(billing.totalAmount);
    setFormData({
      customerName: billing.customerName,
      paymentMethod: billing.paymentMethod,
      medicines: billing.medicines,
      totalAmount: billing.totalAmount,
    });
    setIsModalOpen(true);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = formData.medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    const totalAmount = updatedMedicines.reduce(
      (sum, med) => sum + med.quantity * med.price,
      0
    );
    setFormData({ ...formData, medicines: updatedMedicines, totalAmount });
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medName: "", price: 0, quantity: 0 },
      ],
    });
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
    const totalAmount = updatedMedicines.reduce(
      (sum, med) => sum + med.quantity * med.price,
      0
    );
    setFormData({ 
      ...formData, 
      medicines: updatedMedicines, 
      totalAmount 
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/billing/upbi/${editBilling}`, formData);
      setBillings(billings.map((b) => (b._id === editBilling ? { ...b, ...formData } : b)));
      setIsModalOpen(false);
      setEditBilling(null);

      Swal.fire({
        icon: 'success',
        title: 'Bill Updated',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating billing:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update the bill',
      });
    }
  };

  const handlePrintReceipt = (billing) => {
    setReceiptToPrint(billing);
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const renderReceipt = () => {
    if (!receiptToPrint) return null;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    return (
      
      <div id="print-receipt" className="print-receipt hidden print:block p-6 bg-white">
        <div className="border-2 border-black p-6">
          <h1 className="text-3xl font-bold text-center mb-4">Pharmacy Receipt</h1>
          
          <div className="grid grid-cols-2 mb-4">
            <div>
              <p><strong>Customer Name:</strong> {receiptToPrint.customerName}</p>
              <p><strong>Payment Method:</strong> {receiptToPrint.paymentMethod}</p>
            </div>
            <div className="text-right">
              <p><strong>Date:</strong> {formattedDate}</p>
              <p><strong>Time:</strong> {formattedTime}</p>
            </div>
          </div>

          <table id="receipt-table" className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Medicine Name</th>
                <th className="border p-2 text-right">Price (LKR)</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Subtotal (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {receiptToPrint.medicines.map((med, index) => (
                <tr key={index} id={`receipt-item-${index}`}>
                  <td className="border p-2">{med.medName}</td>
                  <td className="border p-2 text-right">{med.price.toFixed(2)}</td>
                  <td className="border p-2 text-right">{med.quantity}</td>
                  <td className="border p-2 text-right">{(med.price * med.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right">
            <p id="receipt-total" className="text-xl font-bold">Total Amount: LKR {receiptToPrint.totalAmount.toFixed(2)}</p>
          </div>

          <div className="text-center mt-4 text-sm">
            <p>Thank you for your purchase!</p>
            <p>Pharmacy Management System</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="all-bills-container" className="relative">
    <div className="bg-gradient-to-br from-red-200 via-black-700 to-blue-200 p-6" >
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 id="page-title" className="text-3xl font-bold mb-6 text-center text-gray-800">
        Billing Management
      </h2>
      
      
      {loading ? (
        <div id="loading-spinner" className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
        </div>
      ) : (
        <div id="bills-table-container" className="overflow-x-auto shadow-md rounded-lg">
          <table id="bills-table" className="w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Total Amount (LKR)</th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((billing) => (
                <tr id={`bill-row-${billing._id}`} key={billing._id} className="border-b hover:bg-gray-100 transition-colors">
                  <td className="py-3 px-4">{billing.customerName}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    LKR {billing.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">{billing.paymentMethod}</td>
                  <td className="py-3 px-4">
                    {new Date(billing.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      id={`edit-bill-${billing._id}`}
                      onClick={() => handleEdit(billing)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      id={`delete-bill-${billing._id}`}
                      onClick={() => deleteBilling(billing._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      id={`print-bill-${billing._id}`}
                      onClick={() => handlePrintReceipt(billing)}
                      className="bg-green-500 text-white px-5 py-1 rounded hover:bg-green-600 transition-colors "
                    >
                      Print 
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div id="edit-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-whie bg-opacity-30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h3 id="modal-title" className="text-2xl font-bold">Edit Billing Details</h3>
              <button 
                id="close-modal-button"
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-blue-700 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div id="modal-content" className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <input
                    id="payment-method"
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payment method"
                  />
                </div>
              </div>

              <div id="medicines-section" className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Medicines</h4>
                  <button
                    id="add-medicine-button"
                    onClick={handleAddMedicine}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Medicine
                  </button>
                </div>

                {formData.medicines.map((med, index) => (
                  <div 
                    id={`medicine-item-${index}`}
                    key={index} 
                    className="bg-white p-4 rounded-lg mb-3 shadow-sm border border-gray-200"
                  >
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label htmlFor={`med-name-${index}`} className="block text-xs text-gray-600 mb-1">Medicine Name</label>
                        <input
                          id={`med-name-${index}`}
                          type="text"
                          value={med.medName}
                          onChange={(e) =>
                            handleMedicineChange(index, "medName", e.target.value)
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Medicine name"
                        />
                      </div>
                      <div>
                        <label htmlFor={`med-price-${index}`} className="block text-xs text-gray-600 mb-1">Price</label>
                        <input
                          id={`med-price-${index}`}
                          type="number"
                          value={med.price}
                          onChange={(e) =>
                            handleMedicineChange(index, "price", parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Price"
                        />
                      </div>
                      <div>
                        <label htmlFor={`med-quantity-${index}`} className="block text-xs text-gray-600 mb-1">Quantity</label>
                        <div className="flex items-center">
                          <input
                            id={`med-quantity-${index}`}
                            type="number"
                            value={med.quantity}
                            onChange={(e) =>
                              handleMedicineChange(index, "quantity", parseInt(e.target.value))
                            }
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Quantity"
                          />
                          <button
                            id={`remove-med-${index}`}
                            onClick={() => handleRemoveMedicine(index)}
                            className="ml-2 text-red-500 hover:bg-red-50 p-2 rounded-full"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div id="total-display" className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Previous Total</p>
                  <p id="previous-total" className="text-xl font-bold text-red-600">
                    LKR {previousTotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Updated Total</p>
                  <p id="updated-total" className="text-xl font-bold text-green-600">
                    LKR {formData.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  id="cancel-button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                >
                  <X size={16} className="mr-1" /> Cancel
                </button>
                <button
                  id="save-changes-button"
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Save size={16} className="mr-1" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home Button */}
      <div className="flex justify-center mt-6">
        <button
          id="back-to-home-button"
          onClick={() => navigate("/parmacyhome")}
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
        >
          Back to Home
        </button>
      </div>

      {/* Print Receipt Component */}
      {renderReceipt()}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-receipt, .print-receipt * {
            visibility: visible;
          }
          .print-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
    </div>
    </div>
  );
};

export default AllBills;