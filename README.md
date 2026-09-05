# Advanced Responsive To-Do App

#[Live Demo](https://rohaan2802.github.io/TODO-Web-App/)

A polished, recruiter-friendly productivity dashboard built as a front-end web app. It combines task management, focus mode, analytics, drag-and-drop workflow, recurring tasks, reminders, and smart productivity insights in one responsive interface.

## Overview

This project is designed to feel like a professional portfolio piece while staying lightweight and easy to run. It is a single-page app with local browser persistence, no backend dependency, and no authentication required.

The goal is to make it feel premium, usable on any device, and strong enough to showcase front-end design, UX thinking, and interactive product behavior in a portfolio or interview demo.

## Why this project stands out

- Clean, modern UI inspired by productivity dashboards
- Fully responsive across mobile, tablet, and desktop
- Advanced filtering and sorting controls
- Drag-and-drop task board for plan execution
- Recurring tasks and reminder support
- Smart insights panel with progress analytics
- Focus mode for today's priorities
- Quick task shortcuts for frequent workflows
- Export/import for JSON workflow portability
- Local persistence using browser storage

## Features

### Productivity dashboard
- Total, completed, and remaining task counters
- Completion progress bar
- Category-based activity analytics
- Smart insight cards for focus score, high priority, due today, and completed this week

### Task management
- Add tasks with title, category, due date, reminder, recurrence, and priority
- Search tasks by keyword
- Sort by newest, oldest, due soon, and priority
- Mark tasks complete/incomplete
- Edit and delete tasks
- Clear completed tasks

### Workflow organization
- Task board with Backlog, In Progress, and Done stages
- Drag-and-drop status movement
- Global filter tabs for All, Active, Completed, and High Priority
- Focus mode to reduce clutter and show only today's important tasks

### Recurrence and reminders
- Recurring tasks: daily, weekly, monthly
- Reminder scheduling using datetime-local input
- Browser-based toast notifications for reminders and actions

### Export/Import support
- Export current tasks as JSON
- Import saved tasks back into the app
- Useful for backups or transferring task data between devices/browser profiles

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
├── index.html            # App structure and UI layout
├── style.css             # Responsive styling and premium visual design
├── script.js             # App logic, rendering, analytics, storage, actions
├── README.md             # Project documentation
├── .gitignore            # Ignore editor/system files
└── .github/
    └── workflows/
        └── deploy-pages.yml
```

## Local setup

1. Clone the repository:

```bash
git clone https://github.com/rohaan2802/portfolio-todo-app.git
cd portfolio-todo-app
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

## GitHub profile and repository

- Profile: https://github.com/rohaan2802
- Repository: https://github.com/rohaan2802/portfolio-todo-app

## Future enhancements

Potential next upgrades for a production-grade version include:

- Real authentication and user accounts
- Cloud sync using a backend database
- Advanced charts and reporting dashboards
- Calendar and timeline view
- Task sharing or team collaboration
- Notifications with real browser/device reminders

## Author

Rohaan Arshad

## License

This project is for educational and portfolio demonstration purposes.
