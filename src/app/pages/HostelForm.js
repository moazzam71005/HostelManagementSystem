import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const HostelForm = () => {
  const [hostelData, setHostelData] = useState({
    purpose: "",
    placeOfLeave: "",
    dateOfLeave: "",
    dateOfArrival: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state
  const [submitMessage, setSubmitMessage] = useState(""); // Success or error message
  const [toastMessage, setToastMessage] = useState(""); // Toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Toast visibility

  const searchParams = useSearchParams()
  const studentId = searchParams.get('id')

  // Handle form field changes
  const handleInputChange = (e) => {
    const studentId = localStorage.getItem('studentId');
    const { name, value } = e.target;
    setHostelData((prevData) => ({
      ...prevData,
      [name]: value,
      id: studentId
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage(""); // Reset any previous message

    // Submit data to the backend
    try {
      const response = await fetch("http://localhost:5000/api/hostel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hostelData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("Request successfully submitted!"); // Success message
        setToastMessage("Request successfully submitted!");
        setIsDialogOpen(false); // Close dialog
      } else {
        setSubmitMessage(result.error || "Error occurred while submitting!"); // Error message
        setToastMessage(result.error || "Error occurred while submitting!");
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitMessage("Network error: " + error.message); // Network error message
      setToastMessage("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
      setIsToastVisible(true); // Show toast message

      // Hide toast message after 5 seconds
      setTimeout(() => {
        setIsToastVisible(false);
      }, 5000);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {isToastVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Trigger: Card UI */}
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-4 h-4">\ud83c\udfe0</span> {/* Example icon */}
                Hostel In/Out
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Register your hostel entry/exit
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Dialog: Hostel In/Out Form */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hostel In/Out</DialogTitle>
            <DialogDescription>
              Please provide details for your hostel entry/exit
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                name="purpose"
                placeholder="Reason for leaving/entering"
                required
                value={hostelData.purpose}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="placeOfLeave">Place of Leave</Label>
              <Input
                id="placeOfLeave"
                name="placeOfLeave"
                placeholder="Where are you going?"
                required
                value={hostelData.placeOfLeave}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="dateOfLeave">Date of Leave</Label>
              <Input
                id="dateOfLeave"
                name="dateOfLeave"
                type="date"
                required
                value={hostelData.dateOfLeave}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="dateOfArrival">Date of Arrival</Label>
              <Input
                id="dateOfArrival"
                name="dateOfArrival"
                type="date"
                required
                value={hostelData.dateOfArrival}
                onChange={handleInputChange}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HostelForm;