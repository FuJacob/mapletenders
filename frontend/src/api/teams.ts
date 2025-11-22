import apiClient from "../client/apiClient";
import type { Json } from '../../database.types';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  industry?: string;
  size?: "startup" | "small" | "medium" | "large" | "enterprise";
  billingEmail?: string;
  subscriptionPlan: "team" | "business" | "enterprise";
  subscriptionStatus: "active" | "cancelled" | "suspended" | "trial";
  trialEndsAt?: string;
  maxUsers: number;
  settings: Json;
  createdAt: string;
  updatedAt: string;
  // Additional fields from API
  role?: string;
  memberCount?: number;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: "owner" | "admin" | "manager" | "member" | "viewer";
  permissions: string[];
  status: "active" | "pending" | "suspended";
  invitedBy?: string;
  invitedAt?: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
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
  role: "admin" | "manager" | "member" | "viewer";
  invitedBy: string;
  invitationToken: string;
  expiresAt: string;
  status: "pending" | "accepted" | "declined" | "expired";
  acceptedBy?: string;
  acceptedAt?: string;
  personalMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SharedBookmark {
  id: string;
  organizationId: string;
  tenderNoticeId: string;
  title?: string;
  notes?: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "urgent";
  status: "active" | "watching" | "applied" | "won" | "lost" | "archived";
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: string;
  createdBy: string;
  applicationDeadline?: string;
  internalDeadline?: string;
  estimatedBidAmount?: number;
  winProbability?: number;
  createdAt: string;
  updatedAt: string;
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
  searchQuery: Json;
  isPublic: boolean;
  sharedWith: string[];
  enableAlerts: boolean;
  alertFrequency: "immediate" | "daily" | "weekly";
  lastAlertSent?: string;
  subscriberCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const teamsApi = {
  // Organization management
  async createOrganization(data: {
    name: string;
    slug: string;
    description?: string;
    industry?: string;
    size?: Organization["size"];
  }): Promise<Organization> {
    const response = await apiClient.post("/teams/organizations", data);
    return response.data;
  },

  async getUserOrganizations(): Promise<Organization[]> {
    const response = await apiClient.get("/teams/organizations");
    return response.data;
  },

  async getOrganization(organizationId: string): Promise<Organization> {
    const response = await apiClient.get(
      `/teams/organizations/${organizationId}`
    );
    return response.data;
  },

  async updateOrganization(
    organizationId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    const response = await apiClient.put(
      `/teams/organizations/${organizationId}`,
      updates
    );
    return response.data;
  },

  // Member management
  async getOrganizationMembers(
    organizationId: string
  ): Promise<OrganizationMember[]> {
    const response = await apiClient.get(
      `/teams/organizations/${organizationId}/members`
    );
    return response.data;
  },

  async inviteUser(
    organizationId: string,
    data: {
      email: string;
      role: TeamInvitation["role"];
      personalMessage?: string;
    }
  ): Promise<TeamInvitation> {
    const response = await apiClient.post(
      `/teams/organizations/${organizationId}/invitations`,
      data
    );
    return response.data;
  },

  async acceptInvitation(token: string): Promise<OrganizationMember> {
    const response = await apiClient.post(`/teams/invitations/${token}/accept`);
    return response.data;
  },

  async updateMemberRole(
    organizationId: string,
    memberId: string,
    role: OrganizationMember["role"]
  ): Promise<OrganizationMember> {
    const response = await apiClient.put(
      `/teams/organizations/${organizationId}/members/${memberId}`,
      { role }
    );
    return response.data;
  },

  async removeMember(organizationId: string, memberId: string): Promise<void> {
    await apiClient.delete(
      `/teams/organizations/${organizationId}/members/${memberId}`
    );
  },
};

