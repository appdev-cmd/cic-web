'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type ComponentPropsWithRef } from 'react';

interface CounterProps {
  value: number;
  suffix?: string;
  motionEnabled?: boolean;
  elementProps?: ComponentPropsWithRef<'span'>;
}

export const Counter = ({ value, suffix = '', motionEnabled = true, elementProps }: CounterProps) => {
  const [count, setCount] = useState(motionEnabled ? 0 : value);

  useEffect(() => {
    if (!motionEnabled) {
      return undefined;
    }

    const start = 0;
    const end = value;
    if (start === end) {
      const resetId = requestAnimationFrame(() => setCount(value));
      return () => cancelAnimationFrame(resetId);
    }

    const duration = 2000;
    const range = end - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * range + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [motionEnabled, value]);

  const displayCount = motionEnabled ? count : value;

  return <span {...elementProps}>{displayCount.toLocaleString('vi-VN')}{suffix}</span>;
};
