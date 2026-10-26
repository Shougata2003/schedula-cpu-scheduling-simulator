import { simulate } from "./algorithms/scheduling";
import AlgorithmComparison from "./components/AlgorithmComparison";
import { useSimulation } from "./hooks/useSimulation";
import { useState } from "react";
import {
  Cpu,
  LayoutDashboard,
  GitBranch,
  BarChart3,
  BookOpen,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Clock3,
  Activity,
  Timer,
  Zap,
  Menu
} from "lucide-react";


import "./App.css";

const initialProcesses = [
  { pid: "P1", at: 0, bt: 5, priority: 2 },
  { pid: "P2", at: 1, bt: 3, priority: 1 },
  { pid: "P3", at: 2, bt: 8, priority: 3 },
  { pid: "P4", at: 3, bt: 2, priority: 2 }
];

const algorithms = [
  { value: "FCFS", label: "FCFS", full: "First Come First Serve" },
  { value: "SJF", label: "SJF", full: "Shortest Job First" },
  { value: "SRTF", label: "SRTF", full: "Shortest Remaining Time First" },
  { value: "RR", label: "Round Robin", full: "Round Robin Scheduling" },
  { value: "PRIORITY", label: "Priority", full: "Priority Scheduling" }
];

const colors = [
  "#3984ed",
  "#a477e8",
  "#22b99a",
  "#e9a34d",
  "#e46c86",
  "#37a9c7"
];

