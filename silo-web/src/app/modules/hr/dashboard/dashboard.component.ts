import { Component, OnInit, ViewChild } from '@angular/core';
import { authPageStagger } from '@animations/auth-page-animations';
import { HrService } from '@services/hr/hr.service';
import { AuthService } from '@sharedWeb/services/utils/auth.service';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { UtilityService } from '@services/utils/utility.service';
import { NotificationService } from '@services/utils/notification.service';
import { Regions } from '@sharedWeb/constants/regions';
import { forkJoin, map, of, tap } from 'rxjs';
import { LeaveRequestInfoComponent } from '@hr/leave-management/leave-request-info/leave-request-info.component';
import { ModalService } from '@services/utils/modal.service';
import { ExpenseRequestsInfoComponent } from '@hr/expense-management/expense-requests-info/expense-requests-info.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [authPageStagger]
})
export class DashboardComponent implements OnInit {
  loggedInUser:any;
  dashboardData:any;
  dateTime!: Date;
  dayStatus: string = '';
  graphDetails!:any;
  graphValues!:any;
  currency:any;

  announcements!: any[];

  expenseAnalysisColorScheme = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(235, 87, 87, 0.7)']
  };
  expenseAnalysisData:any = [];

  payrollYear!: number;
  payrollYearOptions:any = {
    2024: '2024',
    2025: '2025',
    2026: '2026'  
  };

  keepOrder = () => 0;

  cardTriggerVal:string = 'birthdays';
  employeeList: any[] = [];
  employeeCount!: number;

  approvalRequests!:any[];
  birthdays!:any[];
  workAnniversaries!:any[];

  leaveTypes: any[] = [];
  expenseTypes: any[] = [];

  checkedIn: boolean = false;
  userLocation: any;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;

  mapZoom = 14;
  mapCenter!: google.maps.LatLng;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 4,
  };

  markerInfoContent = '';
  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  totalLeaveDays!:number;
  leaveDaysUsed!:number;
  leaveChartTotalView: boolean = false;

  chartColorScheme = {
    domain: ['rgba(235, 87, 87, 0.7)', 'rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(255, 150, 85, 0.7)']
  };
  chartData:any = [];
  totalChartData:any = [];
  chartYear: string = new Date().getFullYear().toString();

  constructor(
    private authService: AuthService,
    private hrService: HrService,
    private utilityService: UtilityService,
    private notifyService: NotificationService,
    private modalService: ModalService,
  ) {
    setInterval(() => {
      this.dateTime = new Date();
      this.updateDayStatus();
    }, 1000)
  }

  ngOnInit(): void {
    console.log()
    this.loggedInUser = this.authService.loggedInUser;
    this.currency = this.utilityService.currency;
    console.log(this.currency)
    this.payrollYearOptions = this.utilityService.generateYearOptions(Number(this.chartYear));
    this.getPayrollGraph(Number(this.chartYear))
    this.getPageData();
  }

  getPageData() {
    this.getDahboardStats();
    this.getNotices();
    this.hrService.getEmployees().subscribe({
      next: res => {
        this.employeeList = res.data;
        this.employeeCount = res.totalRecords;
        this.setUpMapLocation();
        if(!this.loggedInUser.isSuperAdmin) this.generateLeaveCharts(this.loggedInUser.leaveAssignment);
        this.getApprovalRequests();
        this.generateUpcomingBithdays();
        this.generateUpcomingAnniversaries();
      }
    });

    forkJoin({
      leaveTypes: this.hrService.getLeaveTypes(),
      expenseTypes: this.hrService.getExpenseTypes()
    }).subscribe(({ leaveTypes, expenseTypes }) => {
      this.leaveTypes = leaveTypes.data;
      this.expenseTypes = expenseTypes.data;
    });
  }

  getDahboardStats() {
    this.hrService.getDashboardStats().subscribe(res => {
      console.log(res.data);
      this.dashboardData = res.data
    })
  }

  getNotices() {
    this.hrService.getNotices().subscribe(res => {
      this.announcements = res.data ?? [];
      console.log(this.announcements);
      //this.announcements.length ? this.noticeInview = this.announcements[0] : this.newNotice = true;
    });
  }

  getPayrollGraph(year:any) {
    this.hrService.getPayrollGraph(Number(year)).subscribe(res => {
      this.graphDetails = res.data;
      console.log(this.graphDetails);
      this.graphValues = this.utilityService.getMonthlyAreaChartValues(this.graphDetails);
      console.log(this.graphValues)
    })
  }

  onChartYearChange(newYear: string) {

    // Call your function to update chart data
    this.getPayrollGraph(newYear);
  }

  updateDayStatus() {
    const hour = this.dateTime.getHours();

    if (hour >= 5 && hour < 12) {
      this.dayStatus = 'morning';
    } else if (hour >= 12 && hour < 17) {
      this.dayStatus = 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      this.dayStatus = 'evening';
    } else {
      this.dayStatus = 'night';
    }
  }

  // getApprovalRequests() {
  //   const leaveRequests$ = this.hrService.getRequestedLeaveApprovals();
  //   const expenseRequests$ = this.loggedInUser.isManager || this.loggedInUser.isSuperAdmin ? this.hrService.getRequestedExpenseApprovals() : of({data:[]});
  //   forkJoin([leaveRequests$, expenseRequests$]).pipe(
  //     map((res:any) => {
  //       console.log(res)
  //       const reqs = res[0].data.map((x:any) => {return {...x, type:'leave'}}).concat(res[1].data.map((x:any) => {return {...x, type:'expense'}}));
  //       const pendingReqs = reqs.filter((x:any) => {
  //         return x
  //       })
  //       return this.loggedInUser.isSuperAdmin || this.loggedInUser.isManager ? pendingReqs : reqs
  //     })
  //   ).subscribe(res => {
  //     this.approvalRequests = res
  //   })
  // }

  getApprovalRequests() {
    const leaveRequests$ = this.hrService.getRequestedLeaveApprovals();

    const expenseRequests$ = this.loggedInUser.isManager || this.loggedInUser.isSuperAdmin ? this.hrService.getRequestedExpenseApprovals() : of({ data: [] });

    forkJoin([leaveRequests$, expenseRequests$]).pipe(
      tap((res: any) => {
        const expenseRequests = res[1].data;

        // ✅ Build expenseAnalysisData using expenseTypes
        this.expenseAnalysisData = this.expenseTypes.map((type: any) => {
          const matchingRequests = expenseRequests.filter(
            (req: any) => req.expenseTypeName === type.expenseType
          );

          const total = matchingRequests.reduce((sum: number, req: any) => sum + Number(req.amount || 0), 0);

          // Optional: smarter status logic
          const statusPriority = ['pending', 'warning', 'awaiting', 'complete'];

          const status = statusPriority.find(s => matchingRequests.some((r: any) => r.status === s)) || 'pending';

          return {
            name: type.expenseType,
            value: total,
            status
          };
        })
        // Optional: remove empty ones
        //.filter((item: any) => item.value > 0);
      }),

      map((res: any) => {
        // ✅ ORIGINAL FUNCTIONALITY (unchanged)
        const reqs = res[0].data
          .map((x: any) => ({ ...x, type: 'leave' }))
          .concat(
            res[1].data.map((x: any) => ({ ...x, type: 'expense' }))
          );

        const pendingReqs = reqs.filter((x: any) => x);

        return this.loggedInUser.isSuperAdmin || this.loggedInUser.isManager
          ? pendingReqs
          : reqs;
      })
    )
    .subscribe(res => {
      this.approvalRequests = res;
    });
  }

  generateUpcomingBithdays() {
    this.birthdays = this.orderByUpcoming(this.employeeList, 'dateOfBirth')
  }

  generateUpcomingAnniversaries() {
    this.workAnniversaries = this.orderByUpcoming(this.employeeList, 'employmentStartDate')
  }

  orderByUpcoming(items:any[], dateKey:string) {
    const now = new Date();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();

    return items.slice().sort((a, b) => {
      const dA = new Date(a[dateKey]);
      const dB = new Date(b[dateKey]);

      const aMonthDay = { month: dA.getMonth(), day: dA.getDate() };
      const bMonthDay = { month: dB.getMonth(), day: dB.getDate() };

      const isAFuture = aMonthDay.month > nowMonth || (aMonthDay.month === nowMonth && aMonthDay.day >= nowDate);
      const isBFuture = bMonthDay.month > nowMonth || (bMonthDay.month === nowMonth && bMonthDay.day >= nowDate);

      if (isAFuture && !isBFuture) return -1;
      if (!isAFuture && isBFuture) return 1;

      // Compare month and day
      if (aMonthDay.month !== bMonthDay.month) {
        return aMonthDay.month - bMonthDay.month;
      }
      return aMonthDay.day - bMonthDay.day;
    });
  }

  get checkedInStatus() {
    if (sessionStorage.getItem('loggedInUser')) {
      return JSON.parse(sessionStorage.getItem('userCheckedIn') ?? '');
    }
  }

  setUpMapLocation() {
    if(!this.loggedInUser.isSuperAdmin && !this.checkedInStatus) {
      this.utilityService.getCurrentLocation().subscribe(pos=> {
        console.log(pos);
        let checkInTime = new Date();
        let userPos:[number, number] = [pos.latitude, pos.longitude];
        this.userLocation = userPos;
        const point: google.maps.LatLngLiteral = {
          lat: pos.latitude,
          lng: pos.longitude,
        };
  
        this.mapCenter = new google.maps.LatLng(point);
        //this.map.panTo(point);
  
        // this.markerInfoContent = "I'm here!";
  
        this.markerOptions = {
          draggable: false,
          animation: google.maps.Animation.DROP,
        };

        let distanceFromOffice = this.checkLocation(userPos);
        if(distanceFromOffice > 2) {
          this.notifyService.confirmCheckIn({
            title: 'Location Details',
            userLocation: [pos.latitude, pos.longitude],
            message: `You are currently ${Math.floor(distanceFromOffice).toLocaleString()}km away from the office. Do you want to check in manually as working remotely today?`,
            confirmText: 'Manual Checkin',
            cancelText: 'Cancel',
          }).subscribe((confirmed) => {
            if (confirmed) {
              this.manualCheckAction('checkIn');
            }
          });
        }
        else {
          this.manualCheckAction('checkIn');
        }
      });
    }
  }

  checkLocation(userPos:any) {
    const officePos: [number, number] = [6.4293011410936725, 3.4184931377760366];
    // [6.595643351234309, 3.3544838956325185]
    // [6.4293011410936725, 3.4184931377760366]
    return this.utilityService._getDistanceFromLatLonInKm(officePos, userPos);
  }

  manualCheckAction(action: string) {
    let data = {
      checkInTime: new Date(),
    }
    this.hrService.staffCheckInOut(data).subscribe({
      next: res => {
        // console.log(res);
        if(res.status == 200) {
          if(action == 'checkIn') {
            this.notifyService.showSuccess('You have been checked in successfully');
            this.checkedIn = true;
            sessionStorage.setItem('userCheckedIn', JSON.stringify(this.checkedIn));
          }
          else {
            this.notifyService.showSuccess('You have been checked out successfully');
          }
        }
        // this.getPageData();
      },
      error: err => {
        console.log(err)
        this.notifyService.showError(err.error.error);
      } 
    })
  }

  openLeaveApplicationModal() {

  }

  generateLeaveCharts(leaveArray: any[]) {
    // Filter only leaves with >0 days
    const validLeaves = leaveArray.filter(item => item.noOfLeaveDays > 0);

    // --- 1️⃣ Generate individual leave chart data ---
    this.chartData = validLeaves.map(item => {
      const percent = (item.daysUsed / item.noOfLeaveDays) * 100;

      const status =
        item.daysUsed === 0 ? 'awaiting' :
        percent < 40 ? 'pending' :
        percent < 100 ? 'warning' :
        'complete';

      return {
        name: item.leaveName,
        value: item.noOfLeaveDays,
        status
      };
    });

    // --- 2️⃣ Calculate totals ---
    this.totalLeaveDays = validLeaves.reduce((sum, item) => sum + item.noOfLeaveDays, 0);
    this.leaveDaysUsed = validLeaves.reduce((sum, item) => sum + item.daysUsed, 0);
    const leaveDaysLeft = this.totalLeaveDays - this.leaveDaysUsed;

    // --- 3️⃣ Generate total chart data ---
    const percentUsed = (this.leaveDaysUsed / this.totalLeaveDays) * 100;
    const totalStatus =
      this.leaveDaysUsed === 0 ? 'awaiting' :
      percentUsed < 40 ? 'pending' :
      percentUsed < 100 ? 'warning' :
      'complete';

    this.totalChartData = [
      { name: 'Days Used', value: this.leaveDaysUsed, status: totalStatus },
      { name: 'Days Left', value: leaveDaysLeft, status: 'awaiting' }
    ];
  }

  actionRequest(details: any, actionType:string) {
    if(details.status !== 'Pending') return;
    if(this.loggedInUser.isSuperAdmin || this.loggedInUser.isManager) {
      if(actionType == 'leave') {
        this.openLeaveApprovalModal(details);
      }
      else {
        this.openExpenseApprovalModal(details)
      }
    }    
  }

  openLeaveApprovalModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      forApproval: true,
      leaveTypes: this.leaveTypes
    }
    this.modalService.open(
      LeaveRequestInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getApprovalRequests();
      }
    });
  }

  openExpenseApprovalModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      forApproval: true,
      expenseTypes: this.expenseTypes
    }
    this.modalService.open(
      ExpenseRequestsInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getApprovalRequests();
      }
    });
  }


}
