import { Request, Response } from 'express';
import { teamService } from '../services/teamService';
import { handleControllerError } from '../utils/errorHandler';
import { 
  validateAuth, 
  validateAuthAndOrgMembership, 
  validateOrgAdminPermissions,
  validateOrgInvitePermissions 
} from '../utils/authUtils';
import type {
  CreateOrganizationRequest,
  InviteUserRequest,
  CreateSharedBookmarkRequest,
  CreateTeamSavedSearchRequest
} from '../types/teams';

/**
 * Team Controller
 * Handles team/organization management endpoints
 */
export class TeamController {
  /**
   * Create a new organization
   * POST /teams/organizations
   */
  async createOrganization(req: Request, res: Response): Promise<void> {
    try {
      const authResult = validateAuth(req, res);
      if (!authResult.success) return;

      const organizationData: CreateOrganizationRequest = req.body;

      if (!organizationData.name || !organizationData.slug) {
        res.status(400).json({ 
          success: false, 
          error: 'Organization name and slug are required' 
        });
        return;
      }

      const organization = await teamService.createOrganization(authResult.userId, organizationData);

      res.status(201).json({
        success: true,
        data: organization
      });
    } catch (error) {
      handleControllerError(error, res, 'createOrganization');
    }
  }

  /**
   * Get user's organizations
   * GET /teams/organizations
   */
  async getUserOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const authResult = validateAuth(req, res);
      if (!authResult.success) return;

      const organizations = await teamService.getUserOrganizations();

