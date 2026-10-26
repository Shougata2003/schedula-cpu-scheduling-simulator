
/*
  SCHEDULA - CPU Scheduling Engine

  Algorithms:
  1. FCFS
  2. SJF
  3. SRTF
  4. Round Robin
  5. Priority Scheduling

  Priority convention:
  Smaller number = Higher priority

  Time unit:
  One simulation tick = One CPU time unit
*/

const SUPPORTED_ALGORITHMS = [
  "FCFS",
  "SJF",
  "SRTF",
  "RR",
  "PRIORITY"
];

// --------------------------------------------------
// 1. VALIDATE INPUT
// --------------------------------------------------

function validateProcesses(processes, algorithm, quantum) {

  if (!Array.isArray(processes) || processes.length === 0) {
    throw new Error("Please add at least one process.");
  }

  if (!SUPPORTED_ALGORITHMS.includes(algorithm)) {
    throw new Error("Invalid scheduling algorithm.");
  }

  if (
    algorithm === "RR" &&
    (!Number.isInteger(Number(quantum)) || Number(quantum) <= 0)
  ) {
    throw new Error("Time quantum must be a positive integer.");
  }

  const ids = new Set();

  return processes.map((process, index) => {

    const pid = String(process.pid ?? "").trim();
    const at = Number(process.at);
    const bt = Number(process.bt);
    const priority = Number(process.priority ?? 1);

    if (!pid) {
      throw new Error("Process ID cannot be empty.");
    }

    if (ids.has(pid)) {
      throw new Error(`Duplicate Process ID: ${pid}`);
    }

    ids.add(pid);

    if (!Number.isInteger(at) || at < 0) {
      throw new Error(`${pid}: Arrival Time must be a non-negative integer.`);
    }

    if (!Number.isInteger(bt) || bt <= 0) {
      throw new Error(`${pid}: Burst Time must be a positive integer.`);
    }

    if (!Number.isInteger(priority)) {
      throw new Error(`${pid}: Priority must be an integer.`);
    }

    return {
      pid,
      at,
      bt,
      priority,

      remaining: bt,
      firstStart: null,
      ct: null,

      originalOrder: index
    };
  });
}


// --------------------------------------------------
// 2. PROCESS SORTING RULES
// --------------------------------------------------

function sortProcesses(processes, algorithm) {

  const sorted = [...processes];

  sorted.sort((a, b) => {

    if (algorithm === "SJF") {
      return (
        a.bt - b.bt ||
        a.at - b.at ||
        a.originalOrder - b.originalOrder
      );
    }

    if (algorithm === "PRIORITY") {
      return (
        a.priority - b.priority ||
        a.at - b.at ||
        a.originalOrder - b.originalOrder
      );
    }

    return (
      a.at - b.at ||
      a.originalOrder - b.originalOrder
    );
  });

  return sorted;
}


// --------------------------------------------------
// 3. MAIN SIMULATION ENGINE
// --------------------------------------------------

