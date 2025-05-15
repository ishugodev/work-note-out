import { Route, Routes } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Workout } from "@/pages/Workout";
import { AddPlan } from "@/pages/AddPlan";
import { EditPlan } from "@/pages/EditPlan";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="workout">
        <Route index element={<Workout />} />
        <Route path="addplan" element={<AddPlan />} />
        <Route path="editplan/:id" element={<EditPlan />} />
      </Route>
    </Routes>
  );
}
