import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader'
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurls';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {

  ip = baseURL;
  errMess: string;
  leaders : Leader[];
  constructor(private leaderService: LeaderService) { }

  ngOnInit(): void {
    this.leaderService.getLeaders()
    .subscribe((leaders) => this.leaders = leaders,
    errmess => this.errMess = <any>errmess);
  }

}
