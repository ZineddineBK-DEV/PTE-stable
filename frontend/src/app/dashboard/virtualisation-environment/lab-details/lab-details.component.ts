import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LabServiceService } from 'src/app/core/service/lab-service.service';
import Swal from 'sweetalert2';
import { RequestApprovalModalComponent } from '../request-approval-modal/request-approval-modal.component';

@Component({
  selector: 'app-lab-details',
  templateUrl: './lab-details.component.html',
  styleUrls: ['./lab-details.component.scss'],
  providers: [ToastrService],
})
export class LabDetailsComponent implements OnInit {
  @Input('payload_lab') payload_lab: any;

  userRole!: string;
  userId!: string;

  get isMentor(): boolean {
    return this.payload_lab?.offer?.encadrant === this.userId;
  }

  get isPending(): boolean {
    return this.payload_lab?.status === 'PENDING';
  }

  get mentorActionReady(): boolean {
    return (
      this.isMentor &&
      this.isPending &&
      !this.payload_lab?.isMentorAccepted &&
      !this.payload_lab?.isLabManagerAccepted
    );
  }

  get managerActionReady(): boolean {
    return (
      !this.isMentor &&
      this.isPending &&
      this.payload_lab?.isMentorAccepted &&
      !this.payload_lab?.isLabManagerAccepted
    );
  }

  get showActions(): boolean {
    return this.mentorActionReady || this.managerActionReady;
  }

  get statusLabel(): string {
    if (this.payload_lab?.status === 'APPROVED') return 'Approved';
    if (this.payload_lab?.status === 'DECLINED') return 'Declined';
    return 'Pending';
  }

  get statusClass(): string {
    if (this.payload_lab?.status === 'APPROVED') return 'lab-details__status--approved';
    if (this.payload_lab?.status === 'DECLINED') return 'lab-details__status--declined';
    return 'lab-details__status--pending';
  }

  get statusIcon(): string {
    if (this.payload_lab?.status === 'APPROVED') return 'fa-check-circle';
    if (this.payload_lab?.status === 'DECLINED') return 'fa-times-circle';
    return 'fa-hourglass-half';
  }

  constructor(
    private toastr: ToastrService,
    private labService: LabServiceService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')!;
    this.userRole = localStorage.getItem('roles')!;
  }

  acceptLab(labId: string, lab: any): void {
    if (this.userRole === 'LAB-MANAGER') {
      const modalRef: NgbModalRef = this.modalService.open(
        RequestApprovalModalComponent,
        {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
          keyboard: false,
          backdropClass: 'light-blue-backdrop',
        },
      );
      modalRef.componentInstance.payload_id = labId;
      modalRef.componentInstance.payload_lab = lab;
      this.activeModal.close('Close click');
      modalRef.result.then(() => {});
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, approve it!',
      confirmButtonColor: '#00C9A7',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Approved!',
          text: 'Lab has been approved.',
          icon: 'success',
          confirmButtonColor: '#47A992',
        });
        this.labService.approveLab(labId).subscribe((res) => {
          this.toastr.success(res.message, 'Success');
          this.activeModal.close('Close click');
        });
      }
    });
  }

  declineLab(labId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Yes, decline it!',
      confirmButtonColor: '#FF6B6B',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Declined!',
          text: 'Lab has been declined.',
          icon: 'success',
          confirmButtonColor: '#47A992',
        });
        this.labService.declineLab(labId).subscribe((res) => {
          this.toastr.success(res.message, 'Success');
          this.activeModal.close('Close click');
        });
      }
    });
  }
}