import React from "react";

// Success Dialog Component
const NoTokenDialog = ({ open, onClose }) => {
  if (!open) return null; // Don't render if the dialog isn't open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-black rounded-lg shadow-xl p-8 max-w-sm w-full">
        {/* Dialog Title */}
        <h2 className="text-center text-2xl font-semibold text-green-600 mb-4">
          Insufficient Token!
        </h2>

        {/* Success Message */}
        <p className="text-center text-lg text-gray-700 text-white mb-6">
          You have insufficient tokens. Please go to my account page to buy credits.
        </p>

        {/* Close Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoTokenDialog;