export function simulate(
  processes,
  algorithm,
  quantum = 2
) {

  const jobs = validateProcesses(
    processes,
    algorithm,
    quantum
  );

  const timeQuantum = Number(quantum);

  let currentTime = 0;
  let completedCount = 0;

  let currentProcess = null;
  let quantumUsed = 0;

  const timeline = [];
  const completed = [];

  // Used by Round Robin.
  const readyQueue = [];
  const enqueued = new Set();

  // ------------------------------------------------
  // Add a process to the execution timeline.
  // Merge consecutive blocks of the same process.
  // ------------------------------------------------

  function addTimeline(pid, start, end) {

    const last = timeline[timeline.length - 1];

    if (
      last &&
      last.pid === pid &&
      last.end === start
    ) {
      last.end = end;
    } else {
      timeline.push({
        pid,
        start,
        end
      });
    }
  }


  // ------------------------------------------------
  // Add newly arrived processes to RR ready queue.
  // ------------------------------------------------

  function addArrivals(time) {

    const arrivals = jobs
      .filter(
        p => p.at === time && !enqueued.has(p.pid)
      )
      .sort(
        (a, b) => a.originalOrder - b.originalOrder
      );

    arrivals.forEach(p => {
      readyQueue.push(p);
      enqueued.add(p.pid);
    });
  }


  // ------------------------------------------------
  // Choose process for non-preemptive algorithms.
  // ------------------------------------------------

  function chooseNonPreemptive() {

    const ready = jobs.filter(
      p => p.at <= currentTime && p.remaining > 0
    );

    if (ready.length === 0) {
      return null;
    }

    return sortProcesses(ready, algorithm)[0];
  }


  // ------------------------------------------------
  // Choose process for SRTF.
  // ------------------------------------------------

  function chooseSRTF() {

    const ready = jobs.filter(
      p => p.at <= currentTime && p.remaining > 0
    );

    ready.sort((a, b) => {

      return (
        a.remaining - b.remaining ||
        a.at - b.at ||
        a.originalOrder - b.originalOrder
      );

    });

    return ready[0] || null;
  }


  // ------------------------------------------------
  // 4. SIMULATION LOOP
  // ------------------------------------------------

  while (completedCount < jobs.length) {

    // ROUND ROBIN
    if (algorithm === "RR") {

      addArrivals(currentTime);

      if (!currentProcess && readyQueue.length > 0) {

        currentProcess = readyQueue.shift();
        quantumUsed = 0;

      }

    }

    // SRTF
    else if (algorithm === "SRTF") {

      currentProcess = chooseSRTF();

    }

    // FCFS, SJF, PRIORITY
    else {

      if (!currentProcess) {
        currentProcess = chooseNonPreemptive();
      }

    }


    // ----------------------------------------------
    // CPU IDLE
    // ----------------------------------------------

    if (!currentProcess) {

      addTimeline(
        "IDLE",
        currentTime,
        currentTime + 1
      );

      currentTime++;

      continue;
    }


    // ----------------------------------------------
    // RECORD FIRST RESPONSE
    // ----------------------------------------------

    if (currentProcess.firstStart === null) {

      currentProcess.firstStart = currentTime;

    }


    // ----------------------------------------------
    // EXECUTE ONE CPU TIME UNIT
    // ----------------------------------------------

    addTimeline(
      currentProcess.pid,
      currentTime,
      currentTime + 1
    );

    currentProcess.remaining--;

    currentTime++;


    // ----------------------------------------------
    // ROUND ROBIN: ARRIVALS BEFORE REQUEUE
    // ----------------------------------------------

    if (algorithm === "RR") {

      // A process arriving at the quantum boundary
      // joins the queue before the expired process.

      addArrivals(currentTime);

      quantumUsed++;

    }


    // ----------------------------------------------
    // CHECK PROCESS COMPLETION
    // ----------------------------------------------

    if (currentProcess.remaining === 0) {

      currentProcess.ct = currentTime;

      completed.push(currentProcess);
      completedCount++;

      currentProcess = null;
      quantumUsed = 0;

    }


    // ----------------------------------------------
    // ROUND ROBIN: QUANTUM EXPIRED
    // ----------------------------------------------

    else if (
      algorithm === "RR" &&
      quantumUsed >= timeQuantum
    ) {

      readyQueue.push(currentProcess);

      currentProcess = null;
      quantumUsed = 0;

    }

  }


  // --------------------------------------------------
  // 5. CALCULATE PERFORMANCE METRICS
  // --------------------------------------------------

  const results = jobs.map(p => {

    const turnaroundTime = p.ct - p.at;

    const waitingTime = turnaroundTime - p.bt;

    const responseTime = p.firstStart - p.at;

    return {

      pid: p.pid,

      at: p.at,
      bt: p.bt,
      priority: p.priority,

      ct: p.ct,
      tat: turnaroundTime,
      wt: waitingTime,
      rt: responseTime

    };

  });


  // --------------------------------------------------
  // 6. CALCULATE AVERAGES
  // --------------------------------------------------

  const count = results.length;

  const averages = {

    wt:
      results.reduce(
        (sum, p) => sum + p.wt,
        0
      ) / count,

    tat:
      results.reduce(
        (sum, p) => sum + p.tat,
        0
      ) / count,

    rt:
      results.reduce(
        (sum, p) => sum + p.rt,
        0
      ) / count

  };


  // --------------------------------------------------
  // 7. RETURN FINAL SIMULATION RESULT
  // --------------------------------------------------

  return {

    algorithm,

    quantum:
      algorithm === "RR" ? timeQuantum : null,

    timeline,

    results,

    averages,

    totalTime: currentTime,

    completedCount

  };

}