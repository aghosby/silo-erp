import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrmService } from '@services/crm/crm.service';
import { AuthService } from '@services/utils/auth.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { UtilityService } from '@services/utils/utility.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  chartYear: string = new Date().getFullYear().toString();
  chartYearOptions:any = {};

  keepOrder = () => 0;

  invoiceAnalysisColorScheme:any = {};
  invoiceAnalysisData = [
    {
      "name": "Paid",
      "value": 22770,
      "status": "complete"
    },
    {
      "name": "Partially Paid",
      "value": 22070,
      "status": "pending"
    },
    {
      "name": "Pending",
      "value": 40770,
      "status": "warning"
    },
  ]

  leadsAnalysisColorScheme:any = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)', 'rgba(235, 87, 87, 0.7)']
  };
  leadsAnalysisData = [
    {
      "name": "Won",
      "value": 25,
      "status": "complete"
    },
    {
      "name": "Prospect",
      "value": 45,
      "status": "pending"
    },
    {
      "name": "New",
      "value": 120,
      "status": "awaiting"
    },
    {
      "name": "Lost",
      "value": 30,
      "status": "warning"
    },
  ]

  ticketAnalysisColorScheme = {
    domain: ['rgba(54, 171, 104, 0.7)', 'rgba(229, 166, 71, 0.7)', 'rgba(66, 133, 244, 0.7)']
  };
  ticketAnalysisData = [
    {
      "name": "Resolved",
      "value": 270,
      "status": "complete"
    },
    {
      "name": "Investigating",
      "value": 309,
      "status": "pending"
    },
    {
      "name": "Awaitng Customer",
      "value": 230,
      "status": "awaiting"
    },
  ]

  contactsLeadsAnalysisData = [
    {
      "name": "Jan",
      "series": [
        {
          "name": "contacts",
          "value": 27
        },
        {
          "name": "leads",
          "value": 100
        }
      ]
    },
    {
      "name": "Feb",
      "series": [
        {
          "name": "contacts",
          "value": 45
        },
        {
          "name": "leads",
          "value": 85
        }
      ]
    },
    {
      "name": "Mar",
      "series": [
        {
          "name": "contacts",
          "value": 36
        },
        {
          "name": "leads",
          "value": 76
        }
      ]
    },
    {
      "name": "Apr",
      "series": [
        {
          "name": "contacts",
          "value": 32
        },
        {
          "name": "leads",
          "value": 60
        }
      ]
    },
    {
      "name": "May",
      "series": [
        {
          "name": "contacts",
          "value": 21
        },
        {
          "name": "leads",
          "value": 124
        }
      ]
    },
    {
      "name": "Jun",
      "series": [
        {
          "name": "contacts",
          "value": 36
        },
        {
          "name": "leads",
          "value": 58
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilityService,
    private modalService: ModalService,
    private crmService: CrmService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    //this.currency = this.utils.currency;
    this.chartYearOptions = this.utils.generateYearOptions(Number(this.chartYear));
    this.invoiceAnalysisColorScheme = this.utils.pieChartColorScheme;
  }

}
