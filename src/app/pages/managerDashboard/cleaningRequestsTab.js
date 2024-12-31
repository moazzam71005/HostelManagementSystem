import React, { useState, useEffect } from "react";
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
import { Brush, UtensilsCrossed } from "lucide-react";
import supabase from "../../../supabaseClient";
import { Button } from "@/components/ui/button"; // Make sure to import Button here

const CleaningRequestsTab = ({ cleaningRequests }) => {
  const [updatedRequests, setUpdatedRequests] = useState(new Set()); // Set to track which requests have been updated

  // Handle the 'Update' button click
  const handleUpdate = async (id) => {
    try {
      // Update the status in the database to "cleaned"
      const { data, error } = await supabase
        .from("cleaning")
        .update({ status: "cleaned" })
        .eq("id", id);

      if (error) {
        console.error("Error updating status:", error);
        return;
      }

      // Add the updated ID to the set correctly (ensure immutability)
      setUpdatedRequests((prevUpdatedRequests) => {
        const newUpdatedRequests = new Set(prevUpdatedRequests);
        newUpdatedRequests.add(id);
        return newUpdatedRequests;
      });
    } catch (err) {
      console.error("Error handling update:", err);
    }
  };

  useEffect(() => {
    // When new data is fetched, reset the updated states (buttons reset)
    setUpdatedRequests(new Set());
  }, [cleaningRequests]); // This will run when `cleaningRequests` prop changes

  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brush className="w-5 h-5" />
          Cleaning Requests
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
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cleaningRequests.map((clean) => (
                <TableRow key={clean.id}>
                  <TableCell>{clean.studentName}</TableCell>
                  <TableCell>{clean.id}</TableCell>
                  <TableCell>{clean.roomNo}</TableCell>
                  <TableCell>{clean.time}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className={`${
                        clean.status === "pending" || updatedRequests.has(clean.id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-white hover:bg-blue-900 hover:text-white"
                      } text-black`}
                      onClick={() => handleUpdate(clean.id)}
                      disabled={clean.status === "cleaned" || updatedRequests.has(clean.id)}
                    >
                      {updatedRequests.has(clean.id) || clean.status === "cleaned" ? "Updated" : "Update"}
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

export default CleaningRequestsTab;
