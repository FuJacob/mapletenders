import React, { useState, useEffect } from 'react';
import { 
  Bookmark,
  User,
  Calendar,
  Tag,
  ChatCircle as MessageCircle,
  DotsThree as MoreHorizontal,
  Star,
  Clock,
  Warning as AlertCircle
} from '@phosphor-icons/react';
import { teamsApi, type SharedBookmark } from '../../api/teams';

interface SharedBookmarksProps {
  organizationId: string;
}

const SharedBookmarks: React.FC<SharedBookmarksProps> = ({ organizationId }) => {
  const [bookmarks, setBookmarks] = useState<SharedBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'assigned' | 'urgent'>('all');

  useEffect(() => {
    loadBookmarks();
  }, [organizationId]);

  const loadBookmarks = async () => {
    try {
      const data = await teamsApi.getSharedBookmarks(organizationId);
      setBookmarks(data);
    } catch (error) {
      console.error('Failed to load shared bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'watching':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'applied':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (filter === 'assigned') return bookmark.assignedTo;
    if (filter === 'urgent') return bookmark.priority === 'urgent' || bookmark.priority === 'high';
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border-primary p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-border-primary p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Shared Bookmarks</h3>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-sm border border-border-primary rounded px-3 py-1"
          >
            <option value="all">All</option>
            <option value="assigned">Assigned to me</option>
            <option value="urgent">High priority</option>
          </select>
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No shared bookmarks yet</h4>
          <p className="text-text-muted">
            Start collaborating by creating shared bookmarks for tender opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <div key={bookmark.id} className="border border-border-primary rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-text-primary line-clamp-1">
                      {bookmark.title || bookmark.tender?.title || 'Untitled Tender'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(bookmark.priority)}`}>
                        {bookmark.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bookmark.status)}`}>
                        {bookmark.status}
                      </span>
                    </div>
                  </div>

                  {bookmark.notes && (
                    <p className="text-sm text-text-muted mb-3 line-clamp-2">{bookmark.notes}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    {bookmark.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Assigned to {bookmark.assignedUser?.name || bookmark.assignedUser?.email}</span>
                      </div>
                    )}
                    
                    {bookmark.applicationDeadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Due {new Date(bookmark.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}

                    {bookmark.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{bookmark.tags.join(', ')}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {new Date(bookmark.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {bookmark.winProbability && (
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-text-muted">
                        Win probability: {bookmark.winProbability}%
                      </span>
                    </div>
                  )}

                  {bookmark.estimatedBidAmount && (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-medium text-green-600">
                        Estimated bid: ${bookmark.estimatedBidAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {bookmark.priority === 'urgent' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  
                  <button className="text-text-muted hover:text-text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  
                  <button className="text-text-muted hover:text-text-primary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedBookmarks;