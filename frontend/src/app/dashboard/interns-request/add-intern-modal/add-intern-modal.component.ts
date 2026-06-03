import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdDocsService } from 'src/app/core/service/ad-docs.service';
import { InternsService } from 'src/app/core/service/interns.service';

@Component({
  selector: 'app-add-intern-modal',
  templateUrl: './add-intern-modal.component.html',
  styleUrls: ['./add-intern-modal.component.scss'],
  providers: [ToastrService],
})
export class AddInternModalComponent {

  @Input() payload!: { action: 'add' | 'edit', data?: string };
  @ViewChild('customUniversityInput') customUniversityInput!: ElementRef;

  internForm!: FormGroup;
  intern!: any;

  isCustomUniversity = false;
  files: File[] = [];
  loading = false;
  resumeFile!: string;

  departments = ['Cyber Security', 'Development', 'System', 'Networking'];
  universities = ['ESPRIT', 'ISTIC', 'TEK-UP', 'ENIT', 'INSAT', 'IHEC', 'ISAMM', 'other'];
  diplomas = ['License', 'Master', 'Engineering', 'PhD'];

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private internService: InternsService,
    private docService: AdDocsService
  ) {}

  ngOnInit(): void {
    this.initForm();

    if (this.payload.action === 'edit' && this.payload.data) {
      this.loadIntern();
    }
  }

  /* ---------------- FORM ---------------- */

  initForm(): void {
    this.internForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      departement: new FormControl('', Validators.required),
      university: new FormControl('', Validators.required),
      customUniversity: new FormControl(''),
      diploma: new FormControl('', Validators.required),
    });
  }

  /* ---------------- LOAD INTERN (EDIT) ---------------- */

  loadIntern(): void {
    this.internService.getInternById(this.payload.data!).subscribe({
      next: (res) => {
        this.intern = res;

        const isCustom = !this.universities.includes(res.university);
        this.isCustomUniversity = isCustom;

        this.internForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          phone: res.phone,
          email: res.email,
          departement: res.departement,
          university: isCustom ? 'other' : res.university,
          customUniversity: isCustom ? res.university : '',
          diploma: res.diploma,
        });
      },
      error: () => {
        this.toastr.error('Failed to load intern data');
      }
    });
  }

  /* ---------------- UNIVERSITY ---------------- */

  onUniversityChange(event: any): void {
    const value = event.target.value;
    this.isCustomUniversity = value === 'other';

    if (this.isCustomUniversity) {
      setTimeout(() => this.customUniversityInput?.nativeElement.focus(), 50);
    } else {
      this.internForm.patchValue({ customUniversity: '' });
    }
  }

  /* ---------------- FILE UPLOAD ---------------- */

  onSelect(event: any): void {
    this.files = [...event.addedFiles];
    this.resumeFile = this.files[0]?.name;
  }

  onRemove(event: any): void {
    this.files.splice(this.files.indexOf(event), 1);
  }

  /* ---------------- SUBMIT ---------------- */

  onSubmit(): void {
    if (this.internForm.invalid || this.loading) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.loading = true;

    let payload = { ...this.internForm.value };

    if (payload.university === 'other') {
      payload.university = payload.customUniversity;
    }

    delete payload.customUniversity;

    const request$ =
      this.payload.action === 'edit'
        ? this.internService.editIntern(payload, this.payload.data)
        : this.internService.addIntern(payload);

    request$.subscribe({
      next: (res:any) => {
        this.loading = false;

        if (this.payload.action === 'add' && this.files.length) {
          const formData = new FormData();
          formData.append('cv_file', this.files[0]);
          formData.append('user', res.user._id);

          this.docService.addResmue(formData).subscribe();
        }

        this.toastr.success(
          this.payload.action === 'add'
            ? 'Intern created successfully'
            : 'Intern updated successfully'
        );

        this.activeModal.close('success');
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Operation failed');
      }
    });
  }
}
