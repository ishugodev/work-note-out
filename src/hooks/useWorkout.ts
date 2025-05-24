import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

const getCurrentIndexWeek = (weeklyPlans: WeeklyPlan[]) => {
  if (weeklyPlans.length < 1) return 0;

  const firstDate = new Date(weeklyPlans[0].updatedAt);
  const now = new Date();

  const weeksPassed = Math.floor(
    (now.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  return weeksPassed % weeklyPlans.length;
};

const useWorkout = () => {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    exercises: [],
    plannedWorkouts: [],
    weeklyPlans: [
      {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        days: {},
      },
    ],
    currentIndexWeek: 0,
    checkedTodayWorkouts: [],
  });

  const saveDataToLocalStorage = (data: WorkoutData) => {
    setWorkoutData(data);
    localStorage.setItem('@myworkoutapp', JSON.stringify(data));
  };

  const loadDataFromLocalStorage = () => {
    const storedData = localStorage.getItem('@myworkoutapp');
  
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      parsedData.currentIndexWeek = getCurrentIndexWeek(parsedData.weeklyPlans);

      saveDataToLocalStorage(parsedData);
    } else {
      const initialData: WorkoutData = {
        exercises: [],
        plannedWorkouts: [],
        weeklyPlans: [
          {
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            days: {},
          },
        ],
        currentIndexWeek: 0,
        checkedTodayWorkouts: [],
      };
  
      saveDataToLocalStorage(initialData);
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  const toggleExerciseCheck = (exerciseId: string) => {
    const isChecked = workoutData.checkedTodayWorkouts.includes(exerciseId);

    const updatedChecked = isChecked
    ? workoutData.checkedTodayWorkouts.filter(id => id !== exerciseId)
    : [...workoutData.checkedTodayWorkouts, exerciseId];

    const updatedData = {
      ...workoutData,
      checkedTodayWorkouts: updatedChecked,
    };

    saveDataToLocalStorage(updatedData); 
  }

  const addExercise = (exercise: Exercise) => {
    const updatedData = { ...workoutData, exercises: [...workoutData.exercises, exercise] };
    saveDataToLocalStorage(updatedData);
  };

  const editExercise = (exerciseId: string, updatedExercise: Exercise) => {
    const updatedExercises = workoutData.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, ...updatedExercise, updatedAt: new Date().toISOString() } : ex
    );
    const updatedData = { ...workoutData, exercises: updatedExercises };
    saveDataToLocalStorage(updatedData);
  };

  const removeExercise = (exerciseId: string) => {
    const updatedExercises = workoutData.exercises.filter((ex) => ex.id !== exerciseId);
    const updatedData = { ...workoutData, exercises: updatedExercises };
    saveDataToLocalStorage(updatedData);
  };

  const addWorkout = (workout: WorkoutPlan) => {
    const updatedData = { ...workoutData, plannedWorkouts: [...workoutData.plannedWorkouts, workout] };
    saveDataToLocalStorage(updatedData);
  };

  const editWorkout = (workoutId: string, updatedWorkout: WorkoutPlan) => {
    const updatedWorkouts = workoutData.plannedWorkouts.map((workout) =>
      workout.id === workoutId ? { ...workout, ...updatedWorkout, updatedAt: new Date().toISOString() } : workout
    );
    const updatedData = { ...workoutData, plannedWorkouts: updatedWorkouts };
    saveDataToLocalStorage(updatedData);
  };

  const removeWorkout = (workoutId: string) => {
    const updatedWorkouts = workoutData.plannedWorkouts.filter(
      (workout) => workout.id !== workoutId
    );
  
    const updatedWeeklyPlans = workoutData.weeklyPlans.map((plan) => {
      const updatedDays: typeof plan.days = {};

      for (const dayKey in plan.days) {
        const day = plan.days[dayKey as Weekday];
        if (!day) continue;

        const filteredIds = day.workoutId.filter((id) => id !== workoutId);

        if (filteredIds.length > 0) {
          updatedDays[dayKey as Weekday] = {
            ...day,
            workoutId: filteredIds,
          };
        }
      }

      return {
        ...plan,
        days: updatedDays,
      };
    });
  
    const updatedData = {
      ...workoutData,
      plannedWorkouts: updatedWorkouts,
      weeklyPlans: updatedWeeklyPlans,
    };
  
    saveDataToLocalStorage(updatedData);
  };
  

  const addWeeklyPlan = () => {
    const updatedData = {
      ...workoutData,
      weeklyPlans: [
        ...workoutData.weeklyPlans,
        {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          days: {},
        },
      ]
    };
    saveDataToLocalStorage(updatedData);
  };

  const editWeeklyPlan = (planId: string, updatedPlan: WeeklyPlan) => {
    const updatedPlans = workoutData.weeklyPlans.map((plan) => {
      if (plan.id !== planId) return plan;
      
      const newDays: typeof plan.days = {};
      
      for (const [day, dayData] of Object.entries(updatedPlan.days)) {
        newDays[day as Weekday] = {
          id: dayData.id,
          workoutId: [...dayData.workoutId],
        };
      }
      
      return {
        ...plan,
        id: plan.id,
        createdAt: plan.createdAt,
        days: newDays,
        updatedAt: new Date().toISOString(),
      };
    });
    
    const updatedData = {
      ...workoutData,
      weeklyPlans: updatedPlans,
    };

    saveDataToLocalStorage(updatedData);
  };

  const removeWeeklyPlan = (planId: string) => {
    const updatedPlans = workoutData.weeklyPlans.filter((plan) => plan.id !== planId);
    const updatedData = { ...workoutData, weeklyPlans: updatedPlans };
    saveDataToLocalStorage(updatedData);
  };

  return {
    workoutData,
    addExercise,
    editExercise,
    removeExercise,
    addWorkout,
    editWorkout,
    removeWorkout,
    addWeeklyPlan,
    editWeeklyPlan,
    removeWeeklyPlan,
    toggleExerciseCheck,
  };
};

export default useWorkout;
