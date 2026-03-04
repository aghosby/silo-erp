import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CrmService } from '@services/crm/crm.service';
import { ModalService } from '@services/utils/modal.service';
import { NotificationService } from '@services/utils/notification.service';
import { StatusInfoComponent } from '@sharedWeb/components/blocks/status-info/status-info.component';

@Component({
  selector: 'app-crm-settings',
  templateUrl: './crm-settings.component.html',
  styleUrl: './crm-settings.component.scss'
})
export class CrmSettingsComponent implements OnInit {
  form!: FormGroup;
  accordionItems: any[] = [];
  activeTab:number = -1;
  employees:any[] = [];

  constructor(
    private modalService: ModalService,
    private crmService: CrmService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      leadStatus: new FormControl(''),
      dealStatus: new FormControl(''),
      supportTicketStatus: new FormControl(''),
    });

    this.loadAccordionData();
  }

  toggleAccordionInfo(index: number) {
    this.activeTab = this.activeTab === index ? -1 : index;
    //const item = this.accordionItems[index];
  }

  loadAccordionData() {
    this.accordionItems.forEach(item => {
      // Only load once
      if (item.list.length === 0) {
        item.loading = true; // start loading
        item.api().subscribe({
          next: (res: any) => {
            item.list = res.data;
            item.loading = false; // stop loading
          },
          error: () => {
            item.loading = false; // stop loading on error too
          }
        });
      }
    })    
  }

  openStatusModal(statusType:string, modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '35%',
      data: modalData,
      statusType: statusType
    }
    this.modalService.open(
      StatusInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        // this.updateAccordionList('payrollDebits');
        // this.form.controls['payrollDebit'].reset();
      }
    });
  }

  editEntity(type: string, entity: any) {
    switch(type) {

      case "departments":
        break;

      case "leaveTypes":
        break;

      case "holidayTypes":
        break;

      case "expenseTypes":
        break;

      case "designations":
        break;
    }
  }

  deleteEntity(type: string, entity: any) {
    const item = this.accordionItems.find(x => x.key === type);
    if (!item) return;

    const title = `Remove ${item.display(entity)}`;
    const message = `Are you sure you want to remove this ${item.label.toLowerCase().slice(0, -1)}?`;

    this.notify.confirmAction({
      title: title,
      message: message,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
    }).subscribe((confirmed) => {
      if (!confirmed) return;

      item.deleteApi(entity).subscribe({
        next: (res:any) => {
          if (res.status === 200) {
            this.notify.showInfo(`${item.label.slice(0, -1)} has been deleted successfully`);
            // Remove the entity from the list locally
            item.list = item.list.filter((x:any) => x._id !== entity._id);
          }
        },
        error: (err:any) => {}
      });
    });
  }

  updateAccordionList(accordionKey:string) {
    let reqObj = this.accordionItems.find(x => x.key === accordionKey);
    reqObj.loading = true; // start loading
    reqObj.api().subscribe({
      next: (res: any) => {
        reqObj.list = res.data;
        reqObj.loading = false; // stop loading
      },
      error: () => {
        reqObj.loading = false; // stop loading on error too
      }
    });
  }

}
