import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { InternsService } from 'src/app/core/service/interns.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AddInternModalComponent } from './add-intern-modal/add-intern-modal.component';
import { InternDocsComponent } from './itern-docs/intern-docs.component';

@Component({
  selector: 'app-interns-request',
  templateUrl: './interns-request.component.html',
  styleUrls: ['./interns-request.component.scss'],
  providers: [ToastrService],
})
export class InternsRequestComponent implements OnInit {
  readonly intern_image_url = environment.INTERN_IMAGE_URL;

  // Data
  rows: any[]     = [];
  temp: any[]     = [];
  allData: any[]  = [];   // full unfiltered cache for stats
  userRole        = '';
  employeesCount  = 0;
  loadingIndicator = false;
  SortType        = SortType;
  reorderable     = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  // View
  viewMode: 'table' | 'card' = 'table';
  currentViewLabel = 'Approved Interns';

  // Card pagination
  cardPage     = 0;
  cardPageSize = 8;

  // Stats (always from allData)
  totalInterns  = 0;
  approvedCount = 0;
  requestsCount = 0;
  archivedCount = 0;

  // Departments for filter dropdown
  departments: string[] = [];

  // Active filter badges
  activeFilters: { key: string; label: string }[] = [];
  private filterMap: Record<string, string> = {};

  // Which dataset is currently active (for re-applying dept filter after type change)
  private currentDataset: 'approved' | 'requests' | 'archived' = 'approved';

  @ViewChild('table') table!: DatatableComponent;

  constructor(
    private router: Router,
    private internService: InternsService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {}

  // ── Init ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.userRole = localStorage.getItem('roles') ?? '';
    this.loadStats();
    this.getInterns();
  }

  // Load once to fill stat counters
  private loadStats(): void {
    this.internService.getInterns().subscribe((result: any) => {
      this.allData      = result.data as any[];
      this.totalInterns  = this.allData.length;
      this.approvedCount = this.allData.filter(i => !i.archived && i.isEnabled).length;
      this.archivedCount = this.allData.filter(i => i.archived).length;
    });
    this.internService.getInternRequest().subscribe((result: any) => {
      this.requestsCount = (result as any[]).filter(i => !i.archived && !i.isEnabled).length;
    });
  }

  // ── Data Loaders ─────────────────────────────────────────────────
  getInterns(): void {
    this.loadingIndicator  = true;
    this.currentDataset    = 'approved';
    this.currentViewLabel  = 'Approved Interns';
    this.internService.getInterns().subscribe((result: any) => {
      const all  = result.data as any[];
      const data = all.filter(i => !i.archived && i.isEnabled);
      this.temp  = data;
      this.rows  = [...data];
      this.employeesCount  = data.length;
      this.departments     = [...new Set(data.map((i: any) => i.departement).filter(Boolean))];
      this.loadingIndicator = false;
      this.cardPage = 0;
    });
  }

  getInternsRequest(): void {
    this.loadingIndicator  = true;
    this.currentDataset    = 'requests';
    this.currentViewLabel  = 'Intern Requests';
    this.internService.getInternRequest().subscribe((result: any) => {
      const data = (result as any[]).filter(i => !i.archived && !i.isEnabled);
      this.temp  = data;
      this.rows  = [...data];
      this.employeesCount  = data.length;
      this.departments     = [...new Set(data.map((i: any) => i.departement).filter(Boolean))];
      this.loadingIndicator = false;
      this.cardPage = 0;
    });
  }

  getArchivedInterns(): void {
    this.loadingIndicator  = true;
    this.currentDataset    = 'archived';
    this.currentViewLabel  = 'Archived Interns';
    this.internService.getInterns().subscribe((result: any) => {
      const data = (result.data as any[]).filter(i => i.archived);
      this.temp  = data;
      this.rows  = [...data];
      this.employeesCount  = data.length;
      this.departments     = [...new Set(data.map((i: any) => i.departement).filter(Boolean))];
      this.loadingIndicator = false;
      this.cardPage = 0;
    });
  }

  // ── Type Filter (dropdown) ───────────────────────────────────────
  userFilter(event: any): void {
    const val = event.target.value;
    this.filterMap = {};
    this.activeFilters = [];

    if (!val || val === 'approved_interns') {
      this.getInterns();
    } else if (val === 'interns_requests') {
      this.getInternsRequest();
    } else if (val === 'archived_interns') {
      this.getArchivedInterns();
    }
  }

  // ── Search Filter ────────────────────────────────────────────────
  updateFilter(event: any): void {
    const val = event.target.value.toLowerCase().trim();
    this.filterMap['search'] = val;
    val
      ? this.setActiveFilter('search', `Search: "${event.target.value}"`)
      : this.removeFilter('search');
    this.applyFilters();
  }

