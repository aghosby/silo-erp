export interface MenuItem {
    routeLink: string;
    icon: string;
    label: string;
    mobileLabel?: string;
    subMenu?: MenuItem[];
    permissionKey?: string;
    roles?: string[]; 
    permission?: boolean;
}


export const navMenuData: MenuItem[] = [
    {
        routeLink: 'hr/dashboard',
        icon: 'bi bi-person-vcard',
        label: 'Human Resources',
        mobileLabel: 'HR Module',
        subMenu: [
            { 
                routeLink: 'hr/dashboard', 
                icon: 'bi bi-columns-gap', 
                label: 'Dashboard' 
            },
            { 
                routeLink: 'hr/employees', 
                icon: 'bi bi-people lg', 
                label: 'Employees',
                roles: ['superAdmin']
            },
            { 
                routeLink: 'hr/payroll', 
                icon: 'bi bi-cash-stack lg', 
                label: 'Payroll',
                roles: ['superAdmin'] 
            },
            { 
                routeLink: 'hr/self-service/overview', 
                icon: 'bi bi-person lg', 
                label: 'Profile',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/self-service/leave-requests', 
                icon: 'bi bi-person-fill', 
                label: 'Leave Requests',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/leave-management', 
                icon: 'bi bi-calendar2-check', 
                label: 'Leave Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/self-service/payroll', 
                icon: 'bi bi-layers-fill', 
                label: 'Payroll',
                roles: ['manager', 'employee']
            },
            { 
                routeLink: 'hr/expense-management', 
                icon: 'bi bi-credit-card lg', 
                label: 'Expense Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/self-service/expense', 
                icon: 'bi bi-person-fill', 
                label: 'Expense Requests', 
                roles: ['manager', 'employee']
            },
            { 
                routeLink: 'hr/appraisals', 
                icon: 'bi bi-award lg', 
                label: 'Appraisal Management',
                roles: ['superAdmin', 'manager'] 
            },
            { 
                routeLink: 'hr/self-service/appraisals', 
                icon: 'bi bi-journal-x', 
                label: 'Appraisal Requests',
                roles: ['manager', 'employee'] 
            },
            { 
                routeLink: 'hr/recruitment', 
                icon: 'bi bi-briefcase', 
                label: 'Recruitment',
                roles: ['superAdmin'] 
            },
            { 
                routeLink: 'hr/calendar', 
                icon: 'bi bi-calendar4-week lg', 
                label: 'Calendar' 
            },
            { 
                routeLink: 'hr/attendance', 
                icon: 'bi bi-card-checklist lg', 
                label: 'Attendance' 
            },
            { 
                routeLink: 'hr/visitors-log', 
                icon: 'bi bi-building-check lg', 
                label: 'Visitors Log' 
            }
        ]
    },
    {
        routeLink: 'crm',
        icon: 'bi bi-file-earmark-person',
        label: 'CRM',
        mobileLabel: 'CRM',
        roles: ['superAdmin', 'crmAgent'],
        subMenu: [
            { 
                routeLink: 'crm/dashboard', 
                icon: 'bi bi-grid-fill', 
                label: 'Dashboard' 
            },
            { 
                routeLink: 'crm/contacts', 
                icon: 'bi bi-person-vcard-fill', 
                label: 'Contacts' 
            },
            { 
                routeLink: 'crm/leads', 
                icon: 'bi bi-person-fill-up', 
                label: 'Leads' 
            },
            { 
                routeLink: 'crm/communication', 
                icon: 'bi bi-envelope-fill', 
                label: 'Communication' 
            },
            { 
                routeLink: 'crm/calendar', 
                icon: 'bi bi-calendar2-week-fill', 
                label: 'Calendar' 
            },
            { 
                routeLink: 'crm/support', 
                icon: 'bi bi-headset', 
                label: 'Support' 
            },
            { 
                routeLink: 'crm/sales', 
                icon: 'bi bi-receipt-cutoff', 
                label: 'Sales' 
            },
            { 
                routeLink: 'crm/agents', 
                icon: 'bi bi-person-square', 
                label: 'Agents' 
            },
            { 
                routeLink: 'crm/reports', 
                icon: 'bi bi-clipboard2-data-fill', 
                label: 'Reports' 
            }
        ]
    },
    {
        routeLink: 'settings',
        icon: 'bi bi-gear lg',
        label: 'Settings',
        mobileLabel: 'Settings',
        roles: ['superAdmin'], 
        subMenu: [
            { 
                routeLink: 'settings/general', 
                icon: 'bi bi-box-fill', 
                label: 'General',
            },
            { 
                routeLink: 'settings/hr', 
                icon: 'bi bi-people-fill', 
                label: 'Human Resources' 
            },
            { 
                routeLink: 'settings/crm', 
                icon: 'bi bi-microsoft-teams', 
                label: 'CRM' 
            }
        ]
    }
];
