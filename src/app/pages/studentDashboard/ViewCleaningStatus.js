import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "../../../supabaseClient";

const ViewCleaningStatus = ({ studentId }) => {
  const [cleaningStatus, setCleaningStatus] = useState([]);


  useEffect(() => {
    const fetchCleaningStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("cleaning") // Assuming the table name is "cleaning"
          .select("status, req_date") // Only select necessary fields
          .eq("id", studentId); // Only fetch cleaning requests for the current studentId

        if (error) throw error;

        setCleaningStatus(data);
      } catch (error) {
        console.error("Error fetching cleaning status:", error.message);
      } 
    };

    fetchCleaningStatus();
  }, [studentId]); // Dependency array updated to reload data when studentId changes



  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">Cleaning Status</CardTitle>
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
              {cleaningStatus.map((cleaning) => (
                <TableRow key={cleaning.req_date}>
                  <TableCell>{cleaning.req_date}</TableCell>
                  <TableCell>{cleaning.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ViewCleaningStatus;
