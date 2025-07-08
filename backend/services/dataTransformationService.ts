export class DataTransformationService {
  // Define the target columns to filter the tender notices
  private targetColumns: { [key: string]: string } = {
    "title-titre-eng": "title",
    "referenceNumber-numeroReference": "reference_number",
    "amendmentNumber-numeroModification": "amendment_number",
    "solicitationNumber-numeroSollicitation": "solicitation_number",
    "publicationDate-datePublication": "publication_date",
    "tenderClosingDate-appelOffresDateCloture": "tender_closing_date",
    "amendmentDate-dateModification": "amendment_date",
    "expectedContractStartDate-dateDebutContratPrevue":
      "expected_contract_start_date",
    "expectedContractEndDate-dateFinContratPrevue": "expected_contract_end_date",
    "tenderStatus-appelOffresStatut-eng": "tender_status",
    "gsin-nibs": "gsin",
    "gsinDescription-nibsDescription-eng": "gsin_description",
    unspsc: "unspsc",
    "unspscDescription-eng": "unspsc_description",
    "procurementCategory-categorieApprovisionnement": "procurement_category",
    "noticeType-avisType-eng": "notice_type",
    "procurementMethod-methodeApprovisionnement-eng": "procurement_method",
    "selectionCriteria-criteresSelection-eng": "selection_criteria",
    "limitedTenderingReason-raisonAppelOffresLimite-eng":
      "limited_tendering_reason",
    "tradeAgreements-accordsCommerciaux-eng": "trade_agreements",
    "regionsOfOpportunity-regionAppelOffres-eng": "regions_of_opportunity",
    "regionsOfDelivery-regionsLivraison-eng": "regions_of_delivery",
    "contractingEntityName-nomEntitContractante-eng": "contracting_entity_name",
    "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng":
      "contracting_entity_address_line",
    "contractingEntityAddressCity-entiteContractanteAdresseVille-eng":
      "contracting_entity_city",
    "contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng":
      "contracting_entity_province",
    "contractingEntityAddressPostalCode-entiteContractanteAdresseCodePostal":
      "contracting_entity_postal_code",
    "contractingEntityAddressCountry-entiteContractanteAdressePays-eng":
      "contracting_entity_country",
    "endUserEntitiesName-nomEntitesUtilisateurFinal-eng":
      "end_user_entities_name",
    "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng":
      "end_user_entities_address",
    "contactInfoName-informationsContactNom": "contact_name",
    "contactInfoEmail-informationsContactCourriel": "contact_email",
    "contactInfoPhone-contactInfoTelephone": "contact_phone",
    contactInfoFax: "contact_fax",
    "contactInfoAddressLine-contactInfoAdresseLigne-eng": "contact_address_line",
    "contactInfoCity-contacterInfoVille-eng": "contact_city",
    "contactInfoProvince-contacterInfoProvince-eng": "contact_province",
    contactInfoPostalcode: "contact_postal_code",
    "contactInfoCountry-contactInfoPays-eng": "contact_country",
    "noticeURL-URLavis-eng": "notice_url",
    "attachment-piecesJointes-eng": "attachments",
    "tenderDescription-descriptionAppelOffres-eng": "tender_description",
  };

  transformTenderData(rawData: any[]): any[] {
    return rawData.map(row => this.filterToTargetColumns(row));
  }

  private filterToTargetColumns(row: any): Record<string, any> {
    return Object.entries(row).reduce((acc, [csvKey, value]) => {
      // Try to find an exact match for the CSV key in targetColumns
      if (!this.targetColumns[csvKey]) {
        return acc;
      }

      const match = this.targetColumns[csvKey];
      if (match) {
        acc[match] = value;
      }
      return acc;
    }, {} as Record<string, any>);
  }

  combineDataWithEmbeddings(tenderData: any[], embeddingsData: any): any[] {
    const combinedData = [...tenderData];
    
    for (let i = 0; i < combinedData.length; i++) {
      if (embeddingsData.embeddings && embeddingsData.embeddings[i]) {
        combinedData[i].embedding = embeddingsData.embeddings[i];
      }
      if (embeddingsData.embedding_inputs && embeddingsData.embedding_inputs[i]) {
        combinedData[i].embedding_input = embeddingsData.embedding_inputs[i];
      }
    }
    
    return combinedData;
  }
}
