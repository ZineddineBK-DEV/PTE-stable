import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LabServiceService } from 'src/app/core/service/lab-service.service';
import { Chart } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-labs-kpis',
  templateUrl: './labs-kpis.component.html',
  styleUrls: ['./labs-kpis.component.scss']
})
export class LabsKpisComponent implements OnInit, AfterViewInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  stats: any = {};
  currentYear: number = new Date().getFullYear();
  currentMonth: string = '';
  currentDepartment: string = '';
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

  departments: string[] = ['Development', 'Networking', 'System', 'Cyber Security', 'Administration'];

  // Charts
  statusChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  statusChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  typeChartData: ChartData<'pie'> = { labels: [], datasets: [] };
  typeChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  };

  constructor(private labService: LabServiceService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.chart?.update(), 300);
  }

  loadStats(): void {
    const params: any = { year: this.currentYear };
    if (this.currentMonth) params.month = this.currentMonth;
    if (this.currentDepartment) params.department = this.currentDepartment;

    this.labService.getVirtEnvStats(params).subscribe({
      next: (data) => {
        this.stats = data || {};
        console.log('Labs Stats received:', this.stats);

        // Status Breakdown Pie
        this.statusChartData = {
          labels: data?.statusBreakdown?.map((s: any) => s._id) || [],
          datasets: [{
            data: data?.statusBreakdown?.map((s: any) => s.count) || [],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#64748b'],
            hoverOffset: 25
          }]
        };

        // Requests by Type
        this.typeChartData = {
          labels: data?.requestsByType?.map((t: any) => t._id) || [],
          datasets: [{
            data: data?.requestsByType?.map((t: any) => t.count) || [],
            backgroundColor: ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
          }]
        };

        // Monthly Trend
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyCounts = monthLabels.map((_, i) => {
          const key = `${this.currentYear}-${String(i + 1).padStart(2, '0')}`;
          return data?.monthlyTrend?.find((m: any) => m._id === key)?.count || 0;
        });

        this.lineChartData = {
          labels: monthLabels,
          datasets: [{
            label: 'Virtualization Requests',
            data: monthlyCounts,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            tension: 0.4,
            fill: true
          }]
        };

        setTimeout(() => this.chart?.update(), 100);
      },
      error: (err) => console.error('Virtualization Stats Error:', err)
    });
  }

  // ==================== SAFE GETTERS ====================
  get totalRequests(): number {
    return this.stats?.totalRequests?.count ?? this.stats?.totalRequests ?? 0;
  }

  get active(): number {
    return this.stats?.statusBreakdown?.find((s: any) => s._id === 'Active')?.count ?? 0;
  }

  get pending(): number {
    return this.stats?.statusBreakdown?.find((s: any) => s._id === 'Pending')?.count ?? 0;
  }

  get declined(): number {
    return this.stats?.statusBreakdown?.find((s: any) => s._id === 'Declined')?.count ?? 0;
  }

  get expired(): number {
    return this.stats?.statusBreakdown?.find((s: any) => s._id === 'Expired')?.count ?? 0;
  }

  get approvalRate(): number {
    const decided = this.active + this.declined + this.expired;
    return decided > 0 ? Math.round((this.active / decided) * 100) : 0;
  }
}