import apiClient from '../client/apiClient';
import { handleApiError } from './config';

export interface DashboardData {
  tenderStats: {
    totalMatches: number;
    newToday: number;
    expiringSoon: number;
    bookmarked: number;
    applied: number;
    won: number;
  };
  financialMetrics: {
    totalOpportunityValue: number;
    averageContractSize: number;
    estimatedROI: number;
    contractsWonValue: number;
    subscriptionCost: number;
  };
  performanceMetrics: {
    winRate: number;
    responseTime: number;
    timesSaved: number;
    opportunitiesPerDay: number;
  };
}

export interface ROIMetrics {
  totalInvestment: number;
  totalReturn: number;
  roiPercentage: number;
  timeSavedHours: number;
  timeSavedValue: number;
  contractsWon: number;
  contractsWonValue: number;
}

export interface PerformanceReport {
  period: string;
  metrics: {
    searchesPerformed: number;
    opportunitiesViewed: number;
    opportunitiesBookmarked: number;
    opportunitiesApplied: number;
    opportunitiesWon: number;
    avgResponseTime: number;
    winRate: number;
    totalValue: number;
    timeSaved: number;
  };
}

export interface TimeSavingsData {
  timeFrame: string;
  opportunitiesViewed: number;
  manualSearchTimeRequired: number;
  actualTimeSpent: number;
  timeSavedHours: number;
  moneySavedCAD: number;
  hourlyRate: number;
  efficiencyPercentage: number;
}

export interface ActivityTrackingData {
  actionType: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: any;
  sessionId?: string;
  duration?: number;
  pageUrl?: string;
  referrerUrl?: string;
  responseTime?: number;
}

export interface DashboardPreferences {
  enabledWidgets: string[];
  widgetOrder: number[];
  defaultTimePeriod: string;
  showFinancialMetrics: boolean;
  showPerformanceCharts: boolean;
  showCompetitorAnalysis: boolean;
  alertOnNewOpportunities: boolean;
  alertOnDeadlines: boolean;
  alertOnWonContracts: boolean;
  deadlineWarningDays: number[];
  hourlyRate: number;
  manualSearchHoursPerOpportunity: number;
  includeIndirectBenefits: boolean;
}

class AnalyticsAPI {
  private basePath: string;

  constructor() {
    this.basePath = '/analytics';
  }

  private async request<T>(
    endpoint: string,
    options: { method?: string; data?: any } = {}
  ): Promise<T> {
    try {
      const { method = 'GET', data } = options;
      const url = `${this.basePath}${endpoint}`;
      
      let response;
      if (method === 'GET') {
        response = await apiClient.get(url);
      } else if (method === 'POST') {
        response = await apiClient.post(url, data);
      } else if (method === 'PUT') {
        response = await apiClient.put(url, data);
      } else if (method === 'DELETE') {
        response = await apiClient.delete(url);
      } else {
        throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data?.data || response.data;
    } catch (error) {
      return handleApiError(error, `Analytics API ${endpoint}`);
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/dashboard');
  }

  /**
   * Get ROI metrics for a specific time frame
   */
  async getROI(timeFrame: 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<ROIMetrics> {
    return this.request<ROIMetrics>(`/roi?timeFrame=${timeFrame}`);
  }

  /**
   * Get performance report
   */
  async getPerformanceReport(timeFrame: 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<PerformanceReport> {
    return this.request<PerformanceReport>(`/performance?timeFrame=${timeFrame}`);
  }

  /**
   * Track user activity
   */
  async trackActivity(activity: ActivityTrackingData): Promise<void> {
    await this.request('/track', {
      method: 'POST',
      data: activity,
    });
  }

  /**
   * Get recent user activities for dashboard
   */
  async getUserActivities(limit = 10): Promise<any[]> {
    const response = await this.request(`/activities?limit=${limit}`);
    return Array.isArray(response) ? response : [];
  }

  /**
   * Get market intelligence data
   */
  async getMarketIntelligence(industry?: string, province?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (industry) params.append('industry', industry);
    if (province) params.append('province', province);
    
    const queryString = params.toString();
    return this.request<any[]>(`/market-intelligence${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Get dashboard preferences
   */
  async getPreferences(): Promise<DashboardPreferences> {
    return this.request<DashboardPreferences>('/preferences');
  }

  /**
   * Update dashboard preferences
   */
  async updatePreferences(preferences: Partial<DashboardPreferences>): Promise<void> {
    await this.request('/preferences', {
      method: 'PUT',
      data: preferences,
    });
  }

  /**
   * Update tender performance tracking
   */
  async updateTenderPerformance(tenderId: string, updates: any): Promise<void> {
    await this.request(`/tender-performance/${tenderId}`, {
      method: 'PUT',
      data: updates,
    });
  }

  /**
   * Get analytics summary (multiple time periods)
   */
  async getSummary(): Promise<{
    dashboard: DashboardData;
    roi: {
      weekly: ROIMetrics;
      monthly: ROIMetrics;
      yearly: ROIMetrics;
    };
  }> {
    return this.request('/summary');
  }

  /**
   * Get time savings calculation
   */
  async getTimeSavings(timeFrame: 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<TimeSavingsData> {
    return this.request<TimeSavingsData>(`/time-savings?timeFrame=${timeFrame}`);
  }
}

export const analyticsAPI = new AnalyticsAPI();