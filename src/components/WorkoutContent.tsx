type WorkoutContentProps = {
  name: string;
  gifUrl: string;
  kg?: number | undefined;
};

export function WorkoutContent(props: WorkoutContentProps) {
  return (
    <a className="flex gap-3">
      <img src={props.gifUrl} className="h-20 w-20 rounded-md object-contain" />

      <div className="flex flex-col justify-between">
        <span className="">{props.name}</span>

        <div className="flex flex-col">
          <span className="text-sm dark:text-zinc-400">Your weight</span>
          <span>{props.kg}</span>
          <span>kg</span>
        </div>
      </div>
    </a>
  );
}
