import { Component, OnInit } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private dishService : DishService,
    private promotionService : PromotionService,
    private leaderService : LeaderService) { }

  ngOnInit(): void {
    this.dish = this.dishService.getFeatureDish();
    this.promotion = this.promotionService.getFeaturedPromotion();
    this.leader = this.leaderService.getFeatureLeader();
  }
    dish : Dish;
  promotion : Promotion;
  leader : Leader;
  
}
