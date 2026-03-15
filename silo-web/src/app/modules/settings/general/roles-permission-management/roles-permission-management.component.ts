import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AdminService } from '@services/admin/admin.service';
import { SettingsService } from '@services/settings/settings.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { CompanyRoleInfoComponent } from '../company-role-info/company-role-info.component';
import { ModalService } from '@services/utils/modal.service';

@Component({
  selector: 'app-roles-permission-management',
  templateUrl: './roles-permission-management.component.html',
  styleUrl: './roles-permission-management.component.scss'
})
export class RolesPermissionManagementComponent implements OnInit {
  loggedInUser:any;
  activeTab!:string;
  systemModules!:any[];
  companyRoles!:any[];
  permissionsForm:FormGroup = new FormGroup({});

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private notifyService: NotificationService,
    private settingsService: SettingsService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.getSystemModules();
  }

  getSystemModules() {
    this.adminService.getSystemModules().subscribe(res => {
      this.systemModules = res.data;
      console.log(this.systemModules);
      this.generateFormGroup();
    });
  }

  getSystemRoles() {}

  toggleModuleInfo(moduleName:string) {
    this.activeTab == moduleName ? this.activeTab = '' : this.activeTab = moduleName
  }

  modulePermissions(moduleKey:string) {
    return this.permissionsForm.get(moduleKey) as FormArray;
  }

  generateFormGroup() {
    this.loggedInUser.companyFeatures.modules.forEach((module:any) => {
      this.addModuleToFormGroup(module);
      this.generateModuleRolesFormGroup(module);
    })
    //console.log(this.permissionsForm.value)
  }

  addModuleToFormGroup(moduleData:any) {
    const formArr = new FormArray([]);
    this.permissionsForm.addControl(moduleData.key, formArr)
  }

  generateModuleRolesFormGroup(moduleData:any) {
    this.settingsService.getCompanyRoles().subscribe(res => {
      console.log('Roles', res.data);
    })
    this.companyRoles.map(role => {
      const features = new FormGroup({});
      moduleData.moduleFeatures.map((feature:any) => {
        feature.featurePermissions.map((p:any) => {
          let reqVal = role.rolePermissions
          .find((x:any) => x.key == moduleData.key).moduleFeatures
          .find((y:any) => y.featureKey == feature.featureKey).featurePermissions
          .find((v:any) => v.key == p.key).value;
          const formControl = new FormControl(reqVal)
          features.addControl(p.key, formControl)
        })
      });

      this.modulePermissions(moduleData.key).push(features)
    })
  }

  saveChanges() {
    console.log('BEFORE TRANSFORMATION', this.permissionsForm.value);
    let permissionsVal = this.permissionsForm.value;

    Object.keys(permissionsVal).forEach((moduleKey) => {
      let modulePermissions:any[] = permissionsVal[moduleKey];
      let newModulePermissions:any[] = []

      //Generate an array that combines the features and permissionKeys under each module
      let arrayfeatIdPermKeys:any[] = []
      let moduleFeat:any[] = this.systemModules.find(module => module.key == moduleKey).moduleFeatures;
      moduleFeat.map(feat => {
        feat.featurePermissions.find((permission:any) => {
          let combineData = {
            featureId: feat.featureId,
            permissionKey: permission.key
          }
          arrayfeatIdPermKeys.push(combineData)
        })
      })

      //Loop through each role in a module and transform the data to have required Ids
      this.companyRoles.map((role, roleIndex) => {
        let rolePermissionsArr:any[] = []
        Object.keys(modulePermissions[roleIndex]).map(permissionKey => {
          let newPermissionVal:any = {
            featureId: arrayfeatIdPermKeys.find(x => x.permissionKey == permissionKey).featureId,
          }
          newPermissionVal[permissionKey] = modulePermissions[roleIndex][permissionKey]
          rolePermissionsArr.push(newPermissionVal)
        })
        
        let reqTransData = {
          roleId: role['_id'],
          rolePermissions: rolePermissionsArr
        }
        newModulePermissions.push(reqTransData)
      })

      //Assign original module key value to new value
      permissionsVal[moduleKey] = newModulePermissions

    })
    console.log('AFTER TRANSFORMATION', permissionsVal)

    let payload = {
      companyId: this.loggedInUser._id,
      modules: permissionsVal
    }

    this.adminService.updatePermissions(payload).subscribe({
      next: res => {
        // console.log(res);
        if(res.success) {
          this.notifyService.showSuccess('Your permissions have been updated successfully')
          this.getSystemModules()
        }
      },
      error: err => {
        console.log(err)
      } 
    })
  }

  openRoleModal(modalData?:any) {
    const modalConfig:any = {
      isExisting: modalData ? true : false,
      width: '40%',
      data: modalData,
      modules: this.systemModules,
    }
    this.modalService.open(
      CompanyRoleInfoComponent, 
      modalConfig
    )
    .subscribe(result => {
      if (result.action === 'submit' && result.dirty) {
        this.getSystemRoles();
        this.getSystemModules();
      }
    });
  }
}
