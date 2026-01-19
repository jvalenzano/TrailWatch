/**
 * Crew types for trail maintenance coordination.
 */

export type CrewStatus = 'available' | 'assigned' | 'in_progress' | 'completed';

export interface CrewMember {
    id: string;
    name: string;
    role: 'leader' | 'member';
}

export interface Crew {
    id: string;
    name: string;
    organization: string;
    members: CrewMember[];
    status: CrewStatus;
    specialties: string[];
    assigned_trails?: string[];
    current_assignment?: {
        report_id: string;
        assigned_at: string;
        due_date?: string;
    };
}
