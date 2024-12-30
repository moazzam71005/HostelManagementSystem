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

const VehicleRegisterTab = ({ vehicleRegister, setVehicleRegister }) => {
  const handleApprove = async (id) => {
    try {
      console.log("Approving vehicle registration with ID:", id);

      // Update the status in the Supabase database
      const { data, error } = await supabase
        .from("testvehicles")
        .update({ status: "approved" })
        .eq("id", id);  // Use 'id' to identify the vehicle registration

      if (error) {
        console.error("Error updating request:", error.message || error);
        return;
      }

      // Log data to confirm the update was successful
      console.log("Vehicle registration approved successfully:", data);

      // Update the local state using setVehicleRegister
      setVehicleRegister((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, status: "approved" } : vehicle
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
          Vehicle Registration
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
                <TableHead>Vehicle Type</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Vehicle Name</TableHead>
                <TableHead>Engine No.</TableHead>
                <TableHead>Chassis No.</TableHead>
                <TableHead>Owner Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleRegister.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.studentName}</TableCell>
                  <TableCell>{vehicle.regNo}</TableCell>
                  <TableCell>{vehicle.roomNo}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.vehicleName}</TableCell>
                  <TableCell>{vehicle.engineNum}</TableCell>
                  <TableCell>{vehicle.chassisNum}</TableCell>
                  <TableCell>{vehicle.ownerName}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className={`${
                        vehicle.status === "approved"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-400 hover:bg-blue-600"
                      } text-white`}
                      onClick={() => handleApprove(vehicle.id)}
                      disabled={vehicle.status === "approved"}
                    >
                      {vehicle.status === "approved" ? "Approved" : "Approve"}
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

export default VehicleRegisterTab;
