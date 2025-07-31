import express from 'express';
import { teamController } from '../controllers/teamController';
import { authenticateUser } from '../middleware/authenticateUser';

const router = express.Router();

// All team routes require authentication
router.use(authenticateUser);

// Organization management
router.post('/organizations', teamController.createOrganization);
router.get('/organizations', teamController.getUserOrganizations);
router.get('/organizations/:organizationId', teamController.getOrganization);
router.put('/organizations/:organizationId', teamController.updateOrganization);

// Member management
router.get('/organizations/:organizationId/members', teamController.getOrganizationMembers);
router.post('/organizations/:organizationId/invitations', teamController.inviteUser);
router.put('/organizations/:organizationId/members/:memberId', teamController.updateMemberRole);
router.delete('/organizations/:organizationId/members/:memberId', teamController.removeMember);

// Invitation handling
router.post('/invitations/:token/accept', teamController.acceptInvitation);

// Shared bookmarks
router.post('/organizations/:organizationId/bookmarks', teamController.createSharedBookmark);
router.get('/organizations/:organizationId/bookmarks', teamController.getSharedBookmarks);
router.put('/bookmarks/:bookmarkId', teamController.updateSharedBookmark);

// Team saved searches
router.post('/organizations/:organizationId/saved-searches', teamController.createTeamSavedSearch);
router.get('/organizations/:organizationId/saved-searches', teamController.getTeamSavedSearches);

export default router;