  filterByDept(event: any): void {
    const val = event.target.value;
    this.filterMap['dept'] = val;
    val
      ? this.setActiveFilter('dept', `Dept: ${val}`)
      : this.removeFilter('dept');
    this.applyFilters();
  }

  private applyFilters(): void {
    const search = this.filterMap['search'] ?? '';
    const dept   = this.filterMap['dept']   ?? '';

    this.rows = this.temp.filter((d: any) => {
      const matchSearch =
        !search ||
        d.firstName?.toLowerCase().includes(search) ||
        d.lastName?.toLowerCase().includes(search)  ||
        d.email?.toLowerCase().includes(search)     ||
        d.phone?.includes(search);

      const matchDept = !dept || d.departement === dept;

      return matchSearch && matchDept;
    });

    this.cardPage = 0;
    if (this.table) this.table.offset = 0;
  }

  private setActiveFilter(key: string, label: string): void {
    const idx = this.activeFilters.findIndex(f => f.key === key);
    idx > -1
      ? (this.activeFilters[idx].label = label)
      : this.activeFilters.push({ key, label });
  }

  removeFilter(key: string): void {
    this.activeFilters = this.activeFilters.filter(f => f.key !== key);
    delete this.filterMap[key];
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterMap     = {};
    this.activeFilters = [];
    this.rows          = [...this.temp];
    this.cardPage      = 0;
    if (this.table) this.table.offset = 0;
  }

  // ── Card Pagination ──────────────────────────────────────────────
  get pagedRows(): any[] {
    const start = this.cardPage * this.cardPageSize;
    return this.rows.slice(start, start + this.cardPageSize);
  }

  get totalCardPages(): number {
    return Math.ceil(this.rows.length / this.cardPageSize);
  }

  // ── Actions ──────────────────────────────────────────────────────
  confirmRequest(userID: string): void {
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swal.fire({
      title: 'Approve this intern?',
      text: "The intern will be granted access.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.internService.confirmInternRequest(userID).subscribe(() => {
          this.rows = this.rows.filter(u => u._id !== userID);
          this.temp = this.temp.filter(u => u._id !== userID);
          this.employeesCount = this.temp.length;
          this.requestsCount  = Math.max(0, this.requestsCount - 1);
          this.approvedCount++;
          swal.fire('Approved!', 'Intern request has been confirmed.', 'success');
        });
      }
    });
  }

  declineRequest(userID: string): void {
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swal.fire({
      title: 'Decline this request?',
      text: "This cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Decline!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.internService.declineInternRequest(userID).subscribe(() => {
          this.rows = this.rows.filter(u => u._id !== userID);
          this.temp = this.temp.filter(u => u._id !== userID);
          this.employeesCount = this.temp.length;
          this.requestsCount  = Math.max(0, this.requestsCount - 1);
          swal.fire('Declined!', 'Intern request has been removed.', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swal.fire('Cancelled', 'Intern request is safe.', 'info');
      }
    });
  }

  switchToArchive(internID: string): void {
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swal.fire({
      title: 'Move to archive?',
      text: "This action cannot be reverted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Archive!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        this.internService.switchToArchive(internID).subscribe(() => {
          this.rows = this.rows.filter(r => r._id !== internID);
          this.temp = this.temp.filter(r => r._id !== internID);
          this.employeesCount = this.temp.length;
          this.approvedCount  = Math.max(0, this.approvedCount - 1);
          this.archivedCount++;
          Swal.fire({ title: 'Archived!', text: 'Intern moved to archive.', icon: 'success', confirmButtonColor: '#667eea' });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({ title: 'Cancelled', text: 'Intern is safe.', icon: 'info', confirmButtonColor: '#667eea' });
      }
    });
  }

  // ── Modals ───────────────────────────────────────────────────────
  addInternModal(data: any, action: string): void {
    const modalRef: NgbModalRef = this.modalService.open(AddInternModalComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
      size: 'lg',
    });
    modalRef.componentInstance.payload = { data, action };
    modalRef.result.then(() => this.getInterns());
  }

  openDocsModal(id: any): void {
    const modalRef: NgbModalRef = this.modalService.open(InternDocsComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
      size: 'xl',
    });
    modalRef.componentInstance.payload = id;
    modalRef.result.then(() => this.getInterns());
  }

  // ── Window Resize ────────────────────────────────────────────────
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    if (this.table) {
      this.table.recalculate();
      this.table.recalculateColumns();
    }
  }
}