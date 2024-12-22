import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare } from "lucide-react";



const ComplaintForm = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state
  const [submitMessage, setSubmitMessage] = useState(""); // Success or error message
  const [toastMessage, setToastMessage] = useState(""); // For the toast notification
  const [isToastVisible, setIsToastVisible] = useState(false); // Control toast visibility

  const handleSubmit = async (e) => {
    const studentId = localStorage.getItem('studentId');
    console.log(studentId);
    e.preventDefault();
    const formData = new FormData(e.target);
    const complaintData = {
      cid: studentId,
      title: formData.get("complaint-title"),
      type: formData.get("complaint-type"),
      details: formData.get("complaint-details"),
    };

    setIsSubmitting(true);
    setSubmitMessage(""); // Reset any previous message

    try {
      

      const response = await fetch("http://localhost:5000/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      
        body: JSON.stringify(complaintData),
        credentials: 'include'
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage("Complaint submitted successfully!"); // Success message
        setIsDialogOpen(false); // Close dialog
        setToastMessage("Complaint submitted successfully!");
      } else {
        setSubmitMessage(`Error: ${result.error || "Unknown error"}`); // Error message
        setToastMessage(`Error: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      setSubmitMessage(`Network error: ${error.message}`); // Network error message
      setToastMessage(`Network error: ${error.message}`);
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
          <Card
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsDialogOpen(true)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Register Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to submit a new complaint
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>

        {/* Dialog: Complaint Form */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit a Complaint</DialogTitle>
            <DialogDescription>
              Describe your issue in detail. We&apos;ll get back to you as soon as
              possible.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="complaint-title">Complaint Title</Label>
              <Input
                id="complaint-title"
                name="complaint-title"
                placeholder="Brief description of the issue"
                required
              />
            </div>
            <div>
              <Label htmlFor="complaint-type">Complaint Type</Label>
              <Select name="complaint-type" required>
                <SelectTrigger id="complaint-type">
                  <SelectValue placeholder="Select complaint type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="aluminium">Aluminium</SelectItem>
                  <SelectItem value="plumber">Plumber</SelectItem>
                  <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="complaint-details">Details</Label>
              <Textarea
                id="complaint-details"
                name="complaint-details"
                placeholder="Provide more information about your complaint"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintForm;