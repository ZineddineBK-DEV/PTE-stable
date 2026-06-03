import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { User } from 'src/app/core/models/user';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.scss']
})
export class UserRequestComponent implements OnInit {
  readonly picsUrl = environment.PICSURL;

  rows: User[] = [];
  temp: User[] = [];
  employeesCount = 0;
  loadingIndicator = false;
  SortType = SortType;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  // Filter state
  departments: string[] = [];
  activeFilters: { key: string; label: string }[] = [];
  private filterMap: Record<string, string> = {};

  @ViewChild('table') table!: DatatableComponent;

  constructor(private router: Router, private userService: UserServiceService) {}

  ngOnInit(): void {
    this.loadingIndicator = true;
    this.userService.getUserRequest().subscribe((result: any) => {
      this.rows        = result as User[];
      this.temp        = result as User[];
      this.employeesCount = this.rows.length;
      this.departments = [...new Set(this.rows.map((u: any) => u.departement).filter(Boolean))];
      this.loadingIndicator = false;
    });
  }

  // ── Stats Helpers ────────────────────────────────────────────────
  getActiveCount(): number {
    return this.temp.filter((u: any) => u.isEnabled === 'Active').length;
  }

  getInactiveCount(): number {
    return this.temp.filter((u: any) => u.isEnabled === 'Inactive').length;
  }

  getDepartmentCount(): number {
    return new Set(this.temp.map((u: any) => u.departement).filter(Boolean)).size;
  }

  // ── Filtering ────────────────────────────────────────────────────
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

  filterByStatus(event: any): void {
    const val = event.target.value;
    this.filterMap['status'] = val;
    val !== ''
      ? this.setActiveFilter('status', `Status: ${val}`)
      : this.removeFilter('status');
    this.applyFilters();
  }

  private applyFilters(): void {
    const search = this.filterMap['search'] ?? '';
    const dept   = this.filterMap['dept']   ?? '';
    const status = this.filterMap['status'] ?? '';

    this.rows = this.temp.filter((u: any) => {
      const matchSearch =
        !search ||
        u.firstName?.toLowerCase().includes(search) ||
        u.lastName?.toLowerCase().includes(search)  ||
        u.email?.toLowerCase().includes(search)     ||
        u.departement?.toLowerCase().includes(search);

      const matchDept   = !dept   || u.departement === dept;
      const matchStatus = !status || u.isEnabled   === status;

      return matchSearch && matchDept && matchStatus;
    });

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
    this.filterMap   = {};
    this.activeFilters = [];
    this.rows = [...this.temp];
    if (this.table) this.table.offset = 0;
  }

  // ── Actions ──────────────────────────────────────────────────────
  confirmRequest(userID: string | undefined): void {
    if (!userID) return;
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    });

    swal.fire({
      title: 'Approve this request?',
      text: 'The user will be granted access to the system.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Approve!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.confirmUserRequest(userID).subscribe(() => {
          this.rows = this.rows.filter(u => u._id !== userID);
          this.temp = this.temp.filter(u => u._id !== userID);
          this.employeesCount = this.temp.length;
          swal.fire('Approved!', 'Sign-up request has been confirmed.', 'success');
        });
      }
    });
  }

  declineRequest(userID: string | undefined): void {
    if (!userID) return;
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false
    });

    swal.fire({
      title: 'Decline this request?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Decline!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.declineUserRequest(userID).subscribe(() => {
          this.rows = this.rows.filter(u => u._id !== userID);
          this.temp = this.temp.filter(u => u._id !== userID);
          this.employeesCount = this.temp.length;
          swal.fire('Declined!', 'Sign-up request has been removed.', 'success');
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swal.fire('Cancelled', 'The request is safe.', 'info');
      }
    });
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