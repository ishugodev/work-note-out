type WorkoutContentProps = {
  name: string;
  gifUrl: string;
  kg?: number | undefined;
};

export function WorkoutContent(props: WorkoutContentProps) {
  return (
    <a className="flex gap-3">
      <img src={props.gifUrl} className="w-20 h-20 object-contain rounded-md" />

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
