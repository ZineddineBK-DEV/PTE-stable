import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { environment } from 'src/environments/environment';
import * as html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-log-modal',
  templateUrl: './log-modal.component.html',
  styleUrls: ['./log-modal.component.scss']
})
export class LogModalComponent {
  @Input('payload') payload: any;
  logForm!: FormGroup;
  selectedUserOption!: any;
  selectedDateOption!: any;
  log!: any;
  sortedLog!: any;
  readonly picsUrl = environment.PICSURL;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  constructor(
    public activeModal: NgbActiveModal,
    private userService: UserServiceService
  ) {}

  ngOnInit() {
    this.payload = this.payload.filter(
      (tech: { departement: string }) =>
        tech.departement === "System" || 
        tech.departement === "Networking" || 
        tech.departement === "Cyber Security"
    );
    
    this.logForm = new FormGroup({
      tech: new FormControl(''),
      dateRangStart: new FormControl(''),
      dateRangEnd: new FormControl(''),
      day: new FormControl(''),
    });
  }

  download() {
    const element = this.pdfContent.nativeElement;
    const options = {
      margin: 10,
      filename: 'Tableau-mission.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf(element, options);
  }

  downloadExcel() {
    if (!this.sortedLog || this.sortedLog.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare the data with French column headers
    const excelData = this.sortedLog.map((log: any) => ({
      'MATRICULE': log.engineer.matricule,
      'EMAIL': log.engineer.email,
      'NOM ET PRENOM DU PERSONNEL': log.engineer.firstName.toUpperCase() + ' ' + log.engineer.lastName.toUpperCase(),
      'HEURE DE SORTIE': this.formatDateForExcel(log.start),
      'HEURE DE ARRIVEE': this.formatDateForExcel(log.end),
      'DESTINATION': log.title
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { 
      Sheets: { 'Mission Log': worksheet }, 
      SheetNames: ['Mission Log'] 
    };
    
    // Calculate column widths based on content
    const wscols = [
      { wch: 10 },  // MATRICULE
      { wch: 25 },  // EMAIL
      { wch: 30 },  // NOM ET PRENOM
      { wch: 20 },  // HEURE DE SORTIE
      { wch: 20 },  // HEURE DE ARRIVEE
      { wch: 30 }   // DESTINATION
    ];
    worksheet['!cols'] = wscols;

    const excelBuffer: any = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    });
    
    this.saveAsExcelFile(excelBuffer, 'Mission_Log');
  }

  private formatDateForExcel(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(data);
    a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    document.body.removeChild(a);
  }

  onSubmit(logForm: FormGroup) {
    let dd = new Date(logForm.value.day);
    dd.setDate(dd.getDate() + 1);

    let data = {
      userTypeSelected: this.selectedUserOption,
      dateTypeOption: this.selectedDateOption,
      tech: logForm.value.tech,
      dateRangStart: logForm.value.dateRangStart,
      dateRangEnd: logForm.value.dateRangEnd,
      day: logForm.value.day,
      day_1: dd
    };

    this.userService.getEventsLog(data).subscribe(res => {
      this.log = res;
      let sorted: any[] = [];
      
      for (let i = 0; i < this.log.length; i++) {
        sorted = sorted.concat(this.log[i]);
      }
      
      sorted.sort((a: { start: string | number | Date; }, b: { start: string | number | Date; }) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
      
      this.sortedLog = sorted;
    });
  }
}