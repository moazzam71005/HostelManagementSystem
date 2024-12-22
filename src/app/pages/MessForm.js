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

const MessOffForm = () => {
  const [messOffDates, setMessOffDates] = useState({
    requestDate: "",
    leavingDate: "",
    arrivalDate: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state
  const [submitMessage, setSubmitMessage] = useState(""); // Success or error message
  const [toastMessage, setToastMessage] = useState(""); // Toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Toast visibility

  const searchParams = useSearchParams()
  const studentId = searchParams.get('id')

  // Handle form field changes
  const handleMessOffChange = (e) => {
    const { name, value } = e.target;
    setMessOffDates((prevDates) => ({
      ...prevDates,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleMessOffSubmit = async (e) => {
    const studentId = localStorage.getItem('studentId');
    e.preventDefault();
    const formData = new FormData(e.target);

    // Access individual form data
    const requestDate = formData.get("requestDate");
    const leavingDate = formData.get("leavingDate");
    const arrivalDate = formData.get("arrivalDate");

    // Create an object with the data
    const messOffData = {
      requestDate,
      leavingDate,
      arrivalDate,
      studentId
    };

    setIsSubmitting(true);
    setSubmitMessage(""); // Reset any previous message

    // Submit data to the backend
    try {
      const response = await fetch("http://localhost:5000/api/mess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messOffData),
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
                <span className="w-4 h-4">🍽</span> {/* Example icon */}
                Mess Off
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Request mess off for your absence
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Dialog: Mess Off Form */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mess Off</DialogTitle>
            <DialogDescription>
              Please provide the dates for your mess off request
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMessOffSubmit} className="space-y-4">
            <div>
              <Label htmlFor="requestDate">Request Date</Label>
              <Input
                id="requestDate"
                name="requestDate"
                type="date"
                required
                value={messOffDates.requestDate}
                onChange={handleMessOffChange}
              />
            </div>
            <div>
              <Label htmlFor="leavingDate">Leaving Date</Label>
              <Input
                id="leavingDate"
                name="leavingDate"
                type="date"
                required
                value={messOffDates.leavingDate}
                onChange={handleMessOffChange}
              />
            </div>
            <div>
              <Label htmlFor="arrivalDate">Arrival Date</Label>
              <Input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                required
                value={messOffDates.arrivalDate}
                onChange={handleMessOffChange}
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

export default MessOffForm;
