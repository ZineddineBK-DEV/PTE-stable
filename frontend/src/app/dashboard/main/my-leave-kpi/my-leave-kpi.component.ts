import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LeaveServiceService } from 'src/app/core/service/leave-service.service';

// Register Chart.js
import { Chart } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-my-leave-kpi',
  templateUrl: './my-leave-kpi.component.html',
  styleUrls: ['./my-leave-kpi.component.scss']
})
export class MyLeaveKpiComponent implements OnInit, AfterViewInit {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  stats: any = {};
  currentYear: number = new Date().getFullYear();
  currentMonth: string = '';
  currentTime: Date = new Date();

  years: number[] = [2023, 2024, 2025, 2026, 2027];
  months = [
    { value: '1', name: 'January' }, { value: '2', name: 'February' },
    { value: '3', name: 'March' }, { value: '4', name: 'April' },
    { value: '5', name: 'May' }, { value: '6', name: 'June' },
    { value: '7', name: 'July' }, { value: '8', name: 'August' },
    { value: '9', name: 'September' }, { value: '10', name: 'October' },
    { value: '11', name: 'November' }, { value: '12', name: 'December' }
  ];

  // Charts
  pieChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Days' } }
    }
  };

  constructor(private leaveService: LeaveServiceService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.chart?.update(), 200);
  }

  loadStats(): void {
    const params: any = { year: this.currentYear };
    if (this.currentMonth) params.month = this.currentMonth;

    this.leaveService.getMyLeaveStats(params).subscribe({
      next: (data) => {
        this.stats = data || {};
        console.log('My Leave Stats received:', this.stats);

        // Pie Chart - Leave by Type
        this.pieChartData = {
          labels: data?.leaveByType?.map((t: any) => t._id || 'Other') || [],
          datasets: [{
            data: data?.leaveByType?.map((t: any) => Number(t.days) || 0) || [],
            backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'],
            hoverOffset: 20
          }]
        };

        // Line Chart - Monthly Trend
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = monthLabels.map((_, i) => {
          const key = `${this.currentYear}-${String(i + 1).padStart(2, '0')}`;
          return data?.monthlyTrend?.find((m: any) => m._id === key)?.days || 0;
        });

        this.lineChartData = {
          labels: monthLabels,
          datasets: [{
            label: 'Approved Leave Days',
            data: monthlyData,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            tension: 0.4,
            fill: true
          }]
        };

        setTimeout(() => this.chart?.update(), 100);
      },
      error: (err) => console.error('My Leave Stats Error:', err)
    });
  }

  // ==================== GETTERS ====================
  get totalRequests(): number {
    return this.stats?.totalRequests || 0;
  }

  get approvedDays(): number {
    return Number(this.stats?.approvedDays || 0);
  }

  get pendingRequests(): number {
    return this.stats?.pendingRequests || 0;
  }

  get avgDuration(): number {
    return Number(this.stats?.avgDuration || 0);
  }

  get last5Leaves(): any[] {
    return this.stats?.last5Leaves || [];
  }

  get totalDaysThisYear(): number {
    return Number(this.stats?.approvedDays || 0);
  }

  getStatusText(leave: any): string {
    if (leave.managerAccepted && leave.supervisorAccepted) {
      return 'Fully Approved';
    } else if (leave.managerAccepted && !leave.supervisorAccepted) {
      return 'Pending Supervisor';
    } else if (!leave.managerAccepted && leave.supervisorAccepted) {
      return 'Pending Manager';
    } else {
      return 'Pending';
    }
  }

  // ==================== DATE FORMATTING ====================

  formatRequestDate(leave: any): string {
    const date = leave?.createdAt || leave?.startDate;
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  /** 
   * PERIOD COLUMN - Main method you requested
   * Shows clean date range for normal leaves
   * Shows date + time for Authorization and 1/2 day
   */
  formatPeriod(leave: any): string {
    if (!leave?.startDate || !leave?.endDate) return '—';

    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);

    const type = (leave.type || '').trim();

    // For Authorization and 1/2 day → show time as well
    if (type === 'Authorization' || type === '1/2 day') {
      const startStr = start.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      const endStr = end.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      });
      return `${startStr} → ${endStr}`;
    } 
    // For all other leave types → clean date only
    else {
      const startStr = start.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      });
      const endStr = end.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
      });
      return `${startStr} → ${endStr}`;
    }
  }
}