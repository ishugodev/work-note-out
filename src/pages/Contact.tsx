import { Linkedin, Github } from "lucide-react";

import { SideMenu } from "@/components/SideMenu";

export function Contact() {
  return (
    <div className="max-h-full min-h-screen bg-zinc-100 p-5 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto mb-32 mt-8 max-w-screen-sm animate-pageFadeIn">
        <SideMenu />
        <h1 className="mb-4 animate-titleFadeIn text-2xl font-semibold">
          Contact me
        </h1>

        <div className="flex flex-col gap-4">
          <p>
            Want to get in touch or contribute to the project? Check out the
            links below:
          </p>
          <a
            href="https://linkedin.com/in/ishugo"
            target="_blank"
            className="flex items-center gap-2 text-xl underline"
            rel="noopener noreferrer"
            aria-label="Visit my LinkedIn profile"
            title="My LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
            My LinkedIn
          </a>

          <a
            href="https://github.com/ishugodev/work-note-out/issues"
            target="_blank"
            className="flex items-center gap-2 text-xl underline"
            rel="noopener noreferrer"
            aria-label="Open GitHub issues page to report a bug"
            title="GitHub Issues"
          >
            <Github className="h-5 w-5" />
            GitHub Issues
          </a>
        </div>
        <p className="mt-4 text-sm italic text-zinc-500">
          Thanks for using Work Note Out. Your feedback is always appreciated!
        </p>
      </div>
    </div>
  );
}
