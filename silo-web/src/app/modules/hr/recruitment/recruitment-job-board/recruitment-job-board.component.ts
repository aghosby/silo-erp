import { Component, OnInit } from '@angular/core';
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

  }
}
