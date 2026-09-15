# Set up the lesson server

Type: task (AFK)
Status: resolved
Run with: /wayfinder course/v1/map.md

## Question

The Browser pane can't load a lesson's `../assets/*.js` from a local file. Add a `.claude/launch.json` entry that runs `python3 -m http.server` from the workspace root, start it with `preview_start`, and confirm lesson 0001 loads with a clean console. Checking the lesson's content belongs to a later lesson ticket.

## Answer

Added a `lesson-server` config to `.claude/launch.json` (`python3 -m http.server 8000` from the workspace root). Started it with `preview_start` and opened `http://localhost:8000/lessons/0001-whats-inside-a-resume-file.html`: console is clean, and all assets (`course.css`, `file-inspector.js`, `quiz.js`, `samples/samples.js`) returned 200. Lesson content itself is untouched — that's the next lesson ticket's job.
