"use client";
import React, { useState } from "react";
import {MinusIcon, PlusIcon} from "lucide-react";
import {createStripeSingleTransactionCheckout} from "@/api/payment.api";

const AddCreditsCard = () => {
  const [credits, setCredits] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to handle the "Buy Now" button click
  const handleBuyCredits = async () => {
    // Prevent multiple clicks during the loading state
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = {
        creditSale:{
          credits,
          totalAmount: (credits / 1000) * 5
        }
      }
      const response = await createStripeSingleTransactionCheckout(formData)

      if (response.status === 200) {
        window.location.replace(response.data?.url);
      }
    } catch (err) {
      // Handle error
      setError(err.message || "An error occurred while processing the payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-800 p-6 rounded-lg flex flex-col justify-center items-center lg:min-w-80">
      <h3 className="text-gray-400 mb-4">Add Credits</h3>
      <div className="flex items-center space-x-4 mb-4">
        <button
          className="bg-red text-white p-2 rounded-full"
          onClick={() => setCredits((prev) => Math.max(0, prev - 1000))}
        >
          <MinusIcon size={16} />
        </button>
        <span className="text-3xl font-bold">{credits}</span>
        <button
          className="bg-red text-white p-2 rounded-full"
          onClick={() => setCredits((prev) => prev + 1000)}
        >
          <PlusIcon size={16} />
        </button>
      </div>
      <p className="text-gray-400 mb-4">Buy {credits} credits for</p>
      <div className="text-3xl font-bold text-red mb-4">
        ${(credits / 1000) * 5}
      </div>

      {/* Show loading state */}
      {loading && <p className="text-gray-400 mb-4">Processing your purchase...</p>}

      {/* Show success message */}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Show error message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        className="bg-red text-white py-2 px-6 rounded hover:bg-red-600"
        onClick={handleBuyCredits}
        disabled={loading} // Disable the button during the loading state
      >
        Buy Now
      </button>
    </div>
  );
};

export default AddCreditsCard;
