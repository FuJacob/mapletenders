import { DatabaseService } from './databaseService';

const databaseService = new DatabaseService();
// Access the Supabase client from the service
const supabase = (databaseService as any).supabase;

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

export interface ActivityLogEntry {
  actionType: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: any;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  duration?: number;
  pageUrl?: string;
  referrerUrl?: string;
  responseTime?: number;
}

export class AnalyticsService {
  /**
   * Initialize analytics schema (ensure tables exist)
   */
  async initializeSchema(): Promise<void> {
    try {
      // Check if analytics tables exist by trying to select from user_analytics
      const { error } = await supabase
        .from('user_analytics')
        .select('id')
        .limit(1);

      if (error && error.code === '42P01') {
        // Table doesn't exist - this would need to be handled differently
        // For now, we'll just log that the schema needs to be applied manually
        console.warn('Analytics tables do not exist. Please apply the analytics schema manually.');
        console.warn('Run the SQL script in backend/database/analytics-schema.sql');
      }
    } catch (error) {
      console.warn('Could not verify analytics schema:', error);
    }
  }

  /**
   * Generate comprehensive dashboard data for a user
   */
  async generateUserDashboard(userId: string): Promise<DashboardData> {
    try {
      // Get dashboard summary using the SQL function
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_dashboard_summary', {
          target_user_id: userId,
          time_period: 'monthly'
        });

      if (summaryError) {
        console.error('Error getting dashboard summary:', summaryError);
        throw summaryError;
      }

      const summary = summaryData[0] || {};

