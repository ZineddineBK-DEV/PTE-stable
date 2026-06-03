import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { UserServiceService } from 'src/app/core/service/user-service.service';

// Register all Chart.js components (fixes scale errors)
import { Chart } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-mission-kpi',
  templateUrl: './mission-kpi.component.html',
  styleUrls: ['./mission-kpi.component.scss']
})
export class MissionKpiComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  stats: any = {};
  currentYear: number = new Date().getFullYear();
  currentMonth: string = '';
  currentDepartment: string = '';
  currentTime: Date = new Date();

  years: number[] = [2023, 2024, 2025, 2026, 2027];
  months = [
    { value: '1', name: 'January' },
    { value: '2', name: 'February' },
    { value: '3', name: 'March' },
    { value: '4', name: 'April' },
    { value: '5', name: 'May' },
    { value: '6', name: 'June' },
    { value: '7', name: 'July' },
    { value: '8', name: 'August' },
    { value: '9', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];

  departments: string[] = [];

  // Charts
  missionsTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  missionsTrendOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Missions' } },
      x: { title: { display: true, text: 'Month' } }
    }
  };

  topEngineersData: ChartData<'bar'> = { labels: [], datasets: [] };
  topEngineersOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: 'Mission Count' } }
    }
  };

  topVehiclesData: ChartData<'bar'> = { labels: [], datasets: [] };
  topVehiclesOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: 'Usage Count' } }
    }
  };

  kmPerVehicleData: ChartData<'line'> = { labels: [], datasets: [] };
  kmPerVehicleOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Kilometers' } },
      x: { title: { display: true, text: 'Month' } }
    }
  };

  workloadData: ChartData<'bar'> = { labels: [], datasets: [] };
  workloadOptions: ChartConfiguration<'bar'>['options'] = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: 'Max Concurrent Missions/Day' } }
    }
  };

  deptMissionsData: ChartData<'bar'> = { labels: [], datasets: [] };
  deptMissionsOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed.y} missions` } }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Mission Count' } },
      x: { title: { display: true, text: 'Department' } }
    }
  };

  constructor(private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadStats();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.chart?.update(), 200);
  }

  loadDepartments(): void {
    this.userService.getDepartments().subscribe({
      next: (depts) => this.departments = depts || [],
      error: (err) => console.error('Failed to load departments:', err)
    });
  }

  loadStats(): void {
    const params: any = { year: this.currentYear };
    if (this.currentMonth) params.month = this.currentMonth;
    if (this.currentDepartment) params.department = this.currentDepartment;

    this.userService.getMissionStats(params).subscribe({
      next: (data) => {
        this.stats = data || {};
        console.log('Received stats:', this.stats);

        const months = Array.from({ length: 12 }, (_, i) => `${this.currentYear}-${String(i + 1).padStart(2, '0')}`);

        // Missions trend
        const userCounts = months.map(m =>
          data?.missionsPerMonth?.userEvents?.find((e: any) => e._id === m)?.userEvents || 0
        );
        const vehicleCounts = months.map(m =>
          data?.missionsPerMonth?.vehicleEvents?.find((e: any) => e._id === m)?.vehicleEvents || 0
        );

        this.missionsTrendData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Engineer Missions',
              data: userCounts,
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Vehicle Missions',
              data: vehicleCounts,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              tension: 0.3,
              fill: true
            }
          ]
        };

        // Top Engineers
        this.topEngineersData = {
          labels: data?.topEngineers?.map((e: any) => e.fullName || 'Unknown') || [],
          datasets: [{
            data: data?.topEngineers?.map((e: any) => e.count || 0) || [],
            backgroundColor: '#3b82f6',
            borderRadius: 6
          }]
        };

        // Top Vehicles
        this.topVehiclesData = {
          labels: data?.topVehicles?.map((v: any) => `${v.registration || 'N/A'} (${v.model || 'N/A'})`) || [],
          datasets: [{
            data: data?.topVehicles?.map((v: any) => v.events || 0) || [],
            backgroundColor: '#f59e0b',
            borderRadius: 6
          }]
        };

        // Kilometers per Vehicle per Month
        const vehicleData = data?.kmPerVehiclePerMonth || [];
        const vehicleMap = new Map<string, { name: string, data: number[] }>();

        vehicleData.forEach((item: any) => {
          const vid = item.vehicleId?.toString() || 'unknown';
          if (!vehicleMap.has(vid)) {
            vehicleMap.set(vid, {
              name: `${item.registration || 'N/A'} (${item.model || 'Unknown'})`,
              data: new Array(12).fill(0)
            });
          }
          const monthIndex = months.indexOf(item.month);
          if (monthIndex !== -1) {
            vehicleMap.get(vid)!.data[monthIndex] = item.totalKm || 0;
          }
        });

        const sortedVehicles = Array.from(vehicleMap.values())
          .sort((a, b) => b.data.reduce((s, v) => s + v, 0) - a.data.reduce((s, v) => s + v, 0))
          .slice(0, 8);

        this.kmPerVehicleData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: sortedVehicles.map((veh, index) => ({
            label: veh.name,
            data: veh.data,
            borderColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'][index],
            tension: 0.3,
            fill: false
          }))
        };

        // Engineer workload overlap
        this.workloadData = {
          labels: data?.engineerWorkloadOverlap?.map((e: any) => e.fullName || 'Unknown') || [],
          datasets: [{
            label: 'Max Overlap per Day',
            data: data?.engineerWorkloadOverlap?.map((e: any) => e.maxOverlap || 0) || [],
            backgroundColor: '#ef4444',
            borderRadius: 6
          }]
        };

        // Missions by Department
        this.deptMissionsData = {
          labels: data?.missionsByDepartment?.map((d: any) => d._id || 'Unknown') || [],
          datasets: [{
            data: data?.missionsByDepartment?.map((d: any) => d.count || 0) || [],
            backgroundColor: '#8b5cf6',
            borderRadius: 6
          }]
        };

        setTimeout(() => this.chart?.update(), 100);
      },
      error: (err) => console.error('Missions stats error:', err)
    });
  }

  // Getters
  get totalMissions(): number {
    return (
      (this.stats?.missionsPerMonth?.userEvents?.reduce((s: number, m: any) => s + (m.userEvents || 0), 0) || 0) +
      (this.stats?.missionsPerMonth?.vehicleEvents?.reduce((s: number, m: any) => s + (m.vehicleEvents || 0), 0) || 0)
    );
  }

  get engineerMissions(): number {
    return this.stats?.missionsPerMonth?.userEvents?.reduce((s: number, m: any) => s + (m.userEvents || 0), 0) || 0;
  }

  get vehicleMissions(): number {
    return this.stats?.missionsPerMonth?.vehicleEvents?.reduce((s: number, m: any) => s + (m.vehicleEvents || 0), 0) || 0;
  }

  get avgDuration(): number {
    return Number(this.stats?.avgDurationHours || 0);
  }
}