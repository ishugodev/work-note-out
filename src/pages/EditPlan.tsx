import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/Button";
import { GoBack } from "@/components/GoBack";
import { NavigatorBar } from "@/components/NavigatorBar";
import { WorkoutPlan } from "@/components/WorkoutPlan";
import useWorkout from "@/hooks/useWorkout";

export function EditPlan() {
  const params = useParams<{ id: string }>();
  const planId = params.id;

  const navigate = useNavigate();

  const { removeWorkout } = useWorkout();

  async function handleDelete() {
    if (!planId) return;

    try {
      await removeWorkout(planId);
      alert("Workout plan deleted successfully.");
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Failed to delete workout plan. Please, try again.");
    }
  }

  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex justify-between">
        <GoBack />
        <Button
          className="text-red-600 dark:text-red-500"
          onClick={handleDelete}
        >
          Delete this plan
        </Button>
      </div>
      <div id="editPlan" className="mb-32 mt-6">
        <h1 className="mb-4 text-2xl">Edit workout plan</h1>

        {planId && <WorkoutPlan key={planId} mode="edit" planId={planId} />}

      </div>

      <NavigatorBar />
    </div>
  );
}
