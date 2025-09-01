import { Request, Response } from 'express';
import { teamService } from '../services/teamService';

export interface AuthResult {
  userId: string;
  success: boolean;
}

export interface AuthWithOrgResult extends AuthResult {
  isMember: boolean;
}

/**
 * Validate user authentication
 */
export const validateAuth = (req: Request, res: Response): AuthResult => {
  const userId = (req as any).user?.id;

  if (!userId) {
    res.status(401).json({ success: false, error: 'User not authenticated' });
    return { userId: '', success: false };
  }

  return { userId, success: true };
};

/**
 * Validate user authentication and organization membership
 */
export const validateAuthAndOrgMembership = async (
  req: Request,
  res: Response,
  organizationId: string
): Promise<AuthWithOrgResult> => {
  const authResult = validateAuth(req, res);
  if (!authResult.success) {
    return { ...authResult, isMember: false };
  }

  try {
    const isMember = await teamService.isOrganizationMember(organizationId, authResult.userId);
    if (!isMember) {
      res.status(403).json({ success: false, error: 'Access denied' });
      return { ...authResult, isMember: false };
    }

    return { ...authResult, isMember: true };
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify membership' });
    return { ...authResult, isMember: false };
  }
};

/**
 * Validate user has admin permissions in organization (owner/admin only)
 */
export const validateOrgAdminPermissions = async (
  req: Request,
  res: Response,
  organizationId: string
): Promise<AuthWithOrgResult> => {
  const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
  if (!memberResult.success || !memberResult.isMember) {
    return memberResult;
  }

  try {
    const userRole = await teamService.getUserRole(organizationId, memberResult.userId);
    if (!userRole || !['owner', 'admin'].includes(userRole)) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return { ...memberResult, isMember: false };
    }

    return memberResult;
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify permissions' });
    return { ...memberResult, isMember: false };
  }
};

/**
 * Validate user has invite permissions in organization (owner/admin/manager)
 */
export const validateOrgInvitePermissions = async (
  req: Request,
  res: Response,
  organizationId: string
): Promise<AuthWithOrgResult> => {
  const memberResult = await validateAuthAndOrgMembership(req, res, organizationId);
  if (!memberResult.success || !memberResult.isMember) {
    return memberResult;
  }

  try {
    const userRole = await teamService.getUserRole(organizationId, memberResult.userId);
    if (!userRole || !['owner', 'admin', 'manager'].includes(userRole)) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions to invite users' 
      });
      return { ...memberResult, isMember: false };
    }

    return memberResult;
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to verify permissions' });
    return { ...memberResult, isMember: false };
  }
};