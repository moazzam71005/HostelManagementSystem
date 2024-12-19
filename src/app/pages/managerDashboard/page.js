'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ClipboardList, UtensilsCrossed, LogOut } from 'lucide-react'
import {useRouter} from 'next/navigation'
import supabase from "../../../supabaseClient"



export default function ManagerDashboard() {
  const router = useRouter();


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

  const [messOffRequests, setMessOffRequests] = useState([
    { id: 1, studentName: 'Alice Johnson', regNo: '2021CS102', roomNo: 'D404', from: '2024-03-10', to: '2024-03-15', status: 'Pending' },
    { id: 2, studentName: 'Bob Smith', regNo: '2022EE057', roomNo: 'E505', from: '2024-03-12', to: '2024-03-14', status: 'Approved' },
  ])

  const [hostelInOut, setHostelInOut] = useState([
    { id: 1, studentName: 'Charlie Brown', regNo: '2020ME079', roomNo: 'F606', type: 'Out', date: '2024-03-05', reason: 'Weekend trip', placeOfLeave: 'Home' },
    { id: 2, studentName: 'Diana Prince', regNo: '2021CS103', roomNo: 'G707', type: 'In', date: '2024-03-07', reason: 'Returned from home', placeOfLeave: 'N/A' },
  ])



  const [manager, setManager] = useState({
    name: "Jane Doe",
    role: "Hostel Manager",
    hostel: "Beruni",
    profilePic: "/placeholder.svg",
  });

  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchManagerData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("testmanager") // Replace "managers" with your table name
        .select("*")
        .eq("hostel", "Attar"); // Adjust the filter based on your criteria (e.g., ID, role, etc.)

      if (error) {
        console.error("Error fetching manager data:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const fetchedManager = data[0];
        setManager({
          name: fetchedManager.name,
          role: fetchedManager.designation,
          hostel: fetchedManager.hostel,
          profilePic: fetchedManager.profilePic || "/placeholder.svg", // Use a default profile picture if not provided
        });
      }

      setLoading(false);
    };

    fetchManagerData();
  }, []); // Empty dependency array means this runs once when the component mounts


  const getStatusBadge = (status) => {
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
              <AvatarFallback>{manager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{manager.name}</CardTitle>
              <CardDescription>{manager.role} | {manager.hostel} Hostel</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="complaints" className="space-y-4">
          <TabsList>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="messoff">Mess Off Requests</TabsTrigger>
            <TabsTrigger value="inout">Hostel In/Out</TabsTrigger>
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
                          <TableCell>{complaint.complaintType}</TableCell>
                          <TableCell>{complaint.date}</TableCell>
                          <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">View Details</Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Complaint Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p><strong>Title:</strong> {complaint.title}</p>
                                    <p><strong>Student Name:</strong> {complaint.studentName}</p>
                                    <p><strong>Registration No.:</strong> {complaint.regNo}</p>
                                    <p><strong>Room No.:</strong> {complaint.roomNo}</p>
                                    <p><strong>Complaint Type:</strong> {complaint.complaintType}</p>
                                  </div>
                                  <div>
                                    <p><strong>Date:</strong> {complaint.date}</p>
                                    <p><strong>Status:</strong> {complaint.status}</p>
                                    <p><strong>Description:</strong> {complaint.description}</p>
                                  </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                  <Button size="sm" variant="outline">Update Status</Button>
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
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
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
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No new announcements at this time.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}