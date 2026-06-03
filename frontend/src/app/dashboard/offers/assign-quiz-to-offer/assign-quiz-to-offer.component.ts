import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/core/models/user';
import { QuizService } from 'src/app/core/service/quiz.service';
import { UserServiceService } from 'src/app/core/service/user-service.service';

@Component({
  selector: 'app-assign-quiz-to-offer',
  templateUrl: './assign-quiz-to-offer.component.html',
  styleUrls: ['./assign-quiz-to-offer.component.scss'],
  providers: [ToastrService]
})
export class AssignQuizToOfferComponent implements OnInit {

  @Input() offerId!: string;
  @Input() quiz!: any;
  @Input() action!: string;

  editQuestion!: boolean;

  quizForm!: FormGroup;
  questionForm!: FormGroup;

  questions: any[] = [];
  selectedQuestion!: any;

  userId!: string;
  user!: User;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private quizService: QuizService,
    private userService: UserServiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')!;
    this.getEncadrant();
    this.initQuizForm();
    this.initQuestionForm();
    this.setValues();
    this.getQuizQuestions();
  }

  /* ================= QUIZ ================= */

  initQuizForm() {
    this.quizForm = new FormGroup({
      title:       new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  setValues() {
    if (this.action === 'edit') {
      this.quizForm.patchValue({
        title:       this.quiz.title,
        description: this.quiz.description
      });
    }
  }

  onSubmitQuiz() {
    if (this.quizForm.invalid) return;

    const payloadQuiz = {
      title:       this.quizForm.value.title,
      description: this.quizForm.value.description,
      createdBy:   this.user._id,
      offer:       this.offerId
    };

    if (this.action === 'edit') {
      this.quizService.updateQuiz(this.quiz._id, payloadQuiz).subscribe(res =>
        res.data
          ? this.toastr.success('Quiz updated successfully')
          : this.toastr.error('Error while updating quiz')
      );

      if (this.questionForm.invalid || !this.selectedQuestion) return;

      const payloadQuest = {
        question: this.questionForm.value.question,
        responses: this.questionForm.value.responses.map((r: any) => ({
          _id:       r._id,
          text:      r.text,
          isCorrect: r.isCorrect ? 'true' : ''
        }))
      };

      this.quizService.updateQuestion(this.selectedQuestion._id, payloadQuest)
        .subscribe((res: any) =>
          res.data
            ? this.toastr.success('Question updated successfully')
            : this.toastr.error('Error while updating question')
        );

      this.activeModal.close('Quiz updated successfully');

    } else {
      this.quizService.createQuiz(payloadQuiz).subscribe(res =>
        res.data
          ? this.toastr.success('Quiz added successfully')
          : this.toastr.error('Failed to add quiz')
      );

      this.activeModal.close('Quiz updated successfully');
    }
  }

  /* ================= QUESTIONS ================= */

  initQuestionForm() {
    this.questionForm = this.fb.group({
      question:  ['', Validators.required],
      responses: this.fb.array([])
    });
  }

  get responses(): FormArray {
    return this.questionForm.get('responses') as FormArray;
  }

  createResponse(resp?: any): FormGroup {
    return this.fb.group({
      _id:       [resp?._id],
      text:      [resp?.text || '', Validators.required],
      isCorrect: [resp?.isCorrect === 'true']
    });
  }

  patchQuestion(question: any) {
    this.selectedQuestion = question;

    this.questionForm.patchValue({
      question: question.question
    });

    this.responses.clear();

    question.responses.forEach((r: any) => {
      this.responses.push(this.createResponse(r));
    });
  }

  onSubmitQuestion() {
    // intentionally empty — submission handled via onSubmitQuiz
  }

  editQuestionToggle() {
    this.editQuestion = !this.editQuestion;
  }

  getQuizQuestions() {
    this.quizService.getQuestionsByQuiz(this.quiz._id).subscribe(res => {
      this.questions = res.data;
      if (this.questions.length) {
        this.patchQuestion(this.questions[0]);
      }
    });
  }

  selectQuestionByIndex(event: Event) {
    const select = event.target as HTMLSelectElement;
    const index  = Number(select.value);
    this.patchQuestion(this.questions[index]);
  }

  /* ================= USER ================= */

  getEncadrant() {
    this.userService.getUserById(this.userId).subscribe(res => {
      this.user = res;
    });
  }
}