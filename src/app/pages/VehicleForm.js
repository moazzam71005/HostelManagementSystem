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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VehicleForm = () => {
  const id = localStorage.getItem('studentId');
  const [vehicleData, setVehicleData] = useState({
    vehicleType: "",
    model: "",
    name: "",
    registrationNo: "",
    engineNo: "",
    chassisNo: "",
    ownerName: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog open state
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state
  const [submitMessage, setSubmitMessage] = useState(""); // Success or error message
  const [toastMessage, setToastMessage] = useState(""); // Toast message
  const [isToastVisible, setIsToastVisible] = useState(false); // Toast visibility


  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: value,
      id
    }));
  };

  const handleSelectChange = (value) => {
    setVehicleData((prevData) => ({
      ...prevData,
      vehicleType: value,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitMessage(""); // Reset any previous message

    // Submit data to the backend
    try {
      const response = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("Vehicle successfully registered!"); // Success message
        setToastMessage("Vehicle successfully registered!");
        setIsDialogOpen(false); // Close dialog
      } else {
        setSubmitMessage(result.error || "Error occurred while registering vehicle!"); // Error message
        setToastMessage(result.error || "Error occurred while registering vehicle!");
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
                <span className="w-4 h-4">\ud83d\ude97</span> {/* Example icon */}
                Register Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Register your vehicle
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Dialog: Vehicle Registration Form */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register Vehicle</DialogTitle>
            <DialogDescription>
              Please provide details about your vehicle
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="Vehicle model"
                required
                value={vehicleData.model}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Vehicle name"
                required
                value={vehicleData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="registrationNo">Registration No.</Label>
              <Input
                id="registrationNo"
                name="registrationNo"
                placeholder="Vehicle registration number"
                required
                value={vehicleData.registrationNo}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="engineNo">Engine No.</Label>
              <Input
                id="engineNo"
                name="engineNo"
                placeholder="Engine number"
                required
                value={vehicleData.engineNo}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="chassisNo">Chassis No.</Label>
              <Input
                id="chassisNo"
                name="chassisNo"
                placeholder="Chassis number"
                required
                value={vehicleData.chassisNo}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="Name of the vehicle owner"
                required
                value={vehicleData.ownerName}
                onChange={handleInputChange}
              />
            </div>
            

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Register Vehicle"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleForm;
