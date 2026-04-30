export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      artist_follows: {
        Row: {
          artist_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_follows_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          active: boolean
          bio: string | null
          created_at: string
          genre: string
          id: string
          image_url: string | null
          instagram_handle: string | null
          name: string
          spotify_url: string | null
          tier: Database["public"]["Enums"]["ambassador_tier"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string | null
          created_at?: string
          genre?: string
          id?: string
          image_url?: string | null
          instagram_handle?: string | null
          name: string
          spotify_url?: string | null
          tier?: Database["public"]["Enums"]["ambassador_tier"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string | null
          created_at?: string
          genre?: string
          id?: string
          image_url?: string | null
          instagram_handle?: string | null
          name?: string
          spotify_url?: string | null
          tier?: Database["public"]["Enums"]["ambassador_tier"]
          updated_at?: string
        }
        Relationships: []
      }
      bet_selections: {
        Row: {
          bet_id: string
          created_at: string
          id: string
          market_id: string
          match_id: string
          odds_snapshot: number
          result: string | null
          selection_id: string
        }
        Insert: {
          bet_id: string
          created_at?: string
          id?: string
          market_id: string
          match_id: string
          odds_snapshot: number
          result?: string | null
          selection_id: string
        }
        Update: {
          bet_id?: string
          created_at?: string
          id?: string
          market_id?: string
          match_id?: string
          odds_snapshot?: number
          result?: string | null
          selection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bet_selections_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bet_selections_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bet_selections_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bet_selections_selection_id_fkey"
            columns: ["selection_id"]
            isOneToOne: false
            referencedRelation: "selections"
            referencedColumns: ["id"]
          },
        ]
      }
      bets: {
        Row: {
          bonus_stake: number
          created_at: string
          id: string
          payout: number | null
          placed_at: string
          potential_payout: number
          reference: string
          settled_at: string | null
          stake: number
          status: Database["public"]["Enums"]["bet_status"]
          total_odds: number
          type: Database["public"]["Enums"]["bet_type"]
          updated_at: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          bonus_stake?: number
          created_at?: string
          id?: string
          payout?: number | null
          placed_at?: string
          potential_payout: number
          reference: string
          settled_at?: string | null
          stake: number
          status?: Database["public"]["Enums"]["bet_status"]
          total_odds: number
          type: Database["public"]["Enums"]["bet_type"]
          updated_at?: string
          user_id: string
          wallet_id: string
        }
        Update: {
          bonus_stake?: number
          created_at?: string
          id?: string
          payout?: number | null
          placed_at?: string
          potential_payout?: number
          reference?: string
          settled_at?: string | null
          stake?: number
          status?: Database["public"]["Enums"]["bet_status"]
          total_odds?: number
          type?: Database["public"]["Enums"]["bet_type"]
          updated_at?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          post_type: Database["public"]["Enums"]["post_type"]
          shared_bet_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_type?: Database["public"]["Enums"]["post_type"]
          shared_bet_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_type?: Database["public"]["Enums"]["post_type"]
          shared_bet_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_shared_bet_id_fkey"
            columns: ["shared_bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          artist_id: string | null
          city: string
          created_at: string
          description: string | null
          ekasibets_presence: boolean
          event_date: string
          id: string
          image_url: string | null
          promo_code: string | null
          ticket_url: string | null
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          artist_id?: string | null
          city: string
          created_at?: string
          description?: string | null
          ekasibets_presence?: boolean
          event_date: string
          id?: string
          image_url?: string | null
          promo_code?: string | null
          ticket_url?: string | null
          title: string
          updated_at?: string
          venue: string
        }
        Update: {
          artist_id?: string | null
          city?: string
          created_at?: string
          description?: string | null
          ekasibets_presence?: boolean
          event_date?: string
          id?: string
          image_url?: string | null
          promo_code?: string | null
          ticket_url?: string | null
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      influencer_picks: {
        Row: {
          confidence: Database["public"]["Enums"]["pick_confidence"]
          created_at: string
          id: string
          influencer_id: string
          match_id: string | null
          prediction: string
          reasoning: string | null
        }
        Insert: {
          confidence?: Database["public"]["Enums"]["pick_confidence"]
          created_at?: string
          id?: string
          influencer_id: string
          match_id?: string | null
          prediction: string
          reasoning?: string | null
        }
        Update: {
          confidence?: Database["public"]["Enums"]["pick_confidence"]
          created_at?: string
          id?: string
          influencer_id?: string
          match_id?: string | null
          prediction?: string
          reasoning?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "influencer_picks_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "influencer_picks_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      influencers: {
        Row: {
          active: boolean
          category: string
          created_at: string
          followers: number
          handle: string
          id: string
          image_url: string | null
          name: string
          platform: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          followers?: number
          handle: string
          id?: string
          image_url?: string | null
          name: string
          platform?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          followers?: number
          handle?: string
          id?: string
          image_url?: string | null
          name?: string
          platform?: string
          updated_at?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_number: string | null
          expiry_date: string | null
          file_path: string
          id: string
          rejection_reason: string | null
          type: Database["public"]["Enums"]["document_type"]
          user_id: string
          verified: boolean
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_path: string
          id?: string
          rejection_reason?: string | null
          type: Database["public"]["Enums"]["document_type"]
          user_id: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_path?: string
          id?: string
          rejection_reason?: string | null
          type?: Database["public"]["Enums"]["document_type"]
          user_id?: string
          verified?: boolean
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      leagues: {
        Row: {
          active: boolean
          country: string | null
          created_at: string
          display_order: number
          id: string
          name: string
          slug: string
          sport_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          country?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name: string
          slug: string
          sport_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          country?: string | null
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          slug?: string
          sport_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leagues_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          created_at: string
          id: string
          key: string
          match_id: string
          name: string
          status: Database["public"]["Enums"]["market_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          match_id: string
          name: string
          status?: Database["public"]["Enums"]["market_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          match_id?: string
          name?: string
          status?: Database["public"]["Enums"]["market_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "markets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team: string
          created_at: string
          home_score: number | null
          home_team: string
          id: string
          league_id: string
          region: string | null
          start_time: string
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          away_score?: number | null
          away_team: string
          created_at?: string
          home_score?: number | null
          home_team: string
          id?: string
          league_id: string
          region?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          away_score?: number | null
          away_team?: string
          created_at?: string
          home_score?: number | null
          home_team?: string
          id?: string
          league_id?: string
          region?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_artists: {
        Row: {
          artist_id: string
          playlist_id: string
        }
        Insert: {
          artist_id: string
          playlist_id: string
        }
        Update: {
          artist_id?: string
          playlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_artists_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          active: boolean
          created_at: string
          curated_by: string
          description: string | null
          id: string
          image_url: string | null
          mood: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          curated_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          mood?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          curated_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          mood?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          created_at: string
          date_of_birth: string
          first_name: string
          id: string
          id_number: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          created_at?: string
          date_of_birth: string
          first_name: string
          id: string
          id_number?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          created_at?: string
          date_of_birth?: string
          first_name?: string
          id?: string
          id_number?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          bonus_amount: number
          code: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          max_redemptions: number | null
          min_deposit: number
          total_redemptions: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          bonus_amount: number
          code: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          min_deposit?: number
          total_redemptions?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          bonus_amount?: number
          code?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          max_redemptions?: number | null
          min_deposit?: number
          total_redemptions?: number
          updated_at?: string
        }
        Relationships: []
      }
      promo_redemptions: {
        Row: {
          bonus_credited: number
          id: string
          promo_code_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          bonus_credited: number
          id?: string
          promo_code_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          bonus_credited?: number
          id?: string
          promo_code_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_items: {
        Row: {
          active: boolean
          category: Database["public"]["Enums"]["reward_category"]
          created_at: string
          description: string
          id: string
          image_emoji: string
          name: string
          points_cost: number
          rand_value: number
          stock: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: Database["public"]["Enums"]["reward_category"]
          created_at?: string
          description?: string
          id?: string
          image_emoji?: string
          name: string
          points_cost: number
          rand_value?: number
          stock?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: Database["public"]["Enums"]["reward_category"]
          created_at?: string
          description?: string
          id?: string
          image_emoji?: string
          name?: string
          points_cost?: number
          rand_value?: number
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reward_redemptions: {
        Row: {
          created_at: string
          delivery_notes: string | null
          delivery_phone: string | null
          fulfilled_at: string | null
          id: string
          points_spent: number
          reward_item_id: string
          status: Database["public"]["Enums"]["redemption_status"]
          user_id: string
          voucher_code: string | null
        }
        Insert: {
          created_at?: string
          delivery_notes?: string | null
          delivery_phone?: string | null
          fulfilled_at?: string | null
          id?: string
          points_spent: number
          reward_item_id: string
          status?: Database["public"]["Enums"]["redemption_status"]
          user_id: string
          voucher_code?: string | null
        }
        Update: {
          created_at?: string
          delivery_notes?: string | null
          delivery_phone?: string | null
          fulfilled_at?: string | null
          id?: string
          points_spent?: number
          reward_item_id?: string
          status?: Database["public"]["Enums"]["redemption_status"]
          user_id?: string
          voucher_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_item_id_fkey"
            columns: ["reward_item_id"]
            isOneToOne: false
            referencedRelation: "reward_items"
            referencedColumns: ["id"]
          },
        ]
      }
      selections: {
        Row: {
          created_at: string
          display_order: number
          id: string
          label: string
          market_id: string
          odds: number
          updated_at: string
          won: boolean | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          label: string
          market_id: string
          odds: number
          updated_at?: string
          won?: boolean | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          label?: string
          market_id?: string
          odds?: number
          updated_at?: string
          won?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "selections_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          active: boolean
          created_at: string
          display_order: number
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          artist_name: string
          audio_url: string
          created_at: string
          display_order: number
          duration: number
          id: string
          playlist_id: string
          title: string
        }
        Insert: {
          artist_name: string
          audio_url: string
          created_at?: string
          display_order?: number
          duration?: number
          id?: string
          playlist_id: string
          title: string
        }
        Update: {
          artist_name?: string
          audio_url?: string
          created_at?: string
          display_order?: number
          duration?: number
          id?: string
          playlist_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          completed_at: string | null
          created_at: string
          id: string
          metadata: Json | null
          payment_method: string | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_limits: {
        Row: {
          created_at: string
          daily_bet_limit: number | null
          daily_deposit_limit: number | null
          id: string
          monthly_deposit_limit: number | null
          self_exclusion_until: string | null
          session_time_limit_min: number | null
          updated_at: string
          user_id: string
          weekly_deposit_limit: number | null
        }
        Insert: {
          created_at?: string
          daily_bet_limit?: number | null
          daily_deposit_limit?: number | null
          id?: string
          monthly_deposit_limit?: number | null
          self_exclusion_until?: string | null
          session_time_limit_min?: number | null
          updated_at?: string
          user_id: string
          weekly_deposit_limit?: number | null
        }
        Update: {
          created_at?: string
          daily_bet_limit?: number | null
          daily_deposit_limit?: number | null
          id?: string
          monthly_deposit_limit?: number | null
          self_exclusion_until?: string | null
          session_time_limit_min?: number | null
          updated_at?: string
          user_id?: string
          weekly_deposit_limit?: number | null
        }
        Relationships: []
      }
      user_points: {
        Row: {
          lifetime_earned: number
          points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          lifetime_earned?: number
          points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          lifetime_earned?: number
          points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          bonus_balance: number
          created_at: string
          currency: string
          id: string
          locked_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          bonus_balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          bonus_balance?: number
          created_at?: string
          currency?: string
          id?: string
          locked_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cash_out_bet: { Args: { _bet_id: string }; Returns: Json }
      get_leaderboard: {
        Args: { _limit?: number; _metric?: string; _period?: string }
        Returns: {
          bets_count: number
          display_name: string
          rank: number
          user_id: string
          value: number
        }[]
      }
      get_post_author: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      place_bet: {
        Args: {
          _bet_type?: Database["public"]["Enums"]["bet_type"]
          _selection_ids: string[]
          _stake: number
        }
        Returns: Json
      }
      redeem_promo_code: { Args: { _code: string }; Returns: Json }
      redeem_reward: {
        Args: { _item_id: string; _notes?: string; _phone?: string }
        Returns: Json
      }
      set_user_limits: {
        Args: {
          _daily_bet?: number
          _daily_deposit?: number
          _monthly_deposit?: number
          _self_exclude_days?: number
          _session_minutes?: number
          _weekly_deposit?: number
        }
        Returns: Json
      }
      settle_match: {
        Args: { _match_id: string; _winning_selection_ids: string[] }
        Returns: Json
      }
    }
    Enums: {
      account_status: "active" | "suspended" | "self_excluded" | "closed"
      ambassador_tier: "platinum" | "gold" | "community" | "none"
      app_role: "admin" | "operator" | "user"
      bet_status: "pending" | "won" | "lost" | "void" | "cashed_out"
      bet_type: "single" | "multiple"
      document_type:
        | "id_document"
        | "proof_of_residence"
        | "bank_statement"
        | "selfie"
      kyc_status: "pending" | "submitted" | "verified" | "rejected"
      market_status: "open" | "suspended" | "closed" | "settled" | "cancelled"
      match_status:
        | "scheduled"
        | "live"
        | "finished"
        | "postponed"
        | "cancelled"
      pick_confidence: "lock" | "solid" | "risky"
      post_type: "text" | "tip" | "bet_share"
      reaction_type: "fire" | "laugh" | "clap" | "skull"
      redemption_status: "pending" | "fulfilled" | "cancelled"
      reward_category: "airtime" | "voucher" | "braai" | "data" | "other"
      transaction_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "bet_placed"
        | "bet_won"
        | "bet_lost"
        | "bet_refund"
        | "bonus_credit"
        | "bonus_debit"
        | "bet_void"
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
    Enums: {
      account_status: ["active", "suspended", "self_excluded", "closed"],
      ambassador_tier: ["platinum", "gold", "community", "none"],
      app_role: ["admin", "operator", "user"],
      bet_status: ["pending", "won", "lost", "void", "cashed_out"],
      bet_type: ["single", "multiple"],
      document_type: [
        "id_document",
        "proof_of_residence",
        "bank_statement",
        "selfie",
      ],
      kyc_status: ["pending", "submitted", "verified", "rejected"],
      market_status: ["open", "suspended", "closed", "settled", "cancelled"],
      match_status: ["scheduled", "live", "finished", "postponed", "cancelled"],
      pick_confidence: ["lock", "solid", "risky"],
      post_type: ["text", "tip", "bet_share"],
      reaction_type: ["fire", "laugh", "clap", "skull"],
      redemption_status: ["pending", "fulfilled", "cancelled"],
      reward_category: ["airtime", "voucher", "braai", "data", "other"],
      transaction_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: [
        "deposit",
        "withdrawal",
        "bet_placed",
        "bet_won",
        "bet_lost",
        "bet_refund",
        "bonus_credit",
        "bonus_debit",
        "bet_void",
      ],
    },
  },
} as const
