import { Component, HostListener, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent, SortType } from '@swimlane/ngx-datatable';
import { ResultsService } from 'src/app/core/service/results.service';
import { environment } from 'src/environments/environment.development';
import { QuizService } from 'src/app/core/service/quiz.service';
import { InternDocsComponent } from '../../interns-request/itern-docs/intern-docs.component';

@Component({
  selector: 'app-selected-intern',
  templateUrl: './selected-intern.component.html',
  styleUrls: ['./selected-intern.component.scss']
})
export class SelectedInternComponent {
  internResults: any[] = []
  internResults_temp: any[] = [];
  readonly picsUrl = environment.INTERN_IMAGE_URL;
  readonly cvUrl = environment.INTERN_CV_URL;
  loadingIndicator!: boolean;
  reorderable = true;
  SortType = SortType;
  scrollBarHorizontal = window.innerWidth < 1200;
  @ViewChild('table') table!: DatatableComponent;
  userRole!: string;

  // View & filter state
  viewMode: 'cards' | 'table' = 'cards';
  searchQuery: string = '';
  selectedDepartment: string = 'all';
  minScore: number = 0;

  constructor(
    private resultService: ResultsService,
    private modalService: NgbModal,
    private quizService: QuizService,
  ) { }

  ngOnInit(): void {
    this.getAllSelectedInterns();
    this.userRole = localStorage.getItem('roles')!;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table?.recalculate();
    this.table?.recalculateColumns();
  }
  openDocsModal(id: any): void {
    const modalRef: NgbModalRef = this.modalService.open(InternDocsComponent, {
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
      size: 'xl',
    });
    modalRef.componentInstance.payload = id;
    // modalRef.result.then(() => this.getInterns());
  }
  getAllSelectedInterns() {
    this.loadingIndicator = true;
    this.resultService.getAllSelectedInterns().subscribe(res => {
      let data = res.data.filter((item: any) => item.userId.archived === false);
      this.internResults_temp = data;
      this.internResults = [...data];
      this.loadingIndicator = false;
    });
  }

  openCV(file: string) {
    window.open(this.cvUrl + file, '_blank');
  }

  toggleViewMode(mode: 'cards' | 'table') {
    this.viewMode = mode;
  }

  updateFilter(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.applyFilters();
    if (this.table) this.table.offset = 0;
  }

  applyFilters() {
    let filtered = [...this.internResults_temp];

    if (this.searchQuery) {
      filtered = filtered.filter((d: any) =>
        d.userId.firstName.toLowerCase().includes(this.searchQuery) ||
        d.userId.lastName.toLowerCase().includes(this.searchQuery) ||
        d.userId.email.toLowerCase().includes(this.searchQuery) ||
        (d.userId.departement || '').toLowerCase().includes(this.searchQuery)
      );
    }

    if (this.selectedDepartment !== 'all') {
      filtered = filtered.filter((d: any) => d.userId.departement === this.selectedDepartment);
    }

    if (this.minScore > 0) {
      filtered = filtered.filter((d: any) => d.score >= this.minScore);
    }

    this.internResults = filtered;
    if (this.table) this.table.offset = 0;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedDepartment = 'all';
    this.minScore = 0;
    this.internResults = [...this.internResults_temp];
    if (this.table) this.table.offset = 0;
  }

  getUniqueDepartments(): string[] {
    if (!this.internResults_temp) return [];
    const depts = this.internResults_temp
      .map((i: any) => i.userId.departement)
      .filter((d: any) => d);
    return [...new Set(depts)] as string[];
  }

  getAverageScore(): number {
    if (!this.internResults_temp?.length) return 0;
    const sum = this.internResults_temp.reduce((acc: number, i: any) => acc + (i.score || 0), 0);
    return Math.round(sum / this.internResults_temp.length);
  }

  getTopScore(): number {
    if (!this.internResults_temp?.length) return 0;
    return Math.max(...this.internResults_temp.map((i: any) => i.score || 0));
  }
}