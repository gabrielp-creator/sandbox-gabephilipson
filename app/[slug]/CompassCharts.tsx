'use client';

import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
);

export function FeatureChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: [
          'Core pipeline',
          'Intake',
          'Agent intel',
          'Stakeholder',
          'Export',
          'UI/UX',
          'Architecture',
          'Phase III',
        ],
        datasets: [
          {
            label: 'Live',
            data: [7, 7, 8, 8, 6, 8, 5, 0],
            backgroundColor: '#1D9E75',
            borderRadius: 4,
          },
          {
            label: 'Planned',
            data: [4, 1, 2, 0, 1, 0, 1, 2],
            backgroundColor: '#B5D4F4',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Features by category',
            color: '#5F5E5A',
            font: { size: 14, weight: 500 },
            padding: { bottom: 16 },
          },
        },
        scales: {
          x: {
            stacked: true,
            ticks: { color: '#5F5E5A', font: { size: 11 }, maxRotation: 45 },
            grid: { display: false },
          },
          y: {
            stacked: true,
            ticks: { color: '#5F5E5A', stepSize: 2 },
            grid: { color: 'rgba(0,0,0,0.06)' },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export function TokenChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['PayFlow', 'BC365 R1', 'BC365 R2', 'BC365 R3', 'Pitcher', 'Furniture', 'Network'],
        datasets: [
          {
            label: 'Discovery',
            data: [2928, 2050, 2424, 1552, 2569, 2393, 2510],
            borderColor: '#534AB7',
            backgroundColor: '#534AB7',
            pointRadius: 4,
            tension: 0.3,
          },
          {
            label: 'Strategy',
            data: [4249, 4379, 3771, 3218, 4220, 3475, 3965],
            borderColor: '#1D9E75',
            backgroundColor: '#1D9E75',
            pointRadius: 4,
            tension: 0.3,
          },
          {
            label: 'Requirements',
            data: [11041, 11403, 12989, 10094, 11999, 10258, 12936],
            borderColor: '#D85A30',
            backgroundColor: '#D85A30',
            pointRadius: 4,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#5F5E5A',
              font: { size: 11 },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
            },
          },
          title: {
            display: true,
            text: 'Token efficiency across test runs',
            color: '#5F5E5A',
            font: { size: 14, weight: 500 },
            padding: { bottom: 8 },
          },
        },
        scales: {
          x: {
            ticks: { color: '#5F5E5A', font: { size: 11 } },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: '#5F5E5A',
              callback: (v) => Number(v).toLocaleString(),
            },
            grid: { color: 'rgba(0,0,0,0.06)' },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
