# Advanced Responsive To-Do App

A polished, recruiter-friendly productivity dashboard built as a front-end web app. It combines task management, focus mode, analytics, drag-and-drop workflow, recurring tasks, reminders, confirmation safeguards, and smart productivity insights in one responsive interface.

## LIVE DEMO

https://rohaan2802.github.io/TODO-Web-App/

## Feature screenshots

Below are **15 tightly cropped screenshots** � each shows only the UI for that heading (no full-page chrome, side margins, or empty background).

### 1. Dashboard overview

Full productivity workspace: top bar, metrics, insights, analytics, task composer, filters, board, and task list in one view.

![Dashboard overview](docs/screenshots/01-dashboard-overview.png)

### 2. Summary metrics

Live counters for **Total**, **Completed**, and **Remaining** tasks so progress is visible at a glance.

![Summary metrics](docs/screenshots/02-summary-metrics.png)

### 3. Smart insights

Auto-updated insight cards for focus score, high-priority load, due-today pressure, and weekly completions.

![Smart insights](docs/screenshots/03-smart-insights.png)

### 4. Productivity overview

Goal completion progress bar plus category breakdown (work / personal / study) for workload balance.

![Productivity overview](docs/screenshots/04-productivity-overview.png)

### 5. Add task form

Create tasks with title, category, recurrence, due date, reminder, and priority in one composer.

![Add task form](docs/screenshots/05-add-task-form.png)

### 6. Quick shortcuts

One-click pills for frequent workflows (deep work, follow-up, review, workout) without retyping.

![Quick shortcuts](docs/screenshots/06-quick-shortcuts.png)

### 7. Focus mode

Focus mode hides clutter and keeps only today’s active priorities visible.

![Focus mode](docs/screenshots/07-focus-mode.png)

### 8. Search and sort

Keyword search plus sorting by newest, oldest, priority, or due soon.

![Search and sort](docs/screenshots/08-search-sort.png)

### 9. Filters (high priority)

Global tabs for All / Active / Completed / High priority to slice the backlog instantly.

![High priority filter](docs/screenshots/09-filters-high-priority.png)

### 10. Progress board

Kanban-style board with **Backlog → In Progress → Done** and drag-and-drop status movement.

![Progress board](docs/screenshots/10-progress-board.png)

### 11. Task list details

Rich task cards with priority badges, categories, due dates, recurrence labels, reminders, and nested subtasks.

![Task list details](docs/screenshots/11-task-list-details.png)

### 12. Recurring due-date roll-forward

Checking a recurring task does **not** permanently complete it. Instead the **due date extends** (daily / weekly / monthly) and the task stays active for the next cycle.

![Recurring date extend](docs/screenshots/12-recurring-date-extend.png)

### 13. Delete confirmation

Delete asks for permission first with **OK / Cancel** so accidental removals are blocked.

![Delete confirmation](docs/screenshots/13-delete-confirmation.png)

### 14. Edit confirmation

Edit also asks for confirmation before entering edit mode and again before saving changes.

![Edit confirmation](docs/screenshots/14-edit-confirmation.png)

### 15. Mobile responsive layout

Phone-width layout keeps metrics, composer, board, and task actions usable on small screens.

![Mobile responsive](docs/screenshots/15-mobile-responsive.png)

---

## Overview

This project is designed to feel like a professional portfolio piece while staying lightweight and easy to run. It is a single-page app with local browser persistence, no backend dependency, and no authentication required.

The goal is to make it feel premium, usable on any device, and strong enough to showcase front-end design, UX thinking, and interactive product behavior in a portfolio or interview demo.

## Why this project stands out

- Clean, modern UI inspired by productivity dashboards
- Fully responsive across mobile, tablet, and desktop
- Advanced filtering and sorting controls
- Drag-and-drop task board for plan execution
- Recurring tasks that automatically roll the due date forward
- Reminder support with toast feedback
- Smart insights panel with progress analytics
- Focus mode for today's priorities
- Quick task shortcuts for frequent workflows
- Export/import for JSON workflow portability
- Confirmation dialogs before destructive or edit actions
- Local persistence using browser storage
- Seeded demo workspace with 15 sample tasks covering every feature

## Features (deep dive)

### Productivity dashboard

The top of the app is a decision surface, not just decoration.

- **Total / Completed / Remaining** cards recalculate after every create, edit, complete, delete, import, or board move.
- A **completion rate** percentage and progress fill show how close the current cycle is to “inbox zero.”
- Category rows visualize how work is distributed across `work`, `personal`, and `study`.

### Smart insights

Insight cards translate raw counts into coaching-style notes:

