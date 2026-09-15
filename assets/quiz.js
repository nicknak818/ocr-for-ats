/* Multiple-choice quiz with instant feedback.
   <div class="quiz" data-answer="1">
     <p class="q">Question</p>
     <ol class="opts"><li data-why="Why this option is wrong">Option</li> …</ol>
     <div class="explain">Shown once the right option is picked.</div>
   </div>
   data-answer is the zero-based index of the right option. Wrong picks are struck out, their
   data-why is shown, and the learner tries again. Put <p class="quiz-tally"></p> anywhere for a running score.
   Usage: Quiz.mount(document) */
(function () {
  "use strict";
  function mount(root) {
    root = root || document;
    const quizzes = Array.from(root.querySelectorAll(".quiz"));
    const tally = root.querySelector(".quiz-tally");
    let done = 0, firstTry = 0;
    const report = () => {
      if (!tally) return;
      tally.textContent = done < quizzes.length
        ? `${done} of ${quizzes.length} answered, ${firstTry} on the first try.`
        : `All ${quizzes.length} answered: ${firstTry} right on the first try.`;
    };
    for (const quiz of quizzes) {
      const answer = Number(quiz.dataset.answer);
      const items = Array.from(quiz.querySelectorAll(".opts > li"));
      const explain = quiz.querySelector(".explain");
      const note = document.createElement("p");
      note.className = "why-note";
      note.hidden = true;
      quiz.querySelector(".opts").after(note);
      if (explain) explain.hidden = true;
      let misses = 0;
      const buttons = items.map((li, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.append(...Array.from(li.childNodes));
        li.append(b);
        b.addEventListener("click", () => {
          if (i === answer) {
            b.classList.add("right");
            buttons.forEach((x) => (x.disabled = true));
            note.hidden = true;
            if (explain) explain.hidden = false;
            done++;
            if (!misses) firstTry++;
            report();
          } else {
            misses++;
            b.classList.add("wrong");
            b.disabled = true;
            note.textContent = li.dataset.why || "Not quite. Try another.";
            note.hidden = false;
          }
        });
        return b;
      });
    }
    report();
  }
  window.Quiz = { mount };
})();
