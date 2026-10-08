export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
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
      }
      clips: {
        Row: {
          id: string
          title: string
          file_path: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          file_path: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          file_path?: string
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          question_text: string
          display_order: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question_text: string
          display_order: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          question_text?: string
          display_order?: number
          active?: boolean
          created_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          user_id: string
          clip_id: string
          question_id: string
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clip_id: string
          question_id: string
          rating: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clip_id?: string
          question_id?: string
          rating?: number
          created_at?: string
        }
      }
      evaluations: {
        Row: {
          id: string
          user_id: string
          clip_id: string
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clip_id: string
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clip_id?: string
          submitted_at?: string
        }
      }
    }
  }
}
