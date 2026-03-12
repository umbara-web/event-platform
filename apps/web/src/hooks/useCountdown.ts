'use client';

import { useState, useEffect, useCallback } from 'react';

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function useCountdown(
  targetDate: string | Date | null
): CountdownResult {
  const calculateTimeLeft = useCallback((): CountdownResult => {
    if (!targetDate) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: '00:00:00',
      };
    }

    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: '00:00:00',
      };
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const formatted = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return { hours, minutes, seconds, isExpired: false, formatted };
  }, [targetDate]);

  const [countdown, setCountdown] =
    useState<CountdownResult>(calculateTimeLeft);

  useEffect(() => {
    if (!targetDate) return;

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, calculateTimeLeft]);

  return countdown;
}

export default useCountdown;
