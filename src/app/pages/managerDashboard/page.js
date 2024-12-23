
'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ClipboardList, UtensilsCrossed, LogOut } from 'lucide-react'
import {useRouter} from 'next/navigation'
import supabase from "../../../supabaseClient"
import { useSearchParams } from "next/navigation";



export default function ManagerDashboard() {
  const router = useRouter();

  const [dialogState, setDialogState] = useState({
    isOpen: false,
    action: "",
    studentId: null,
    studentName: "",
  });
  const handleActionClick = async (action, student) => {
    console.log("Action clicked:", action); // Log the action (accept or reject)
    console.log("Student info:", student); // Log the student details
  
    try {
      const { error } = await supabase
        .from("testuser")
        .update({ approval_status: action === "accept" ? "approved" : "rejected" })
        .eq("id", student.id); // Update the status of the student based on the action
  
      if (error) {
        console.error("Error updating student:", error.message);
      } else {
        console.log(`Student ${action}ed successfully`);
        
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  // Mock data - replace with actual data fetching logic
  const [complaints, setComplaints] = useState([
    { 
      id: 1, 
      title: 'Broken Faucet', 
      type: 'Plumbing', 
      status: 'Pending', 
      date: '2024-03-01', 
      roomNo: 'A101', 
      studentName: 'John Doe', 
      regNo: '2021CS101',
      description: 'The faucet in the bathroom is leaking continuously and needs immediate repair.',
      complaintType: 'Plumber'
    },
    { 
      id: 2, 
      title: 'Flickering Lights', 
      type: 'Electrical', 
      status: 'In Progress', 
      date: '2024-03-02', 
      roomNo: 'B205', 
      studentName: 'Jane Smith', 
      regNo: '2022EE056',
      description: 'The lights in the study area are flickering, making it difficult to read at night.',
      complaintType: 'Electric'
    },
    { 
      id: 3, 
      title: 'Loose Door Handle', 
      type: 'Carpentry', 
      status: 'Resolved', 
      date: '2024-03-03', 
      roomNo: 'C309', 
      studentName: 'Alex Johnson', 
      regNo: '2020ME078',
      description: 'The door handle of the main door is loose and might fall off soon.',
      complaintType: 'Wood'
    },
  ])

  useEffect(() => {
    
    console.log("Hello bruv");
    const fetchedComplaintData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("testcomplaint") 
        .select("cid, complaintTitle, complaintType, details, submitted_at, testuser(name, roomno)");
  
      if (error) {
        console.error("Error fetching Complaint data:", error.message);
        setLoading(false);
        return;
      }

      console.log('id is ', data[0].cid);
      console.log('name is ', data[0].testuser?.name);
      console.log('title is ', data[0].complaintTitle);
      console.log('type is ', data[0].complaintType);

      if (data && data.length > 0) {
        
        const formattedComplaints = data.map((complaint) => ({
          id: complaint.cid,
          title: complaint.complaintTitle,
          studentName: complaint.testuser?.name,
          regNo: complaint.cid,
          roomNo: complaint.testuser?.roomno,
          type: complaint.complaintType,
          date: complaint.submitted_at,
          description: complaint.details,
          status: complaint.status || 'Pending', // Use status from the database, default to 'Pending'
        }));
        setComplaints(formattedComplaints);
      }
  
      setLoading(false);
    };
  
    fetchedComplaintData();
  }, []); // Empty dependency array means this runs once when the component mounts
  



  const [messOffRequests, setMessOffRequests] = useState([
    { id: 1, studentName: 'Alice Johnson', regNo: '2021CS102', roomNo: 'D404', requestDate: '2024-03-10', from: '2024-03-10', to: '2024-03-15', status: 'Pending' },
    { id: 2, studentName: 'Bob Smith', regNo: '2022EE057', roomNo: 'E505', requestDate: '2024-03-10', from: '2024-03-12', to: '2024-03-14', status: 'Approved' },
  ])
  
  
  useEffect(() => {
    const fetchedMessData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("testmess") // Replace "managers" with your table name
        .select("id, requestDate, leavingDate, arrivalDate, testuser(name, roomno)");
  
      if (error) {
        console.error("Error fetching Mess data:", error.message);
        setLoading(false);
        return;
      }
  
      if (data && data.length > 0) {
        const formattedMessRequests = data.map((mess) => ({
          id: mess.id,
          requestDate: mess.requestDate,
          from: mess.leavingDate,
          to: mess.arrivalDate,
          status: mess.status || 'Pending',
          studentName: mess.testuser?.name,
          roomNo: mess.testuser?.roomno,
          regNo: mess.id
        }));
        setMessOffRequests(formattedMessRequests);
      }
  
      setLoading(false);
    };
  
    fetchedMessData();
  }, []);
  




  const [hostelInOut, setHostelInOut] = useState([
    { id: 1, studentName: 'Charlie Brown', regNo: '2020ME079', roomNo: 'F606', type: 'Out', leaveDate: '2024-03-05', arrivalDate: '2024-03-07', reason: 'Weekend trip', placeOfLeave: 'Home' },
    { id: 2, studentName: 'Charlie Brown', regNo: '2020ME079', roomNo: 'F606', type: 'Out', leaveDate: '2024-03-05', arrivalDate: '2024-03-07', reason: 'Weekend trip', placeOfLeave: 'Home' },
    
  ])

  
  useEffect(() => {
    const fetchHostelData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("testhostel") // Replace "managers" with your table name
        .select("id, dateOfLeave, dateOfArrival, placeOfLeave, purpose, testuser(name, roomno)");
  
      if (error) {
        console.error("Error fetching hostel data:", error.message);
        setLoading(false);
        return;
      }
  
      if (data && data.length > 0) {
        const formattedHostelLogs = data.map((log) => ({
          id: log.id,
          leaveDate: log.dateOfLeave,
          arrivalDate: log.dateOfArrival,
          placeOfLeave: log.placeOfLeave,
          reason: log.purpose,
          studentName: log.testuser?.name,
          roomNo: log.testuser?.roomno,
          regNo: log.id
        }));
        setHostelInOut(formattedHostelLogs);
      }
  
      setLoading(false);
    };
  
    fetchHostelData();
  }, []);
  


  const [pendingStudents, setPendingStudents] = useState([
    {id: 1, studentName: 'Charlie Brown', regNo: '2020ME079', roomNo: 'F606', hostel: 'xyz', contactNum: '012', nustEmail: 'a@', school: 'xyz', department: 'xyz'},
    {id: 2, studentName: 'Charlie Brown', regNo: '2020ME078', roomNo: 'F606', hostel: 'xyz', contactNum: '012', nustEmail: 'a@', school: 'xyz', department: 'xyz'}
  ])

  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("testuser") // Replace "managers" with your table name
        .select("*")
        .eq("approval_status", "pending");
  
      if (error) {
        console.error("Error fetching student data:", error.message);
        setLoading(false);
        return;
      }
  
      if (data && data.length > 0) {
        const formattedStudents = data.map((student) => ({
          id: student.id,
          studentName: student.name,
          regNo: student.id,
          contactNum: student.contactno,
          nustEmail: student.nustemail,
          school: student.school,
          department: student.discipline,
          hostel: student.hostel,
          roomNo: student.roomno,
        }));
        setPendingStudents(formattedStudents);
      }
  
      setLoading(false);
    };
  
    fetchStudentData();
  }, []);
  
  const [manager, setManager] = useState({
    name: "Jane Doe",
    role: "Hostel Manager",
    hostel: "Beruni",
    profilePic: "/placeholder.svg",
  });

  const [loading, setLoading] = useState(true); // Add a loading state

  const searchParams = useSearchParams(); // Hook to access URL parameters

  useEffect(() => {
    const fetchManagerData = async () => {
      const id = searchParams.get("id"); // Get the 'id' from the URL
      if (!id) {
        console.error("No ID provided in URL");
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("testuser") // Replace with your actual table name
          .select("*")
          .eq("id", id)
          .single(); // Fetch a single row matching the ID

        if (error) {
          console.error("Error fetching manager data:", error.message);
          setLoading(false);
          return;
        }

        if (data) {
          setManager({
            name: data.name,
            role: data.role,
            hostel: data.hostel,
            profilePic: data.profilePic || "/placeholder.svg", // Use a default profile picture if not provided
          });
        }
      } catch (fetchError) {
        console.error("Unexpected error fetching manager data:", fetchError);
      }

      setLoading(false);
    };

    fetchManagerData();
  }, [searchParams]);


  const getStatusBadge = (status) => {
    if (!status) {
      console.error("Status is undefined or null:", status);
      return <Badge>Unknown</Badge>;
    }
    
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="secondary">{status}</Badge>
      case 'in progress':
        return <Badge variant="warning">{status}</Badge>
      case 'resolved':
        return <Badge variant="success">{status}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={manager.profilePic} alt={manager.name} />
              <AvatarFallback>
                {manager.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{manager.name}</CardTitle>
              <CardDescription>
                {manager.role} | {manager.hostel} Hostel
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="messoff">Mess Off Requests</TabsTrigger>
            <TabsTrigger value="inout">Hostel In/Out</TabsTrigger>
            <TabsTrigger value="awaitingStudents">Pending Students</TabsTrigger>
          </TabsList>
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Complaints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Reg. No.</TableHead>
                        <TableHead>Room No.</TableHead>
                        <TableHead>Complaint Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.map((complaint) => (
                        <TableRow key={complaint.id}>
                          <TableCell>{complaint.title}</TableCell>
                          <TableCell>{complaint.studentName}</TableCell>
                          <TableCell>{complaint.regNo}</TableCell>
                          <TableCell>{complaint.roomNo}</TableCell>
                          <TableCell>{complaint.type}</TableCell>
                          <TableCell>{complaint.date}</TableCell>
                          <TableCell>
                            {getStatusBadge(complaint.status)}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Complaint Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p>
                                      <strong>Title:</strong> {complaint.title}
                                    </p>
                                    <p>
                                      <strong>Student Name:</strong>{" "}
                                      {complaint.studentName}
                                    </p>
                                    <p>
                                      <strong>Registration No.:</strong>{" "}
                                      {complaint.regNo}
                                    </p>
                                    <p>
                                      <strong>Room No.:</strong>{" "}
                                      {complaint.roomNo}
                                    </p>
                                    <p>
                                      <strong>Complaint Type:</strong>{" "}
                                      {complaint.complaintType}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong>Date:</strong> {complaint.date}
                                    </p>
                                    <p>
                                      <strong>Status:</strong>{" "}
                                      {complaint.status}
                                    </p>
                                    <p>
                                      <strong>Description:</strong>{" "}
                                      {complaint.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button size="sm" variant="outline">
                                    Update Status
                                  </Button>
                                  <Button size="sm">Resolve</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messoff">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5" />
                  Mess Off Requests
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
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messOffRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>{request.studentName}</TableCell>
                          <TableCell>{request.regNo}</TableCell>
                          <TableCell>{request.roomNo}</TableCell>
                          <TableCell>{request.from}</TableCell>
                          <TableCell>{request.to}</TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="inout">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
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
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{record.date}</TableCell>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
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
                        <TableHead>Actions</TableHead> {/* Add actions column */}
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
                              onClick={() => handleActionClick("accept", record)}
                            >
                              Accept
                            </Button>
                            <Button
                              className="bg-red-100 text-black hover:bg-red-500"
                              onClick={() => handleActionClick("reject", record)}
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
        </Tabs>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No new announcements at this time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

