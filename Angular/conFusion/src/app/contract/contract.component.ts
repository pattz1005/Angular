import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { flyInOut, expand, visibility } from '../animations/app.animation';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  animations: [
    flyInOut(),
    expand(),
    visibility()
  ]
})
export class ContractComponent implements OnInit {

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbacks: Feedback[];
  contactType = ContactType;
  isSubmit: boolean;
  errMess: string;
  @ViewChild('fform') feedbackFormDirective;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  }

  validationMessages = {
    'firstname': {
      'required': 'first name is required',
      'minLength': 'first name must be at least 2 characters',
      'maxLength': 'first name cannot be more than 25 characters'
    },
    'lastname': {
      'required': 'last name is required',
      'minLength': 'last name must be at least 2 characters',
      'maxLength': 'last name cannot be more than 25 characters'
    },
    'telnum': {
      'required': 'telephone number is required',
      'pattern': 'telephone number must contain only number'
    },
    'email': {
      'required': 'email is required',
      'email': 'email not in valid format'
    }
  }

  constructor(private fb: FormBuilder,
    private feedbackService: FeedbackService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.isSubmit = false;
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      telnum: [0, [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email]],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    this.feedbackService.postFeedback(this.feedback)
      .subscribe(feedback => {
        this.feedback = feedback;
      },
        errmess => { this.feedback = null; this.errMess = <any>errmess; });
    this.isSubmit = true;
    this.feedbackService.getFeedbacks().subscribe(
      feedbacks => this.feedbacks = feedbacks,
      errmess => this.errMess = <any>errmess);
      setTimeout(() => {
        this.isSubmit = false
      }, 5000);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

}
