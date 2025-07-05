import { Github } from "lucide-react";

import { SideMenu } from "@/components/SideMenu";

export function About() {
  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto mb-32 mt-8 max-w-screen-sm animate-pageFadeIn">
        <SideMenu />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <h1 className="animate-titleFadeIn text-2xl font-semibold">
              About
            </h1>
            <p className="text-sm text-zinc-500">
              Current version: <strong>v1.0.0</strong>
            </p>
          </div>

          <div className="space-y-4 text-base leading-relaxed">
            <p>
              <strong>Work Note Out</strong> is a simple exercise note-taking
              app focused on helping you plan and keep track of your workout
              routines throughout the week.
            </p>

            <p>
              With it, you can create custom workout plans by selecting and
              organizing exercises, and assign those plans to specific days of
              the week. The assigned plans show up on the home screen, making it
              easy to follow your schedule.
            </p>

            <p>
              At the moment, the app does not store workout history or logs. Its
              focus is purely on planning and viewing your weekly routine in a
              clean and practical way.
            </p>

            <p>
              Work Note Out was created as a personal project by a developer
              passionate about fitness and simplicity. It’s designed to stay out
              of your way and let you focus on what matters: training.
            </p>
          </div>

          <hr className="mb-2 mt-4 border-t border-zinc-700 text-center text-sm text-zinc-500" />

          <div className="grid gap-1">
            <h2 className="text-base font-semibold">What’s coming next?</h2>
            <p className="text-sm text-zinc-500">
              I’m already thinking ahead. Here’s what’s planned for future
              versions:
            </p>
            <ul className="grid list-inside list-disc gap-0.5 text-sm">
              <li>Workout history tracking</li>
              <li>Progress logs</li>
              <li>Week templates</li>
            </ul>
          </div>

          <a
            href="https://github.com/ishugodev/work-note-out"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm underline"
          >
            <Github className="h-4 w-4" />
            View project on GitHub
          </a>

          <hr className="mb-2 mt-4 border-t border-zinc-700 text-center text-sm text-zinc-500" />

          <p className="text-center text-sm text-zinc-500">
            Made with pain and gain by&nbsp;
            <a
              href="https://github.com/ishugodev"
              target="_blank"
              rel="noopener noreferrer"
              className="italic underline"
            >
              @ishugodev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
