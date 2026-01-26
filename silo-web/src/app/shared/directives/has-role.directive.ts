import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionsService } from '@sharedWeb/services/utils/permissions.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {

    private allowedRoles: string[] = [];

    @Input()
    set hasRole(roles: string[] | string) {
        this.allowedRoles = Array.isArray(roles) ? roles : [roles];
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
        if (this.permissionsService.hasRole(this.allowedRoles)) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
