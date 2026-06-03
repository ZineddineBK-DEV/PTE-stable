import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdDocsService } from 'src/app/core/service/ad-docs.service';
import { InternsService } from 'src/app/core/service/interns.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-intern-docs',
  templateUrl: './intern-docs.component.html',
  styleUrls: ['./intern-docs.component.scss'],
      providers: [ToastrService],

})
export class InternDocsComponent {

  @Input('payload') payload!:any
  
readonly requestUrl = environment.REQUEST_FILES_URL;
  readonly conventionUrl = environment.CONVENTION_FILES_URL;
  readonly cinUrl = environment.CIN_FILES_URL;
  readonly letterUrl = environment.LETTER_FILES_URL;
  readonly presenceUrl = environment.PRESENCE_FILES_URL;
  readonly reportUrl = environment.REPORT_FILES_URL;
  readonly attestationUrl = environment.INTERN_CERTFICATE_FILES_URL;
    readonly cvFileUrl = environment.INTERN_CV_URL;

  userSelectedId! : string
  userDoc!: any
  certifFiles:File[] = [];

  constructor(    
      public activeModal: NgbActiveModal,
      private toastr: ToastrService,
          private docService: AdDocsService
      
    ) {}
        ngOnInit(){
          console.log(this.payload)
          this.userSelectedId = this.payload
              this.getUserDocs()

        }
        getUserDocs(){
    this.docService.getUserDocs(this.userSelectedId).subscribe(res=>{
      this.userDoc = res.data
    })
  }
  downloadCv(file: string){
    window.open(this.cvFileUrl + file, '_blank')
  }
  deleteCertif(id:string){
    this.docService.deleteCertif(id).subscribe(res=>{
      this.toastr.success('Document deleted successfully',"Success")
      this.getUserDocs()
      })
  }
  uploadCertif(){
    const data = new FormData()
    data.append("attestation", this.certifFiles[0])
    data.append("user", this.userDoc[0].user._id);
    this.docService.addCertif(data).subscribe(res=>{
      this.certifFiles = [];  
      this.toastr.success('Document uploaded successfully',"Success")
      this.getUserDocs()
    })
  }
  onSelectCertifFiles(event:any) {
    this.certifFiles.push(...event.addedFiles);
  }
  onRemoveCertifFiles(event:any) {
    this.certifFiles.splice(this.certifFiles.indexOf(event), 1);
  }
}
