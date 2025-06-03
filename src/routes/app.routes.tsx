import { Route, Routes } from "react-router-dom";

import { AddPlan } from "@/pages/AddPlan";
import { EditPlan } from "@/pages/EditPlan";
import { Exercises } from "@/pages/Exercises";
import { Home } from "@/pages/Home";
import { Workout } from "@/pages/Workout";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="exercises" element={<Exercises />} />
      <Route path="workout">
        <Route index element={<Workout />} />
        <Route path="addplan" element={<AddPlan />} />
        <Route path="editplan/:id" element={<EditPlan />} />
      </Route>
    </Routes>
  );
}
