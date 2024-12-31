import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import supabase from "../../../supabaseClient";

const ViewMessOffStatus = ({ studentId }) => {
  const [messOffRequests, setMessOffRequests] = useState([]);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessOffStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("testmess") // Assuming table name is "messOffRequests"
          .select("requestDate, status") // Only select necessary fields
          .eq("id", studentId); // Only fetch requests related to the current studentId

        if (error) throw error;

        setMessOffRequests(data);
      } catch (error) {
        console.error("Error fetching mess off status:", error.message);
      } 
    };

    fetchMessOffStatus();
  }, [studentId]); // Dependency array updated to reload data when studentId changes

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">Mess Off Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messOffRequests.map((request) => (
                <TableRow key={request.requestDate}>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ViewMessOffStatus;
