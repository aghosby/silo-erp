// src/app/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionsService } from '@sharedWeb/services/utils/permissions.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {

    private permissionKey!: string;

    @Input()
    set hasPermission(permissionKey: string) {
        this.permissionKey = permissionKey;
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionsService: PermissionsService
    ) {}

    ngOnInit(): void {
        this.updateView();
    }

    private updateView(): void {
        this.viewContainer.clear();
        if (this.permissionsService.hasPermission(this.permissionKey)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
