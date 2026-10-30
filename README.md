# SCHEDULA — CPU Scheduling Simulator

**An Interactive Operating Systems Laboratory**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge)](https://schedula-cpu-scheduling-simulator.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Shougata2003/schedula-cpu-scheduling-simulator)

Schedula is an interactive CPU Scheduling Simulator developed using React and JavaScript. It helps students understand, visualize, analyze, and compare different CPU scheduling algorithms through an interactive dashboard.

## 🚀 Live Demo

**[Launch Schedula — CPU Scheduling Simulator](https://schedula-cpu-scheduling-simulator.vercel.app/)**

## ✨ Features

- Interactive dashboard for CPU scheduling simulation.
- Process management with arrival time, burst time, and priority.
- Gantt chart visualization of process execution.
- Performance analysis and scheduling metrics.
- Algorithm comparison workspace.
- Simulation controls and configurable scheduling parameters.

## 🧠 Supported Scheduling Algorithms

| Algorithm | Description |
|---|---|
| FCFS | First Come First Serve |
| SJF | Shortest Job First |
| SRTF | Shortest Remaining Time First |
| RR | Round Robin |
| Priority | Priority-Based Scheduling |

**Priority convention:** A smaller priority number represents a higher priority.

## 🛠️ Technology Stack

- React
- JavaScript
- Vite
- HTML5
- CSS3
- Git and GitHub
- Vercel

## 💻 Run Locally

### Prerequisites

- Node.js
- npm
- Git

### Installation

```bash
git clone https://github.com/Shougata2003/schedula-cpu-scheduling-simulator.git
```

```bash
cd schedula-cpu-scheduling-simulator
```

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

`http://localhost:5173/`

### Production Build

```bash
npm run build
```

## 📂 Project Structure

```text
schedula/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── scheduling.js
│   │   └── testScheduling.js
│   ├── assets/
│   ├── components/
│   │   └── AlgorithmComparison.jsx
│   ├── hooks/
│   │   └── useSimulation.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎯 Project Objectives

1. Understand fundamental CPU scheduling algorithms.
2. Visualize process execution and scheduling order.
3. Analyze scheduling performance.
4. Compare different scheduling strategies.
5. Develop practical knowledge of Operating Systems concepts.

## 🎓 Academic Information

**Project:** Schedula — CPU Scheduling Simulator  
**Subject:** Operating Systems  
**Department:** Computer Science & Engineering  
**Institution:** B. P. Poddar Institute of Management & Technology  

## 🌐 Project Links

- **Live Application:** https://schedula-cpu-scheduling-simulator.vercel.app/
- **Source Code:** https://github.com/Shougata2003/schedula-cpu-scheduling-simulator

---

*Developed as an interactive learning project for understanding CPU scheduling concepts in Operating Systems.*
