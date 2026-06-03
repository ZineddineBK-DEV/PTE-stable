import { Component } from '@angular/core';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/service/auth.service';
import { LeaveServiceService } from 'src/app/core/service/leave-service.service';
import Swal from 'sweetalert2';
import { LeaveDocComponent } from '../leave-doc/leave-doc.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-leave-requests',
  templateUrl: './my-leave-requests.component.html',
  styleUrls: ['./my-leave-requests.component.scss'],
  providers: [ToastrService],
})
export class MyLeaveRequestsComponent {
  active: any = 1;
  active2 = 'top';
  active3!: number;
  active4: any;
  disabled = true;
  user: any;
  readonly leaveCertUrl = environment.LEAVE_CERT_URL;
  statusFilter: string = 'all';
  filteredLeaves: any[] = [];
  loadingIndicator: boolean = true;
  rows: any[] = [];

  allLeaves: any[] = [];
  teamLeaves: any[] = [];
  allWorkerLeaves: any[] = [];
  rowsToApprove: any[] = [];
  expanded: any = {};
  timeout: any;
  reorderable = true;
  temp: any[] = [];
  role: string = '';
  leaveType: any[] = [];

  private allLeavesMaster: any[] = [];
  private teamLeavesMaster: any[] = [];

  pageSize = 6;
  currentPageMy = 1;
  currentPageTeam = 1;
  currentPageAll = 1;

  // Timeline steps
  leaveSteps: string[] = ['Submitted', 'Supervisor Validation', 'Manager Validation'];

