import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const Payments = () => {
  const { userData, token, backendUrl, getProfileData } =
    useContext(AppContext);

  const initPayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Postura Gym",
      description: "Membership Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/payment/verify`,
            response,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          if (data.success) {
            toast.success("Payment Successful!");
            getProfileData();
          } else {
            toast.error("Payment Verification Failed");
          }
        } catch (error) {
          console.log(error);
          toast.error("Payment Verification Error");
        }
      },
      prefill: {
        name: userData?.name,
        email: userData?.email,
        contact: userData?.phone,
      },
      theme: {
        color: "#166534",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    try {
      
      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { amount: 500 }, 
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        initPayment(data.order);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating payment order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Membership Payments
        </h2>

        {userData?.paymentStatus === "Paid" ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-green-200">
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Membership Active
            </h3>
            <p className="text-gray-600 mb-6">
              You have successfully paid your membership fees for this month.
            </p>
            <div className="bg-green-50 rounded-lg p-4 inline-block text-left">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(userData.paymentDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-red-50 p-6 border-b border-red-100">
              <div className="flex items-center gap-4">
                <FaExclamationCircle className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-xl font-bold text-red-700">
                    Payment Pending
                  </h3>
                  <p className="text-red-600">
                    Your membership fees for this month are due.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <span className="text-gray-600 text-lg">Monthly Fee</span>
                <span className="text-2xl font-bold text-gray-900">₹500</span>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
