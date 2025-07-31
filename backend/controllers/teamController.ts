import { Request, Response } from 'express';
import { teamService } from '../services/teamService';

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
      const userId = (req as any).user?.id;
      const { name, slug, description, industry, size } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!name || !slug) {
        res.status(400).json({ error: 'Organization name and slug are required' });
        return;
      }

      const organization = await teamService.createOrganization(userId, {
        name,
        slug,
        description,
        industry,
        size
      });

      res.status(201).json({
        success: true,
        data: organization
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      res.status(500).json({
        error: 'Failed to create organization',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get user's organizations
   * GET /teams/organizations
   */
  async getUserOrganizations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const organizations = await teamService.getUserOrganizations();

      res.json({
        success: true,
        data: organizations
      });
    } catch (error) {
      console.error('Error getting user organizations:', error);
      res.status(500).json({
        error: 'Failed to get organizations',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get organization details
   * GET /teams/organizations/:organizationId
   */
  async getOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const organization = await teamService.getOrganization(organizationId);
      if (!organization) {
        res.status(404).json({ error: 'Organization not found' });
        return;
      }

      res.json({
        success: true,
        data: organization
      });
    } catch (error) {
      console.error('Error getting organization:', error);
      res.status(500).json({
        error: 'Failed to get organization',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update organization
   * PUT /teams/organizations/:organizationId
   */
  async updateOrganization(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user has admin permissions
      const userRole = await teamService.getUserRole(organizationId, userId);
      if (!userRole || !['owner', 'admin'].includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      const organization = await teamService.updateOrganization(organizationId, updates);

      res.json({
        success: true,
        data: organization
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      res.status(500).json({
        error: 'Failed to update organization',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get organization members
   * GET /teams/organizations/:organizationId/members
   */
  async getOrganizationMembers(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const members = await teamService.getOrganizationMembers(organizationId);

      res.json({
        success: true,
        data: members
      });
    } catch (error) {
      console.error('Error getting organization members:', error);
      res.status(500).json({
        error: 'Failed to get organization members',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Invite user to organization
   * POST /teams/organizations/:organizationId/invitations
   */
  async inviteUser(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;
      const { email, role, personalMessage } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!email || !role) {
        res.status(400).json({ error: 'Email and role are required' });
        return;
      }

      // Check if user has permissions to invite
      const userRole = await teamService.getUserRole(organizationId, userId);
      if (!userRole || !['owner', 'admin', 'manager'].includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions to invite users' });
        return;
      }

      const invitation = await teamService.inviteUserToOrganization(
        organizationId,
        userId,
        email,
        role,
        personalMessage
      );

      res.status(201).json({
        success: true,
        data: invitation,
        message: 'Invitation sent successfully'
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      res.status(500).json({
        error: 'Failed to invite user',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Accept team invitation
   * POST /teams/invitations/:token/accept
   */
  async acceptInvitation(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const member = await teamService.acceptInvitation(token, userId);

      res.json({
        success: true,
        data: member,
        message: 'Invitation accepted successfully'
      });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      res.status(400).json({
        error: 'Failed to accept invitation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
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
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!role) {
        res.status(400).json({ error: 'Role is required' });
        return;
      }

      // Check if user has permissions to update roles
      const userRole = await teamService.getUserRole(organizationId, userId);
      if (!userRole || !['owner', 'admin'].includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      const member = await teamService.updateMemberRole(organizationId, memberId, role);

      res.json({
        success: true,
        data: member
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      res.status(500).json({
        error: 'Failed to update member role',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Remove member from organization
   * DELETE /teams/organizations/:organizationId/members/:memberId
   */
  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId, memberId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user has permissions to remove members
      const userRole = await teamService.getUserRole(organizationId, userId);
      if (!userRole || !['owner', 'admin'].includes(userRole)) {
        res.status(403).json({ error: 'Insufficient permissions' });
        return;
      }

      await teamService.removeMember(organizationId, memberId);

      res.json({
        success: true,
        message: 'Member removed successfully'
      });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({
        error: 'Failed to remove member',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create shared bookmark
   * POST /teams/organizations/:organizationId/bookmarks
   */
  async createSharedBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;
      const bookmarkData = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      if (!bookmarkData.tenderNoticeId) {
        res.status(400).json({ error: 'Tender notice ID is required' });
        return;
      }

      const bookmark = await teamService.createSharedBookmark(organizationId, userId, bookmarkData);

      res.status(201).json({
        success: true,
        data: bookmark
      });
    } catch (error) {
      console.error('Error creating shared bookmark:', error);
      res.status(500).json({
        error: 'Failed to create shared bookmark',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get shared bookmarks
   * GET /teams/organizations/:organizationId/bookmarks
   */
  async getSharedBookmarks(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const bookmarks = await teamService.getSharedBookmarks(organizationId);

      res.json({
        success: true,
        data: bookmarks
      });
    } catch (error) {
      console.error('Error getting shared bookmarks:', error);
      res.status(500).json({
        error: 'Failed to get shared bookmarks',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update shared bookmark
   * PUT /teams/bookmarks/:bookmarkId
   */
  async updateSharedBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { bookmarkId } = req.params;
      const userId = (req as any).user?.id;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // TODO: Add permission check for bookmark access

      const bookmark = await teamService.updateSharedBookmark(bookmarkId, updates);

      res.json({
        success: true,
        data: bookmark
      });
    } catch (error) {
      console.error('Error updating shared bookmark:', error);
      res.status(500).json({
        error: 'Failed to update shared bookmark',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Create team saved search
   * POST /teams/organizations/:organizationId/saved-searches
   */
  async createTeamSavedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;
      const searchData = req.body;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      if (!searchData.name || !searchData.searchQuery) {
        res.status(400).json({ error: 'Name and search query are required' });
        return;
      }

      const savedSearch = await teamService.createTeamSavedSearch(organizationId, userId, searchData);

      res.status(201).json({
        success: true,
        data: savedSearch
      });
    } catch (error) {
      console.error('Error creating team saved search:', error);
      res.status(500).json({
        error: 'Failed to create team saved search',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get team saved searches
   * GET /teams/organizations/:organizationId/saved-searches
   */
  async getTeamSavedSearches(req: Request, res: Response): Promise<void> {
    try {
      const { organizationId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // Check if user is member
      const isMember = await teamService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const savedSearches = await teamService.getTeamSavedSearches(organizationId, userId);

      res.json({
        success: true,
        data: savedSearches
      });
    } catch (error) {
      console.error('Error getting team saved searches:', error);
      res.status(500).json({
        error: 'Failed to get team saved searches',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const teamController = new TeamController();