  constructor(
    private leaveService: LeaveServiceService,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((res) => {
      this.user = res;
    });

    this.role = localStorage.getItem('roles')!;
    if (this.role === 'ADMIN' || this.role === 'ASSISTANT') {
      this.getAllLeave();
    } else {
      this.getUserLeave();
    }
    this.getTeamRequests();
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) changeEvent.preventDefault();
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled) this.active3 = 1;
  }

  getTeamRequests() {
    this.leaveService.getWorkerRequests(localStorage.getItem('userId')!).subscribe((resultat) => {
      this.teamLeaves = [...resultat].reverse();
      this.teamLeavesMaster = [...this.teamLeaves];
      this.currentPageTeam = 1;
      setTimeout(() => (this.loadingIndicator = false), 500);
    });
  }

  getUserLeave() {
    this.leaveService.getUserLeave(localStorage.getItem('userId')!).subscribe((resultat) => {
      this.allLeaves = [...resultat].reverse();
      this.allLeavesMaster = [...this.allLeaves];
      this.currentPageMy = 1;
      setTimeout(() => (this.loadingIndicator = false), 500);
    });
  }

  getAllLeave() {
    this.leaveService.getAllLeaves().subscribe((resultat) => {
      this.allLeaves = [...resultat].reverse();
      this.allLeavesMaster = [...this.allLeaves];
      this.currentPageAll = 1;
      setTimeout(() => (this.loadingIndicator = false), 500);
    });
  }

  get myStart() { return (this.currentPageMy - 1) * this.pageSize; }
  get myEnd() { return this.currentPageMy * this.pageSize; }
  get teamStart() { return (this.currentPageTeam - 1) * this.pageSize; }
  get teamEnd() { return this.currentPageTeam * this.pageSize; }
  get allStart() { return (this.currentPageAll - 1) * this.pageSize; }
  get allEnd() { return this.currentPageAll * this.pageSize; }

  get pagedMyLeaves() { return this.allLeaves.slice(this.myStart, this.myEnd); }
  get pagedTeamLeaves() { return this.teamLeaves.slice(this.teamStart, this.teamEnd); }
  get pagedAllLeaves() { return this.allLeaves.slice(this.allStart, this.allEnd); }

  get totalMyPages() { return Math.max(1, Math.ceil(this.allLeaves.length / this.pageSize)); }
  get totalTeamPages() { return Math.max(1, Math.ceil(this.teamLeaves.length / this.pageSize)); }
  get totalAllPages() { return Math.max(1, Math.ceil(this.allLeaves.length / this.pageSize)); }

  goToPage(context: 'my' | 'team' | 'all', page: number) {
    if (context === 'my') this.currentPageMy = Math.min(this.totalMyPages, Math.max(1, page));
    if (context === 'team') this.currentPageTeam = Math.min(this.totalTeamPages, Math.max(1, page));
    if (context === 'all') this.currentPageAll = Math.min(this.totalAllPages, Math.max(1, page));
  }

  getPageNumbers(totalPages: number, currentPage: number): number[] {
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  // Timeline helpers
  private getCurrentStep(row: any): number {
    const status = (row?.status || '').toString().trim();
    if (status === 'Pending 0/2') return 2;
    if (status === 'Pending 1/2') return 3;
    if (status === 'Approved') return 3;
    if (status === 'Declined') return 3;
    return 1;
  }

  private isDeclined(row: any): boolean {
    return (row?.status || '').toString().trim() === 'Declined';
  }

  isStepDone(row: any, step: number): boolean {
    const status = (row?.status || '').toString().trim();
    const current = this.getCurrentStep(row);

    if (status === 'Approved') return step <= 3;
    if (status === 'Declined') return step < this.getCurrentStep(row);
    return step < current;
  }

  isStepCurrent(row: any, step: number): boolean {
    const status = (row?.status || '').toString().trim();
    if (status === 'Approved' || status === 'Declined') return false;
    return this.getCurrentStep(row) === step;
  }

  isStepDeclined(row: any, step: number): boolean {
    return this.isDeclined(row) && step === this.getCurrentStep(row);
  }

  isConnectorDone(row: any, step: number): boolean {
    const status = (row?.status || '').toString().trim();
    if (status === 'Approved') return true;
    if (status === 'Declined') return step < 2;
    return this.getCurrentStep(row) > step;
  }

  isConnectorDeclined(row: any, step: number): boolean {
    return this.isDeclined(row) && step === 2;
  }

  getStepTitle(row: any, step: number): string {
    if (step !== 3) return this.leaveSteps[step - 1];
    if ((row?.status || '').toString().trim() === 'Approved') return 'Manager Approved';
    if ((row?.status || '').toString().trim() === 'Declined') return 'Manager Declined';
    return this.leaveSteps[2];
  }

  workerApproveRequest(reqID: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, Approve it!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Confirmed!', 'Leave request has been confirmed.', 'success');
        this.leaveService.workerAccept(reqID).subscribe(() => this.getTeamRequests());
      }
    });
  }

  workerDeclineRequest(reqID: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Declined!', 'Leave request has been declined.', 'success');
        this.leaveService.workerDecline(reqID).subscribe(() => this.getTeamRequests());
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire('Cancelled', 'Leave request is safe :)', 'error');
      }
    });
  }

  managerApproveRequest(reqID: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, Approve it!',
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Confirmed!', 'Leave request has been confirmed.', 'success');
        this.leaveService.managerAccept(reqID).subscribe(() => this.getAllLeave());
      }
    });
  }

  managerDeclineRequest(reqID: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: { confirmButton: 'btn btn-success', cancelButton: 'btn btn-danger' },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire('Declined!', 'Leave request has been declined.', 'success');
        this.leaveService.managerDecline(reqID).subscribe(() => this.getAllLeave());
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire('Cancelled', 'Leave request is safe :)', 'error');
      }
    });
  }

  downloadDoc(row: any) {
    const modalRef = this.modalService.open(LeaveDocComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop',
    });
    modalRef.componentInstance.payload = row;
  }

  downloadCertif(row: any) {
    window.open(this.leaveCertUrl + row.certif);
  }

  handleMyLeaveSearch(event: any) {
    const search = (event.target.value || '').toLowerCase().trim();
    this.allLeaves = search
      ? this.allLeavesMaster.filter((leave) =>
          leave.fullName.toLowerCase().includes(search) ||
          leave.code.toLowerCase().includes(search) ||
          leave.type.toLowerCase().includes(search)
        )
      : [...this.allLeavesMaster];
    this.currentPageMy = 1;
  }

  handleTeamLeaveSearch(event: any) {
    const search = (event.target.value || '').toLowerCase().trim();
    this.teamLeaves = search
      ? this.teamLeavesMaster.filter((leave) =>
          leave.fullName.toLowerCase().includes(search) ||
          leave.code.toLowerCase().includes(search) ||
          leave.type.toLowerCase().includes(search)
        )
      : [...this.teamLeavesMaster];
    this.currentPageTeam = 1;
  }

  handleAllLeaveSearch(event: any) {
    const search = (event.target.value || '').toLowerCase().trim();
    this.allLeaves = search
      ? this.allLeavesMaster.filter((leave) =>
          leave.fullName.toLowerCase().includes(search) ||
          leave.code.toLowerCase().includes(search) ||
          leave.type.toLowerCase().includes(search)
        )
      : [...this.allLeavesMaster];
    this.currentPageAll = 1;
  }
}