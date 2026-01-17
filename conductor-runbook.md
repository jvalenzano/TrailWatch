Below is a Mac-focused, step‑by‑step script you can drop into your repo and have Gemini/Anti‑Gravity walk you through. Each step assumes you are on macOS, in Anti‑Gravity, using its integrated terminal. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)

***

## Section 0 – How to use this file

- Treat this file as a **runbook**: read one step, do exactly that step, then ask Gemini in Anti‑Gravity, “What is my next step according to the runbook?”.
- Stay inside the project workspace in Anti‑Gravity; use the built‑in terminal at the bottom for all commands. [dev](https://dev.to/blamsa0mine/google-antigravity-public-preview-what-it-is-how-it-works-and-what-the-limits-really-mean-4pe)

***

## Section 1 – One‑time prerequisites (Mac)

1. In Anti‑Gravity, open the project folder you want to use with Conductor.
2. Open the terminal in Anti‑Gravity (e.g., View → Terminal, or the terminal icon; you should see a shell prompt like `my-mac ~ %`). [dev](https://dev.to/blamsa0mine/google-antigravity-public-preview-what-it-is-how-it-works-and-what-the-limits-really-mean-4pe)
3. Check you have Git: run `git --version`. If it prints a version (e.g., `git version 2.x`), you are good. [github](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md)
4. Check you have Node.js or Python (at least one is fine, Node is typical for Gemini CLI):
   - Run `node -v`. If that fails, install Node LTS from nodejs.org before continuing. [github](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md)
5. Check you have `gemini`:
   - Run `gemini --help`.
   - If the command is **not found**, install Gemini CLI following its official install instructions (for example, `npm install -g @google/gemini-cli`), then re‑open Anti‑Gravity so the PATH updates. [youtube](https://www.youtube.com/watch?v=e-iIoMjowQY)
6. In your browser, go to the Gemini developer console / AI Studio and create an API key for Gemini 3. Copy the key. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
7. Back in the Anti‑Gravity terminal, set the key for this terminal session:  
   `export GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"`  
   (You must do this again after restarting Anti‑Gravity or the terminal.) [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)

***

## Section 2 – Initialize the repo and context files

1. In the Anti‑Gravity terminal, ensure you are in your project root:
   - If needed, run `pwd` to see the current path.
   - If you are not in the right folder, use `cd` to navigate to your workspace folder (for example, `cd ~/dev/my-gemini-app`). [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
2. Initialize Git if not already done:
   - Run `git init`. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
3. In Anti‑Gravity’s file explorer, create these Markdown files in the project root:
   - `product.md`
   - `tech-stack.md`
   - `workflow-guidelines.md` [youtube](https://www.youtube.com/watch?v=I2O93hMH5ZI)
4. Fill them with short bullet points (you can ask Gemini in the editor to draft them, then edit):
   - `product.md`: what you’re building, who it’s for, core features. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
   - `tech-stack.md`: languages, frameworks, libraries, target platforms, any “must” or “must not” decisions. [infoq](https://www.infoq.com/news/2026/01/google-conductor/)
   - `workflow-guidelines.md`: testing expectations, code style preferences, branching strategy, review expectations. [linkedin](https://www.linkedin.com/posts/markcartertm_conductor-introducing-context-driven-development-activity-7408247564485136384-Zkla)

***

## Section 3 – Install and enable Conductor extension

1. In the Anti‑Gravity terminal (project root), install Conductor:  
   `gemini extensions install https://github.com/gemini-cli-extensions/conductor` [geminicli](https://geminicli.com/extensions/)
2. Enable the extension for this workspace:  
   `gemini extensions enable conductor --scope=workspace` [github](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md)
3. Confirm it is registered:
   - Run `gemini extensions list` and look for `conductor` in the list. [github](https://github.com/google-gemini/gemini-cli/blob/main/docs/extensions/index.md)
4. Test the extension’s help:
   - Run `gemini /conductor:help`  
   - You should see commands like `/conductor:setup`, `/conductor:newTrack`, `/conductor:implement`. [youtube](https://www.youtube.com/watch?v=TT9LtLeI5nk)

***

## Section 4 – Run Conductor setup (Establish project context)

1. In the Anti‑Gravity terminal, from the project root, run:  
   `gemini /conductor:setup` [youtube](https://www.youtube.com/watch?v=I2O93hMH5ZI)
2. Conductor will ask questions about your product, tech stack, and workflow.
   - Answer in simple language; it will synthesize that into Markdown context files (often under a `conductor/` or similar directory, depending on the version). [youtube](https://www.youtube.com/watch?v=I2O93hMH5ZI)
3. After setup completes, use Anti‑Gravity’s file explorer to open the new Conductor files (for example: `conductor/product.md`, `conductor/stack.md`, `conductor/workflow.md`—names may vary but follow the blog/GitHub docs). [github](https://github.com/gemini-cli-extensions/conductor)
4. Read each file and:
   - Fix anything that is inaccurate.
   - Simplify anything that feels confusing.
   - Commit the files with Git when you are satisfied:  
     `git add .`  
     `git commit -m "Add initial Conductor context"` [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)

***

## Section 5 – Create your first track (spec + plan)

1. Decide on a **small** feature or change. Example: “Add a simple home page that shows a title and a description.” [youtube](https://www.youtube.com/watch?v=e-iIoMjowQY)
2. In the Anti‑Gravity terminal, run:  
   `gemini /conductor:newTrack "Add a simple home page that shows a title and description"` [youtube](https://www.youtube.com/watch?v=TT9LtLeI5nk)
3. Conductor will:
   - Create a spec and a plan for this track (e.g., `conductor/tracks/<track-name>/spec.md` and `plan.md`). [youtube](https://www.youtube.com/watch?v=I2O93hMH5ZI)
4. In Anti‑Gravity, open the new `spec.md` and `plan.md`:
   - Read through the spec and make sure it matches what you want.
   - In `plan.md`, check that each task is small and understandable (e.g., “Create HomePage component”, “Wire up route”, “Add basic styling”). [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
5. If something feels off:
   - Edit `spec.md` or `plan.md` directly in the editor, or
   - Ask Gemini in the editor: “Update this plan to better match X” and then review its edits. [dev](https://dev.to/blamsa0mine/google-antigravity-public-preview-what-it-is-how-it-works-and-what-the-limits-really-mean-4pe)

***

## Section 6 – Implement the track with Conductor

1. When you are happy with the spec and plan, go back to the Anti‑Gravity terminal (still in project root).
2. Run:  
   `gemini /conductor:implement` [youtube](https://www.youtube.com/watch?v=TT9LtLeI5nk)
3. Watch files change in real time in the Anti‑Gravity editor:
   - Conductor will follow `plan.md` and create or modify code files. [youtube](https://www.youtube.com/watch?v=e-iIoMjowQY)
   - It may update the plan as tasks are completed.
4. If the implementation goes in a direction you don’t like:
   - Press `Ctrl + C` in the terminal to stop.
   - Edit `plan.md` or the relevant context files.
   - Re‑run `/conductor:implement`. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
5. When the command finishes:
   - Use `git status` and `git diff` in the terminal to see exactly what changed.
   - If the changes look good, run:  
     `git add .`  
     `git commit -m "Implement track: <short description>"` [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)

***

## Section 7 – Connect Conductor context with Anti‑Gravity rules

1. In the project root, create a folder for workspace rules if it does not exist:  
   `.agent/rules/` [youtube](https://www.youtube.com/watch?v=FVwIgc5IiBE)
2. Inside `.agent/rules/`, create files that mirror your Conductor context:
   - `project-goals.md` – summarize the same product goals as Conductor’s product context. [discuss.ai.google](https://discuss.ai.google.dev/t/conductor-should-be-integrated-into-antigravity-to-ensure-long-term-context-retention/113384)
   - `tech-stack.md` – mirror the tech stack decisions used by Conductor. [discuss.ai.google](https://discuss.ai.google.dev/t/conductor-should-be-integrated-into-antigravity-to-ensure-long-term-context-retention/113384)
   - `workflow.md` – mirror your workflow guidelines (tests, code style, review). [youtube](https://www.youtube.com/watch?v=FVwIgc5IiBE)
3. Optionally, in your home directory, create or update global rules:  
   `~/.gemini/GEMINI.md`  
   - Put preferences that should apply to **all** projects (for example: “Prefer TypeScript over JavaScript,” “Always write unit tests for new code”). [youtube](https://www.youtube.com/watch?v=FVwIgc5IiBE)
4. Ask Anti‑Gravity’s agent manager (Manager Surface) to confirm it recognizes these rules:
   - In the manager/agent UI, tell the agent:  
     “Use `.agent/rules/*.md` and `~/.gemini/GEMINI.md` as long‑term rules. Ensure your decisions stay consistent with Conductor’s context files.” [discuss.ai.google](https://discuss.ai.google.dev/t/conductor-should-be-integrated-into-antigravity-to-ensure-long-term-context-retention/113384)

***

## Section 8 – Daily workflow loop

Whenever you start work on this project, follow this sequence:

1. Open Anti‑Gravity and open this project workspace. [dev](https://dev.to/blamsa0mine/google-antigravity-public-preview-what-it-is-how-it-works-and-what-the-limits-really-mean-4pe)
2. Open the terminal and ensure `pwd` shows this project. If necessary, run:  
   `export GEMINI_API_KEY="YOUR_KEY_HERE"` again. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
3. Update context if needed:
   - If product goals or constraints changed, update both the Conductor context files and `.agent/rules` to stay aligned. [discuss.ai.google](https://discuss.ai.google.dev/t/conductor-should-be-integrated-into-antigravity-to-ensure-long-term-context-retention/113384)
4. For each new feature or bugfix:
   - Run `/conductor:newTrack "short description of the work"`.
   - Review and edit the track’s `spec.md` and `plan.md`. [youtube](https://www.youtube.com/watch?v=I2O93hMH5ZI)
   - Run `/conductor:implement` when you are satisfied. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)
5. After implementation:
   - Review code in the editor.
   - Ask Anti‑Gravity’s agents for help understanding changes or writing tests.
   - Run your app/tests using the built‑in tools (or via terminal commands like `npm test`, `npm run dev`, etc.). [dev](https://dev.to/blamsa0mine/google-antigravity-public-preview-what-it-is-how-it-works-and-what-the-limits-really-mean-4pe)
6. Commit frequently with helpful messages using `git add` and `git commit`. [developers.googleblog](https://developers.googleblog.com/conductor-introducing-context-driven-development-for-gemini-cli/)

***
