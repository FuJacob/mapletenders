import { DatabaseService } from "./databaseService";
import { randomBytes } from "crypto";
import type { Database } from "../database.types";

const databaseService = new DatabaseService();
const supabase = databaseService.getSupabaseClient();

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  billingEmail?: string;
  subscriptionPlan: 'team' | 'business' | 'enterprise';
  subscriptionStatus: 'active' | 'cancelled' | 'suspended' | 'trial';
  trialEndsAt?: Date;
  maxUsers: number;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
  permissions: string[];
  status: 'active' | 'pending' | 'suspended';
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
  invitationToken: string;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedBy?: string;
  acceptedAt?: Date;
  personalMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedBookmark {
  id: string;
  organizationId: string;
  tenderNoticeId: string;
  title?: string;
  notes?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'active' | 'watching' | 'applied' | 'won' | 'lost' | 'archived';
  assignedTo?: string;
  assignedBy?: string;
  assignedAt?: Date;
  createdBy: string;
  applicationDeadline?: Date;
  internalDeadline?: Date;
  estimatedBidAmount?: number;
  winProbability?: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined data
  tender?: any;
  assignedUser?: any;
  createdByUser?: any;
}

export interface TeamSavedSearch {
  id: string;
  organizationId: string;
  createdBy: string;
  name: string;
  description?: string;
  searchQuery: Record<string, any>;
  isPublic: boolean;
  sharedWith: string[];
  enableAlerts: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
  lastAlertSent?: Date;
  subscriberCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class TeamService {
  /**
   * Create a new organization
   */
  async createOrganization(
    userId: string,
    organizationData: {
      name: string;
      slug: string;
      description?: string;
      industry?: string;
      size?: Organization['size'];
    }
  ): Promise<Organization> {
    try {
      const { data, error } = await supabase.rpc('create_organization', {
        p_name: organizationData.name,
        p_slug: organizationData.slug,
        p_description: organizationData.description,
        p_industry: organizationData.industry,
        p_size: organizationData.size
      });

      if (error) throw error;

      // Get the created organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', data)
        .single();

      if (orgError) throw orgError;

      return this.mapDatabaseToOrganization(org);
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new Error('Failed to create organization');
    }
  }

  /**
   * Get user's organizations
   */
  async getUserOrganizations(): Promise<(Organization & { role: string; memberCount: number })[]> {
    try {
      const { data, error } = await supabase.rpc('get_user_organizations');

      if (error) throw error;

      return (data || []).map((item: any) => ({
        ...this.mapDatabaseToOrganization(item),
        role: item.role,
        memberCount: item.member_count
      }));
    } catch (error) {
      console.error('Error getting user organizations:', error);
      throw new Error('Failed to get user organizations');
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (error || !data) return null;
      return this.mapDatabaseToOrganization(data);
    } catch (error) {
      console.error('Error getting organization:', error);
      return null;
    }
  }

  /**
   * Update organization
   */
  async updateOrganization(
    organizationId: string,
    updates: Partial<Organization>
  ): Promise<Organization> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToOrganization(data);
    } catch (error) {
      console.error('Error updating organization:', error);
      throw new Error('Failed to update organization');
    }
  }

  /**
   * Get organization members
   */
  async getOrganizationMembers(organizationId: string): Promise<OrganizationMember[]> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          user:auth.users(id, email, raw_user_meta_data)
        `)
        .eq('organization_id', organizationId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((member: any) => ({
        ...this.mapDatabaseToOrganizationMember(member),
        user: member.user ? {
          id: member.user.id,
          email: member.user.email,
          name: member.user.raw_user_meta_data?.name || member.user.email
        } : undefined
      }));
    } catch (error) {
      console.error('Error getting organization members:', error);
      throw new Error('Failed to get organization members');
    }
  }

  /**
   * Invite user to organization
   */
  async inviteUserToOrganization(
    organizationId: string,
    invitedBy: string,
    email: string,
    role: TeamInvitation['role'],
    personalMessage?: string
  ): Promise<TeamInvitation> {
    try {
      // Check if user is already a member by looking up user by email in profiles
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (userProfile) {
        const { data: existingMember } = await supabase
          .from('organization_members')
          .select('id')
          .eq('organization_id', organizationId)
          .eq('user_id', userProfile.id)
          .single();

        if (existingMember) {
          throw new Error('User is already a member of this organization');
        }
      }


      // Check for existing pending invitation
      const { data: existingInvitation } = await supabase
        .from('team_invitations')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('email', email)
        .is('accepted_at', null)
        .single();

      if (existingInvitation) {
        throw new Error('User already has a pending invitation');
      }

      // Create invitation
      const invitationToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { data, error } = await supabase
        .from('team_invitations')
        .insert([{
          organization_id: organizationId,
          email,
          role,
          invited_by: invitedBy,
          token: invitationToken,
          expires_at: expiresAt.toISOString(),
          personal_message: personalMessage
        }])
        .select()
        .single();

      if (error) throw error;

      // TODO: Send invitation email
      return this.mapDatabaseToTeamInvitation(data);
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }
  }

  /**
   * Accept team invitation
   */
  async acceptInvitation(invitationToken: string, userId: string): Promise<OrganizationMember> {
    try {
      // Get invitation
      const { data: invitation, error: invError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('invitation_token', invitationToken)
        .eq('status', 'pending')
        .single();

      if (invError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Create organization member
      const { data: member, error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: invitation.organization_id,
          user_id: userId,
          role: invitation.role,
          status: 'active',
          invited_by: invitation.invited_by,
          invited_at: invitation.created_at,
          joined_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (memberError) throw memberError;

      // Update invitation status
      await supabase
        .from('team_invitations')
        .update({
          status: 'accepted',
          accepted_by: userId,
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      return this.mapDatabaseToOrganizationMember(member);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    organizationId: string,
    memberId: string,
    newRole: OrganizationMember['role']
  ): Promise<OrganizationMember> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', memberId)
        .eq('organization_id', organizationId)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToOrganizationMember(data);
    } catch (error) {
      console.error('Error updating member role:', error);
      throw new Error('Failed to update member role');
    }
  }

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: string, memberId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId)
        .eq('organization_id', organizationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing member:', error);
      throw new Error('Failed to remove member');
    }
  }

  /**
   * Create shared bookmark
   */
  async createSharedBookmark(
    organizationId: string,
    userId: string,
    bookmarkData: {
      tenderNoticeId: string;
      title?: string;
      notes?: string;
      tags?: string[];
      priority?: SharedBookmark['priority'];
      assignedTo?: string;
    }
  ): Promise<SharedBookmark> {
    try {
      const { data, error } = await supabase
        .from('shared_bookmarks')
        .insert([{
          organization_id: organizationId,
          tender_notice_id: bookmarkData.tenderNoticeId,
          title: bookmarkData.title,
          notes: bookmarkData.notes,
          tags: bookmarkData.tags || [],
          priority: bookmarkData.priority || 'medium',
          assigned_to: bookmarkData.assignedTo,
          assigned_by: bookmarkData.assignedTo ? userId : null,
          assigned_at: bookmarkData.assignedTo ? new Date().toISOString() : null,
          created_by: userId,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToSharedBookmark(data);
    } catch (error) {
      console.error('Error creating shared bookmark:', error);
      throw new Error('Failed to create shared bookmark');
    }
  }

  /**
   * Get organization shared bookmarks
   */
  async getSharedBookmarks(organizationId: string): Promise<SharedBookmark[]> {
    try {
      const { data, error } = await supabase
        .from('shared_bookmarks')
        .select(`
          *,
          tender:tenders(*),
          assigned_user:auth.users!shared_bookmarks_assigned_to_fkey(id, email, raw_user_meta_data),
          created_by_user:auth.users!shared_bookmarks_created_by_fkey(id, email, raw_user_meta_data)
        `)
        .eq('organization_id', organizationId)
        .neq('status', 'archived')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((bookmark: any) => ({
        ...this.mapDatabaseToSharedBookmark(bookmark),
        tender: bookmark.tender,
        assignedUser: bookmark.assigned_user,
        createdByUser: bookmark.created_by_user
      }));
    } catch (error) {
      console.error('Error getting shared bookmarks:', error);
      throw new Error('Failed to get shared bookmarks');
    }
  }

  /**
   * Update shared bookmark
   */
  async updateSharedBookmark(
    bookmarkId: string,
    updates: Partial<SharedBookmark>
  ): Promise<SharedBookmark> {
    try {
      const { data, error } = await supabase
        .from('shared_bookmarks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookmarkId)
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToSharedBookmark(data);
    } catch (error) {
      console.error('Error updating shared bookmark:', error);
      throw new Error('Failed to update shared bookmark');
    }
  }

  /**
   * Create team saved search
   */
  async createTeamSavedSearch(
    organizationId: string,
    userId: string,
    searchData: {
      name: string;
      description?: string;
      searchQuery: Record<string, any>;
      isPublic?: boolean;
      enableAlerts?: boolean;
      alertFrequency?: TeamSavedSearch['alertFrequency'];
    }
  ): Promise<TeamSavedSearch> {
    try {
      const { data, error } = await supabase
        .from('team_saved_searches')
        .insert([{
          organization_id: organizationId,
          created_by: userId,
          name: searchData.name,
          description: searchData.description,
          search_query: searchData.searchQuery,
          is_public: searchData.isPublic || false,
          enable_alerts: searchData.enableAlerts || false,
          alert_frequency: searchData.alertFrequency || 'daily'
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapDatabaseToTeamSavedSearch(data);
    } catch (error) {
      console.error('Error creating team saved search:', error);
      throw new Error('Failed to create team saved search');
    }
  }

  /**
   * Get team saved searches
   */
  async getTeamSavedSearches(organizationId: string, userId: string): Promise<TeamSavedSearch[]> {
    try {
      const { data, error } = await supabase
        .from('team_saved_searches')
        .select('*')
        .eq('organization_id', organizationId)
        .or(`is_public.eq.true,created_by.eq.${userId},shared_with.cs.{${userId}}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapDatabaseToTeamSavedSearch);
    } catch (error) {
      console.error('Error getting team saved searches:', error);
      throw new Error('Failed to get team saved searches');
    }
  }

  /**
   * Check if user is member of organization
   */
  async isOrganizationMember(organizationId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('user_id', userId)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user's role in organization
   */
  async getUserRole(organizationId: string, userId: string): Promise<string | null> {
    try {
      const { data } = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', userId)
        .single();

      return data?.role || null;
    } catch (error) {
      return null;
    }
  }

  // Mapping functions
  private mapDatabaseToOrganization(data: any): Organization {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      logoUrl: data.logo_url,
      websiteUrl: data.website_url,
      industry: data.industry,
      size: data.size,
      billingEmail: data.billing_email,
      subscriptionPlan: data.subscription_plan,
      subscriptionStatus: data.subscription_status,
      trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : undefined,
      maxUsers: data.max_users,
      settings: data.settings || {},
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabaseToOrganizationMember(data: any): OrganizationMember {
    return {
      id: data.id,
      organizationId: data.organization_id,
      userId: data.user_id,
      role: data.role,
      permissions: data.permissions || [],
      status: data.status,
      invitedBy: data.invited_by,
      invitedAt: data.invited_at ? new Date(data.invited_at) : undefined,
      joinedAt: new Date(data.joined_at),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabaseToTeamInvitation(data: any): TeamInvitation {
    return {
      id: data.id,
      organizationId: data.organization_id,
      email: data.email,
      role: data.role,
      invitedBy: data.invited_by,
      invitationToken: data.invitation_token,
      expiresAt: new Date(data.expires_at),
      status: data.status,
      acceptedBy: data.accepted_by,
      acceptedAt: data.accepted_at ? new Date(data.accepted_at) : undefined,
      personalMessage: data.personal_message,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabaseToSharedBookmark(data: any): SharedBookmark {
    return {
      id: data.id,
      organizationId: data.organization_id,
      tenderNoticeId: data.tender_notice_id,
      title: data.title,
      notes: data.notes,
      tags: data.tags || [],
      priority: data.priority,
      status: data.status,
      assignedTo: data.assigned_to,
      assignedBy: data.assigned_by,
      assignedAt: data.assigned_at ? new Date(data.assigned_at) : undefined,
      createdBy: data.created_by,
      applicationDeadline: data.application_deadline ? new Date(data.application_deadline) : undefined,
      internalDeadline: data.internal_deadline ? new Date(data.internal_deadline) : undefined,
      estimatedBidAmount: data.estimated_bid_amount,
      winProbability: data.win_probability,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  private mapDatabaseToTeamSavedSearch(data: any): TeamSavedSearch {
    return {
      id: data.id,
      organizationId: data.organization_id,
      createdBy: data.created_by,
      name: data.name,
      description: data.description,
      searchQuery: data.search_query,
      isPublic: data.is_public,
      sharedWith: data.shared_with || [],
      enableAlerts: data.enable_alerts,
      alertFrequency: data.alert_frequency,
      lastAlertSent: data.last_alert_sent ? new Date(data.last_alert_sent) : undefined,
      subscriberCount: data.subscriber_count,
      lastUsedAt: data.last_used_at ? new Date(data.last_used_at) : undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

export const teamService = new TeamService();