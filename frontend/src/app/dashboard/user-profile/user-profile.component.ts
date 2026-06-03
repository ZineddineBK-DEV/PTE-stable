import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map, of } from 'rxjs';
import { UserServiceService } from 'src/app/core/service/user-service.service';
import { CvServiceService } from 'src/app/core/service/cv-service.service';
import { DownloadCVComponent } from '../profile/download-cv/download-cv.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  readonly picsUrl = environment.PICSURL;

  active: number = 1;
  user!: any;
  CV!: any;
  lisence!: string;
  personalData!: FormGroup;
  securityForm!: FormGroup;
  files: File[] = [];
  image!: any;
  isEduVisible!: boolean;
  isExpVisible!: boolean;
  isCertVisible!: boolean;
  isProjVisible!: boolean;
  isSkillVisible!: boolean;
  isLanguageVisible!: boolean;

  experiences: any;
  educations: any;
  certifications: any;
  skills: any;
  languages: any;
  projets: any;
  readonly certFileUrl = environment.CERT_URL;

  fs = ['Single', 'Maried', 'Divorced'];

  constructor(
    private userService: UserServiceService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private cvService: CvServiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.cvService.getUserCV(id!).subscribe(resultat => {
      this.CV = resultat as any;
    });

    this.userService.getUserById(id!).subscribe(resultat => {
      this.user = resultat as any;

      if (this.user.drivingLisence == true) {
        this.lisence = 'YES';
      } else {
        this.lisence = 'NO';
      }

      this.cvService.getEducation(this.user.cv._id).subscribe(result => {
        this.educations = result;
      });

      this.cvService.getExperience(this.user.cv._id).subscribe(result => {
        this.experiences = result;
      });

      this.cvService.getCertification(this.user.cv._id).subscribe(result => {
        this.certifications = result;
      });

      this.cvService.getSkill(this.user.cv._id).subscribe(result => {
        this.skills = result;
      });

      this.cvService.getProject(this.user.cv._id).subscribe(result => {
        this.projets = result;
      });

      this.cvService.getLanguage(this.user.cv._id).subscribe(result => {
        this.languages = result;
      });
    });
  }

  matchValues(matchTo: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const input = control.value;
      const isValid = control.root.value[matchTo] === input;
      return of(isValid ? null : { matchValues: true }).pipe(
        map((result) => result)
      );
    };
  }

  openDownloadModal(projets: any, certifications: any, experiences: any, educations: any, skills: any, cv: any) {
    const modalRef: NgbModalRef = this.modalService.open(DownloadCVComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      keyboard: false,
    });
    modalRef.componentInstance.payload = {
      cv,
      projets,
      languages: this.languages,
      certifications,
      experiences,
      educations,
      skills,
      user: this.user
    };
  }

  openCertiFile(cert: any) {
    window.open(this.certFileUrl + cert.cert_file);
  }
}