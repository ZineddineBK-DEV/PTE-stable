import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LabServiceService } from 'src/app/core/service/lab-service.service';
import Swal from 'sweetalert2';
import { RequestApprovalModalComponent } from '../request-approval-modal/request-approval-modal.component';
import { LabDetailsComponent } from '../lab-details/lab-details.component';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.scss'],
  providers: [ToastrService],
})
export class MyRequestsComponent {

  // ── Tab state ────────────────────────────────────────────────────────
  activee: number = 1;

  // ── Data ─────────────────────────────────────────────────────────────
  rows: any[] = [];
  filteredRows: any[] = [];
  loadingIndicator = true;
  role: string = '';
  searchTerm: string = '';

  // ── Pagination ───────────────────────────────────────────────────────
  currentPage: number = 1;
  pageSize: number = 10;

  // ── Intern / Offer data ──────────────────────────────────────────────
  intern_labs: any[] = [];
  offer_labs: any[] = [];
  mentorOffers: any[] = [];
  AllMentorOffers: any[] = [];
  offerSelected: boolean = false;
  offerEmpty: boolean = false;

  readonly picsUrl = environment.INTERN_IMAGE_URL;

  // ── Scrollbar tracking for TAB 2 & 3 ─────────────────────────────────
  scrollBarHorizontal = window.innerWidth < 1200;

  constructor(
    private userService: UserServiceService,
    private labService: LabServiceService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('roles')!.toString();

    if (this.role !== 'LAB-MANAGER') {
      this.getUserLabRequest();
      this.getMentorOffers();
    } else {
      this.getAllLabRequest();
      this.getAllMentorOffers();
      this.getMentorOffers();
    }
  }

  // ── Pagination helpers ───────────────────────────────────────────────

  get totalPages(): number {
    return Math.ceil(this.filteredRows.length / this.pageSize) || 1;
  }

  get pageStart(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get pageEnd(): number {
    return this.currentPage * this.pageSize;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    const curr = this.currentPage;

    let start = Math.max(1, curr - 2);
    let end = Math.min(total, curr + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(total, start + 4);
      } else {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  // ── Toggle row expansion ─────────────────────────────────────────────

  toggleRow(row: any): void {
    row._expanded = !row._expanded;
  }

  // ── Offer / Request selection ────────────────────────────────────────

  selectOffer(offer: any): void {
    this.offerSelected = true;
    this.labService.getLabsByOffer(offer._id).subscribe((res: any) => {
      this.offer_labs = res.data;
      this.offerEmpty = this.offer_labs.length === 0;
    });
  }

  goToOffer(offer: any): void {
    this.offerSelected = true;
    this.labService.getLabsByOffer(offer._id).subscribe((res: any) => {
      this.offer_labs = res.data;
      this.offerEmpty = this.offer_labs.length === 0;
    });
  }

  selectRequest(req: any): void {
    const modalRef: NgbModalRef = this.modalService.open(LabDetailsComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
    });
    modalRef.componentInstance.payload_lab = req;
    modalRef.result.then(() => {
      this.labService.getLabsByOffer(req.offer._id).subscribe((res: any) => {
        this.offer_labs = res.data;
      });
    });
  }

  // ── Data fetching ────────────────────────────────────────────────────

  getInternLabs(): void {
    this.labService.getInternsLabsRequests(localStorage.getItem('userId')!).subscribe((res: any) => {
      this.intern_labs = res.data;
    });
  }

  getMentorOffers(): void {
    this.labService.getMentorOffers(localStorage.getItem('userId')!).subscribe((res: any) => {
      this.mentorOffers = res.data;
      this.mentorOffers = this.mentorOffers.filter(offer => offer.archived === false)
      this.mentorOffers.forEach((offer: any) => {
        this.labService.getLabsByOffer(offer._id).subscribe((r: any) => {
          offer.labCount = r.data.length;
        });
      });
    });
  }

  getAllMentorOffers(): void {
    this.labService.getAllMentorOffers().subscribe((res: any) => {
      this.AllMentorOffers = res.data;
      this.AllMentorOffers = this.AllMentorOffers.filter(offer => offer.archived === false)
      this.AllMentorOffers.forEach((offer: any) => {
        this.labService.getLabsByOffer(offer._id).subscribe((r: any) => {
          offer.labCount = r.data.length;
        });
      });
    });
  }

  getUserLabRequest(): void {
    this.labService.userLabRequests(localStorage.getItem('userId')!).subscribe((res: any) => {
      this.rows = res;
      this.rows.reverse();
      this.rows.forEach((r: any) => r._expanded = false);
      this.applyFilter();
      setTimeout(() => { this.loadingIndicator = false; }, 500);
    });
  }

  getAllLabRequest(): void {
    this.labService.getAllLabsRequests().subscribe((res: any) => {
      this.rows = res;
      this.rows.reverse();
      this.rows.forEach((r: any) => r._expanded = false);
      this.applyFilter();
      setTimeout(() => { this.loadingIndicator = false; }, 500);
    });
  }

  // ── Modal actions ────────────────────────────────────────────────────

  approveRequestModal(id: any, lab: any): void {
    const modalRef: NgbModalRef = this.modalService.open(RequestApprovalModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
    });
    modalRef.componentInstance.payload_id = id;
    modalRef.componentInstance.payload_lab = lab;
    modalRef.result.then(() => { this.getAllLabRequest(); });
  }

  declineRequest(id: string): void {
    const swal = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result: any) => {
      if (result.isConfirmed) {
        swal.fire('Deleted!', 'Lab environment request has been deleted.', 'success');
        this.labService.declineLabRequest(id).subscribe(() => { this.getAllLabRequest(); });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swal.fire('Cancelled', 'Lab environment request is safe :)', 'error');
      }
    });
  }

  // ── Search & filter ─────────────────────────────────────────────────

  handleLabSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.currentPage = 1;
    this.applyFilter();
  }

  private applyFilter(): void {
    const term = this.searchTerm?.toLowerCase().trim() || '';
    if (!term) {
      this.filteredRows = [...this.rows];
    } else {
      this.filteredRows = this.rows.filter((lab: any) =>
        (lab.firstName || '').toLowerCase().includes(term) ||
        (lab.lastName || '').toLowerCase().includes(term) ||
        (lab.code || '').toLowerCase().includes(term) ||
        (lab.status || '').toLowerCase().includes(term),
      );
    }
  }

  // ── Resize ───────────────────────────────────────────────────────────

  @HostListener('window:resize', ['$event'])
  onResize(_event: any): void {
    this.scrollBarHorizontal = window.innerWidth < 1200;
  }
}
