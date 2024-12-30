import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import supabase from "../../../supabaseClient";

const ComplaintsTab = ({ complaints, setComplaints }) => {
    const handleResolve = async (id) => {  // Change id to cid here
        try {
          console.log("Resolving complaint with CID:", id);  // Update logging to match the new column name
      
          // Update the status in the Supabase database
          const { data, error } = await supabase
            .from("testcomplaint")
            .update({ status: "resolved" })
            .eq("serialNum", id);  // Use 'cid' here instead of 'id'
      
          if (error) {
            console.error("Error updating complaint:", error.message || error);
            return;
          }
      
          // Log data to confirm the update was successful
          console.log("Complaint updated successfully:", data);
      
          // Assuming setComplaints is available and works to update local state
          setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
              complaint.id === id ? { ...complaint, status: "resolved" } : complaint
            )
          );
        } catch (err) {
          console.error("Error resolving complaint:", err);
        }
    };
      


  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
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
                    <div className="flex gap-10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-400 hover:bg-green-600"
                          >
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
                                <strong>Room No.:</strong> {complaint.roomNo}
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
                                <strong>Description:</strong>{" "}
                                {complaint.description}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        className={`${
                          complaint.status === "resolved"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-400 hover:bg-blue-600"
                        } text-white`}
                        onClick={() => handleResolve(complaint.id)}
                        disabled={complaint.status === "resolved"}
                      >
                        {complaint.status === "resolved" ? "Resolved" : "Resolve"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ComplaintsTab;
