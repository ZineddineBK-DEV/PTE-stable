import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { User } from 'src/app/core/models/user';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { environment } from 'src/environments/environment';
import { AddExternalModalComponent } from './add-external-modal/add-external-modal.component';
import { PreviewDocsModalComponent } from './preview-docs-modal/preview-docs-modal.component';

@Component({
  selector: 'app-external-user',
  templateUrl: './external-user.component.html',
  styleUrls: ['./external-user.component.scss']
})
export class ExternalUserComponent implements OnInit {
  readonly picsUrl = environment.PICSURL;

  // Data
  all: any[] = [];
  rows: any[] = [];
  temp: any[] = [];
  loadingIndicator = false;
  reorderable = true;
  SortType = SortType;
  scrollBarHorizontal = window.innerWidth < 1200;
  employeesCount = 0;
  userRole = '';

  // View mode: 'table' | 'card'
  viewMode: 'table' | 'card' = 'table';

  // Card pagination
  cardPage = 0;
  cardPageSize = 8;

  // Filters
  departments: string[] = [];
  activeFilters: { key: string; label: string }[] = [];
  private filterMap: Record<string, string> = {};

  @ViewChild('table') table!: DatatableComponent;

  constructor(
    public userService: UserServiceService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('roles') ?? '';
    this.loadingIndicator = true;
    setTimeout(() => this.getUsers(), 500);
  }

  // ── Data Loading ────────────────────────────────────────────────
  getUsers(): void {
    this.userService.getExternals().subscribe((result: any) => {
      this.all = result as any[];
      console.log(this.all)
      // const filtered = all
      this.temp = this.all;
      this.rows = [...this.all];
      this.employeesCount = this.all.length;
      this.departments = [...new Set(this.all.map((u: any) => u.departement).filter(Boolean))];
      this.loadingIndicator = false;
    });
  }

  // ── Stats Helpers ────────────────────────────────────────────────
  // getActiveCount(): number {
  //   return this.temp.filter((u: any) => u.external === true).length;
  // }

  getWithDocsCount(): number {
    return this.temp.filter((u: any) => u.external_docs?.length > 0).length;
  }
  getWithoutDocsCount(): number {
    return this.temp.filter((u: any) => u.external_docs?.length === 0).length;
  }

  getDepartmentCount(): number {
    return new Set(this.temp.map((u: any) => u.departement).filter(Boolean)).size;
  }

  // ── Card Pagination ──────────────────────────────────────────────
  get pagedRows(): any[] {
    const start = this.cardPage * this.cardPageSize;
    return this.rows.slice(start, start + this.cardPageSize);
  }

  get totalCardPages(): number {
    return Math.ceil(this.rows.length / this.cardPageSize);
  }

  // ── Filtering ────────────────────────────────────────────────────
  updateFilter(event: any): void {
    const val = event.target.value.toLowerCase().trim();
    this.filterMap['search'] = val;
    if (val) {
      this.setActiveFilter('search', `Search: "${event.target.value}"`);
    } else {
      this.removeFilter('search');
    }
    this.applyFilters();
  }

  filterByDept(event: any): void {
    const val = event.target.value;
    this.filterMap['dept'] = val;
    if (val) {
      this.setActiveFilter('dept', `Dept: ${val}`);
    } else {
      this.removeFilter('dept');
    }
    this.applyFilters();
  }

  filterByDocs(event: any): void {
    const val = event.target.value;
    this.filterMap['docs'] = val;

    if (val === 'with') {
      this.setActiveFilter('docs', 'With Docs');
    } else if (val === 'without') {
      this.setActiveFilter('docs', 'Without Docs');
    } else {
      this.removeFilter('docs');
    }

    this.applyFilters();
  }

  private applyFilters(): void {
    const search = this.filterMap['search'] ?? '';
    const dept = this.filterMap['dept'] ?? '';
    const docs = this.filterMap['docs'] ?? '';

    this.rows = this.temp.filter((u: any) => {
      const matchSearch =
        !search ||
        u.firstName?.toLowerCase().includes(search) ||
        u.lastName?.toLowerCase().includes(search) ||
        u.email?.toLowerCase().includes(search) ||
        u.departement?.toLowerCase().includes(search);

      const matchDept = !dept || u.departement === dept;

      const matchDocs =
        docs === '' ||
        (docs === 'with' && u.external_docs?.length > 0) ||
        (docs === 'without' && (!u.external_docs || u.external_docs.length === 0));

      return matchSearch && matchDept && matchDocs;
    });

    this.cardPage = 0;
  }

  private setActiveFilter(key: string, label: string): void {
    const idx = this.activeFilters.findIndex(f => f.key === key);
    if (idx > -1) {
      this.activeFilters[idx].label = label;
    } else {
      this.activeFilters.push({ key, label });
    }
  }

  removeFilter(key: string): void {
    this.activeFilters = this.activeFilters.filter(f => f.key !== key);
    delete this.filterMap[key];
    this.applyFilters();
  }

  resetFilters(): void {
    this.filterMap = {};
    this.activeFilters = [];
    this.rows = [...this.temp];
    this.cardPage = 0;
  }

  // ── Modals ───────────────────────────────────────────────────────
  downloadCV(row: any): void {
    const modalRef: NgbModalRef = this.modalService.open(PreviewDocsModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = row;
  }

  addExternalModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(AddExternalModalComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.result.then(() => this.getUsers());
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