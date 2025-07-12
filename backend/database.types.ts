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
      filtered_open_tender_notices: {
        Row: {
          "amendmentDate-dateModification": string | null
          "amendmentNumber-numeroModification": string | null
          "attachment-piecesJointes-eng": string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng": string | null
          "contactInfoCity-contacterInfoVille-eng": string | null
          "contactInfoCountry-contactInfoPays-eng": string | null
          "contactInfoEmail-informationsContactCourriel": string | null
          contactInfoFax: string | null
          "contactInfoName-informationsContactNom": string | null
          "contactInfoPhone-contactInfoTelephone": string | null
          contactInfoPostalcode: string | null
          "contactInfoProvince-contacterInfoProvince-eng": string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng":
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e":
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng":
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod":
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi":
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng": string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng":
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng": string | null
          "expectedContractEndDate-dateFinContratPrevue": string | null
          "expectedContractStartDate-dateDebutContratPrevue": string | null
          "gsin-nibs": string | null
          "gsinDescription-nibsDescription-eng": string | null
          "limitedTenderingReason-raisonAppelOffresLimite-eng": string | null
          "noticeType-avisType-eng": string | null
          "noticeURL-URLavis-eng": string | null
          "procurementCategory-categorieApprovisionnement": string | null
          "procurementMethod-methodeApprovisionnement-eng": string | null
          "publicationDate-datePublication": string | null
          "referenceNumber-numeroReference": string | null
          "regionsOfDelivery-regionsLivraison-eng": string | null
          "regionsOfOpportunity-regionAppelOffres-eng": string | null
          "selectionCriteria-criteresSelection-eng": string | null
          "solicitationNumber-numeroSollicitation": string | null
          "tenderClosingDate-appelOffresDateCloture": string | null
          "tenderDescription-descriptionAppelOffres-eng": string | null
          "tenderStatus-appelOffresStatut-eng": string | null
          "title-titre-eng": string | null
          "tradeAgreements-accordsCommerciaux-eng": string | null
          unspsc: string | null
          "unspscDescription-eng": string | null
        }
        Insert: {
          "amendmentDate-dateModification"?: string | null
          "amendmentNumber-numeroModification"?: string | null
          "attachment-piecesJointes-eng"?: string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng"?: string | null
          "contactInfoCity-contacterInfoVille-eng"?: string | null
          "contactInfoCountry-contactInfoPays-eng"?: string | null
          "contactInfoEmail-informationsContactCourriel"?: string | null
          contactInfoFax?: string | null
          "contactInfoName-informationsContactNom"?: string | null
          "contactInfoPhone-contactInfoTelephone"?: string | null
          contactInfoPostalcode?: string | null
          "contactInfoProvince-contacterInfoProvince-eng"?: string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng"?:
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e"?:
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng"?:
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod"?:
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi"?:
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng"?: string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng"?:
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng"?: string | null
          "expectedContractEndDate-dateFinContratPrevue"?: string | null
          "expectedContractStartDate-dateDebutContratPrevue"?: string | null
          "gsin-nibs"?: string | null
          "gsinDescription-nibsDescription-eng"?: string | null
          "limitedTenderingReason-raisonAppelOffresLimite-eng"?: string | null
          "noticeType-avisType-eng"?: string | null
          "noticeURL-URLavis-eng"?: string | null
          "procurementCategory-categorieApprovisionnement"?: string | null
          "procurementMethod-methodeApprovisionnement-eng"?: string | null
          "publicationDate-datePublication"?: string | null
          "referenceNumber-numeroReference"?: string | null
          "regionsOfDelivery-regionsLivraison-eng"?: string | null
          "regionsOfOpportunity-regionAppelOffres-eng"?: string | null
          "selectionCriteria-criteresSelection-eng"?: string | null
          "solicitationNumber-numeroSollicitation"?: string | null
          "tenderClosingDate-appelOffresDateCloture"?: string | null
          "tenderDescription-descriptionAppelOffres-eng"?: string | null
          "tenderStatus-appelOffresStatut-eng"?: string | null
          "title-titre-eng"?: string | null
          "tradeAgreements-accordsCommerciaux-eng"?: string | null
          unspsc?: string | null
          "unspscDescription-eng"?: string | null
        }
        Update: {
          "amendmentDate-dateModification"?: string | null
          "amendmentNumber-numeroModification"?: string | null
          "attachment-piecesJointes-eng"?: string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng"?: string | null
          "contactInfoCity-contacterInfoVille-eng"?: string | null
          "contactInfoCountry-contactInfoPays-eng"?: string | null
          "contactInfoEmail-informationsContactCourriel"?: string | null
          contactInfoFax?: string | null
          "contactInfoName-informationsContactNom"?: string | null
          "contactInfoPhone-contactInfoTelephone"?: string | null
          contactInfoPostalcode?: string | null
          "contactInfoProvince-contacterInfoProvince-eng"?: string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng"?:
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e"?:
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng"?:
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod"?:
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi"?:
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng"?: string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng"?:
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng"?: string | null
          "expectedContractEndDate-dateFinContratPrevue"?: string | null
          "expectedContractStartDate-dateDebutContratPrevue"?: string | null
          "gsin-nibs"?: string | null
          "gsinDescription-nibsDescription-eng"?: string | null
          "limitedTenderingReason-raisonAppelOffresLimite-eng"?: string | null
          "noticeType-avisType-eng"?: string | null
          "noticeURL-URLavis-eng"?: string | null
          "procurementCategory-categorieApprovisionnement"?: string | null
          "procurementMethod-methodeApprovisionnement-eng"?: string | null
          "publicationDate-datePublication"?: string | null
          "referenceNumber-numeroReference"?: string | null
          "regionsOfDelivery-regionsLivraison-eng"?: string | null
          "regionsOfOpportunity-regionAppelOffres-eng"?: string | null
          "selectionCriteria-criteresSelection-eng"?: string | null
          "solicitationNumber-numeroSollicitation"?: string | null
          "tenderClosingDate-appelOffresDateCloture"?: string | null
          "tenderDescription-descriptionAppelOffres-eng"?: string | null
          "tenderStatus-appelOffresStatut-eng"?: string | null
          "title-titre-eng"?: string | null
          "tradeAgreements-accordsCommerciaux-eng"?: string | null
          unspsc?: string | null
          "unspscDescription-eng"?: string | null
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
      open_tender_notices: {
        Row: {
          "amendmentDate-dateModification": string | null
          "amendmentNumber-numeroModification": string | null
          "attachment-piecesJointes-eng": string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng": string | null
          "contactInfoCity-contacterInfoVille-eng": string | null
          "contactInfoCountry-contactInfoPays-eng": string | null
          "contactInfoEmail-informationsContactCourriel": string | null
          contactInfoFax: string | null
          "contactInfoName-informationsContactNom": string | null
          "contactInfoPhone-contactInfoTelephone": string | null
          contactInfoPostalcode: string | null
          "contactInfoProvince-contacterInfoProvince-eng": string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng":
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e":
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng":
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod":
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi":
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng": string | null
          embedding: string | null
          embedding_input: string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng":
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng": string | null
          "expectedContractEndDate-dateFinContratPrevue": string | null
          "expectedContractStartDate-dateDebutContratPrevue": string | null
          "gsin-nibs": string | null
          "gsinDescription-nibsDescription-eng": string | null
          id: string
          "limitedTenderingReason-raisonAppelOffresLimite-eng": string | null
          "noticeType-avisType-eng": string | null
          "noticeURL-URLavis-eng": string | null
          "procurementCategory-categorieApprovisionnement": string | null
          "procurementMethod-methodeApprovisionnement-eng": string | null
          "publicationDate-datePublication": string | null
          "referenceNumber-numeroReference": string | null
          "regionsOfDelivery-regionsLivraison-eng": string | null
          "regionsOfOpportunity-regionAppelOffres-eng": string | null
          "selectionCriteria-criteresSelection-eng": string | null
          "solicitationNumber-numeroSollicitation": string | null
          "tenderClosingDate-appelOffresDateCloture": string | null
          "tenderDescription-descriptionAppelOffres-eng": string | null
          "tenderStatus-appelOffresStatut-eng": string | null
          "title-titre-eng": string | null
          "tradeAgreements-accordsCommerciaux-eng": string | null
          unspsc: string | null
          "unspscDescription-eng": string | null
        }
        Insert: {
          "amendmentDate-dateModification"?: string | null
          "amendmentNumber-numeroModification"?: string | null
          "attachment-piecesJointes-eng"?: string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng"?: string | null
          "contactInfoCity-contacterInfoVille-eng"?: string | null
          "contactInfoCountry-contactInfoPays-eng"?: string | null
          "contactInfoEmail-informationsContactCourriel"?: string | null
          contactInfoFax?: string | null
          "contactInfoName-informationsContactNom"?: string | null
          "contactInfoPhone-contactInfoTelephone"?: string | null
          contactInfoPostalcode?: string | null
          "contactInfoProvince-contacterInfoProvince-eng"?: string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng"?:
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e"?:
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng"?:
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod"?:
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi"?:
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng"?: string | null
          embedding?: string | null
          embedding_input?: string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng"?:
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng"?: string | null
          "expectedContractEndDate-dateFinContratPrevue"?: string | null
          "expectedContractStartDate-dateDebutContratPrevue"?: string | null
          "gsin-nibs"?: string | null
          "gsinDescription-nibsDescription-eng"?: string | null
          id?: string
          "limitedTenderingReason-raisonAppelOffresLimite-eng"?: string | null
          "noticeType-avisType-eng"?: string | null
          "noticeURL-URLavis-eng"?: string | null
          "procurementCategory-categorieApprovisionnement"?: string | null
          "procurementMethod-methodeApprovisionnement-eng"?: string | null
          "publicationDate-datePublication"?: string | null
          "referenceNumber-numeroReference"?: string | null
          "regionsOfDelivery-regionsLivraison-eng"?: string | null
          "regionsOfOpportunity-regionAppelOffres-eng"?: string | null
          "selectionCriteria-criteresSelection-eng"?: string | null
          "solicitationNumber-numeroSollicitation"?: string | null
          "tenderClosingDate-appelOffresDateCloture"?: string | null
          "tenderDescription-descriptionAppelOffres-eng"?: string | null
          "tenderStatus-appelOffresStatut-eng"?: string | null
          "title-titre-eng"?: string | null
          "tradeAgreements-accordsCommerciaux-eng"?: string | null
          unspsc?: string | null
          "unspscDescription-eng"?: string | null
        }
        Update: {
          "amendmentDate-dateModification"?: string | null
          "amendmentNumber-numeroModification"?: string | null
          "attachment-piecesJointes-eng"?: string | null
          "contactInfoAddressLine-contactInfoAdresseLigne-eng"?: string | null
          "contactInfoCity-contacterInfoVille-eng"?: string | null
          "contactInfoCountry-contactInfoPays-eng"?: string | null
          "contactInfoEmail-informationsContactCourriel"?: string | null
          contactInfoFax?: string | null
          "contactInfoName-informationsContactNom"?: string | null
          "contactInfoPhone-contactInfoTelephone"?: string | null
          contactInfoPostalcode?: string | null
          "contactInfoProvince-contacterInfoProvince-eng"?: string | null
          "contractingEntityAddressCity-entiteContractanteAdresseVille-eng"?:
            | string
            | null
          "contractingEntityAddressCountry-entiteContractanteAdressePays-e"?:
            | string
            | null
          "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng"?:
            | string
            | null
          "contractingEntityAddressPostalCode-entiteContractanteAdresseCod"?:
            | string
            | null
          "contractingEntityAddressProvince-entiteContractanteAdresseProvi"?:
            | string
            | null
          "contractingEntityName-nomEntitContractante-eng"?: string | null
          embedding?: string | null
          embedding_input?: string | null
          "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng"?:
            | string
            | null
          "endUserEntitiesName-nomEntitesUtilisateurFinal-eng"?: string | null
          "expectedContractEndDate-dateFinContratPrevue"?: string | null
          "expectedContractStartDate-dateDebutContratPrevue"?: string | null
          "gsin-nibs"?: string | null
          "gsinDescription-nibsDescription-eng"?: string | null
          id?: string
          "limitedTenderingReason-raisonAppelOffresLimite-eng"?: string | null
          "noticeType-avisType-eng"?: string | null
          "noticeURL-URLavis-eng"?: string | null
          "procurementCategory-categorieApprovisionnement"?: string | null
          "procurementMethod-methodeApprovisionnement-eng"?: string | null
          "publicationDate-datePublication"?: string | null
          "referenceNumber-numeroReference"?: string | null
          "regionsOfDelivery-regionsLivraison-eng"?: string | null
          "regionsOfOpportunity-regionAppelOffres-eng"?: string | null
          "selectionCriteria-criteresSelection-eng"?: string | null
          "solicitationNumber-numeroSollicitation"?: string | null
          "tenderClosingDate-appelOffresDateCloture"?: string | null
          "tenderDescription-descriptionAppelOffres-eng"?: string | null
          "tenderStatus-appelOffresStatut-eng"?: string | null
          "title-titre-eng"?: string | null
          "tradeAgreements-accordsCommerciaux-eng"?: string | null
          unspsc?: string | null
          "unspscDescription-eng"?: string | null
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
      tender_ai_summaries: {
        Row: {
          id: string
          summary: Json
        }
        Insert: {
          id?: string
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
      tenders: {
        Row: {
          amendment_date: string | null
          amendment_number: string | null
          attachments: string | null
          contact_address_line: string | null
          contact_city: string | null
          contact_country: string | null
          contact_email: string | null
          contact_fax: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_postal_code: string | null
          contact_province: string | null
          contracting_entity_address_line: string | null
          contracting_entity_city: string | null
          contracting_entity_country: string | null
          contracting_entity_name: string | null
          contracting_entity_postal_code: string | null
          contracting_entity_province: string | null
          embedding: string | null
          embedding_input: string | null
          end_user_entities_address: string | null
          end_user_entities_name: string | null
          expected_contract_end_date: string | null
          expected_contract_start_date: string | null
          gsin: string | null
          gsin_description: string | null
          id: string
          limited_tendering_reason: string | null
          notice_type: string | null
          notice_url: string | null
          procurement_category: string | null
          procurement_method: string | null
          publication_date: string | null
          reference_number: string | null
          regions_of_delivery: string | null
          regions_of_opportunity: string | null
          selection_criteria: string | null
          solicitation_number: string | null
          tender_closing_date: string | null
          tender_description: string | null
          tender_status: string | null
          title: string | null
          trade_agreements: string | null
          unspsc: string | null
          unspsc_description: string | null
        }
        Insert: {
          amendment_date?: string | null
          amendment_number?: string | null
          attachments?: string | null
          contact_address_line?: string | null
          contact_city?: string | null
          contact_country?: string | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_postal_code?: string | null
          contact_province?: string | null
          contracting_entity_address_line?: string | null
          contracting_entity_city?: string | null
          contracting_entity_country?: string | null
          contracting_entity_name?: string | null
          contracting_entity_postal_code?: string | null
          contracting_entity_province?: string | null
          embedding?: string | null
          embedding_input?: string | null
          end_user_entities_address?: string | null
          end_user_entities_name?: string | null
          expected_contract_end_date?: string | null
          expected_contract_start_date?: string | null
          gsin?: string | null
          gsin_description?: string | null
          id?: string
          limited_tendering_reason?: string | null
          notice_type?: string | null
          notice_url?: string | null
          procurement_category?: string | null
          procurement_method?: string | null
          publication_date?: string | null
          reference_number?: string | null
          regions_of_delivery?: string | null
          regions_of_opportunity?: string | null
          selection_criteria?: string | null
          solicitation_number?: string | null
          tender_closing_date?: string | null
          tender_description?: string | null
          tender_status?: string | null
          title?: string | null
          trade_agreements?: string | null
          unspsc?: string | null
          unspsc_description?: string | null
        }
        Update: {
          amendment_date?: string | null
          amendment_number?: string | null
          attachments?: string | null
          contact_address_line?: string | null
          contact_city?: string | null
          contact_country?: string | null
          contact_email?: string | null
          contact_fax?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_postal_code?: string | null
          contact_province?: string | null
          contracting_entity_address_line?: string | null
          contracting_entity_city?: string | null
          contracting_entity_country?: string | null
          contracting_entity_name?: string | null
          contracting_entity_postal_code?: string | null
          contracting_entity_province?: string | null
          embedding?: string | null
          embedding_input?: string | null
          end_user_entities_address?: string | null
          end_user_entities_name?: string | null
          expected_contract_end_date?: string | null
          expected_contract_start_date?: string | null
          gsin?: string | null
          gsin_description?: string | null
          id?: string
          limited_tendering_reason?: string | null
          notice_type?: string | null
          notice_url?: string | null
          procurement_category?: string | null
          procurement_method?: string | null
          publication_date?: string | null
          reference_number?: string | null
          regions_of_delivery?: string | null
          regions_of_opportunity?: string | null
          selection_criteria?: string | null
          solicitation_number?: string | null
          tender_closing_date?: string | null
          tender_description?: string | null
          tender_status?: string | null
          title?: string | null
          trade_agreements?: string | null
          unspsc?: string | null
          unspsc_description?: string | null
        }
        Relationships: []
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
      match_tenders_by_vector: {
        Args: {
          query_embedding: string
          match_threshold: number
          match_count: number
        }
        Returns: {
          id: string
          title: string
          reference_number: string
          amendment_number: string
          solicitation_number: string
          publication_date: string
          tender_closing_date: string
          amendment_date: string
          expected_contract_start_date: string
          expected_contract_end_date: string
          tender_status: string
          gsin: string
          gsin_description: string
          unspsc: string
          unspsc_description: string
          procurement_category: string
          notice_type: string
          procurement_method: string
          selection_criteria: string
          limited_tendering_reason: string
          trade_agreements: string
          regions_of_opportunity: string
          regions_of_delivery: string
          contracting_entity_name: string
          contracting_entity_address_line: string
          contracting_entity_city: string
          contracting_entity_province: string
          contracting_entity_postal_code: string
          contracting_entity_country: string
          end_user_entities_name: string
          end_user_entities_address: string
          contact_name: string
          contact_email: string
          contact_phone: string
          contact_fax: string
          contact_address_line: string
          contact_city: string
          contact_province: string
          contact_postal_code: string
          contact_country: string
          notice_url: string
          attachments: string
          tender_description: string
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
