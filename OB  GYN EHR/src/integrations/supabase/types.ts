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
      patients: {
        Row: {
          abdominal_examination: string | null
          age: string | null
          blood_group: string | null
          blood_pressure: string | null
          created_at: string
          dob: string | null
          email: string | null
          examination: string | null
          full_name: string
          haemoglobin: string | null
          height: string | null
          hepatitis_b: string | null
          hepatitis_c: string | null
          hiv: string | null
          id: string
          investigation_others: string | null
          last_updated: string
          medical_history: string | null
          next_visit: string | null
          obstetrical_history: string | null
          odema: string | null
          outcome: string | null
          parity: string | null
          past_history: string | null
          patient_external_id: string
          pelvic_examination: string | null
          phone: string | null
          plan: string | null
          presenting_complaint: string | null
          pulse: string | null
          rbs: string | null
          temperature: string | null
          treatment: string | null
          ultrasound: string | null
          weight: string | null
        }
        Insert: {
          abdominal_examination?: string | null
          age?: string | null
          blood_group?: string | null
          blood_pressure?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          examination?: string | null
          full_name?: string
          haemoglobin?: string | null
          height?: string | null
          hepatitis_b?: string | null
          hepatitis_c?: string | null
          hiv?: string | null
          id?: string
          investigation_others?: string | null
          last_updated?: string
          medical_history?: string | null
          next_visit?: string | null
          obstetrical_history?: string | null
          odema?: string | null
          outcome?: string | null
          parity?: string | null
          past_history?: string | null
          patient_external_id: string
          pelvic_examination?: string | null
          phone?: string | null
          plan?: string | null
          presenting_complaint?: string | null
          pulse?: string | null
          rbs?: string | null
          temperature?: string | null
          treatment?: string | null
          ultrasound?: string | null
          weight?: string | null
        }
        Update: {
          abdominal_examination?: string | null
          age?: string | null
          blood_group?: string | null
          blood_pressure?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          examination?: string | null
          full_name?: string
          haemoglobin?: string | null
          height?: string | null
          hepatitis_b?: string | null
          hepatitis_c?: string | null
          hiv?: string | null
          id?: string
          investigation_others?: string | null
          last_updated?: string
          medical_history?: string | null
          next_visit?: string | null
          obstetrical_history?: string | null
          odema?: string | null
          outcome?: string | null
          parity?: string | null
          past_history?: string | null
          patient_external_id?: string
          pelvic_examination?: string | null
          phone?: string | null
          plan?: string | null
          presenting_complaint?: string | null
          pulse?: string | null
          rbs?: string | null
          temperature?: string | null
          treatment?: string | null
          ultrasound?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      visits: {
        Row: {
          created_at: string
          diagnosis: string | null
          id: string
          notes: string | null
          patient_id: string
          treatment: string | null
          visit_date: string
          visit_type: string
        }
        Insert: {
          created_at?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          treatment?: string | null
          visit_date?: string
          visit_type?: string
        }
        Update: {
          created_at?: string
          diagnosis?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          treatment?: string | null
          visit_date?: string
          visit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "visits_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
