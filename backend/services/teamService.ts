import { DatabaseService } from "./databaseService";
import { randomBytes } from "crypto";
import type { Database } from "../database.types";
import {
  Organization,
  OrganizationMember,
  TeamInvitation,
  SharedBookmark,
  TeamSavedSearch,
  CreateOrganizationRequest,
  InviteUserRequest,
  CreateSharedBookmarkRequest,
  CreateTeamSavedSearchRequest
} from "../types/teams";
import { TeamManagementError } from "../utils/errorHandler";

export class TeamService {
  private supabase: any;

  constructor(private databaseService: DatabaseService) {
    this.supabase = databaseService.getSupabaseClient();
  }

  /**
   * Create a new organization
   */
  async createOrganization(
    userId: string,
    organizationData: CreateOrganizationRequest
  ): Promise<Organization> {
    try {
      const { data, error } = await this.supabase.rpc('create_organization', {
        p_name: organizationData.name,
        p_slug: organizationData.slug,
        p_description: organizationData.description,
        p_industry: organizationData.industry,
        p_size: organizationData.size
      });

      if (error) throw error;

      // Get the created organization
      const { data: org, error: orgError } = await this.supabase
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
      const { data, error } = await this.supabase.rpc('get_user_organizations');

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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
    inviteData: InviteUserRequest
  ): Promise<TeamInvitation> {
    try {
      // Check if user is already a member by looking up user by email in profiles
      const { data: userProfile } = await this.supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteData.email)
        .single();

      if (userProfile) {
        const { data: existingMember } = await this.supabase
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
      const { data: existingInvitation } = await this.supabase
        .from('team_invitations')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('email', inviteData.email)
        .is('accepted_at', null)
        .single();

      if (existingInvitation) {
        throw new Error('User already has a pending invitation');
      }

      // Create invitation
      const invitationToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const { data, error } = await this.supabase
        .from('team_invitations')
        .insert([{
          organization_id: organizationId,
          email: inviteData.email,
          role: inviteData.role,
          invited_by: invitedBy,
          token: invitationToken,
          expires_at: expiresAt.toISOString(),
          personal_message: inviteData.personalMessage
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
      const { data: invitation, error: invError } = await this.supabase
        .from('team_invitations')
        .select('*')
        .eq('token', invitationToken)
        .is('accepted_at', null)
        .single();

      if (invError || !invitation) {
        throw new Error('Invalid or expired invitation');
      }

      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired');
      }

      // Create organization member
      const { data: member, error: memberError } = await this.supabase
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
      await this.supabase
        .from('team_invitations')
        .update({
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
      const { data, error } = await this.supabase
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
      const { error } = await this.supabase
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
    bookmarkData: CreateSharedBookmarkRequest
  ): Promise<SharedBookmark> {
    try {
      const { data, error } = await this.supabase
        .from('shared_bookmarks')
        .insert([{
          organization_id: organizationId,
          tender_id: bookmarkData.tenderId,
          title: bookmarkData.title,
          notes: bookmarkData.notes,
          tags: bookmarkData.tags || [],
          priority: bookmarkData.priority || 'medium',
          assigned_to: bookmarkData.assignedTo,
          created_by: userId,
          status: 'active'
        }])
        .select()
        .single();

      if (error) {
        throw new TeamManagementError(
          error.message || 'Failed to create shared bookmark',
          400,
          'CREATE_BOOKMARK_FAILED'
        );
      }

      return this.mapDatabaseToSharedBookmark(data);
    } catch (error) {
      if (error instanceof TeamManagementError) {
        throw error;
      }
      throw new TeamManagementError(
        'Failed to create shared bookmark',
        500,
        'CREATE_BOOKMARK_ERROR'
      );
    }
  }

  /**
   * Get organization shared bookmarks
   */
  async getSharedBookmarks(organizationId: string): Promise<SharedBookmark[]> {
    try {
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data, error } = await this.supabase
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
      const { data } = await this.supabase
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
      createdBy: data.created_by,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      // Additional fields from API responses
      role: data.role,
      memberCount: data.member_count
    };
  }

  private mapDatabaseToOrganizationMember(data: any): OrganizationMember {
    return {
      id: data.id,
      organizationId: data.organization_id,
      userId: data.user_id,
      role: data.role,
      invitedBy: data.invited_by,
      joinedAt: new Date(data.joined_at),
      // Joined data
      user: data.user
    };
  }

  private mapDatabaseToTeamInvitation(data: any): TeamInvitation {
    return {
      id: data.id,
      organizationId: data.organization_id,
      email: data.email,
      role: data.role,
      invitedBy: data.invited_by,
      token: data.token,
      expiresAt: new Date(data.expires_at),
      acceptedAt: data.accepted_at ? new Date(data.accepted_at) : undefined,
      personalMessage: data.personal_message,
      createdAt: new Date(data.created_at)
    };
  }

  private mapDatabaseToSharedBookmark(data: any): SharedBookmark {
    return {
      id: data.id,
      organizationId: data.organization_id,
      tenderId: data.tender_id,
      title: data.title,
      notes: data.notes,
      tags: data.tags || [],
      priority: data.priority,
      status: data.status,
      assignedTo: data.assigned_to,
      createdBy: data.created_by,
      applicationDeadline: data.application_deadline ? new Date(data.application_deadline) : undefined,
      estimatedBidAmount: data.estimated_bid_amount,
      winProbability: data.win_probability,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      // Joined data
      tender: data.tender,
      assignedUser: data.assignedUser,
      createdByUser: data.createdByUser
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
      enableAlerts: data.enable_alerts,
      alertFrequency: data.alert_frequency,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export const teamService = new TeamService(databaseService);