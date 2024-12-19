'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Brush, MessageSquare, Phone, UtensilsCrossed, LogOut, UserCircle, Car } from 'lucide-react'
import supabase from "../../../supabaseClient"
import ComplaintForm from '../complaintForm'

export default function StudentDashboard() {
  const [isCleaningRequested, setIsCleaningRequested] = useState(false)
  const [messOffDates, setMessOffDates] = useState({ requestDate: '', leavingDate: '', arrivalDate: '' })
  const [messOffError, setMessOffError] = useState('')

  // Mock student data - replace with actual data fetching logic
  const [student, setStudent] = useState({
    name: "John Doe",
    fathersName: "Michael Doe",
    email: "john.doe@example.com",
    contactNo: "+92 300 1234567",
    registrationNo: "2021CS101",
    school: "SEECS",
    batch: "2021",
    discipline: "Computer Science",
    hostel: "Beruni",
    roomNo: "A-101",
    gender: "Male",
    profilePic: "/placeholder.svg"
  })


  useEffect(() => {
    const fetchStudentData = async () => {
      const { data, error } = await supabase
        .from("testuser") // Replace "students" with your table name
        .select("*")
        .eq("email", "masterdawg@gmail.com"); // Adjust the filter as needed (e.g., by ID, registration number, etc.)

      if (error) {
        console.error("Error fetching student data:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const fetchedStudent = data[0];
        setStudent({
          name: fetchedStudent.name,
          fathersName: fetchedStudent.fatherName,
          email: fetchedStudent.email,
          contactNo: fetchedStudent.contactno,
          registrationNo: fetchedStudent.id,
          school: fetchedStudent.school,
          batch: fetchedStudent.batch,
          discipline: fetchedStudent.discipline,
          hostel: fetchedStudent.hostel,
          roomNo: fetchedStudent.roomno,
          gender: fetchedStudent.gender,
          profilePic: "/placeholder.svg",
        });
      }
    };

    fetchStudentData();
  }, []);



  // Mock emergency contacts
  const emergencyContacts = [
    { name: "Hostel Warden", number: "+92 300 1234567" },
    { name: "Campus Security", number: "+92 300 7654321" },
    { name: "Medical Emergency", number: "+92 300 1112223" }
  ]

  const handleCleaningRequest = () => {
    setIsCleaningRequested(true)
    // Here you would typically send a request to your backend
    console.log("Cleaning request sent for room", student.roomNo)
    setTimeout(() => setIsCleaningRequested(false), 5000) // Reset after 5 seconds
  }

  const handleMessOffSubmit = (e) => {
    e.preventDefault()
    const { leavingDate, arrivalDate } = messOffDates
    const diffTime = Math.abs(new Date(arrivalDate) - new Date(leavingDate))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays > 14) {
      setMessOffError("Mess can't be off for more than 14 days")
    } else {
      setMessOffError('')
      console.log("Mess off request submitted:", messOffDates)
      // Here you would send the request to your backend
    }
  }

  const handleMessOffChange = (e) => {
    setMessOffDates({ ...messOffDates, [e.target.name]: e.target.value })
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Here you would typically send the updated profile data to your backend
    console.log("Profile update submitted:", student)
    // After successful update, you might want to show a success message or close the dialog
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setStudent(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={student.profilePic} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>Room: {student.roomNo} | Hostel: {student.hostel}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <UserCircle className="w-4 h-4 mr-2" />
                  View/Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" value={student.name} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fathersName">Father&apos;s Name</Label>
                      <Input id="fathersName" name="fathersName" value={student.fathersName} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" value={student.email} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNo">Contact No.</Label>
                      <Input id="contactNo" name="contactNo" value={student.contactNo} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNo">Registration No.</Label>
                      <Input id="registrationNo" name="registrationNo" value={student.registrationNo} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Select name="school" value={student.school} onValueChange={(value) => handleProfileChange({ target: { name: 'school', value } })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select School" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SEECS">SEECS</SelectItem>
                          <SelectItem value="NICE">NICE</SelectItem>
                          <SelectItem value="SMME">SMME</SelectItem>
                          <SelectItem value="SCME">SCME</SelectItem>
                          <SelectItem value="IGIS">IGIS</SelectItem>
                          <SelectItem value="ASAB">ASAB</SelectItem>
                          <SelectItem value="SNS">SNS</SelectItem>
                          <SelectItem value="S3H">S3H</SelectItem>
                          <SelectItem value="SADA">SADA</SelectItem>
                          <SelectItem value="NBS">NBS</SelectItem>
                          <SelectItem value="SINES">SINES</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch</Label>
                      <Input id="batch" name="batch" value={student.batch} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discipline">Discipline</Label>
                      <Input id="discipline" name="discipline" value={student.discipline} onChange={handleProfileChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hostel">Hostel</Label>
                      <Input id="hostel" name="hostel" value={student.hostel} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roomNo">Room No.</Label>
                      <Input id="roomNo" name="roomNo" value={student.roomNo} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" name="gender" value={student.gender} readOnly />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Save Changes</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brush className="w-4 h-4" />
                Room Cleaning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleCleaningRequest} 
                disabled={isCleaningRequested}
                className="w-full"
              >
                {isCleaningRequested ? "Request Sent" : "Request Cleaning"}
              </Button>
            </CardContent>
          </Card>

          <div>
            <ComplaintForm />
          </div>





          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Emergency Contacts
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
                    <a href={`tel:${contact.number}`} className="text-blue-600 hover:underline">{contact.number}</a>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    Mess Off
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Request mess off for your absence</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Mess Off</DialogTitle>
                <DialogDescription>Please provide the dates for your mess off request</DialogDescription>
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
                {messOffError && <p className="text-red-500 text-sm">{messOffError}</p>}
                <Button type="submit">Submit Request</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Hostel In/Out
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Register your hostel entry/exit</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hostel In/Out</DialogTitle>
                <DialogDescription>Please provide details for your hostel entry/exit</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input id="purpose" placeholder="Reason for leaving/entering" required />
                </div>
                <div>
                  <Label htmlFor="placeOfLeave">Place of Leave</Label>
                  <Input id="placeOfLeave" placeholder="Where are you going?" required />
                </div>
                <div>
                  <Label htmlFor="dateOfLeave">Date of Leave</Label>
                  <Input id="dateOfLeave" type="date" required />
                </div>
                <div>
                  <Label htmlFor="dateOfArrival">Date of Arrival</Label>
                  <Input id="dateOfArrival" type="date" required />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Register Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Register your vehicle for campus parking</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Vehicle</DialogTitle>
                <DialogDescription>Please provide details about your vehicle</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select>
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
                  <Input id="model" placeholder="Vehicle model" required />
                </div>
                <div>
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input id="name" placeholder="Vehicle name" required />
                </div>
                <div>
                  <Label htmlFor="registrationNo">Registration No.</Label>
                  <Input id="registrationNo" placeholder="Vehicle registration number" required />
                </div>
                <div>
                  <Label htmlFor="registrationCity">Registration City</Label>
                  <Input id="registrationCity" placeholder="City of registration" required />
                </div>
                <div>
                  <Label htmlFor="engineNo">Engine No.</Label>
                  <Input id="engineNo" placeholder="Engine number" required />
                </div>
                <div>
                  <Label htmlFor="chassisNo">Chassis No.</Label>
                  <Input id="chassisNo" placeholder="Chassis number" required />
                </div>
                <div>
                  <Label htmlFor="ownerName">Owner Name</Label>
                  <Input id="ownerName" placeholder="Name of the vehicle owner" required />
                </div>
                <Button type="submit">Register Vehicle</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
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