      // Get additional financial data
      const { data: financialData, error: financialError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('period_type', 'monthly')
        .order('period_start', { ascending: false })
        .limit(1);

      if (financialError) {
        console.error('Error getting financial data:', financialError);
        throw financialError;
      }

      const financial = financialData[0] || {};

      // Get user preferences for calculations
      const { data: preferencesData, error: preferencesError } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (preferencesError && preferencesError.code !== 'PGRST116') {
        console.error('Error getting preferences:', preferencesError);
      }

      const preferences = preferencesData || { hourly_rate: 75.00 };

      return {
        tenderStats: {
          totalMatches: summary.total_opportunities || 0,
          newToday: summary.new_today || 0,
          expiringSoon: summary.expiring_soon || 0,
          bookmarked: summary.bookmarked || 0,
          applied: summary.applied || 0,
          won: summary.won || 0,
        },
        financialMetrics: {
          totalOpportunityValue: summary.total_value || 0,
          averageContractSize: financial.average_contract_value || 0,
          estimatedROI: summary.roi_percentage || 0,
          contractsWonValue: financial.contracts_won_value || 0,
          subscriptionCost: financial.subscription_cost || 0,
        },
        performanceMetrics: {
          winRate: summary.win_rate || 0,
          responseTime: summary.avg_response_time || 0,
          timesSaved: financial.estimated_time_saved_hours || 0,
          opportunitiesPerDay: Math.round((summary.total_opportunities || 0) / 30),
        },
      };
    } catch (error) {
      console.error('Error generating dashboard data:', error);
      throw new Error('Failed to generate dashboard data');
    }
  }

  /**
   * Calculate detailed ROI metrics for a user over a specific time period
   */
  async calculateROI(
    userId: string, 
    timeFrame: string = 'monthly'
  ): Promise<ROIMetrics> {
    try {
      const now = new Date();
      let startDate: Date;
      let endDate = now;

      // Calculate date range based on time frame
      switch (timeFrame) {
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'monthly':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      // Use the SQL function for ROI calculation
      const { data: roiData, error: roiError } = await supabase
        .rpc('calculate_user_roi', {
          target_user_id: userId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        });

      if (roiError) {
        console.error('Error calculating ROI:', roiError);
        throw roiError;
      }

      const roi = roiData[0] || {};

      return {
        totalInvestment: roi.total_investment || 0,
        totalReturn: roi.total_return || 0,
        roiPercentage: roi.roi_percentage || 0,
        timeSavedHours: roi.time_saved_hours || 0,
        timeSavedValue: roi.time_saved_value || 0,
        contractsWon: roi.contracts_won || 0,
        contractsWonValue: roi.contracts_won_value || 0,
      };
    } catch (error) {
      console.error('Error calculating ROI:', error);
      throw new Error('Failed to calculate ROI metrics');
    }
  }

  /**
   * Track user activity for analytics
   */
  async trackUserActivity(
    userId: string, 
    activity: ActivityLogEntry
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_activity_log')
        .insert([
          {
            user_id: userId,
            action_type: activity.actionType,
            resource_type: activity.resourceType,
            resource_id: activity.resourceId,
            metadata: activity.metadata,
            session_id: activity.sessionId,
            ip_address: activity.ipAddress,
            user_agent: activity.userAgent,
            duration_seconds: activity.duration,
            page_url: activity.pageUrl,
            referrer_url: activity.referrerUrl,
            response_time_ms: activity.responseTime,
          }
        ]);

      if (error) {
        console.error('Error tracking activity:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in trackUserActivity:', error);
      // Don't throw - analytics tracking should not break main functionality
    }
  }

  /**
   * Generate detailed performance report for a user
   */
  async generatePerformanceReport(
    userId: string,
    timeFrame: string = 'monthly'
  ): Promise<PerformanceReport> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeFrame) {
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        case 'monthly':
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
      }

      // Get aggregated analytics data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('period_type', timeFrame.replace('ly', ''))
        .gte('period_start', startDate.toISOString())
        .order('period_start', { ascending: false });

      if (analyticsError) {
        console.error('Error getting analytics data:', analyticsError);
        throw analyticsError;
      }

      // Aggregate the data
      const aggregated = analyticsData.reduce((acc: {
        searchesPerformed: number;
        opportunitiesViewed: number;
        opportunitiesBookmarked: number;
        opportunitiesApplied: number;
        opportunitiesWon: number;
        totalValue: number;
        timeSaved: number;
        responseTimeSum: number;
        responseTimeCount: number;
      }, curr: any) => ({
        searchesPerformed: acc.searchesPerformed + (curr.searches_performed || 0),
        opportunitiesViewed: acc.opportunitiesViewed + (curr.opportunities_viewed || 0),
        opportunitiesBookmarked: acc.opportunitiesBookmarked + (curr.opportunities_bookmarked || 0),
        opportunitiesApplied: acc.opportunitiesApplied + (curr.opportunities_applied || 0),
        opportunitiesWon: acc.opportunitiesWon + (curr.opportunities_won || 0),
        totalValue: acc.totalValue + (curr.total_opportunity_value || 0),
        timeSaved: acc.timeSaved + (curr.estimated_time_saved_hours || 0),
        responseTimeSum: acc.responseTimeSum + (curr.response_time_hours || 0),
        responseTimeCount: acc.responseTimeCount + (curr.response_time_hours ? 1 : 0),
      }), {
        searchesPerformed: 0,
        opportunitiesViewed: 0,
        opportunitiesBookmarked: 0,
        opportunitiesApplied: 0,
        opportunitiesWon: 0,
        totalValue: 0,
        timeSaved: 0,
        responseTimeSum: 0,
        responseTimeCount: 0,
      });

      const avgResponseTime = aggregated.responseTimeCount > 0 
        ? aggregated.responseTimeSum / aggregated.responseTimeCount 
        : 0;

      const winRate = aggregated.opportunitiesApplied > 0 
        ? (aggregated.opportunitiesWon / aggregated.opportunitiesApplied) * 100 
        : 0;

      return {
        period: timeFrame,
        metrics: {
          searchesPerformed: aggregated.searchesPerformed,
          opportunitiesViewed: aggregated.opportunitiesViewed,
          opportunitiesBookmarked: aggregated.opportunitiesBookmarked,
          opportunitiesApplied: aggregated.opportunitiesApplied,
          opportunitiesWon: aggregated.opportunitiesWon,
          avgResponseTime,
          winRate,
          totalValue: aggregated.totalValue,
          timeSaved: aggregated.timeSaved,
        },
      };
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw new Error('Failed to generate performance report');
    }
  }

  /**
   * Get market intelligence data for comparison
   */
  async getMarketIntelligence(
    industry?: string,
    province?: string
  ): Promise<any> {
    try {
      let query = supabase
        .from('market_intelligence')
        .select('*')
        .order('period_start', { ascending: false })
        .limit(10);

      if (industry) {
        query = query.eq('industry', industry);
      }

      if (province) {
        query = query.eq('province', province);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error getting market intelligence:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMarketIntelligence:', error);
      throw new Error('Failed to get market intelligence data');
    }
  }

  /**
   * Update user's dashboard preferences
   */
  async updateDashboardPreferences(
    userId: string,
    preferences: Partial<{
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
    }>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('dashboard_preferences')
        .upsert([
          {
            user_id: userId,
            enabled_widgets: preferences.enabledWidgets,
            widget_order: preferences.widgetOrder,
            default_time_period: preferences.defaultTimePeriod,
            show_financial_metrics: preferences.showFinancialMetrics,
            show_performance_charts: preferences.showPerformanceCharts,
            show_competitor_analysis: preferences.showCompetitorAnalysis,
            alert_on_new_opportunities: preferences.alertOnNewOpportunities,
            alert_on_deadlines: preferences.alertOnDeadlines,
            alert_on_won_contracts: preferences.alertOnWonContracts,
            deadline_warning_days: preferences.deadlineWarningDays,
            hourly_rate: preferences.hourlyRate,
            manual_search_hours_per_opportunity: preferences.manualSearchHoursPerOpportunity,
            include_indirect_benefits: preferences.includeIndirectBenefits,
            updated_at: new Date().toISOString(),
          }
        ], {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateDashboardPreferences:', error);
      throw new Error('Failed to update dashboard preferences');
    }
  }

  /**
   * Get user's dashboard preferences
   */
  async getDashboardPreferences(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('dashboard_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error getting preferences:', error);
        throw error;
      }

      return data || {
        enabled_widgets: ['stats', 'roi', 'timeline', 'performance', 'alerts'],
        widget_order: [1, 2, 3, 4, 5],
        default_time_period: 'monthly',
        show_financial_metrics: true,
        show_performance_charts: true,
        show_competitor_analysis: false,
        alert_on_new_opportunities: true,
        alert_on_deadlines: true,
        alert_on_won_contracts: true,
        deadline_warning_days: [7, 3, 1],
        hourly_rate: 75.00,
        manual_search_hours_per_opportunity: 2.5,
        include_indirect_benefits: true,
      };
    } catch (error) {
      console.error('Error in getDashboardPreferences:', error);
      throw new Error('Failed to get dashboard preferences');
    }
  }

  /**
   * Update tender performance tracking
   */
  async updateTenderPerformance(
    userId: string,
    tenderId: string,
    updates: Partial<{
      status: string;
      outcomeDate: Date;
      finalContractValue: number;
      estimatedCompetitors: number;
      actualCompetitors: number;
      ourBidAmount: number;
      winningBidAmount: number;
      timeToApplicationHours: number;
      preparationHours: number;
      winProbabilityScore: number;
      outcomeNotes: string;
      lessonsLearned: string;
    }>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('tender_performance')
        .upsert([
          {
            user_id: userId,
            tender_id: tenderId,
            status: updates.status,
            outcome_date: updates.outcomeDate?.toISOString(),
            final_contract_value: updates.finalContractValue,
            estimated_competitors: updates.estimatedCompetitors,
            actual_competitors: updates.actualCompetitors,
            our_bid_amount: updates.ourBidAmount,
            winning_bid_amount: updates.winningBidAmount,
            time_to_application_hours: updates.timeToApplicationHours,
            preparation_hours: updates.preparationHours,
            win_probability_score: updates.winProbabilityScore,
            outcome_notes: updates.outcomeNotes,
            lessons_learned: updates.lessonsLearned,
            updated_at: new Date().toISOString(),
          }
        ], {
          onConflict: 'user_id,tender_id'
        });

      if (error) {
        console.error('Error updating tender performance:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateTenderPerformance:', error);
      throw new Error('Failed to update tender performance');
    }
  }
}

export const analyticsService = new AnalyticsService();