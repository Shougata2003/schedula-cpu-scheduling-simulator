
import { simulate } from "./scheduling.js";

const processes = [
  { pid: "P1", at: 0, bt: 5, priority: 2 },
  { pid: "P2", at: 1, bt: 3, priority: 1 },
  { pid: "P3", at: 2, bt: 8, priority: 3 },
  { pid: "P4", at: 3, bt: 2, priority: 2 }
];

const algorithms = [
  "FCFS",
  "SJF",
  "SRTF",
  "RR",
  "PRIORITY"
];

for (const algorithm of algorithms) {

  const result = simulate(
    processes,
    algorithm,
    2
  );

  console.log("\n========================");
  console.log("ALGORITHM:", algorithm);
  console.log("========================");

  console.log("GANTT CHART:");

  console.log(
    result.timeline
      .map(block =>
        `${block.pid} (${block.start}-${block.end})`
      )
      .join(" | ")
  );

  console.table(result.results);

  console.log("AVERAGE WAITING TIME:", result.averages.wt);
  console.log("AVERAGE TURNAROUND TIME:", result.averages.tat);
  console.log("AVERAGE RESPONSE TIME:", result.averages.rt);

}