import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxPrintModule } from 'ngx-print';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { ProfileComponent } from '../../profile/profile.component';
import { EducationFormComponent } from '../../profile/education-form/education-form.component';
import { ExperienceFormComponent } from '../../profile/experience-form/experience-form.component';
import { CertificationFormComponent } from '../../profile/certification-form/certification-form.component';
import { ProjectFormComponent } from '../../profile/project-form/project-form.component';
import { SkillsFormComponent } from '../../profile/skills-form/skills-form.component';
import { LanguageModalComponent } from '../../profile/language-modal/language-modal.component';
import { EditEducationFormComponent } from '../../profile/edit-education-form/edit-education-form.component';
import { EditExperienceFormComponent } from '../../profile/edit-experience-form/edit-experience-form.component';
import { EditCertificationFormComponent } from '../../profile/edit-certification-form/edit-certification-form.component';
import { EditProjectFormComponent } from '../../profile/edit-project-form/edit-project-form.component';
import { EditSkillsFormComponent } from '../../profile/edit-skills-form/edit-skills-form.component';
import { EditSummaryFormComponent } from '../../profile/edit-summary-form/edit-summary-form.component';
import { EditLanguageModalComponent } from '../../profile/edit-language-modal/edit-language-modal.component';

import { ProfileSharedModule } from '../shared/profile-shared.module';

const routes: Routes = [{ path: '', component: ProfileComponent }];

@NgModule({
  declarations: [
    ProfileComponent,
    EducationFormComponent, ExperienceFormComponent, CertificationFormComponent,
    ProjectFormComponent, SkillsFormComponent, LanguageModalComponent,
    EditEducationFormComponent, EditExperienceFormComponent,
    EditCertificationFormComponent, EditProjectFormComponent,
    EditSkillsFormComponent, EditSummaryFormComponent, EditLanguageModalComponent,
  ],
  imports: [
    CommonModule, NgbModule, NgbProgressbarModule,
    FormsModule, ReactiveFormsModule, RouterModule.forChild(routes),
    ToastrModule.forChild(), NgxDropzoneModule, NgxPrintModule, NgxMaskDirective,
    ProfileSharedModule,
  ],
  providers: [provideNgxMask()],
  exports: [RouterModule],
})
export class ProfileModule {}