      res.json({
        success: true,
        data: organizations
      });
    } catch (error) {
      handleControllerError(error, res, 'getUserOrganizations');
    }
  }

  /**
   * Get organization details
   * GET /teams/organizations/:organizationId
   */
  async getOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      
      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      const organization = await teamService.getOrganization(organizationId);
      if (!organization) {
        res.status(404).json({ success: false, error: 'Organization not found' });
        return;
      }

      res.json({
        success: true,
        data: organization
      });
    } catch (error) {
      handleControllerError(error, res, 'getOrganization');
    }
  }

  /**
   * Update organization
   * PUT /teams/organizations/:organizationId
   */
  async updateOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const updates = req.body;

      const adminResult = await validateOrgAdminPermissions(req, res, organizationId);
      if (!adminResult.success || !adminResult.isMember) return;

      const organization = await teamService.updateOrganization(organizationId, updates);

      res.json({
        success: true,
        data: organization
      });
    } catch (error) {
      handleControllerError(error, res, 'updateOrganization');
    }
  }

  /**
   * Get organization members
   * GET /teams/organizations/:organizationId/members
   */
  async getOrganizationMembers(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      
      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      const members = await teamService.getOrganizationMembers(organizationId);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      handleControllerError(error, res, 'getOrganizationMembers');
    }
  }

  /**
   * Invite user to organization
   * POST /teams/organizations/:organizationId/invitations
   */
  async inviteUser(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const inviteData: InviteUserRequest = req.body;

      const inviteResult = await validateOrgInvitePermissions(req, res, organizationId);
      if (!inviteResult.success || !inviteResult.isMember) return;

      if (!inviteData.email || !inviteData.role) {
        res.status(400).json({ 
          success: false, 
          error: 'Email and role are required' 
        });
        return;
      }

      const invitation = await teamService.inviteUserToOrganization(
        organizationId,
        inviteResult.userId,
        inviteData
      );

      res.status(201).json({
        success: true,
        data: invitation,
        message: 'Invitation sent successfully'
      });
    } catch (error) {
      handleControllerError(error, res, 'inviteUser');
    }
  }

  /**
   * Accept team invitation
   * POST /teams/invitations/:token/accept
   */
  async acceptInvitation(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      
      const authResult = validateAuth(req, res);
      if (!authResult.success) return;

      const member = await teamService.acceptInvitation(token, authResult.userId);

      res.json({
        success: true,
        data: member,
        message: 'Invitation accepted successfully'
      });
    } catch (error) {
      handleControllerError(error, res, 'acceptInvitation');
    }
  }

  /**
   * Update member role
   * PUT /teams/organizations/:organizationId/members/:memberId
   */
  async updateMemberRole(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId, memberId } = req.params;
      const { role } = req.body;

      const adminResult = await validateOrgAdminPermissions(req, res, organizationId);
      if (!adminResult.success || !adminResult.isMember) return;

      if (!role) {
        res.status(400).json({ 
          success: false, 
          error: 'Role is required' 
        });
        return;
      }

      const member = await teamService.updateMemberRole(organizationId, memberId, role);

      res.json({
        success: true,
        data: member
      });
    } catch (error) {
      handleControllerError(error, res, 'updateMemberRole');
    }
  }

  /**
   * Remove member from organization
   * DELETE /teams/organizations/:organizationId/members/:memberId
   */
  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId, memberId } = req.params;

      const adminResult = await validateOrgAdminPermissions(req, res, organizationId);
      if (!adminResult.success || !adminResult.isMember) return;

      await teamService.removeMember(organizationId, memberId);

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      handleControllerError(error, res, 'removeMember');
    }
  }

  /**
   * Create shared bookmark
   * POST /teams/organizations/:organizationId/bookmarks
   */
  async createSharedBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const bookmarkData: CreateSharedBookmarkRequest = req.body;

      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      if (!bookmarkData.tenderId) {
        res.status(400).json({ 
          success: false, 
          error: 'Tender ID is required' 
        });
        return;
      }

      const bookmark = await teamService.createSharedBookmark(organizationId, memberResult.userId, bookmarkData);

      res.status(201).json({
        success: true,
        data: bookmark
      });
    } catch (error) {
      handleControllerError(error, res, 'createSharedBookmark');
    }
  }

  /**
   * Get shared bookmarks
   * GET /teams/organizations/:organizationId/bookmarks
   */
  async getSharedBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;

      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      const bookmarks = await teamService.getSharedBookmarks(organizationId);

      res.json({
        success: true,
        data: bookmarks
      });
    } catch (error) {
      handleControllerError(error, res, 'getSharedBookmarks');
    }
  }

  /**
   * Update shared bookmark
   * PUT /teams/bookmarks/:bookmarkId
   */
  async updateSharedBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { bookmarkId } = req.params;
      const updates = req.body;

      const authResult = validateAuth(req, res);
      if (!authResult.success) return;

      // TODO: Add permission check for bookmark access

      const bookmark = await teamService.updateSharedBookmark(bookmarkId, updates);

      res.json({
        success: true,
        data: bookmark
      });
    } catch (error) {
      handleControllerError(error, res, 'updateSharedBookmark');
    }
  }

  /**
   * Create team saved search
   * POST /teams/organizations/:organizationId/saved-searches
   */
  async createTeamSavedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const searchData = req.body;

      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      if (!searchData.name || !searchData.searchQuery) {
        res.status(400).json({ 
          success: false, 
          error: 'Name and search query are required' 
        });
        return;
      }

      const savedSearch = await teamService.createTeamSavedSearch(organizationId, memberResult.userId, searchData);

      res.status(201).json({
        success: true,
        data: savedSearch
      });
    } catch (error) {
      handleControllerError(error, res, 'createTeamSavedSearch');
    }
  }

  /**
   * Get team saved searches
   * GET /teams/organizations/:organizationId/saved-searches
   */
  async getTeamSavedSearches(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;

      const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
      if (!memberResult.success || !memberResult.isMember) return;

      const savedSearches = await teamService.getTeamSavedSearches(organizationId, memberResult.userId);

      res.json({
        success: true,
        data: savedSearches
      });
    } catch (error) {
      handleControllerError(error, res, 'getTeamSavedSearches');
    }
  }
}

export const teamController = new TeamController();