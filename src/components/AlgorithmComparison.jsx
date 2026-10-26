
import { useMemo } from "react";
import { simulate } from "../algorithms/scheduling";
import {
  Trophy,
  Clock3,
  Activity,
  Zap,
  TrendingDown,
  GitCompareArrows
} from "lucide-react";

// All five algorithms
const algorithmList = [
  { id: "FCFS", name: "FCFS", description: "First Come First Serve", color: "#3984ed" },
  { id: "SJF", name: "SJF", description: "Shortest Job First", color: "#a477e8" },
  { id: "SRTF", name: "SRTF", description: "Shortest Remaining Time First", color: "#22b99a" },
  { id: "RR", name: "Round Robin", description: "Time Quantum = 2", color: "#e9a34d" },
  { id: "PRIORITY", name: "Priority", description: "Priority Scheduling", color: "#e46c86" }
];

const metrics = [
  {
    id: "wt",
    name: "Average Waiting Time",
    shortName: "Waiting Time",
    icon: Clock3,
    description: "Average time spent waiting in the ready queue."
  },
  {
    id: "tat",
    name: "Average Turnaround Time",
    shortName: "Turnaround Time",
    icon: Activity,
    description: "Average time from arrival to completion."
  },
  {
    id: "rt",
    name: "Average Response Time",
    shortName: "Response Time",
    icon: Zap,
    description: "Average time until first CPU execution."
  }
];

