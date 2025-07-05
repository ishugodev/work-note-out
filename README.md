# 🏋️ Work Note Out

**Work Note Out** is a simple exercise note-taking app focused on helping you **plan and keep track of your weekly workout routines** — without distractions, overengineering or bloat.

With it, you can:

- Create custom workout plans by selecting and organizing exercises
- Assign those plans to specific days of the week
- Quickly view your weekly schedule right from the home screen

> 📌 The app **does not store logs or history** — the focus is on planning and execution, not tracking progress (at least for now).

---

## ✨ Features

- 🗓️ Weekly routine overview
- 🛠️ Custom workout plan creation
- 📌 Assign plans to weekdays
- ⚡ Fast, minimalist UI
- 🌓 Light and dark mode
- 📱 Progressive Web App (PWA) — use it like a native app on your device  

---

## 🧠 Motivation

Built as a personal project by a developer passionate about **fitness** and **simplicity**. The idea was to create a tool to help plan workouts without distractions or clutter.

No login required. No analytics. Just your plan.

---

## 🧪 Tech Stack

- React + TypeScript
- Tailwind CSS
- Radix UI
- Vite
- LocalStorage (for saving data locally)

---

## 🔑 About the lockfile and package manager

This project uses **pnpm** as its package manager, and includes a `pnpm-lock.yaml` file to lock dependency versions.

If you try to install dependencies with **npm** or **yarn** instead of pnpm:

- They won’t use the `pnpm-lock.yaml` file
- This can lead to a different dependency tree and possibly different package versions
- Which might cause unexpected bugs or issues

**To ensure consistent installs and avoid problems, please use pnpm to install dependencies and run the project.**

---

## 🚀 Running Locally

```bash
# Clone o projeto
git clone https://github.com/ishugodev/work-note-out.git
cd work-note-out

# Instale as dependências
pnpm install

# Rode o app
pnpm run dev
