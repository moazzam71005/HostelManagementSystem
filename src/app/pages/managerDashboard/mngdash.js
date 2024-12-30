"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  ClipboardList,
  UtensilsCrossed,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import supabase from "../../../supabaseClient";
import { useSearchParams } from "next/navigation";
import ComplaintsTab from "./complaintsTab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessOffRequestsTab from "./messOffRequestsTab";
import VehicleRegisterTab from "./vehicleRegisterTab";
import CleaningRequestsTab from "./cleaningRequestsTab";


export default function ManagerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    action: "",
    studentId: null,
    studentName: "",
  });

  
  const [complaints, setComplaints] = useState([]);
  const [vehicleRegister, setVehicles] = useState([]);
  const [messOffRequests, setMessOffRequests] = useState([]);
  const [hostelInOut, setHostelInOut] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [cleaningRequests, setCleaningRequests] = useState([]);
  const [manager, setManager] = useState({
    name: "Jane Doe",
    role: "Hostel Manager",
    hostel: "Beruni",
    profilePic: "/placeholder.svg",
  });
  const [loading, setLoading] = useState(true);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control dialog visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // Handle submitting state  


  const handleActionClick = async (action, student) => {
    try {
      const { error } = await supabase
        .from("testuser")
        .update({
          approval_status: action === "accept" ? "approved" : "rejected",
        })
        .eq("id", student.id);

      if (error) {
        console.error("Error updating student:", error.message);
        return;
      }

      // Remove the updated student from pendingStudents
      setPendingStudents((prev) => prev.filter((s) => s.id !== student.id));
      console.log(`Student ${action}ed successfully`);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge>Unknown</Badge>;

    switch (status.toLowerCase()) {
      case "pending":
        return <Badge variant="secondary">{status}</Badge>;
      case "in progress":
        return <Badge variant="warning">{status}</Badge>;
      case "resolved":
        return <Badge variant="success">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements") // Assuming you have an "announcements" table
        .select("title, description") // Select the columns you need
        .order("created_at", { ascending: false }); // Optional: Sort by creation date

      if (error) {
        console.error("Error fetching announcements:", error.message);
      } else {
        setAnnouncements(data); // Set the fetched announcements to state
      }
    };

    fetchAnnouncements();
  }, []); // Fetch announcements only once when component mounts

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Clear session
    router.push("/"); // Redirect to login page
  };

  const handleAddAnnouncement = async () => {
    const id = searchParams.get("id");
    setIsSubmitting(true); // Set submitting state
    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            title: announcementTitle,
            description: announcementDescription,
            manager_id: id,
          },
        ]);

      if (error) throw error;

      // Show success toast
      toast.success("Announcement added successfully!");
      setIsDialogOpen(false); // Close dialog
      setAnnouncementTitle(""); // Reset title
      setAnnouncementDescription(""); // Reset description
    } catch (error) {
      console.error("Error adding announcement:", error.message);
      toast.error(`Error: ${error.message}`); // Show error toast
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        complaintRes,
        messRes,
        hostelRes,
        vehicleRes,
        cleaningRes,
        studentRes,
      ] = await Promise.all([
        supabase
          .from("testcomplaint")
          .select(
            "serialNum, cid, complaintTitle, complaintType, details, submitted_at, testuser!inner(name, roomno)"
          )
          .eq("testuser.hostel", manager.hostel)
          .eq("status", "pending"),
        supabase
          .from("testmess")
          .select(
            "seqNum, id, requestDate, leavingDate, arrivalDate, testuser!inner(name, roomno)"
          )
          .eq("testuser.hostel", manager.hostel)
          .eq("status", "pending"),
        supabase
          .from("testhostel")
          .select(
            "id, dateOfLeave, dateOfArrival, placeOfLeave, purpose, testuser!inner(name, roomno)"
          )
          .eq("testuser.hostel", manager.hostel),
        supabase
          .from("testvehicles")
          .select(
            "id, vehicleType, model, engineNum, chassisNum, vehicleName, ownerName, status, testuser!inner(name, roomno)"
          )
          .eq("testuser.hostel", manager.hostel)
          .eq("status", "pending"),
        supabase
          .from("cleaning")
          .select("id, time, testuser!inner(name, roomno)")
          .eq("testuser.hostel", manager.hostel)
          .eq("status", "pending"),
        supabase
          .from("testuser")
          .select("*")
          .eq("approval_status", "pending")
          .eq("hostel", manager.hostel),
      ]);

      if (complaintRes.error) throw complaintRes.error;
      if (messRes.error) throw messRes.error;
      if (hostelRes.error) throw hostelRes.error;
      if (studentRes.error) throw studentRes.error;
      if (vehicleRes.error) throw vehicleRes.error;
      if (cleaningRes.error) throw cleaningRes.error;

      setComplaints(
        complaintRes.data.map((c) => ({
          id: c.serialNum,
          title: c.complaintTitle,
          studentName: c.testuser?.name,
          regNo: c.cid,
          roomNo: c.testuser?.roomno,
          type: c.complaintType,
          date: c.submitted_at,
          description: c.details,
          status: c.status || "Pending",
        }))
      );

      setMessOffRequests(
        messRes.data.map((m) => ({
          id: m.seqNum,
          requestDate: m.requestDate,
          from: m.leavingDate,
          to: m.arrivalDate,
          status: m.status || "Pending",
          studentName: m.testuser?.name,
          roomNo: m.testuser?.roomno,
          regNo: m.id,
        }))
      );

      setHostelInOut(
        hostelRes.data.map((h) => ({
          id: h.id,
          leaveDate: h.dateOfLeave,
          arrivalDate: h.dateOfArrival,
          placeOfLeave: h.placeOfLeave,
          reason: h.purpose,
          studentName: h.testuser?.name,
          roomNo: h.testuser?.roomno,
          regNo: h.id,
        }))
      );

      setVehicles(
        vehicleRes.data.map((v) => ({
          id: v.id,
          type: v.vehicleType,
          model: v.model,
          vehicleName: v.vehicleName,
          engineNum: v.engineNum,
          chassisNum: v.chassisNum,
          ownerName: v.ownerName,
          studentName: v.testuser?.name,
          roomNo: v.testuser?.roomno,
          status: v.status,
        }))
      );

      setCleaningRequests(
        cleaningRes.data.map((r) => ({
          id: r.id,
          time: r.time,
          studentName: r.testuser?.name,
          roomNo: r.testuser?.roomno,
        }))
      );

      setPendingStudents(
        studentRes.data.map((s) => ({
          id: s.id,
          studentName: s.name,
          regNo: s.id,
          contactNum: s.contactno,
          nustEmail: s.nustemail,
          school: s.school,
          department: s.discipline,
          hostel: s.hostel,
          roomNo: s.roomno,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("testuser")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching manager data:", error.message);
          return;
        }

        if (data) {
          setManager({
            name: data.name,
            role: data.role,
            hostel: data.hostel,
            profilePic: data.profilePic || "/placeholder.svg",
          });
        }
      } catch (fetchError) {
        console.error("Unexpected error fetching manager data:", fetchError);
      }
    };

    fetchManagerData();
  }, [searchParams]);

  useEffect(() => {
    fetchData(); // Initial data fetch on mount

    const intervalId = setInterval(fetchData, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-300 to-cyan-400 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="bg-white/80">
          <CardHeader className="flex flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 outline outline-2 outline-green-500 outline-offset-2">
                <AvatarImage src={manager.profilePic} alt={manager.name} />
                <AvatarFallback>
                  {manager.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {manager.name}
                </CardTitle>
                <CardDescription className="text-sm font-semibold">
                  {manager.role} | {manager.hostel} Hostel
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <span className="zoom-animation">Add Announcements</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Announcement</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      className="form-input w-full border rounded p-2"
                      placeholder="Title"
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                    />
                    <textarea
                      className="form-textarea w-full border rounded p-2"
                      placeholder="Description"
                      value={announcementDescription}
                      onChange={(e) => setAnnouncementDescription(e.target.value)}
                    />
                    <Button
                      onClick={handleAddAnnouncement}
                      className="bg-green-500 text-white hover:bg-green-600"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
              {/* Toast container for notifications */}
              <ToastContainer />
            </div>

          </CardHeader>
        </Card>

        <Tabs defaultValue="complaints" className="space-y-4 ">
          <TabsList>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="messoff">Mess Off Requests</TabsTrigger>
            <TabsTrigger value="inout">Hostel In/Out</TabsTrigger>
            <TabsTrigger value="awaitingStudents">Pending Students</TabsTrigger>
            <TabsTrigger value="vehicleregister">
              Vehicle Registration
            </TabsTrigger>
            <TabsTrigger value="cleaningrequests">
              Cleaning Requests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="complaints">
            <ComplaintsTab complaints={complaints} setComplaints = {setComplaints}  />
          </TabsContent>
          <TabsContent value="messoff">
            <MessOffRequestsTab
              messOffRequests={messOffRequests}
              setMessOffRequests={setMessOffRequests}
            />
          </TabsContent>
          <TabsContent value="inout">
            <Card className="bg-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <LogOut className="w-5 h-5" />
                  Hostel In/Out Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Reg. No.</TableHead>
                        <TableHead>Room No.</TableHead>
                        <TableHead>Leaving Date</TableHead>
                        <TableHead>Arrival Date</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Place of Leave</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostelInOut.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.studentName}</TableCell>
                          <TableCell>{record.regNo}</TableCell>
                          <TableCell>{record.roomNo}</TableCell>
                          <TableCell>{record.leaveDate}</TableCell>
                          <TableCell>{record.arrivalDate}</TableCell>
                          <TableCell>{record.reason}</TableCell>
                          <TableCell>{record.placeOfLeave}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicleregister">
            <VehicleRegisterTab
              vehicleRegister={vehicleRegister}
              setVehicleRegister={setVehicles}
            />
          </TabsContent>

          <TabsContent value="cleaningrequests">
            <CleaningRequestsTab cleaningRequests={cleaningRequests} />
          </TabsContent>

          <TabsContent value="awaitingStudents">
            <Card className="bg-white/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LogOut className="w-5 h-5" />
                  Pending Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingStudents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No pending students at this time.
                  </p>
                ) : (
                  <ScrollArea className="h-[400px] w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Reg. No.</TableHead>
                          <TableHead>Hostel</TableHead>
                          <TableHead>Room No.</TableHead>
                          <TableHead>Contact No.</TableHead>
                          <TableHead>NUST Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>School</TableHead>
                          <TableHead>Actions</TableHead>{" "}
                          {/* Add actions column */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingStudents.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.studentName}</TableCell>
                            <TableCell>{record.regNo}</TableCell>
                            <TableCell>{record.hostel}</TableCell>
                            <TableCell>{record.roomNo}</TableCell>
                            <TableCell>{record.contactNum}</TableCell>
                            <TableCell>{record.nustEmail}</TableCell>
                            <TableCell>{record.department}</TableCell>
                            <TableCell>{record.school}</TableCell>
                            <TableCell>
                              {/* Accept and Reject buttons */}
                              <Button
                                className="mr-2 bg-green-100 text-black hover:bg-green-500"
                                onClick={() =>
                                  handleActionClick("accept", record)
                                }
                              >
                                Accept
                              </Button>
                              <Button
                                className="bg-red-100 text-black hover:bg-red-500"
                                onClick={() =>
                                  handleActionClick("reject", record)
                                }
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Card className="bg-white/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-red-600 font-bold ">
              <AlertCircle className="w-5 h-5" />
              <span className="zoom-animation">Important Announcements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loop through announcements and display them */}
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <div key={index} className="space-y-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {announcement.title}
                    </h3>
                    <p className="text-md text-gray-500 hover:text-black transition-colors duration-300">
                      {announcement.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No new announcements at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
