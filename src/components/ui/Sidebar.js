import React from "react";
import { useRouter } from "next/navigation"; // For navigation

export default function Sidebar() {
  const router = useRouter();

  // Function to navigate to different pages
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="w-60 bg-gray-800 text-white min-h-screen p-4">
      <div className="space-y-4">
        {/* Home Button - Navigates to the student dashboard */}
        <button
          onClick={() => handleNavigation("/student/dashboard")}
          className="w-full text-left px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          Home
        </button>

        {/* View Mess Request Status Button */}
        <button
          onClick={() => handleNavigation("/student/dashboard#mess-status")}
          className="w-full text-left px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          View Mess Request Status
        </button>

        {/* View Complaint Status Button */}
        <button
          onClick={() => handleNavigation("/student/dashboard#complaint-status")}
          className="w-full text-left px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          View Complaint Status
        </button>

        {/* View Vehicle Registration Status Button */}
        <button
          onClick={() => handleNavigation("/student/dashboard#vehicle-status")}
          className="w-full text-left px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          View Vehicle Registration Status
        </button>

        {/* Cleaning Request Status Button */}
        <button
          onClick={() => handleNavigation("/student/dashboard#cleaning-status")}
          className="w-full text-left px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded-md"
        >
          Cleaning Request Status
        </button>
      </div>
    </div>
  );
}
