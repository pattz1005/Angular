import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { baseURL } from '../shared/baseurls';
import { flyInOut, expand, visibility } from '../animations/app.animation';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand(),
      visibility()
    ]
})
export class DishdetailComponent implements OnInit {

  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  ip = baseURL;
  dish: Dish;
  dishcopy: Dish;
  visibility = 'shown';

  feedbackForm: FormGroup;
  comment: Comment;


  formErrors = {
    'author': '',
    'comment': ''
  }

  validationMessages = {
    'author': {
      'required': 'author name is required',
      'minLength': 'author name must be at least 2 characters'
    },
    'comment': {
      'required': 'email is required',
    }
  }


  constructor(private dishService: DishService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location) {
    this.createForm();
  }

  

  ngOnInit(): void {

    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds,
        errmess => this.errMess = <any>errmess);

    this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', Validators.required]
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

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  onSubmit() {
    this.comment = this.feedbackForm.value;
    let a = Date.now();
    this.comment.date = a.toString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
    console.log(this.comment.date);
    this.dish.comments.push(this.comment);
    this.feedbackForm.reset(
      {
        author: '',
        rating: 5,
        comment: ''
      }
    );

  }

  goBack(): void {
    this.location.back();
  }

}
