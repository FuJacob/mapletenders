/**
 * Team Management Types
 * Centralized type definitions for team/organization functionality
 */

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  // Additional fields from API responses
  role?: string;
  memberCount?: number;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  invitedBy?: string;
  joinedAt: Date;
  // Joined data
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface TeamInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  personalMessage?: string;
  createdAt: Date;
}

export interface SharedBookmark {
  id: string;
  organizationId: string;
  tenderId: string;
  title?: string;
  notes?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'watching' | 'applied' | 'won' | 'lost' | 'archived';
  assignedTo?: string;
  createdBy: string;
  applicationDeadline?: Date;
  estimatedBidAmount?: number;
  winProbability?: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  tender?: {
    id: string;
    title: string;
    deadline?: string;
  };
  assignedUser?: {
    id: string;
    email: string;
    name?: string;
  };
  createdByUser?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface TeamSavedSearch {
  id: string;
  organizationId: string;
  createdBy: string;
  name: string;
  description?: string;
  searchQuery: Record<string, any>;
  isPublic: boolean;
  enableAlerts: boolean;
  alertFrequency: 'daily' | 'weekly';
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response types
export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  size?: Organization['size'];
}

export interface InviteUserRequest {
  email: string;
  role: TeamInvitation['role'];
  personalMessage?: string;
}

export interface CreateSharedBookmarkRequest {
  tenderId: string;
  title?: string;
  notes?: string;
  tags?: string[];
  priority?: SharedBookmark['priority'];
  assignedTo?: string;
}

export interface CreateTeamSavedSearchRequest {
  name: string;
  description?: string;
  searchQuery: Record<string, any>;
  isPublic?: boolean;
  enableAlerts?: boolean;
  alertFrequency?: TeamSavedSearch['alertFrequency'];
}