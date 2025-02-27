import { Component } from '@angular/core';
import { TopbarComponent} from "../topbar/topbar.component";
import { UserSidebarComponent } from '../user-sidebar/user-sidebar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  imports: [TopbarComponent,
    UserSidebarComponent
  ]
})
export class DashboardComponent {}
