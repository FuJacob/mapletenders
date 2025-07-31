export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          status: string | null
          tender_notice_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          tender_notice_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          tender_notice_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_tender_notice_id_fkey"
            columns: ["tender_notice_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_connections: {
        Row: {
          access_token: string
          account_email: string
          calendar_id: string | null
          calendar_name: string | null
          created_at: string | null
          enabled: boolean | null
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          sync_settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          account_email: string
          calendar_id?: string | null
          calendar_name?: string | null
          created_at?: string | null
          enabled?: boolean | null
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          account_email?: string
          calendar_id?: string | null
          calendar_name?: string | null
          created_at?: string | null
          enabled?: boolean | null
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          sync_settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          calendar_connection_id: string
          created_at: string | null
          description: string | null
          end_time: string
          external_event_id: string | null
          id: string
          last_sync_at: string | null
          location: string | null
          reminders: number[] | null
          start_time: string
          status: string | null
          tender_id: string
          title: string
          url: string | null
          user_id: string
        }
        Insert: {
          calendar_connection_id: string
          created_at?: string | null
          description?: string | null
          end_time: string
          external_event_id?: string | null
          id?: string
          last_sync_at?: string | null
          location?: string | null
          reminders?: number[] | null
          start_time: string
          status?: string | null
          tender_id: string
          title: string
          url?: string | null
          user_id: string
        }
        Update: {
          calendar_connection_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string
          external_event_id?: string | null
          id?: string
          last_sync_at?: string | null
          location?: string | null
          reminders?: number[] | null
          start_time?: string
          status?: string | null
          tender_id?: string
          title?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_connection_id_fkey"
            columns: ["calendar_connection_id"]
            isOneToOne: false
            referencedRelation: "calendar_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_provider_settings: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          enabled: boolean | null
          features: Json | null
          icon_url: string | null
          oauth_settings: Json | null
          provider: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          enabled?: boolean | null
          features?: Json | null
          icon_url?: string | null
          oauth_settings?: Json | null
          provider: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          enabled?: boolean | null
          features?: Json | null
          icon_url?: string | null
          oauth_settings?: Json | null
          provider?: string
        }
        Relationships: []
      }
      calendar_sync_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          events_created: number | null
          events_deleted: number | null
          events_updated: number | null
          id: string
          last_sync_at: string
          provider: string
          sync_status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          events_created?: number | null
          events_deleted?: number | null
          events_updated?: number | null
          id?: string
          last_sync_at: string
          provider: string
          sync_status: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          events_created?: number | null
          events_deleted?: number | null
          events_updated?: number | null
          id?: string
          last_sync_at?: string
          provider?: string
          sync_status?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_preferences: {
        Row: {
          alert_on_deadlines: boolean | null
          alert_on_new_opportunities: boolean | null
          alert_on_won_contracts: boolean | null
          created_at: string | null
          deadline_warning_days: number[] | null
          default_time_period: string | null
          enabled_widgets: string[] | null
          hourly_rate: number | null
          id: string
          include_indirect_benefits: boolean | null
          manual_search_hours_per_opportunity: number | null
          show_competitor_analysis: boolean | null
          show_financial_metrics: boolean | null
          show_performance_charts: boolean | null
          updated_at: string | null
          user_id: string | null
          widget_order: number[] | null
        }
        Insert: {
          alert_on_deadlines?: boolean | null
          alert_on_new_opportunities?: boolean | null
          alert_on_won_contracts?: boolean | null
          created_at?: string | null
          deadline_warning_days?: number[] | null
          default_time_period?: string | null
          enabled_widgets?: string[] | null
          hourly_rate?: number | null
          id?: string
          include_indirect_benefits?: boolean | null
          manual_search_hours_per_opportunity?: number | null
          show_competitor_analysis?: boolean | null
          show_financial_metrics?: boolean | null
          show_performance_charts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          widget_order?: number[] | null
        }
        Update: {
          alert_on_deadlines?: boolean | null
          alert_on_new_opportunities?: boolean | null
          alert_on_won_contracts?: boolean | null
          created_at?: string | null
          deadline_warning_days?: number[] | null
          default_time_period?: string | null
          enabled_widgets?: string[] | null
          hourly_rate?: number | null
          id?: string
          include_indirect_benefits?: boolean | null
          manual_search_hours_per_opportunity?: number | null
          show_competitor_analysis?: boolean | null
          show_financial_metrics?: boolean | null
          show_performance_charts?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          widget_order?: number[] | null
        }
        Relationships: []
      }
      deadline_alerts: {
        Row: {
          alert_date: string
          alert_type: string
          channels: string[] | null
          closing_date: string
          created_at: string | null
          id: string
          sent: boolean | null
          tender_id: string
          user_id: string
        }
        Insert: {
          alert_date: string
          alert_type: string
          channels?: string[] | null
          closing_date: string
          created_at?: string | null
          id?: string
          sent?: boolean | null
          tender_id: string
          user_id: string
        }
        Update: {
          alert_date?: string
          alert_type?: string
          channels?: string[] | null
          closing_date?: string
          created_at?: string | null
          id?: string
          sent?: boolean | null
          tender_id?: string
          user_id?: string
        }
        Relationships: []
      }
      live_demo_requests: {
        Row: {
          email: string
        }
        Insert: {
          email: string
        }
        Update: {
          email?: string
        }
        Relationships: []
      }
      market_intelligence: {
        Row: {
          average_bid_spread_percentage: number | null
          average_competitors: number | null
          average_decision_time_days: number | null
          average_opportunity_value: number | null
          average_procurement_cycle_days: number | null
          calculated_at: string | null
          created_at: string | null
          growth_rate_percentage: number | null
          id: string
          industry: string | null
          median_opportunity_value: number | null
          opportunity_count_trend: number | null
          period_end: string
          period_start: string
          procurement_method: string | null
          province: string | null
          total_opportunities: number | null
          total_value: number | null
          value_trend_percentage: number | null
        }
        Insert: {
          average_bid_spread_percentage?: number | null
          average_competitors?: number | null
          average_decision_time_days?: number | null
          average_opportunity_value?: number | null
          average_procurement_cycle_days?: number | null
          calculated_at?: string | null
          created_at?: string | null
          growth_rate_percentage?: number | null
          id?: string
          industry?: string | null
          median_opportunity_value?: number | null
          opportunity_count_trend?: number | null
          period_end: string
          period_start: string
          procurement_method?: string | null
          province?: string | null
          total_opportunities?: number | null
          total_value?: number | null
          value_trend_percentage?: number | null
        }
        Update: {
          average_bid_spread_percentage?: number | null
          average_competitors?: number | null
          average_decision_time_days?: number | null
          average_opportunity_value?: number | null
          average_procurement_cycle_days?: number | null
          calculated_at?: string | null
          created_at?: string | null
          growth_rate_percentage?: number | null
          id?: string
          industry?: string | null
          median_opportunity_value?: number | null
          opportunity_count_trend?: number | null
          period_end?: string
          period_start?: string
          procurement_method?: string | null
          province?: string | null
          total_opportunities?: number | null
          total_value?: number | null
          value_trend_percentage?: number | null
        }
        Relationships: []
      }
      metadata: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      notification_channels: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          name: string
          settings: Json | null
          type: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id: string
          name: string
          settings?: Json | null
          type: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          name?: string
          settings?: Json | null
          type?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          channels: string[] | null
          created_at: string | null
          enabled: boolean | null
          frequency: string
          id: string
          settings: Json | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          frequency: string
          id?: string
          settings?: Json | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          enabled?: boolean | null
          frequency?: string
          id?: string
          settings?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channels: string[] | null
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          scheduled_for: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          size: string | null
          slug: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          slug: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          slug?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          limits: Json | null
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          stripe_product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          stripe_product_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          company_size: string | null
          created_at: string | null
          government_experience: string | null
          id: string
          industry: string | null
          onboarding_completed: boolean | null
          primary_services: string[] | null
          service_regions: string[] | null
          typical_contract_size: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          government_experience?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          primary_services?: string[] | null
          service_regions?: string[] | null
          typical_contract_size?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          government_experience?: string | null
          id?: string
          industry?: string | null
          onboarding_completed?: boolean | null
          primary_services?: string[] | null
          service_regions?: string[] | null
          typical_contract_size?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rfp_analysis: {
        Row: {
          created_at: string | null
          data: string | null
          id: number
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id: number
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: number
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          alert_frequency: string | null
          created_at: string | null
          favorite: boolean | null
          filters: Json | null
          id: string
          is_alert: boolean | null
          last_run: string | null
          name: string
          query: string
          result_count: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alert_frequency?: string | null
          created_at?: string | null
          favorite?: boolean | null
          filters?: Json | null
          id?: string
          is_alert?: boolean | null
          last_run?: string | null
          name: string
          query: string
          result_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alert_frequency?: string | null
          created_at?: string | null
          favorite?: boolean | null
          filters?: Json | null
          id?: string
          is_alert?: boolean | null
          last_run?: string | null
          name?: string
          query?: string
          result_count?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      search_performance: {
        Row: {
          id: string
          result_count: number
          search_id: string
          search_time_ms: number
          timestamp: string | null
          user_id: string
        }
        Insert: {
          id?: string
          result_count?: number
          search_id: string
          search_time_ms?: number
          timestamp?: string | null
          user_id: string
        }
        Update: {
          id?: string
          result_count?: number
          search_id?: string
          search_time_ms?: number
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shared_bookmarks: {
        Row: {
          application_deadline: string | null
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          estimated_bid_amount: number | null
          id: string
          notes: string | null
          organization_id: string | null
          priority: string | null
          status: string | null
          tags: string[] | null
          tender_id: string | null
          title: string | null
          updated_at: string | null
          win_probability: number | null
        }
        Insert: {
          application_deadline?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_bid_amount?: number | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          tender_id?: string | null
          title?: string | null
          updated_at?: string | null
          win_probability?: number | null
        }
        Update: {
          application_deadline?: string | null
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_bid_amount?: number | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          priority?: string | null
          status?: string | null
          tags?: string[] | null
          tender_id?: string | null
          title?: string | null
          updated_at?: string | null
          win_probability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_bookmarks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_bookmarks_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string | null
          usage_limits: Json | null
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string | null
          personal_message: string | null
          role: string | null
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          personal_message?: string | null
          role?: string | null
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string | null
          personal_message?: string | null
          role?: string | null
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_saved_searches: {
        Row: {
          alert_frequency: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          enable_alerts: boolean | null
          id: string
          is_public: boolean | null
          name: string
          organization_id: string | null
          search_query: Json
          updated_at: string | null
        }
        Insert: {
          alert_frequency?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enable_alerts?: boolean | null
          id?: string
          is_public?: boolean | null
          name: string
          organization_id?: string | null
          search_query: Json
          updated_at?: string | null
        }
        Update: {
          alert_frequency?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enable_alerts?: boolean | null
          id?: string
          is_public?: boolean | null
          name?: string
          organization_id?: string | null
          search_query?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_saved_searches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_ai_summaries: {
        Row: {
          id: string
          summary: Json
        }
        Insert: {
          id: string
          summary: Json
        }
        Update: {
          id?: string
          summary?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tender_ai_summaries_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_performance: {
        Row: {
          actual_competitors: number | null
          applied_at: string | null
          bookmarked_at: string | null
          closing_date: string | null
          created_at: string | null
          estimated_competitors: number | null
          final_contract_value: number | null
          first_viewed_at: string | null
          id: string
          lessons_learned: string | null
          our_bid_amount: number | null
          outcome_date: string | null
          outcome_notes: string | null
          preparation_hours: number | null
          status: string | null
          tender_id: string | null
          tender_source: string | null
          tender_title: string | null
          tender_value: number | null
          time_to_application_hours: number | null
          updated_at: string | null
          user_id: string | null
          win_probability_score: number | null
          winning_bid_amount: number | null
        }
        Insert: {
          actual_competitors?: number | null
          applied_at?: string | null
          bookmarked_at?: string | null
          closing_date?: string | null
          created_at?: string | null
          estimated_competitors?: number | null
          final_contract_value?: number | null
          first_viewed_at?: string | null
          id?: string
          lessons_learned?: string | null
          our_bid_amount?: number | null
          outcome_date?: string | null
          outcome_notes?: string | null
          preparation_hours?: number | null
          status?: string | null
          tender_id?: string | null
          tender_source?: string | null
          tender_title?: string | null
          tender_value?: number | null
          time_to_application_hours?: number | null
          updated_at?: string | null
          user_id?: string | null
          win_probability_score?: number | null
          winning_bid_amount?: number | null
        }
        Update: {
          actual_competitors?: number | null
          applied_at?: string | null
          bookmarked_at?: string | null
          closing_date?: string | null
          created_at?: string | null
          estimated_competitors?: number | null
          final_contract_value?: number | null
          first_viewed_at?: string | null
          id?: string
          lessons_learned?: string | null
          our_bid_amount?: number | null
          outcome_date?: string | null
          outcome_notes?: string | null
          preparation_hours?: number | null
          status?: string | null
          tender_id?: string | null
          tender_source?: string | null
          tender_title?: string | null
          tender_value?: number | null
          time_to_application_hours?: number | null
          updated_at?: string | null
          user_id?: string | null
          win_probability_score?: number | null
          winning_bid_amount?: number | null
        }
        Relationships: []
      }
      tenders: {
        Row: {
          category_primary: string | null
          closing_date: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contract_start_date: string | null
          contracting_entity_city: string | null
          contracting_entity_country: string | null
          contracting_entity_name: string | null
          contracting_entity_province: string | null
          created_at: string | null
          currency: string | null
          delivery_location: string | null
          description: string | null
          embedding: string | null
          embedding_input: string | null
          estimated_value_min: number | null
          gsin: string | null
          id: string
          last_scraped_at: string | null
          plan_takers_count: number | null
          procurement_method: string | null
          procurement_type: string | null
          published_date: string | null
          source: string
          source_reference: string | null
          source_url: string | null
          status: string | null
          submissions_count: number | null
          summary: string | null
          title: string
          unspsc: string | null
          updated_at: string | null
        }
        Insert: {
          category_primary?: string | null
          closing_date?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_start_date?: string | null
          contracting_entity_city?: string | null
          contracting_entity_country?: string | null
          contracting_entity_name?: string | null
          contracting_entity_province?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_location?: string | null
          description?: string | null
          embedding?: string | null
          embedding_input?: string | null
          estimated_value_min?: number | null
          gsin?: string | null
          id: string
          last_scraped_at?: string | null
          plan_takers_count?: number | null
          procurement_method?: string | null
          procurement_type?: string | null
          published_date?: string | null
          source: string
          source_reference?: string | null
          source_url?: string | null
          status?: string | null
          submissions_count?: number | null
          summary?: string | null
          title: string
          unspsc?: string | null
          updated_at?: string | null
        }
        Update: {
          category_primary?: string | null
          closing_date?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contract_start_date?: string | null
          contracting_entity_city?: string | null
          contracting_entity_country?: string | null
          contracting_entity_name?: string | null
          contracting_entity_province?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_location?: string | null
          description?: string | null
          embedding?: string | null
          embedding_input?: string | null
          estimated_value_min?: number | null
          gsin?: string | null
          id?: string
          last_scraped_at?: string | null
          plan_takers_count?: number | null
          procurement_method?: string | null
          procurement_type?: string | null
          published_date?: string | null
          source?: string
          source_reference?: string | null
          source_url?: string | null
          status?: string | null
          submissions_count?: number | null
          summary?: string | null
          title?: string
          unspsc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          page_url: string | null
          referrer_url: string | null
          resource_id: string | null
          resource_type: string | null
          response_time_ms: number | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_url?: string | null
          referrer_url?: string | null
          resource_id?: string | null
          resource_type?: string | null
          response_time_ms?: number | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          page_url?: string | null
          referrer_url?: string | null
          resource_id?: string | null
          resource_type?: string | null
          response_time_ms?: number | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_analytics: {
        Row: {
          ai_summaries_generated: number | null
          average_contract_value: number | null
          calculated_at: string | null
          contracts_won_value: number | null
          created_at: string | null
          efficiency_score: number | null
          estimated_roi_percentage: number | null
          estimated_time_saved_hours: number | null
          id: string
          manual_search_hours_avoided: number | null
          notifications_acted_upon: number | null
          notifications_received: number | null
          opportunities_applied: number | null
          opportunities_bookmarked: number | null
          opportunities_lost: number | null
          opportunities_viewed: number | null
          opportunities_won: number | null
          period_end: string
          period_start: string
          period_type: string
          response_time_hours: number | null
          searches_performed: number | null
          subscription_cost: number | null
          time_spent_minutes: number | null
          total_opportunity_value: number | null
          updated_at: string | null
          user_id: string | null
          win_rate: number | null
          won_opportunity_value: number | null
        }
        Insert: {
          ai_summaries_generated?: number | null
          average_contract_value?: number | null
          calculated_at?: string | null
          contracts_won_value?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          estimated_roi_percentage?: number | null
          estimated_time_saved_hours?: number | null
          id?: string
          manual_search_hours_avoided?: number | null
          notifications_acted_upon?: number | null
          notifications_received?: number | null
          opportunities_applied?: number | null
          opportunities_bookmarked?: number | null
          opportunities_lost?: number | null
          opportunities_viewed?: number | null
          opportunities_won?: number | null
          period_end: string
          period_start: string
          period_type: string
          response_time_hours?: number | null
          searches_performed?: number | null
          subscription_cost?: number | null
          time_spent_minutes?: number | null
          total_opportunity_value?: number | null
          updated_at?: string | null
          user_id?: string | null
          win_rate?: number | null
          won_opportunity_value?: number | null
        }
        Update: {
          ai_summaries_generated?: number | null
          average_contract_value?: number | null
          calculated_at?: string | null
          contracts_won_value?: number | null
          created_at?: string | null
          efficiency_score?: number | null
          estimated_roi_percentage?: number | null
          estimated_time_saved_hours?: number | null
          id?: string
          manual_search_hours_avoided?: number | null
          notifications_acted_upon?: number | null
          notifications_received?: number | null
          opportunities_applied?: number | null
          opportunities_bookmarked?: number | null
          opportunities_lost?: number | null
          opportunities_viewed?: number | null
          opportunities_won?: number | null
          period_end?: string
          period_start?: string
          period_type?: string
          response_time_hours?: number | null
          searches_performed?: number | null
          subscription_cost?: number | null
          time_spent_minutes?: number | null
          total_opportunity_value?: number | null
          updated_at?: string | null
          user_id?: string | null
          win_rate?: number | null
          won_opportunity_value?: number | null
        }
        Relationships: []
      }
      user_notification_channels: {
        Row: {
          channel_id: string
          created_at: string | null
          enabled: boolean | null
          id: string
          settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_channels_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "notification_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_searches: {
        Row: {
          created_at: string | null
          filters: Json | null
          id: string
          results_count: number | null
          search_query: string
          search_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query: string
          search_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filters?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string
          search_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_user_roi: {
        Args: { target_user_id: string; start_date: string; end_date: string }
        Returns: {
          total_investment: number
          total_return: number
          roi_percentage: number
          time_saved_hours: number
          time_saved_value: number
          contracts_won: number
          contracts_won_value: number
        }[]
      }
      cleanup_calendar_sync_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      create_organization: {
        Args: {
          p_name: string
          p_slug: string
          p_description?: string
          p_industry?: string
          p_size?: string
        }
        Returns: string
      }
      get_dashboard_summary: {
        Args: { target_user_id: string; time_period?: string }
        Returns: {
          total_opportunities: number
          new_today: number
          expiring_soon: number
          bookmarked: number
          applied: number
          won: number
          total_value: number
          win_rate: number
          avg_response_time: number
          roi_percentage: number
        }[]
      }
      get_upcoming_calendar_events: {
        Args: { p_user_id: string; p_days_ahead?: number }
        Returns: {
          event_id: string
          tender_id: string
          title: string
          description: string
          start_time: string
          end_time: string
          provider: string
          sync_status: string
        }[]
      }
      get_user_calendar_sync_status: {
        Args: { p_user_id: string }
        Returns: {
          provider: string
          last_sync_at: string
          sync_status: string
          total_events: number
          enabled_connections: number
        }[]
      }
      get_user_organizations: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          slug: string
          description: string
          industry: string
          size: string
          logo_url: string
          website_url: string
          created_at: string
          updated_at: string
          role: string
          member_count: number
        }[]
      }
      match_tenders_by_vector: {
        Args: {
          query_embedding: string
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          precomputed_summary: string
          similarity: number
        }[]
      }
      try_acquire_refresh_lock: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
