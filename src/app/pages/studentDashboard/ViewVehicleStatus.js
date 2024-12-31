import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import supabase from "../../../supabaseClient";

const ViewVehicleStatus = ({ studentId }) => {
  const [vehicleStatus, setVehicleStatus] = useState([]);
  

  useEffect(() => {
    const fetchVehicleStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("testvehicles") // Assuming table name is "testvehicles"
          .select("vehicleName, status") // Only select necessary fields
          .eq("id", studentId); // Only fetch requests related to the current studentId

        if (error) throw error;

        setVehicleStatus(data);
      } catch (error) {
        console.error("Error fetching vehicle status:", error.message);
      } 
    };

    fetchVehicleStatus();
  }, [studentId]); // Dependency array updated to reload data when studentId changes



  return (
    <Card className="bg-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleStatus.map((vehicle) => (
                <TableRow key={vehicle.vehicleName}>
                  <TableCell>{vehicle.vehicleName}</TableCell>
                  <TableCell>{vehicle.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ViewVehicleStatus;
