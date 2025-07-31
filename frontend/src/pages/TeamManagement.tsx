import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Gear as Settings, 
  Envelope as Mail, 
  Shield, 
  UserPlus,
  Buildings as Building2,
  Crown,
  Star,
  Calendar,
  Bookmark
} from '@phosphor-icons/react';
import { teamsApi, type Organization, type OrganizationMember, type TeamInvitation } from '../api/teams';

interface TeamManagementProps {}

const TeamManagement: React.FC<TeamManagementProps> = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await teamsApi.getUserOrganizations();
      setOrganizations(orgs);
      if (orgs.length > 0 && !selectedOrg) {
        setSelectedOrg(orgs[0]);
        loadMembers(orgs[0].id);
      }
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async (organizationId: string) => {
    try {
      const members = await teamsApi.getOrganizationMembers(organizationId);
      setMembers(members);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const handleOrgSelect = (org: Organization) => {
    setSelectedOrg(org);
    loadMembers(org.id);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'manager':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-secondary p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 border border-border-primary">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-3 bg-white rounded-lg p-6 border border-border-primary">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Team Management</h1>
            <p className="text-text-muted">
              Manage your organizations, team members, and collaborative features
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Organization
          </button>
        </div>

        {organizations.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg border border-border-primary p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Organizations Yet</h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Create your first organization to start collaborating with your team on tender opportunities.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-accent-primary text-white px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Organization
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Organizations Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border-primary p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Organizations</h2>
                <div className="space-y-2">
                  {organizations.map((org) => (
                    <button
                      key={org.id}
                      onClick={() => handleOrgSelect(org)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedOrg?.id === org.id
                          ? 'bg-accent-primary/10 border-accent-primary text-accent-primary'
                          : 'hover:bg-gray-50 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium truncate">{org.name}</div>
                          <div className="text-sm text-text-muted flex items-center gap-1">
                            {getRoleIcon(org.role || 'member')}
                            <span className="capitalize">{org.role}</span>
                          </div>
                        </div>
                        <div className="text-xs text-text-muted">
                          {org.memberCount} members
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedOrg && (
                <div className="space-y-6">
                  {/* Organization Overview */}
                  <div className="bg-white rounded-lg border border-border-primary p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-text-primary">{selectedOrg.name}</h2>
                        {selectedOrg.description && (
                          <p className="text-text-muted mt-1">{selectedOrg.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          Invite Member
                        </button>
                        <button
                          onClick={() => navigate(`/teams/${selectedOrg.id}/settings`)}
                          className="border border-border-primary text-text-primary px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">{members.length}</div>
                            <div className="text-sm text-blue-600">Team Members</div>
                          </div>
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-green-600">Shared Bookmarks</div>
                          </div>
                          <Bookmark className="w-8 h-8 text-green-500" />
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-purple-600">Team Searches</div>
                          </div>
                          <Settings className="w-8 h-8 text-purple-500" />
                        </div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold text-orange-600">0</div>
                            <div className="text-sm text-orange-600">Calendar Events</div>
                          </div>
                          <Calendar className="w-8 h-8 text-orange-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="bg-white rounded-lg border border-border-primary p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-text-primary">Team Members</h3>
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="text-accent-primary hover:text-accent-primary/80 flex items-center gap-1 text-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border-primary">
                            <th className="text-left py-3 px-4 font-medium text-text-muted">Member</th>
                            <th className="text-left py-3 px-4 font-medium text-text-muted">Role</th>
                            <th className="text-left py-3 px-4 font-medium text-text-muted">Joined</th>
                            <th className="text-left py-3 px-4 font-medium text-text-muted">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((member) => (
                            <tr key={member.id} className="border-b border-border-primary/50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-accent-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-accent-primary">
                                      {member.user?.name?.[0] || member.user?.email[0].toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-text-primary">
                                      {member.user?.name || member.user?.email.split('@')[0]}
                                    </div>
                                    <div className="text-sm text-text-muted">{member.user?.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(member.role)}
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(member.role)}`}>
                                    {member.role}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-text-muted">
                                {new Date(member.joinedAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <button className="text-text-muted hover:text-text-primary text-sm">
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Organization Modal */}
        {showCreateModal && (
          <CreateOrganizationModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadOrganizations();
            }}
          />
        )}

        {/* Invite Member Modal */}
        {showInviteModal && selectedOrg && (
          <InviteMemberModal
            organizationId={selectedOrg.id}
            onClose={() => setShowInviteModal(false)}
            onSuccess={() => {
              setShowInviteModal(false);
              loadMembers(selectedOrg.id);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Create Organization Modal Component
const CreateOrganizationModal: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    industry: '',
    size: 'small' as Organization['size']
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await teamsApi.createOrganization(formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Create Organization</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: generateSlug(e.target.value)
                });
              }}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
            <p className="text-xs text-text-muted mt-1">mapletenders.com/team/{formData.slug}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Size
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as Organization['size'] })}
                className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="startup">Startup (1-10)</option>
                <option value="small">Small (11-50)</option>
                <option value="medium">Medium (51-200)</option>
                <option value="large">Large (201-1000)</option>
                <option value="enterprise">Enterprise (1000+)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Invite Member Modal Component
const InviteMemberModal: React.FC<{
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ organizationId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'member' as TeamInvitation['role'],
    personalMessage: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await teamsApi.inviteUser(organizationId, formData);
      onSuccess();
    } catch (error) {
      console.error('Failed to invite user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Invite Team Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as TeamInvitation['role'] })}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="viewer">Viewer - Can view tenders and reports</option>
              <option value="member">Member - Can bookmark and collaborate</option>
              <option value="manager">Manager - Can manage team bookmarks</option>
              <option value="admin">Admin - Can manage team and settings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Personal Message
            </label>
            <textarea
              value={formData.personalMessage}
              onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
              className="w-full px-3 py-2 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              rows={3}
              placeholder="Add a personal message to the invitation..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-muted hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-primary text-white px-4 py-2 rounded-lg hover:bg-accent-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamManagement;