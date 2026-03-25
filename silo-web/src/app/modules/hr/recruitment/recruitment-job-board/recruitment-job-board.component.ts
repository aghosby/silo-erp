import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HrService } from '@services/hr/hr.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';

@Component({
  selector: 'app-recruitment-job-board',
  templateUrl: './recruitment-job-board.component.html',
  styleUrl: './recruitment-job-board.component.scss'
})
export class RecruitmentJobBoardComponent implements OnInit {

  jobRoles!:any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private hrService: HrService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.getJobRoles();
  }

  getJobRoles() {
    this.hrService.getJobRoles().subscribe(res => this.jobRoles = res.data);
  }

  openJobInfoForm() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onSwitchChange(checked: boolean, jobInfo:any): void {
    console.log('New value:', checked);
  }

  viewRow(row: any) {
    //console.log('View', row);
    this.router.navigate([row._id], { relativeTo: this.route });
    //this.router.navigate(['/app/hr/employees', row._id]);
  }

  //Delete a job post
  deleteRow(row: any) {
    //console.log('Delete', row);
    this.notify.confirmAction({
      title: 'Remove Job Post',
      message: 'Are you sure you want to remove this job post?',
      confirmText: 'Remove Job Post',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.hrService.deleteJobPost(row._id).subscribe({
          next: res => {
            // console.log(res);
            if(res.status == 200) {
              this.notify.showInfo('This job post has been deleted successfully');
            }
            this.getJobRoles();
            //this.search$.next('');
          },
          error: err => {
            //console.log(err)
          } 
        })
      }
    });
  }
}
