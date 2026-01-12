import { CompanyManagement } from '@/pages/company-management/company-management.model';

export interface DeviceManagement {
    id?: string | number;         // Updated to allow both types
    companyId: string;
    msnMapping: { msn: string; simPhone?: string }[];
    status: string;
    onboardDate: string | null;

    // Fix: Make optional and nullable
    company?: CompanyManagement | null;
    msn?: string;
}