function AlgorithmComparison({ processes, quantum = 2 }) {

  // Run all algorithms on the same process input.
  const comparison = useMemo(() => {

    if (!processes || processes.length === 0) {
      return {
        results: [],
        error: "Add at least one process to compare algorithms."
      };
    }

    try {

      const results = algorithmList.map(algorithm => {

        const result = simulate(
          processes,
          algorithm.id,
          algorithm.id === "RR" ? quantum : 2
        );

        return {
          ...algorithm,
          averages: result.averages,
          totalTime: result.totalTime,
          completedCount: result.completedCount,
          results: result.results
        };

      });

      return {
        results,
        error: null
      };

    } catch (error) {

      return {
        results: [],
        error: error.message
      };

    }

  }, [processes, quantum]);


  const results = comparison.results;


  // Find the best algorithm for a particular metric.
  function getBest(metricId) {

    if (results.length === 0) return null;

    return [...results].sort(
      (a, b) => a.averages[metricId] - b.averages[metricId]
    )[0];

  }


  // Get maximum value for bar chart scaling.
  function getMaximum(metricId) {

    return Math.max(
      1,
      ...results.map(item => item.averages[metricId])
    );

  }


  if (comparison.error) {

    return (
      <section className="panel comparison-panel" id="comparison">

        <div className="section-heading">
          <div>
            <span className="section-kicker">ALGORITHM ANALYTICS</span>
            <h2>Comparison Laboratory</h2>
          </div>
        </div>

        <div className="empty-state">
          <p>{comparison.error}</p>
        </div>

      </section>
    );

  }


  return (

    <section className="comparison-panel" id="comparison">

      {/* HEADER */}

      <div className="comparison-header">

        <div>
          <span className="section-kicker">
            STAGE 6 · PERFORMANCE ANALYTICS
          </span>

          <h2>Algorithm Comparison Laboratory</h2>

          <p>
            Compare all five CPU scheduling algorithms
            using identical process workloads.
          </p>
        </div>

        <div className="comparison-icon">
          <GitCompareArrows size={27} />
        </div>

      </div>


      {/* CONFIGURATION */}

      <div className="comparison-config">

        <div>
          <span>PROCESSES ANALYZED</span>
          <strong>{processes.length}</strong>
        </div>

        <div>
          <span>ALGORITHMS COMPARED</span>
          <strong>{results.length}</strong>
        </div>

        <div>
          <span>ROUND ROBIN QUANTUM</span>
          <strong>{quantum}</strong>
        </div>

        <div>
          <span>COMPARISON STATUS</span>
          <strong className="analysis-ready">
            Complete
          </strong>
        </div>

      </div>


      {/* WINNERS */}

      <div className="comparison-section-heading">

        <div>
          <span className="section-kicker">
            AUTOMATIC ANALYSIS
          </span>

          <h3>Performance Leaders</h3>

          <p>
            The lowest average execution metric wins.
          </p>
        </div>

        <Trophy size={23} color="#e9a34d" />

      </div>


      <div className="winner-grid">

        {metrics.map(metric => {

          const best = getBest(metric.id);
          const Icon = metric.icon;

          return (

            <div className="winner-card" key={metric.id}>

              <div className="winner-card-top">
                <Icon size={21} />

                <span className="winner-tag">
                  BEST RESULT
                </span>
              </div>

              <span className="winner-label">
                {metric.name}
              </span>

              <h3 style={{ color: best.color }}>
                {best.name}
              </h3>

              <strong>
                {best.averages[metric.id].toFixed(2)}
              </strong>

              <p>{metric.description}</p>

            </div>

          );

        })}

      </div>


      {/* BAR CHARTS */}

      <div className="comparison-section-heading">

        <div>
          <span className="section-kicker">
            VISUAL ANALYTICS
          </span>

          <h3>Performance Charts</h3>

          <p>
            Compare average execution metrics across algorithms.
            Shorter bars represent lower values.
          </p>
        </div>

        <TrendingDown size={23} color="#22b99a" />

      </div>


      <div className="comparison-chart-grid">

        {metrics.map(metric => {

          const maximum = getMaximum(metric.id);
          const best = getBest(metric.id);

          return (

            <div className="comparison-chart-card" key={metric.id}>

              <h4>{metric.shortName}</h4>

              <p>{metric.description}</p>

              <div className="comparison-bars">

                {results.map(item => {

                  const value = item.averages[metric.id];

                  const width =
                    (value / maximum) * 100;

                  const isBest = item.id === best.id;

                  return (

                    <div className="comparison-bar-row" key={item.id}>

                      <span className="comparison-bar-label">
                        {item.name}
                      </span>

                      <div className="comparison-bar-track">

                        <div
                          className="comparison-bar-fill"
                          style={{
                            width: `${width}%`,
                            background: item.color
                          }}
                        />

                      </div>

                      <strong className="comparison-bar-value">
                        {value.toFixed(2)}
                      </strong>

                      {isBest && (
                        <Trophy
                          size={14}
                          color="#e9a34d"
                          className="comparison-trophy"
                        />
                      )}

                    </div>

                  );

                })}

              </div>

              <div className="chart-best-result">
                <Trophy size={14} />
                Best: {best.name}
              </div>

            </div>

          );

        })}

      </div>


      {/* COMPARISON TABLE */}

      <div className="comparison-section-heading">

        <div>
          <span className="section-kicker">
            DETAILED PERFORMANCE
          </span>

          <h3>Algorithm Comparison Table</h3>

          <p>
            Complete numerical comparison of every algorithm.
          </p>
        </div>

      </div>


      <div className="table-wrapper">

        <table className="comparison-table">

          <thead>
            <tr>
              <th>ALGORITHM</th>
              <th>AVG WAITING</th>
              <th>AVG TURNAROUND</th>
              <th>AVG RESPONSE</th>
              <th>FINISH TIME</th>
            </tr>
          </thead>

          <tbody>

            {results.map(item => (

              <tr key={item.id}>

                <td>
                  <span className="comparison-algorithm-name">

                    <span
                      className="comparison-dot"
                      style={{ background: item.color }}
                    />

                    <strong>{item.name}</strong>

                  </span>
                </td>

                <td>
                  <strong>
                    {item.averages.wt.toFixed(2)}
                  </strong>
                </td>

                <td>
                  {item.averages.tat.toFixed(2)}
                </td>

                <td>
                  {item.averages.rt.toFixed(2)}
                </td>

                <td>
                  {item.totalTime}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* EDUCATIONAL NOTE */}

      <div className="comparison-note">

        <Trophy size={21} />

        <div>

          <strong>How to interpret the results</strong>

          <p>
            Lower waiting, turnaround and response times
            generally indicate better performance for their
            respective metrics. The best algorithm can differ
            depending on the workload and optimization goal.
            No single algorithm is universally best.
          </p>

        </div>

      </div>

    </section>

  );

}

export default AlgorithmComparison;