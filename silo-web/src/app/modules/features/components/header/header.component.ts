import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { NotificationService } from '@sharedWeb/services/utils/notification.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  @Input() userDetails:any;
  userName!:string;
  userRole!:string;
  profilePhoto!: string;
  sideModalOpened:boolean = false;
  currentLink = 'Human Resources';
  systemAdminLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService, 
    private notifyService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.systemAdminLoggedIn = this.userDetails.email === 'superadmin@siloerp.io';
    if(this.userDetails.isSuperAdmin) {
      this.userName = this.userDetails.companyName;
      this.userRole = 'Super Admin';
      console.log('Logged In User', this.userDetails);
    }
    else if(this.systemAdminLoggedIn) {
      this.userName = this.userDetails.companyName;
      this.userRole = 'Silo Admin';
    }
    else {
      this.userName = this.userDetails.fullName;
      this.userRole = this.userDetails.companyRole;
      this.profilePhoto = this.userDetails.profilePic;
      console.log('profile photo', this.profilePhoto)
    }
  }

  //Logout function
  logout() {
    this.notifyService.confirmAction({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      confirmText: 'Logout',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.authService.logOut();
      }
    });
  }

  goToCalendar() {
    this.router.navigateByUrl('/app/hr/calendar');
  }

}
