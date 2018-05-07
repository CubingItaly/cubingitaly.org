import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../../services/teams.service';
import { CITeam } from '../../../../server/models/ci.team.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [TeamsService]
})
export class DashboardComponent implements OnInit {

  constructor(public teamsSvc: TeamsService) { }

  async ngOnInit() {
    console.log('about to try fetching teams.');
    const teamsList: CITeam[] = await this.teamsSvc.list();
    console.log('teams list is:');
    console.log(teamsList);
    alert('list teams length is: ' + teamsList.length);
  }

}
