import { Suspense } from "react";
import StudentDashboard from "./stddash";

export default function Student() {
  return (
    <Suspense>
      <StudentDashboard />
    </Suspense>
  );
}
