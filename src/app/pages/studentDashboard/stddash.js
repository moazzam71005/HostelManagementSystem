"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, LogOut, Bed, AlertCircle } from "lucide-react";
import supabase from "../../../supabaseClient";
import ComplaintForm from "../ComplaintForm";
import MessForm from "../MessForm";
import HostelForm from "../HostelForm";
import VehicleForm from "../VehicleForm";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import the Tabs component

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const studentId = searchParams.get("id");

  const [isCleaningRequested, setIsCleaningRequested] = useState(false);
  const [student, setStudent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [messOffDates, setMessOffDates] = useState({ requestDate: "", leavingDate: "", arrivalDate: "" });
  const [messOffError, setMessOffError] = useState("");

  const emergencyContacts = [
    { name: "Hostel Warden", number: "+92 300 1234567" },
    { name: "Campus Security", number: "+92 300 7654321" },
    { name: "Medical Emergency", number: "+92 300 1112223" },
  ];

  useEffect(() => {
    if (studentId) {
      const fetchStudentData = async () => {
        const { data, error } = await supabase
          .from("testuser")
          .select("*")
          .eq("id", studentId)
          .single();

        if (error) {
          console.error("Error fetching student data:", error.message);
        } else {
          setStudent({
            name: data.name,
            fathersName: data.fatherName,
            email: data.email,
            contactNo: data.contactno,
            registrationNo: data.id,
            school: data.school,
            batch: data.batch,
            discipline: data.discipline,
            hostel: data.hostel,
            roomNo: data.roomno,
            gender: data.gender,
            profilePic: "/placeholder.svg",
          });
        }
      };

      fetchStudentData();
    }
  }, [studentId]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("title, description")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error.message);
      } else {
        setAnnouncements(data);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleCleaningRequest = async (e) => {
    e.preventDefault();

    setIsCleaningRequested(true);
    setTimeout(() => setIsCleaningRequested(false), 30000);

    try {
      const response = await fetch("http://localhost:5000/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Successsss");
      } else {
        console.log("nahsps");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-200 text-white py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Information Card */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 rounded-xl bg-gradient-to-r from-blue-900 to-blue-900">
              <Avatar className="w-20 h-20 outline outline-2 outline-green-500 outline-offset-2">
                <AvatarImage src={student.profilePic} alt={student.name} />
                <AvatarFallback>
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-gray-200">{student.name}</CardTitle>
                <CardDescription className="text-sm font-semibold text-gray-300">
                  Room: {student.roomNo} | Hostel: {student.hostel}
                </CardDescription>
              </div>
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </CardHeader>
          </Card>

          {/* Tabs for Navigation */}
          <Tabs defaultValue="main_dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="main_dashboard">Main Dashboard</TabsTrigger>
              <TabsTrigger value="complaint_status">Complaint Status</TabsTrigger>
              <TabsTrigger value="messoff_status">Mess Off Status</TabsTrigger>
              <TabsTrigger value="vehicle_status">Vehicle Status</TabsTrigger>
              <TabsTrigger value="cleaning_status">Cleaning Status</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Cards below tabs */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-transform transform hover:scale-105 hover:shadow-2xl bg-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="w-4 h-4" />
                  <span className="zoom-animation">Room Cleaning</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCleaningRequest}
                  disabled={isCleaningRequested}
                  className={`w-full ${
                    isCleaningRequested
                      ? "bg-green-500 text-white"
                      : "bg-gray-600 text-white hover:bg-gray-800"
                  } transition-colors duration-200`}
                >
                  {isCleaningRequested ? "Request Sent" : "Request Cleaning"}
                </Button>
              </CardContent>
            </Card>

            <div className="complaints-section">
              <ComplaintForm />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Card className="transition-transform transform hover:scale-105 hover:shadow-2xl bg-white/70">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="zoom-animation">Emergency Contacts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">View important contact information</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Emergency Contacts</DialogTitle>
                  <DialogDescription>Important numbers to call in case of emergency</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{contact.name}</span>
                      <a
                        href={`tel:${contact.number}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.number}
                      </a>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="messform">
              <MessForm />
            </div>

            <div className="hostelform">
              <HostelForm />
            </div>

            <div className="vehicleform">
              <VehicleForm />
            </div>
          </div>

          {/* Important Announcements */}
          <Card className="bg-white/50 border-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-red-600 text-xl">
                <AlertCircle className="w-4 h-4" />
                <span className="zoom-animation">Important Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Loop through announcements and display them */}
              {announcements.length > 0 ? (
                announcements.map((announcement, index) => (
                  <div key={index} className="space-y-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{announcement.title}</h3>
                      <p className="text-md text-gray-500 hover:text-black transition-colors duration-300">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No new announcements at this time.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
