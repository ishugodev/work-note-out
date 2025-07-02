import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from "uuid";

import { OLD_LOCAL_STORAGE_KEY, NEW_LOCAL_STORAGE_KEY } from '@/config/keys';

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
    checkedTodayWorkouts: {},
  });

  const saveDataToLocalStorage = (data: WorkoutData) => {
    setWorkoutData(data);
    localStorage.setItem(NEW_LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const loadDataFromLocalStorage = () => {
    const oldKey = OLD_LOCAL_STORAGE_KEY;
    const newKey = NEW_LOCAL_STORAGE_KEY;

    const oldData = localStorage.getItem(oldKey);

    if (oldData) {
      const parsedData = JSON.parse(oldData);
      
      parsedData.currentIndexWeek = getCurrentIndexWeek(parsedData.weeklyPlans);

      localStorage.setItem(newKey, JSON.stringify(parsedData));
      localStorage.removeItem(oldKey);

      saveDataToLocalStorage(parsedData);
    }

    const newData = localStorage.getItem(newKey);

    const today = new Date().toISOString().slice(0, 10);

    if (newData) {
      const parsedData = JSON.parse(newData);

      parsedData.currentIndexWeek = getCurrentIndexWeek(parsedData.weeklyPlans);

      if (!parsedData.checkedTodayWorkouts[today]) {
        parsedData.checkedTodayWorkouts[today] = [];
      }

      saveDataToLocalStorage(parsedData);
    } else {
      const initialData = {
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
        checkedTodayWorkouts: {},
      };

      saveDataToLocalStorage(initialData);
    }
  };

  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  const toggleExerciseCheck = (exerciseId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    const todayChecked = workoutData.checkedTodayWorkouts[today] || [];

    const isChecked = todayChecked.includes(exerciseId);

    const updatedChecked = isChecked
    ? todayChecked.filter(id => id !== exerciseId)
    : [...todayChecked, exerciseId];

    const updatedData = {
      ...workoutData,
      checkedTodayWorkouts: {
        ...workoutData.checkedTodayWorkouts,
        [today]: updatedChecked,
      },
    };

    saveDataToLocalStorage(updatedData);
  }

  const toggleSetConfig = (exerciseId: string) => {
    const updatedExercises = workoutData.exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        const currentSetConfig = exercise.setConfig ?? "simple";
        const newSetConfig = (currentSetConfig === "simple" ? "detailed" : "simple") as "simple" | "detailed";

        return {
          ...exercise,
          setConfig: newSetConfig,
          updatedAt: new Date().toISOString(),
        };
      }

      return exercise;
    });

    const updatedPlannedWorkouts = workoutData.plannedWorkouts.map(workout => {
      const updatedWorkoutExercises = workout.exercises.map(exercise => {
        if (exercise.id === exerciseId) {
          const currentSetConfig = exercise.setConfig ?? "simple";
          const newSetConfig = (currentSetConfig === "simple" ? "detailed" : "simple") as "simple" | "detailed";

          return {
            ...exercise,
            setConfig: newSetConfig,
            updatedAt: new Date().toISOString(),
          };
        }

        return exercise;
      });

      return {
        ...workout,
        exercises: updatedWorkoutExercises,
        updatedAt: new Date().toISOString(),
      }
    });

    const updatedData = {
      ...workoutData,
      exercises: updatedExercises,
      plannedWorkouts: updatedPlannedWorkouts,
    };

    saveDataToLocalStorage(updatedData);
  }

  const removeDuplicateExercises = (exercises: Exercise[]) => {
    const map = new Map<string, Exercise>();
    for (const ex of exercises) {
      const key = ex.name.trim().toLowerCase();
      map.set(key, ex); // sobrescreve duplicados, mantém o último
    }
    return Array.from(map.values());
  };

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

    const updatedPlannedWorkouts = workoutData.plannedWorkouts.map((workout) => {
      const updatedWorkoutExercises = workout.exercises.filter((ex) => ex.id !== exerciseId);
      return {
        ...workout,
        exercises: updatedWorkoutExercises,
      };
    });

    const updatedData = {
      ...workoutData,
      exercises: updatedExercises,
      plannedWorkouts: updatedPlannedWorkouts,
    };
    
    saveDataToLocalStorage(updatedData);
  };

  const addWorkout = (workout: WorkoutPlan) => {
    const existingExercises = workoutData.exercises;
    const newExercises = workout.exercises || [];

    const filteredNewExercises = newExercises.filter(ne =>
      !existingExercises.some(ee =>
        ee.name.trim().toLowerCase() === ne.name.trim().toLowerCase()
      )
    );

    const updatedData = {
      ...workoutData,
      plannedWorkouts: [...workoutData.plannedWorkouts, workout],
      exercises: [...existingExercises, ...filteredNewExercises],
    };

    saveDataToLocalStorage(updatedData);
  };

  const editWorkout = (workoutId: string, updatedWorkout: WorkoutPlan) => {
    const updatedWorkouts = workoutData.plannedWorkouts.map((workout) =>
      workout.id === workoutId ? { ...workout, ...updatedWorkout, updatedAt: new Date().toISOString() } : workout
    );

    const existingExercises = workoutData.exercises;
    const newExercises = updatedWorkout.exercises || [];

    const combinedExercises = [
      ...existingExercises.filter(
        ex => !newExercises.some(ne => ne.id === ex.id)
      ),
      ...newExercises,
    ];

    const updatedData = {
      ...workoutData,
      plannedWorkouts: updatedWorkouts,
      exercises: removeDuplicateExercises(combinedExercises),
    };
    
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
    toggleSetConfig,
  };
};

export default useWorkout;
