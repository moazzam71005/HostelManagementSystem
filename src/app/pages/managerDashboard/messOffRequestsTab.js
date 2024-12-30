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
import { Button } from "@/components/ui/button";
import { UtensilsCrossed } from "lucide-react";
import supabase from "../../../supabaseClient";

const MessOffRequestsTab = ({ messOffRequests, setMessOffRequests }) => {
  const handleApprove = async (id) => {
    try {
      console.log("Approving mess off request with ID:", id);

      // Update the status in the Supabase database
      const { data, error } = await supabase
        .from("testmess")
        .update({ status: "approved" })
        .eq("seqNum", id);  // Use 'id' to identify the request

      if (error) {
        console.error("Error updating request:", error.message || error);
        return;
      }

      // Log data to confirm the update was successful
      console.log("Request approved successfully:", data);

      // Update the local state using setMessOffRequests
      setMessOffRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status: "approved" } : request
        )
      );
    } catch (err) {
      console.error("Error approving request:", err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">Approved</span>;
      case "pending":
        return <span className="text-yellow-500">Pending</span>;
      case "rejected":
        return <span className="text-red-500">Rejected</span>;
      default:
        return <span className="text-gray-500">Unknown</span>;
    }
  };

  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
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
                <TableHead>Action</TableHead>
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
                  <TableCell>
                    <Button
                      size="sm"
                      className={`${
                        request.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-400 hover:bg-blue-600"
                      } text-white`}
                      onClick={() => handleApprove(request.id)}
                      disabled={request.status === "approved"}
                    >
                      {request.status === "approved" ? "Approved" : "Approve"}
                    </Button>
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

export default MessOffRequestsTab;
