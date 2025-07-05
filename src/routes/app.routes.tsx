import { Route, Routes } from "react-router-dom";

import { About } from "@/pages/About";
import { AddPlan } from "@/pages/AddPlan";
import { Contact } from "@/pages/Contact";
import { EditPlan } from "@/pages/EditPlan";
import { Home } from "@/pages/Home";
import { Workout } from "@/pages/Workout";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="workout">
        <Route index element={<Workout />} />
        <Route path="addplan" element={<AddPlan />} />
        <Route path="editplan/:id" element={<EditPlan />} />
      </Route>
      <Route path="contact" element={<Contact />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}
