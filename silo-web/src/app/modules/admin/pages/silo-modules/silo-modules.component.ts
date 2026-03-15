import { Component, OnInit } from '@angular/core';
import { AdminService } from '@services/admin/admin.service';
import { ModalService } from '@services/utils/modal.service';
import { PermissionInfoComponent } from '../../components/permission-info/permission-info.component';

@Component({
  selector: 'app-silo-modules',
  templateUrl: './silo-modules.component.html',
  styleUrl: './silo-modules.component.scss'
})
export class SiloModulesComponent implements OnInit {
  activeTab!:string;
  systemModules!:any[];

  constructor(
    public modalService: ModalService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.getPageData();
  }

  toggleModuleInfo(moduleName:string) {
    this.activeTab == moduleName ? this.activeTab = '' : this.activeTab = moduleName
  }

  getPageData() {
    this.adminService.getSystemModules().subscribe(res => {
      this.systemModules = res.data;
    });
  }

  openPermissionModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      modules: this.systemModules,
      features: this.systemModules[0].moduleFeatures
    }
    this.modalService.open(
      PermissionInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        //this.search$.next('');
      }
    });
  }
}
