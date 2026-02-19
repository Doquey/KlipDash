// Replace this file by running the Supabase CLI after applying the schema:
//   npx supabase gen types typescript --linked > src/lib/types/database.ts
//
// This is a hand-written placeholder that matches the generated shape closely
// enough to satisfy @supabase/supabase-js v2 generic typing.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'cancelled'
  | 'no_show'

export interface ShopSettings {
  timezone: string
  open_time: string
  close_time: string
  slot_duration_minutes: number
  days_open: number[]
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      shops: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          logo_url: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          logo_url?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          logo_url?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      barbers: {
        Row: {
          id: string
          shop_id: string
          name: string
          bio: string | null
          avatar_url: string | null
          active: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          bio?: string | null
          avatar_url?: string | null
          active?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          bio?: string | null
          avatar_url?: string | null
          active?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "barbers_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          }
        ]
      }
      services: {
        Row: {
          id: string
          shop_id: string
          name: string
          duration_minutes: number
          price: number
          active: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          duration_minutes: number
          price: number
          active?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          duration_minutes?: number
          price?: number
          active?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          shop_id: string
          barber_id: string
          service_id: string
          customer_name: string
          customer_phone: string
          start_time: string
          end_time: string
          status: AppointmentStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          barber_id: string
          service_id: string
          customer_name: string
          customer_phone: string
          start_time: string
          end_time: string
          status?: AppointmentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          barber_id?: string
          service_id?: string
          customer_name?: string
          customer_phone?: string
          start_time?: string
          end_time?: string
          status?: AppointmentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      get_available_slots: {
        Args: {
          p_barber_id: string
          p_service_id: string
          p_date: string
        }
        Returns: Array<{ slot_start: string; slot_end: string }>
      }
    }
    Enums: {
      appointment_status: AppointmentStatus
    }
    CompositeTypes: Record<string, never>
  }
}

// Convenience row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Shop = Database['public']['Tables']['shops']['Row']
export type Barber = Database['public']['Tables']['barbers']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']

// Enriched appointment row with joined data (used in AgendaView)
export type AppointmentWithDetails = Appointment & {
  barbers: Pick<Barber, 'id' | 'name' | 'avatar_url'>
  services: Pick<Service, 'id' | 'name' | 'duration_minutes' | 'price'>
}
