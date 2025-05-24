declare global {
  type Exercise = {
    id: string;
    type: "reps" | "time";
    name: string;
    sets: number;
    min: number;
    sec: number;
    reps: number;
    kg: number;
    restTime: number;
    createdAt: string;
    updatedAt: string;
  };

  type CheckedTodayWorkouts = string[];

  type WorkoutPlan = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    exercises: Exercise[];
  };

  type WeeklyPlan = {
    id: string;
    createdAt: string;
    updatedAt: string;
    days: {
      [key in Weekday]?: WeeklyPlanDay;
    };
  };

  type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

  type WeeklyPlanDay = {
    id: string;
    workoutId: string[];
  };

  type WorkoutData = {
    exercises: Exercise[];
    plannedWorkouts: WorkoutPlan[];
    weeklyPlans: WeeklyPlan[];
    currentIndexWeek: number;
    checkedTodayWorkouts: CheckedTodayWorkouts;
  };
}

export {};
