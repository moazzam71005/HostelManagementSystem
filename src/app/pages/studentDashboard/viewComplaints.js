import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import supabase from "../../../supabaseClient";

const ViewComplaints = ({studentId}) => {
  const [complaints, setComplaints] = useState([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data, error } = await supabase
          .from("testcomplaint")
          .select("serialNum, complaintTitle, submitted_at, status") // Only select necessary fields
          .eq("cid", studentId); // Only fetch pending complaints

        if (error) throw error;

        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error.message);
      } 
    };

    fetchComplaints();
  }, []);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">Complaints</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint Title</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.serialNum}>

                  <TableCell>{complaint.complaintTitle}</TableCell>
                  <TableCell>{complaint.submitted_at}</TableCell>
                  <TableCell>{complaint.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ViewComplaints;
