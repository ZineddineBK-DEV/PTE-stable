import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-my-mission-kpi',
  templateUrl: './my-mission-kpi.component.html',
  styleUrls: ['./my-mission-kpi.component.scss']
})
export class MyMissionKpiComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  stats: any = {};
  currentYear: number = new Date().getFullYear();
  currentMonth: string = '';
  currentTime: Date = new Date();

  years: number[] = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028];

  months = [
    { value: '1', name: 'January' }, { value: '2', name: 'February' },
    { value: '3', name: 'March' }, { value: '4', name: 'April' },
    { value: '5', name: 'May' }, { value: '6', name: 'June' },
    { value: '7', name: 'July' }, { value: '8', name: 'August' },
    { value: '9', name: 'September' }, { value: '10', name: 'October' },
    { value: '11', name: 'November' }, { value: '12', name: 'December' }
  ];

  // Charts
  missionsTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  missionsTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { color: '#e2e8f0' } }
    }
  };

  kmTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  kmTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { color: '#e2e8f0' } }
    }
  };

  dayOfWeekData: ChartData<'bar'> = { labels: [], datasets: [] };
  dayOfWeekOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
      x: { grid: { color: '#e2e8f0' } }
    }
  };

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadMyStats();
  }

  loadMyStats(): void {
    const params: any = { year: this.currentYear };
    if (this.currentMonth) params.month = this.currentMonth;

    this.userService.getMyMissionStats(params).subscribe({
      next: (data) => {
        this.stats = data || {};
        console.log('My personal stats:', this.stats);

        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthsFull = Array.from({ length: 12 }, (_, i) => 
          `${this.currentYear}-${String(i + 1).padStart(2, '0')}`
        );

        // Missions Trend
        this.missionsTrendData = {
          labels: monthLabels,
          datasets: [{
            label: 'My Missions',
            data: monthsFull.map(m => 
              data.missionsPerMonth?.find((item: any) => item._id === m)?.count || 0
            ),
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            tension: 0.4,
            fill: true
          }]
        };

        // KM Trend
        this.kmTrendData = {
          labels: monthLabels,
          datasets: [{
            label: 'Kilometers Driven',
            data: monthsFull.map(m => 
              data.kmPerMonth?.find((item: any) => item._id === m)?.totalKm || 0
            ),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.4,
            fill: true
          }]
        };

        // Day of Week Bar Chart
        const dayLabels = data.missionsByDayOfWeek?.map((d: any) => d.day) || [];
        const dayCounts = data.missionsByDayOfWeek?.map((d: any) => d.count) || [];

        this.dayOfWeekData = {
          labels: dayLabels,
          datasets: [{
            label: 'Missions',
            data: dayCounts,
            backgroundColor: '#6366f1',
            borderRadius: 6
          }]
        };

        setTimeout(() => this.chart?.update(), 150);
      },
      error: (err) => console.error('My stats error:', err)
    });
  }

  // Getters
  get totalMyMissions(): number {
    return this.stats?.totalMyMissions || 0;
  }

  get avgDuration(): number {
    return Number(this.stats?.avgDurationHours || 0);
  }

  get totalKmThisYear(): number {
    return this.stats?.totalKmThisYear || 0;
  }
}