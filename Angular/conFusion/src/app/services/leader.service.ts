import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
 
@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Leader[] {
    return LEADERS;
  }

  getDish(id: string): Leader {
    return LEADERS.filter((leader) => ( leader.id === id))[0];
  } 

  getFeatureLeader(): Leader {
    return LEADERS.filter((leader) => leader.featured)[0];
  }
}