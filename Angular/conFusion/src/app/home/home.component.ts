import { Component, OnInit, Inject } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { baseURL } from '../shared/baseurls';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;
  ip = baseURL;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe((dish) => this.dish = dish,
        errMess => this.dishErrMess = <any>errMess);
    this.promotionService.getFeaturedPromotion()
      .subscribe((promotion) => this.promotion = promotion,
        errMess => this.promotionErrMess = <any>errMess);
    this.leaderService.getFeatureLeader()
      .subscribe((leader) => this.leader = leader,
        errMess => this.leaderErrMess = <any>errMess);
  }
  dish: Dish;
  promotion: Promotion;
  leader: Leader;

}
