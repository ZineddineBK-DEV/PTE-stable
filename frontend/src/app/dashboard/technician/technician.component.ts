import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { TechEvent } from 'src/app/core/models/techEvent';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { EventInfoTechModalComponent } from './event-info-tech-modal/event-info-tech-modal.component';
import { TechPersonalDetailsModalComponent } from './tech-personal-details-modal/tech-personal-details-modal.component';
import { AddTechnicianEventModalComponent } from './add-technician-event-modal/add-technician-event-modal.component';
import { environment } from 'src/environments/environment';
import { LogModalComponent } from './log-modal/log-modal.component';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.scss'],
  providers: [ToastrService],
})
export class TechnicianComponent {
  @ViewChild('calendar', { static: false })
  readonly picsUrl = environment.PICSURL;

  dialogTitle!: string;
  isEditClick?: boolean;
  techEventForm!: UntypedFormGroup;
  techEvent!: TechEvent | null;
  eventWindow?: TemplateRef<any>;
  calendarData!: TechEvent;
  calendarEvents!: EventInput[];
  technicians!: User[];
  viewTechDetails = this.seeTechPersonalDetails.bind(this);
  showCalendar!: boolean;
  selectedTech!: User | null;
  Events: any[] = [];
  tempEvents: any[] = [];
  currentEvents: EventApi[] = [];
  userRole!: string;

  // Search filter for sidebar
  searchTech: string = '';

  get filteredTechnicians(): User[] {
    if (!this.technicians) return [];
    if (!this.searchTech) return this.technicians;
    const query = this.searchTech.toLowerCase();
    return this.technicians.filter(t =>
      t.firstName?.toLowerCase().includes(query) ||
      t.lastName?.toLowerCase().includes(query) ||
      t.title?.toLowerCase().includes(query)
    );
  }

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private techService: UserServiceService
  ) {
    this.dialogTitle = 'Add New Event';
  }

  public ngOnInit(): void {
    this.showCalendar = false;
    this.getTechnicians();
    this.userRole = localStorage.getItem('roles')!;
  }

  ToggleCalendar(tech: User) {
    if (!this.showCalendar) {
      this.showCalendar = true;
      this.selectedTech = tech;
      this.getEvent(this.selectedTech._id);
    } else {
      this.showCalendar = false;
      this.showCalendar = true;
      this.selectedTech = tech;
      this.getEvent(this.selectedTech._id);
    }
  }

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
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: []
  };

  getEvent(Tid: any) {
    this.techService.getTechEvents(Tid).subscribe(resultat => {
      this.Events = resultat as any;
      this.Events.forEach(event => {
        let techEvents = {
          id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
          engineer: this.selectedTech!._id,
          applicant: event.applicant,
          classNames: ['fc-event-primary']
        };
        this.tempEvents.push(techEvents);
      });
      this.calendarOptions.events = this.tempEvents;
      this.Events = this.tempEvents;
      this.tempEvents = [];
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  seeTechPersonalDetails(tech: User) {
    const modalRef: NgbModalRef = this.modalService.open(TechPersonalDetailsModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = tech;
  }

  eventClick(row: any) {
    const modalRef: NgbModalRef = this.modalService.open(EventInfoTechModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = row.event.id;
    modalRef.result.then((res) => {
      this.getEvent(this.selectedTech?._id);
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  handleDateSelect(info: DateSelectArg) {
    const modalRef = this.modalService.open(AddTechnicianEventModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.data = info.start;
    modalRef.componentInstance.tech = this.selectedTech;
    modalRef.result.then((res) => {
      this.getEvent(this.selectedTech?._id);
    });
  }

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  createCalendarForm(techEvent: TechEvent): UntypedFormGroup {
    return this.fb.group({
      title: [techEvent.title, [Validators.required]],
      start: [techEvent.start, [Validators.required]],
      end: [techEvent.end, [Validators.required]],
      engineer: [techEvent.engineer, [Validators.required]],
      job: [techEvent.job, [Validators.required]],
      address: [techEvent.address, [Validators.required]],
      applicant: [techEvent.applicant, [Validators.required]],
      isAccepted: true
    });
  }

  getTechnicians() {
    return this.techService.getEmployees().subscribe(resultat => {
      this.technicians = resultat as User[];
      if (this.userRole !== "ASSISTANT") {
        this.technicians = this.technicians.filter(row => row._id === localStorage.getItem('userId'));
      } else {
        this.technicians = this.technicians.filter(row => row._id !== localStorage.getItem('userId'));
      }
    });
  }

  openLogModal() {
    const modalRef = this.modalService.open(LogModalComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      keyboard: false,
      backdropClass: 'light-blue-backdrop'
    });
    modalRef.componentInstance.payload = this.technicians;
  }

  showNotification(eventType: string, message: string, ypos: string, xpos: string) {
    if (eventType === 'success') {
      this.toastr.success(message, '', {
        positionClass: 'toast-' + ypos + '-' + xpos,
      });
    }
  }
}