function App() {

  const [processes, setProcesses] = useState(initialProcesses);

  const [algorithm, setAlgorithm] = useState("FCFS");

  const [quantum, setQuantum] = useState(2);

  const [result, setResult] = useState(null);

  const playback = useSimulation(result);

  const [error, setError] = useState("");

  const [newProcess, setNewProcess] = useState({
    pid: "",
    at: 0,
    bt: 1,
    priority: 1
  });

  // Run the selected scheduling algorithm.
  function handleRun() {
    try {
      setError("");

      const output = simulate(
        processes,
        algorithm,
        quantum
      );

      setResult(output);

    } catch (err) {
      setError(err.message);
    }
  }

  // Add a process.
  function handleAddProcess(e) {
    e.preventDefault();

    try {
      const pid = newProcess.pid.trim();

      if (!pid) {
        throw new Error("Enter a Process ID.");
      }

      if (processes.some(p => p.pid === pid)) {
        throw new Error("Process ID already exists.");
      }

      const at = Number(newProcess.at);
      const bt = Number(newProcess.bt);
      const priority = Number(newProcess.priority);

      if (!Number.isInteger(at) || at < 0) {
        throw new Error("Arrival time must be a non-negative integer.");
      }

      if (!Number.isInteger(bt) || bt <= 0) {
        throw new Error("Burst time must be a positive integer.");
      }

      if (!Number.isInteger(priority)) {
        throw new Error("Priority must be an integer.");
      }

      setProcesses(prev => [
        ...prev,
        { pid, at, bt, priority }
      ]);

      setNewProcess({
        pid: "",
        at: 0,
        bt: 1,
        priority: 1
      });

      setResult(null);
      setError("");

    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a process.
  function handleDelete(pid) {
    setProcesses(prev =>
      prev.filter(p => p.pid !== pid)
    );

    setResult(null);
    setError("");
  }

  // Reset all processes.
  function handleReset() {
    setProcesses(initialProcesses);
    setAlgorithm("FCFS");
    setQuantum(2);
    setResult(null);
    setError("");
  }

  // Update new process form.
  function updateNewProcess(field, value) {
    setNewProcess(prev => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <div className="app-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            <Cpu size={25} />
          </div>

          <div>
            <h2>Schedula</h2>
            <span>OS LABORATORY</span>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">

          <a className="nav-item active" href="#dashboard">
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a className="nav-item" href="#processes">
            <GitBranch size={19} />
            Process Manager
          </a>

          <a className="nav-item" href="#results">
            <BarChart3 size={19} />
            Performance
          </a>

          <a className="nav-item" href="#algorithms">
            <BookOpen size={19} />
            Algorithms
          </a>

          <a className="nav-item" href="#comparison">
  <GitBranch size={19} />
  Comparison Lab
</a>

        </nav>

        <div className="sidebar-bottom">
          <div className="status-indicator"></div>
          <span>Scheduling Engine Ready</span>
        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="topbar">

          <div>
            <span className="breadcrumb">
              OS LABORATORY / SIMULATOR
            </span>

            <h1>CPU Scheduling Simulator</h1>

            <p>
              Visualize, analyze and compare CPU scheduling algorithms.
            </p>
          </div>

          <div className="topbar-right">
            <span className="version-tag">v1.0.0</span>
            <div className="avatar">S</div>
          </div>

        </header>


        {/* OVERVIEW CARDS */}

        <section className="overview-grid">

          <MetricCard
            icon={<GitBranch />}
            label="Total Processes"
            value={processes.length}
            color="blue"
          />

          <MetricCard
            icon={<Clock3 />}
            label="Total Burst Time"
            value={processes.reduce((sum, p) => sum + Number(p.bt), 0)}
            color="purple"
          />

          <MetricCard
            icon={<Activity />}
            label="Selected Algorithm"
            value={algorithm}
            color="green"
          />

          <MetricCard
            icon={<Zap />}
            label="Simulation Status"
            value={result ? "Completed" : "Ready"}
            color="orange"
          />

        </section>


        {/* PROCESS MANAGER */}

        <section className="panel" id="processes">

          <div className="section-heading">

            <div>
              <span className="section-kicker">INPUT CONFIGURATION</span>
              <h2>Process Manager</h2>
              <p>Configure the processes entering the CPU.</p>
            </div>

            <button className="secondary-button" onClick={handleReset}>
              <RotateCcw size={16} />
              Reset
            </button>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>PROCESS ID</th>
                  <th>ARRIVAL TIME</th>
                  <th>BURST TIME</th>
                  <th>PRIORITY</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {processes.map((process, index) => (

                  <tr key={process.pid}>

                    <td>
                      <span className="process-name">
                        <span
                          className="process-dot"
                          style={{
                            background: colors[index % colors.length]
                          }}
                        />
                        {process.pid}
                      </span>
                    </td>

                    <td>{process.at}</td>
                    <td>{process.bt}</td>
                    <td>{process.priority}</td>

                    <td>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(process.pid)}
                        title="Delete process"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ADD PROCESS FORM */}

          <form className="add-process-form" onSubmit={handleAddProcess}>

            <div className="form-field">
              <label>Process ID</label>
              <input
                placeholder="P5"
                value={newProcess.pid}
                onChange={e => updateNewProcess("pid", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Arrival Time</label>
              <input
                type="number"
                min="0"
                step="1"
                value={newProcess.at}
                onChange={e => updateNewProcess("at", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Burst Time</label>
              <input
                type="number"
                min="1"
                step="1"
                value={newProcess.bt}
                onChange={e => updateNewProcess("bt", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Priority</label>
              <input
                type="number"
                step="1"
                value={newProcess.priority}
                onChange={e => updateNewProcess("priority", e.target.value)}
              />
            </div>

            <button className="add-button" type="submit">
              <Plus size={17} />
              Add Process
            </button>

          </form>

        </section>


        {/* ALGORITHM CONFIGURATION */}

        <section className="panel" id="algorithms">

          <div className="section-heading">

            <div>
              <span className="section-kicker">SCHEDULING CONFIGURATION</span>
              <h2>Algorithm Selection</h2>
              <p>Choose how the CPU should allocate execution time.</p>
            </div>

          </div>


          <div className="algorithm-grid">

            {algorithms.map(item => (

              <button
                key={item.value}
                className={`algorithm-card ${
                  algorithm === item.value ? "selected" : ""
                }`}
                onClick={() => {
                  setAlgorithm(item.value);
                  setResult(null);
                  setError("");
                }}
              >

                <div className="algorithm-radio">
                  {algorithm === item.value ? "●" : "○"}
                </div>

                <strong>{item.label}</strong>
                <span>{item.full}</span>

              </button>

            ))}

          </div>


          {algorithm === "RR" && (

            <div className="quantum-field">

              <label>Time Quantum</label>

              <input
                type="number"
                min="1"
                step="1"
                value={quantum}
                onChange={e => {
                  setQuantum(e.target.value);
                  setResult(null);
                }}
              />

              <span>CPU time units per turn</span>

            </div>

          )}


          <div className="simulation-actions">

            <button
              className="run-button"
              onClick={handleRun}
              disabled={processes.length === 0}
            >
              <Play size={18} fill="currentColor" />
              Run Simulation
            </button>

            <span>Simulation runs locally in your browser.</span>

          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

        </section>
        
        
{/* ======================================
    CPU EXECUTION PLAYBACK
====================================== */}

{result && (

  <section className="panel playback-panel">

    <div className="section-heading">

      <div>
        <span className="section-kicker">
          LIVE CPU MONITORING
        </span>

        <h2>CPU Execution Control</h2>

        <p>
          Monitor and control process execution step by step.
        </p>
      </div>

      <span className={`cpu-status ${
        playback.isCompleted
          ? "completed"
          : playback.isPlaying
          ? "running"
          : "paused"
      }`}>

        {playback.isCompleted
          ? "COMPLETED"
          : playback.isPlaying
          ? "RUNNING"
          : "PAUSED"}

      </span>

    </div>


    {/* CPU INFORMATION */}

    <div className="cpu-info-grid">

      <div className="cpu-info-card">
        <span>SIMULATION TIME</span>
        <strong>
          {playback.currentTime} / {playback.totalTime}
        </strong>
      </div>

      <div className="cpu-info-card">
        <span>RUNNING PROCESS</span>
        <strong>
          {playback.runningProcess ||
            (playback.isIdle ? "IDLE" : "—")}
        </strong>
      </div>

      <div className="cpu-info-card">
        <span>EXECUTION PROGRESS</span>
        <strong>
          {playback.progress.toFixed(1)}%
        </strong>
      </div>

    </div>


    {/* PROGRESS BAR */}

    <div className="playback-progress">

      <div
        className="playback-progress-fill"
        style={{
          width: `${playback.progress}%`
        }}
      />

    </div>


    {/* PLAYBACK CONTROLS */}

    <div className="playback-actions">

      <button
        className="playback-button primary"
        onClick={playback.togglePlay}
        disabled={!result}
      >
        {playback.isPlaying ? "Ⅱ Pause" : "▶ Play"}
      </button>


      <button
        className="playback-button"
        onClick={playback.pause}
      >
        Pause
      </button>


      <button
        className="playback-button"
        onClick={playback.nextStep}
        disabled={
          playback.isCompleted || playback.isPlaying
        }
      >
        Next Step →
      </button>


      <button
        className="playback-button"
        onClick={playback.restart}
      >
        ↺ Restart
      </button>


      {/* SPEED SELECTOR */}

      <div className="speed-control">

        <label htmlFor="simulation-speed">
          Speed
        </label>

        <select
          id="simulation-speed"
          value={playback.speed}
          onChange={e =>
            playback.changeSpeed(e.target.value)
          }
        >
          <option value="2000">0.5x</option>
          <option value="1000">1x</option>
          <option value="500">2x</option>
          <option value="200">5x</option>
        </select>

      </div>

    </div>

  </section>

)}

        {/* GANTT CHART */}

        <section className="panel" id="results">

          <div className="section-heading">

            <div>
              <span className="section-kicker">CPU EXECUTION VISUALIZATION</span>
              <h2>Gantt Chart</h2>
              <p>
                Visual representation of process execution over time.
              </p>
            </div>

            {result && (
              <span className="completed-tag">
                Simulation completed
              </span>
            )}

          </div>


          {result ? (

            <div className="gantt-container">

              
<div className="gantt-track">

  {result.timeline.map((block, index) => {

    const colorIndex = processes.findIndex(
      p => p.pid === block.pid
    );

    const width =
      ((block.end - block.start) / result.totalTime) * 100;

    const isActive =
      playback.currentTime >= block.start &&
      playback.currentTime < block.end;

    const isRevealed =
      playback.currentTime >= block.end;

    return (

      <div
        key={index}

        className={`gantt-block ${
          block.pid === "IDLE" ? "idle-block" : ""
        } ${
          isActive ? "gantt-active" : ""
        } ${
          isRevealed ? "gantt-revealed" : "gantt-hidden"
        }`}

        style={{
          width: `${width}%`,
          background:
            block.pid === "IDLE"
              ? "#394457"
              : colors[colorIndex % colors.length]
        }}

        title={`${block.pid}: ${block.start} to ${block.end}`}

      >

        <strong>{block.pid}</strong>

        <span>
          {block.start}–{block.end}
        </span>

      </div>

    );

  })}

</div>


              
<div className="gantt-scale">

  {result.timeline.map((block, index) => (
    <span key={index}>
      {block.start}
    </span>
  ))}

  <span>{result.totalTime}</span>

</div>

<div className="current-time-indicator">
  Current CPU Time: {playback.currentTime}
</div>

            </div>

          ) : (

            <div className="empty-state">

              <div className="empty-icon">
                <Timer size={30} />
              </div>

              <h3>Awaiting Simulation</h3>

              <p>
                Select an algorithm and click Run Simulation
                to visualize CPU execution.
              </p>

            </div>

          )}

        </section>


        {/* PERFORMANCE METRICS */}

        {result && (

          <>

            <section className="metrics-grid">

              <MetricCard
                icon={<Clock3 />}
                label="Average Waiting Time"
                value={result.averages.wt.toFixed(2)}
                color="blue"
              />

              <MetricCard
                icon={<Activity />}
                label="Average Turnaround Time"
                value={result.averages.tat.toFixed(2)}
                color="purple"
              />

              <MetricCard
                icon={<Zap />}
                label="Average Response Time"
                value={result.averages.rt.toFixed(2)}
                color="green"
              />

            </section>


            {/* RESULTS TABLE */}

            <section className="panel">

              <div className="section-heading">
                <div>
                  <span className="section-kicker">PERFORMANCE ANALYSIS</span>
                  <h2>Process Results</h2>
                  <p>Detailed execution metrics for every process.</p>
                </div>
              </div>


              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>PROCESS</th>
                      <th>AT</th>
                      <th>BT</th>
                      <th>CT</th>
                      <th>TAT</th>
                      <th>WT</th>
                      <th>RT</th>
                    </tr>
                  </thead>

                  <tbody>

                    {result.results.map(p => (

                      <tr key={p.pid}>
                        <td><strong>{p.pid}</strong></td>
                        <td>{p.at}</td>
                        <td>{p.bt}</td>
                        <td>{p.ct}</td>
                        <td>{p.tat}</td>
                        <td>{p.wt}</td>
                        <td>{p.rt}</td>
                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </section>

          </>

        )}

{/* STAGE 6 - ALGORITHM COMPARISON LABORATORY */}

<AlgorithmComparison
  processes={processes}
  quantum={2}
/>
        <footer className="footer">
          <span>Schedula © 2026</span>
          <span>Operating Systems · CPU Scheduling Laboratory</span>
        </footer>

      </main>

    </div>
  );

}


// REUSABLE METRIC CARD

function MetricCard({ icon, label, value, color }) {

  return (

    <div className="metric-card">

      <div className={`metric-icon ${color}`}>
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <h3>{value}</h3>
      </div>

    </div>

  );

}

export default App;