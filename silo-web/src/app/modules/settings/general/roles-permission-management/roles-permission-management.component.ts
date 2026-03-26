import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminService } from '@services/admin/admin.service';
import { SettingsService } from '@services/settings/settings.service';
import { AuthService } from '@services/utils/auth.service';
import { NotificationService } from '@services/utils/notification.service';
import { CompanyRoleInfoComponent } from '../company-role-info/company-role-info.component';
import { ModalService } from '@services/utils/modal.service';

@Component({
  selector: 'app-roles-permission-management',
  templateUrl: './roles-permission-management.component.html',
  styleUrls: ['./roles-permission-management.component.scss']
})
export class RolesPermissionManagementComponent implements OnInit {
  loggedInUser: any;
  activeTab: string = '';
  systemModules: any[] = [];
  companyRoles: any[] = [];
  permissionsForm: FormGroup = new FormGroup({});
  isLoading:boolean = false;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private notifyService: NotificationService,
    private settingsService: SettingsService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.loggedInUser;
    this.loadPageData();
  }

  loadPageData(): void {
    forkJoin({
      modules: this.adminService.getSystemModules(),
      roles: this.settingsService.getCompanyRoles()
    }).subscribe({
      next: ({ modules, roles }) => {
        this.systemModules = modules?.data || [];
        this.companyRoles = roles?.data || [];
        this.buildPermissionsForm();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getSystemRoles(): void {
    this.settingsService.getCompanyRoles().subscribe({
      next: (res) => {
        this.companyRoles = res?.data || [];
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleModuleInfo(moduleKey: string): void {
    this.activeTab = this.activeTab === moduleKey ? '' : moduleKey;
  }

  modulePermissions(moduleKey: string): FormArray {
    return this.permissionsForm.get(moduleKey) as FormArray;
  }

  buildPermissionsForm(): void {
    this.permissionsForm = new FormGroup({});

    this.systemModules.forEach((module: any) => {
      const roleArray:any = new FormArray([]);

      this.companyRoles.forEach((role: any) => {
        const roleGroup:any = new FormGroup({});

        module.moduleFeatures?.forEach((feature: any) => {
          feature.featurePermissions?.forEach((permission: any) => {
            const permissionValue = this.getPermissionValue(role, module.key, feature.featureKey, permission.key);
            roleGroup.addControl(permission.key, new FormControl(permissionValue));
          });
        });

        roleArray.push(roleGroup);
      });

      this.permissionsForm.addControl(module.key, roleArray);
    });

    console.log('FORM BUILT', this.permissionsForm.value);
  }

  getPermissionValue(
    role: any,
    moduleKey: string,
    featureKey: string,
    permissionKey: string
  ): boolean {
    const roleModule = role?.rolePermissions?.find((m: any) => m.key === moduleKey);
    if (!roleModule) return false;

    const roleFeature = roleModule?.moduleFeatures?.find((f: any) => f.featureKey === featureKey);
    if (!roleFeature) return false;

    const rolePermission = roleFeature?.featurePermissions?.find((p: any) => p.key === permissionKey);
    return !!rolePermission?.value;
  }

  saveChanges(): void {
    this.isLoading = true;
    console.log('BEFORE TRANSFORMATION', this.permissionsForm.value);

    const formValue = this.permissionsForm.value;
    const transformedModules: any = {};

    Object.keys(formValue).forEach((moduleKey) => {
      const moduleRolesFormValues = formValue[moduleKey];
      const currentModule = this.systemModules.find((module: any) => module.key === moduleKey);

      transformedModules[moduleKey] = this.companyRoles.map((role: any, roleIndex: number) => {
        const roleFormGroupValue = moduleRolesFormValues[roleIndex];
        const rolePermissionsArr: any[] = [];

        currentModule?.moduleFeatures?.forEach((feature: any) => {
          feature.featurePermissions?.forEach((permission: any) => {
            rolePermissionsArr.push({
              featureId: feature.featureId,
              [permission.key]: !!roleFormGroupValue[permission.key]
            });
          });
        });

        return {
          roleId: role._id,
          rolePermissions: rolePermissionsArr
        };
      });
    });

    console.log('AFTER TRANSFORMATION', transformedModules);

    const payload = {
      companyId: this.loggedInUser.companyId || this.loggedInUser._id,
      modules: transformedModules
    };

    this.adminService.updatePermissions(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.notifyService.showSuccess('Your permissions have been updated successfully');
          this.loadPageData();
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.isLoading = false;
      }
    });
  }

  isModuleActive(moduleKey: string): boolean {
    return !!this.loggedInUser?.companyFeatures?.modules?.find((m: any) => m.key === moduleKey)?.active;
  }

  onModuleToggle(moduleKey: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    const targetModule = this.loggedInUser?.companyFeatures?.modules?.find(
      (m: any) => m.key === moduleKey
    );

    if (targetModule) {
      targetModule.active = checked;
    }

    console.log('Updated companyFeatures.modules', this.loggedInUser.companyFeatures.modules);
  }

  openRoleModal(modalData?: any): void {
    const modalConfig: any = {
      isExisting: !!modalData,
      width: '40%',
      data: modalData,
      modules: this.systemModules,
    };

    this.modalService.open(
      CompanyRoleInfoComponent,
      modalConfig
    ).subscribe((result) => {
      if (result?.action === 'submit' && result?.dirty) {
        this.loadPageData();
      }
    });
  }
}