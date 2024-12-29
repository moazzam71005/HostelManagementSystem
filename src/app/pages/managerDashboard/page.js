import ManagerDashboard from "./mngdash";
import { Suspense } from "react";

export default function Manager() {
  return (
    <Suspense>
      <ManagerDashboard />
    </Suspense>
  );
}
