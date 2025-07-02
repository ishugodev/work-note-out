declare global {
  type Exercise = {
    id: string;
    type: "reps" | "time";
    name: string;
    muscleGroup: string;
    min: number;
    sec: number;
    setConfig: "simple" | "detailed";
    repsRange: boolean;
    simpleSet: SimpleSet;
    detailedSets: DetailedSet[];
    restTime: number;
    createdAt: string;
    updatedAt: string; 
  };

  type SetType = "normal" | "warmup" | "feeder" | "working" | "failure" | "drop" | "cluster";

  type SimpleSet = {
    sets: number;
    reps?: number;
    minReps?: number;
    maxReps?: number;
    kg: number;
  };

  type DetailedSet = {
    setType: SetType;
    reps?: number;
    minReps?: number;
    maxReps?: number;
    kg: number;
  };

  type CheckedTodayWorkouts = {
    [date: string]: string[];
  };

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
