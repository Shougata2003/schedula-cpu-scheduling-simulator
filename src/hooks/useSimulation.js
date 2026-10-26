
import { useState, useEffect, useCallback } from "react";

export function useSimulation(result) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const totalTime = result?.totalTime ?? 0;

  // Reset whenever a new simulation is generated
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [result]);

  // Find the currently executing process
  const currentBlock = result?.timeline?.find(
    block =>
      currentTime >= block.start &&
      currentTime < block.end
  ) ?? null;

  const runningProcess =
    currentBlock && currentBlock.pid !== "IDLE"
      ? currentBlock.pid
      : null;

  const isIdle = currentBlock?.pid === "IDLE";

  const isCompleted =
    Boolean(result) && currentTime >= totalTime;

  const progress =
    totalTime > 0
      ? Math.min((currentTime / totalTime) * 100, 100)
      : 0;

  // Move forward by one time unit
  const nextStep = useCallback(() => {
    setCurrentTime(previous =>
      Math.min(previous + 1, totalTime)
    );
  }, [totalTime]);

  // Automatic playback
  useEffect(() => {
    if (!isPlaying || !result || currentTime >= totalTime) {
      if (currentTime >= totalTime) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCurrentTime(previous =>
        Math.min(previous + 1, totalTime)
      );
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentTime, totalTime, speed, result]);

  // Play / Pause
  const togglePlay = useCallback(() => {
    if (!result) return;

    if (currentTime >= totalTime) {
      setCurrentTime(0);
    }

    setIsPlaying(previous => !previous);
  }, [result, currentTime, totalTime]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Restart simulation
  const restart = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Playback speed
  const changeSpeed = useCallback(value => {
    setSpeed(Number(value));
  }, []);

  return {
    currentTime,
    totalTime,
    isPlaying,
    isCompleted,
    runningProcess,
    currentBlock,
    isIdle,
    progress,
    speed,
    nextStep,
    togglePlay,
    pause,
    restart,
    changeSpeed
  };
}