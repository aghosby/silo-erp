import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private userRoles: string[] = [];
  private userPermissions: string[] = [];

  /** Set user context once (e.g. after login) */
  setUserContext(user: { role: string | string[], permissions?: string[] }) {
    this.userRoles = Array.isArray(user.role) ? user.role : [user.role];
    this.userPermissions = user.permissions ?? [];
  }

  /** Check if user has a specific permission key */
  hasPermission(permissionKey?: string): boolean {
    if (!permissionKey) return false;
    return this.userPermissions.includes(permissionKey);
  }

  /** Check if user has any of the allowed roles */
  hasRole(roles?: string[]): boolean {
    if (!roles || roles.length === 0) return true;
    return roles.some(role => this.userRoles.includes(role));
  }
}
