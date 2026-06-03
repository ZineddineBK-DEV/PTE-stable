import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { LeaveServiceService } from 'src/app/core/service/leave-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-leave-kpi',
  templateUrl: './leave-kpi.component.html',
  styleUrls: ['./leave-kpi.component.scss']
})
export class LeaveKPIComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  today = new Date();
  stats: any = {};
  filterForm: FormGroup;
  private filterSubscription!: Subscription;
  sortColumn: string = 'days';
  sortDirection: 'asc' | 'desc' = 'desc';

  peakSortColumn: string = 'overlapping';
  peakSortDirection: 'asc' | 'desc' = 'desc';

  pieChartType = 'pie' as const;
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
      tooltip: { enabled: true }
    }
  };
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#f97316'],
      hoverOffset: 20
    }]
  };

  lineChartType = 'line' as const;
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y} days`
        }
      }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Days' } },
      x: { title: { display: true, text: 'Month' } }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Approved Leave Days',
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: 'origin',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7
      },
      {
        data: [],
        label: 'Pending Leave Days',
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderDash: [6, 4],
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7
      }
    ]
  };
  departmentChartType = 'bar' as const;
  departmentChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const days = context.parsed.y!;
            const total = this.stats.totalApprovedLeaveDays || 1;
            const pct = ((days / total) * 100).toFixed(1);
            return `${context.label}: ${days} days (${pct}%)`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Approved Days' } },
      x: { title: { display: true, text: 'Department' } }
    }
  };

  departmentChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899',
        '#8b5cf6', '#3b82f6', '#f97316', '#14b8a6', '#a78bfa'
      ],
      borderColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  // Add these after departmentChartData
remainingChartType = 'bar' as const;
remainingChartOptions: ChartConfiguration<'bar'>['options'] = {
  indexAxis: 'y', // horizontal bars
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.label}: ${ctx.parsed.x!.toFixed(1)} days remaining (out of 24)`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: false, // allow negative
      title: { display: true, text: 'Remaining Days (out of 24)' }
    }
  }
};

remainingChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 6
  }]
};

  constructor(
    private statsService: LeaveServiceService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      period: ['year'],
      type: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.setupDynamicFilters();
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  private setupDynamicFilters(): void {
    this.filterSubscription = this.filterForm.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(() => this.loadStats());
  }

  loadStats(): void {

    this.statsService.getStats(this.filterForm.value).subscribe({
      next: (data) => {
        this.stats = data || {};

        this.pieChartData = {
          ...this.pieChartData,
          labels: data?.leaveByType?.map((t: any) => t._id || 'Other') ?? [],
          datasets: [{
            ...this.pieChartData.datasets[0],
            data: data?.leaveByType?.map((t: any) => Number(t.days.toFixed(1)) || 0) ?? []
          }]
        };

        const months = data?.monthlyLeaveTrend?.map((m: any) => m._id) ?? [];
        this.lineChartData = {
          labels: months,
          datasets: [
            {
              ...this.lineChartData.datasets[0],
              data: data?.monthlyLeaveTrend?.map((m: any) => Number(m.days.toFixed(1)) || 0) ?? []
            },
            {
              ...this.lineChartData.datasets[1],
              data: data?.pendingMonthlyTrend?.map((m: any) => Number(m.days.toFixed(1)) || 0) ?? []
            }
          ]
        };
        this.departmentChartData = {
          labels: data?.leaveByDepartment?.map((d: any) => d._id || 'Unknown') ?? [],
          datasets: [{
            ...this.departmentChartData.datasets[0],
            data: data?.leaveByDepartment?.map((d: any) => Number(d.totalDays.toFixed(1)) || 0) ?? []
          }]
        };
       // Remaining balance chart (24 days initial)
const balanceData = data?.currentRemainingBalance || [];
this.remainingChartData = {
  labels: balanceData.map((u: any) => u.fullName || 'Unknown'),
  datasets: [{
    data: balanceData.map((u: any) => Number(u.remaining?.toFixed(1)) || 0),
    backgroundColor: balanceData.map((u: any) => {
      const rem = u.remaining || 0;
      if (rem < 3) return '#ef4444';     // red - critical
      if (rem < 8) return '#f59e0b';     // orange - watch
      if (rem < 12) return '#fbbf24';    // yellow - moderate
      return '#10b981';                  // green - good
    })
  }]
};
        setTimeout(() => {
          this.chart?.update();
        }, 100);

        this.stats.lastUpdated = new Date();
      },
      error: (err) => console.error('Leave stats error:', err)
    });
  }

  resetFilters(): void {
    this.filterForm.reset({
      period: '',
      type: '',
      startDate: '',
      endDate: ''
    });
  }
  sortTopTakers(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }
  }

  get sortedTopTakers(): any[] {
    if (!this.stats.topLeaveTakers?.length) return [];

    const sorted = [...this.stats.topLeaveTakers];

    return sorted.sort((a, b) => {
      let valA = a[this.sortColumn];
      let valB = b[this.sortColumn];

      if (this.sortColumn === 'lastLeaveDate') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB?.toLowerCase() || '';
      } else if (valA === undefined || valA === null) {
        valA = 0;
      } else if (valB === undefined || valB === null) {
        valB = 0;
      }

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  sortPeakDays(column: string): void {
    if (this.peakSortColumn === column) {
      this.peakSortDirection = this.peakSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.peakSortColumn = column;
      this.peakSortDirection = 'desc';
    }
  }

  get sortedPeakDays(): any[] {
    if (!this.stats.peakOverlapDays?.length) return [];

    const sorted = [...this.stats.peakOverlapDays];

    return sorted.sort((a, b) => {
      let valA = a[this.peakSortColumn];
      let valB = b[this.peakSortColumn];

      if (this.peakSortColumn === '_id') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return this.peakSortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.peakSortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}