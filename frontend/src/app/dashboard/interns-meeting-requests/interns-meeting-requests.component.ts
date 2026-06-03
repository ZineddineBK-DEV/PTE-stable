import { Component, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { InternsService } from 'src/app/core/service/interns.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { RequestMeetingInfoComponent } from './request-meeting-info/request-meeting-info.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-interns-meeting-requests',
  templateUrl: './interns-meeting-requests.component.html',
  styleUrls: ['./interns-meeting-requests.component.scss']
})
export class InternsMeetingRequestsComponent {
 internImagesURL = environment.INTERN_IMAGE_URL
 @ViewChild('calendar', { static: false })
  showCalendar!: boolean;
  currentEvents: EventApi[] = [];
  Events: any[]=[];
  requests: any[]=[];
  tempEvents: any[]=[];
  constructor(private internService : InternsService,  private modalService:NgbModal,
){}
  ngOnInit(): void {
    // this.getMentorRequests()
    this.getEvent(localStorage.getItem('userId')!)
  }
  // getMentorRequests(){
  //   this.internService.getRequestByMentor(localStorage.getItem('userId')!).subscribe((res:any)=>{
  //   })
  // }
   calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    initialView: "dayGridMonth",
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events:[]
  };
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  getEvent(mentorId:any){ 
     this.internService.getRequestByMentor(localStorage.getItem('userId')!).subscribe(resultat => {
            this.Events = resultat.data as any
            this.requests = resultat.data as any
            this.requests = this.requests.filter(req => req.status === false)
            console.log(this.requests)
            this.Events.forEach(event => {
              let internEvents
              if (event.status){
                internEvents = {
                id: event._id,
                title: event.title,
                start: event.start,
                end: event.end,
                intern: event.intern,
                mentor : event.mentor,
                classNames: ['fc-event-success']
              }
              this.tempEvents.push(internEvents);
              }else{
                internEvents = {
                id: event._id,
                title: event.title,
                start: event.start,
                end: event.end,
                intern: event.intern,
                mentor : event.mentor,
                classNames: ['fc-event-danger']
              }
              this.tempEvents.push(internEvents);
              }
               
            })
            this.calendarOptions.events=this.tempEvents
            this.Events=this.tempEvents
            this.tempEvents=[]
           
          })
  }
  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }
  eventClick(row:any) {
    const modalRef: NgbModalRef = this.modalService.open(RequestMeetingInfoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false ,
      backdropClass:'light-blue-backdrop'
    });
    modalRef.componentInstance.payload=row.event.id;
    modalRef.result.then((res)=>{
      this.getEvent(localStorage.getItem('userId'))
    })               
  }
  
  openDetails(id:any) {
    const modalRef: NgbModalRef = this.modalService.open(RequestMeetingInfoComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false ,
      backdropClass:'light-blue-backdrop'
    });
    modalRef.componentInstance.payload=id;
    modalRef.result.then((res)=>{
      this.getEvent(localStorage.getItem('userId'))
    })               
  }

  
}
