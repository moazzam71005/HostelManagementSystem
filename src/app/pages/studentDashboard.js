"use client";

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, BrushIcon, MessageSquare, Phone, UtensilsCrossed, LogOut } from 'lucide-react'

export default function StudentDashboard() {
  const [isCleaningRequested, setIsCleaningRequested] = useState(false)
  const [messOffDates, setMessOffDates] = useState({ requestDate: '', leavingDate: '', arrivalDate: '' })
  const [messOffError, setMessOffError] = useState('')

  // Mock student data
  const student = {
    name: "John Doe",
    roomNumber: "A-101",
    hostel: "Attar",
    profilePic: "/placeholder.svg"
  }

  // Mock emergency contacts
  const emergencyContacts = [
    { name: "Hostel Warden", number: "+92 300 1234567" },
    { name: "Campus Security", number: "+92 300 7654321" },
    { name: "Medical Emergency", number: "+92 300 1112223" }
  ]

  const handleCleaningRequest = () => {
    setIsCleaningRequested(true)
    // Here you would typically send a request to your backend
    console.log("Cleaning request sent for room", student.roomNumber)
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={student.profilePic} alt={student.name} />
              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <CardDescription>Room: {student.roomNumber} | Hostel: {student.hostel}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrushIcon className="w-4 h-4" />
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

          <Dialog>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Register Complaint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Click to submit a new complaint</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
                <DialogDescription>Describe your issue in detail. We'll get back to you as soon as possible.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="complaint-title">Complaint Title</Label>
                  <Input id="complaint-title" placeholder="Brief description of the issue" />
                </div>
                <div>
                  <Label htmlFor="complaint-type">Complaint Type</Label>
                  <Select>
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
                  <Textarea id="complaint-details" placeholder="Provide more information about your complaint" />
                </div>
                <Button type="submit">Submit Complaint</Button>
              </form>
            </DialogContent>
          </Dialog>

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