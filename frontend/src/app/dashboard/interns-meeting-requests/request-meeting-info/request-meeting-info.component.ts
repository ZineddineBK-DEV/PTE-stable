import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { InternsService } from 'src/app/core/service/interns.service';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-request-meeting-info',
  templateUrl: './request-meeting-info.component.html',
  styleUrls: ['./request-meeting-info.component.scss'],
  providers : [ToastrService]
})
export class RequestMeetingInfoComponent {
@Input('payload') payload!:string
@Input('payload') payloadSide!:string
  loading!:boolean
  event!:any
  currentUserId!:string
  mentor!:any
  imagesURL = environment.PICSURL
  internImagesURL = environment.INTERN_IMAGE_URL
  start: string | null = null;
  end: string | null = null;
  constructor(
    public activeModal: NgbActiveModal,
    public userService:UserServiceService,
    public internService:InternsService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    ) {}
  ngOnInit(): void {
    this.currentUserId=localStorage.getItem('userId')!
    this.getEvent()
  }
  getEvent(){
   return this.internService.getMeetingRequestById(this.payload||this.payloadSide).subscribe((resultat:any) => {
      this.event = resultat.data as any
      this.userService.getUserById(this.event.mentor).subscribe((res:any)=>{
        this.mentor = res
      })
    })

}
acceptMeeting() {
  // Validate start & end before sending anything
  if (!this.start || !this.end) {
    Swal.fire({
      icon: 'error',
      title: 'Missing Information',
      text: 'Please select both start and end date.',
    });
    return;
  }

  // Validate end > start
  if (new Date(this.end) <= new Date(this.start)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Date',
      text: 'End date must be later than start date.',
    });
    return;
  }

  const obj = {
    _id: this.event._id,
    start: this.start,
    end: this.end,
    title: this.event.title,
    note: this.event.note,
    internEmail: this.event.intern.email,
    internName: this.event.intern.firstName + " " + this.event.intern.lastName,
    mentor: this.mentor._id,
    mentorEmail: this.mentor.email,
    mentorName: this.mentor.firstName + " " + this.mentor.lastName
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: 'Are you sure?',
    text: "You are about to approve this meeting request.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve it!',
    cancelButtonText: 'Cancel',
    reverseButtons: false
  }).then((result) => {

    if (result.isConfirmed) {
      this.loading = true; // START LOADING
      this.internService.acceptMeetingRequest(obj).subscribe({
        next: (resultat) => {
          this.loading = false; // STOP LOADING
          if (resultat.error) {
            swalWithBootstrapButtons.fire(
              'Ooops!',
              resultat.message,
              'error'
            );
          } else {
            swalWithBootstrapButtons.fire(
              'Confirmed!',
              resultat.message,
              'success'
            );
            this.activeModal.close('Meeting request has been confirmed');
          }
        },
        error: () => {
          this.loading = false; // STOP LOADING
          swalWithBootstrapButtons.fire(
            'Error!',
            'Dates already reserved.',
            'error'
          );
        }
      });
    }
  });
}


}
