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
import { UtensilsCrossed } from "lucide-react";
import supabase from "../../../supabaseClient";

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

      // Add the updated ID to the set
      setUpdatedRequests((prevUpdatedRequests) => new Set(prevUpdatedRequests.add(id)));
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
          <UtensilsCrossed className="w-5 h-5" />
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
                    <button
                      onClick={() => handleUpdate(clean.id)}
                      className={`${
                        updatedRequests.has(clean.id)
                          ? "bg-gray-400 cursor-not-allowed"  // Dull color and disabled state
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white p-2 rounded`}
                      disabled={updatedRequests.has(clean.id)} // Disable button if updated
                    >
                      {updatedRequests.has(clean.id) ? "Updated" : "Update"} {/* Change text to 'Updated' */}
                    </button>
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
