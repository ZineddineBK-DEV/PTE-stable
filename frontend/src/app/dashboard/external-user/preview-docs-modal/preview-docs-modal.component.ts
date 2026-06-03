import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-preview-docs-modal',
  templateUrl: './preview-docs-modal.component.html',
  styleUrls: ['./preview-docs-modal.component.scss']
})
export class PreviewDocsModalComponent {
  @Input() payload: any;

  constructor(
    public activeModal: NgbActiveModal,
    public userService: UserServiceService
  ) {}

  downloadFile(doc: any) {
    this.userService.downloadfile(doc).subscribe(
      (response: any) => {
        const blob: any = new Blob([response], { type: 'file' });
        saveAs(blob, doc);
      },
      (error: any) => console.error('Download error', error)
    );
  }
}