| Insight | What it measures | Why it helps |
| --- | --- | --- |
| Focus score | Completed ÷ total | Momentum signal for the current backlog |
| High priority | Count of `high` tasks | Risk / urgency load |
| Due today | Tasks dated today | Same-day execution pressure |
| Completed this week | Recently finished work | Weekly execution proof |

Each card includes a short note (for example “Excellent momentum” or “Needs attention”) so recruiters can see UX copy, not only numbers.

### Task management

Every task can carry:

- **Title** (required)
- **Category** (`personal`, `work`, `study`)
- **Priority** (`high`, `medium`, `low`)
- **Due date**
- **Reminder** (`datetime-local`)
- **Recurrence** (`none`, `daily`, `weekly`, `monthly`)
- **Board status** (`backlog`, `inProgress`, `done`)
- **Subtasks** with independent completion state

You can search by keyword, sort by newest/oldest/priority/due soon, mark complete/incomplete, edit, delete, and clear completed items.

### Confirmation safeguards (edit / delete)

Destructive and mutation flows are protected:

1. **Delete** opens a modal: confirm with **OK/Delete** or abort with **Cancel**.
2. **Edit** asks permission before entering edit mode.
3. **Save edit** asks again before writing the new title.
4. **Clear completed** also requires confirmation and reports how many tasks will be removed.

Backdrop click and `Escape` cancel the dialog. This prevents accidental data loss during demos.

### Recurring tasks and due-date extension

This is the “check → date extends” behavior:

1. Create or use a task with recurrence set to daily, weekly, or monthly.
2. Mark the task complete (checkbox).
3. Instead of staying completed, the app:
   - keeps the task **active**
   - resets status toward the next cycle
   - **moves `dueDate` forward** by 1 day / 7 days / 1 month
   - shows a toast explaining the new due date

One-time tasks (`recurrence: none`) complete normally and move to Done.

### Reminders and toasts

Reminders use the browser clock. When a reminder time is reached (while the tab is open), a toast surfaces the task title. Action toasts also confirm adds, edits, deletes, imports, exports, focus toggles, and board moves.

### Workflow organization

- **Progress board** stages: Backlog, In Progress, Done
- Drag a board card (or list item) onto another stage to update status
- Completing via board/list keeps analytics and list filters in sync
- Filter tabs: All, Active, Completed, High Priority
- **Focus mode** reduces noise to today’s open work

### Export / Import

- **Export** downloads the current task array as JSON
- **Import** restores a previously exported file
- Useful for backups or moving a demo dataset between machines/browsers

### Theme and workspace chrome

- Light/dark theme toggle persisted in `localStorage`
- Workspace name field for personalizing the demo identity
- “Demo Sync” saves workspace metadata locally (no cloud account required)

## Seeded demo tasks

On first load (or after storage key upgrade), the app seeds **15 tasks**, including:

- High-priority portfolio and interview prep work
- Daily standup + workout recurrences
- Weekly recruiter follow-up / LeetCode loops
- Monthly budget review
- Mixed board statuses (backlog, in progress, done)
- Overdue and due-today examples
- Subtasks on several cards

This makes screenshots, demos, and recruiter walkthroughs useful immediately.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage for persistence
- GitHub Pages for deployment
- GitHub Actions for automated static site deployment

## Project structure

```text
.
├── index.html                 # App structure, composer, board, confirm modal
├── style.css                  # Responsive styling + confirmation dialog
├── script.js                  # State, analytics, recurrence, confirms, storage
├── live-demo.html             # Pages entry helper
├── README.md                  # Documentation + feature screenshots
├── docs/screenshots/          # 15 feature screenshots
├── .gitignore
└── .github/workflows/
    └── deploy-pages.yml
```

## Local setup

1. Clone the repository:

```bash
git clone https://github.com/rohaan2802/TODO-Web-App.git
cd TODO-Web-App
```

2. Open `index.html` in your browser, or run a simple local server:

```bash
python -m http.server 8000
```

3. Visit `http://localhost:8000` in the browser.

## Deployment

This project is deployed to GitHub Pages using a GitHub Actions workflow.

### GitHub Pages workflow

The deployment workflow is defined in:

- `.github/workflows/deploy-pages.yml`

It automatically publishes the static site when changes are pushed to the `main` branch.

Live site:

https://rohaan2802.github.io/TODO-Web-App/

## GitHub profile and repository

- Profile: https://github.com/rohaan2802
- Repository: https://github.com/rohaan2802/TODO-Web-App

## Future enhancements

Potential next upgrades for a production-grade version include:

- Real authentication and user accounts
- Cloud sync using a backend database
- Advanced charts and reporting dashboards
- Calendar and timeline view
- Task sharing or team collaboration
- Native browser/device push reminders
- Undo stack for delete/clear actions

## Author

Rohaan Arshad

## License

This project is for educational and portfolio demonstration purposes.
