import { createColumnHelper } from "@tanstack/react-table";
import { type TenderNoticeInterface } from "./types"; // Adjust the import path as necessary
const columnHelper = createColumnHelper<TenderNoticeInterface>();

export const tenderColumns = [
  columnHelper.accessor("title-titre-eng", {
    header: "Title",
  }),
  columnHelper.accessor("tenderStatus-appelOffresStatut-eng", {
    header: "Status",
  }),
  columnHelper.accessor("gsinDescription-nibsDescription-eng", {
    header: "GSIN",
  }),
  columnHelper.accessor("unspscDescription-eng", {
    header: "UNSPSC",
  }),
  columnHelper.accessor("noticeType-avisType-eng", {
    header: "Type",
  }),
  columnHelper.accessor("procurementMethod-methodeApprovisionnement-eng", {
    header: "Procurement Method",
  }),
  columnHelper.accessor("selectionCriteria-criteresSelection-eng", {
    header: "Selection Criteria",
  }),
  columnHelper.accessor("limitedTenderingReason-raisonAppelOffresLimite-eng", {
    header: "Limited Tendering Reason",
  }),
  columnHelper.accessor("tradeAgreements-accordsCommerciaux-eng", {
    header: "Trade Agreements",
  }),
  columnHelper.accessor("regionsOfOpportunity-regionAppelOffres-eng", {
    header: "Region of Opportunity",
  }),
  columnHelper.accessor("regionsOfDelivery-regionsLivraison-eng", {
    header: "Region of Delivery",
  }),
  columnHelper.accessor("contractingEntityName-nomEntitContractante-eng", {
    header: "Contracting Entity",
  }),
  columnHelper.accessor(
    "contractingEntityAddressLine-ligneAdresseEntiteContractante-eng",
    {
      header: "Entity Address",
    }
  ),
  columnHelper.accessor(
    "contractingEntityAddressCity-entiteContractanteAdresseVille-eng",
    {
      header: "City",
    }
  ),
  columnHelper.accessor(
    "contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng",
    {
      header: "Province",
    }
  ),
  columnHelper.accessor(
    "contractingEntityAddressCountry-entiteContractanteAdressePays-eng",
    {
      header: "Country",
    }
  ),
  columnHelper.accessor("endUserEntitiesName-nomEntitesUtilisateurFinal-eng", {
    header: "End User Entity",
  }),
  columnHelper.accessor(
    "endUserEntitiesAddress-adresseEntitesUtilisateurFinal-eng",
    {
      header: "End User Address",
    }
  ),
  columnHelper.accessor("contactInfoAddressLine-contactInfoAdresseLigne-eng", {
    header: "Contact Address",
  }),
  columnHelper.accessor("contactInfoCity-contacterInfoVille-eng", {
    header: "Contact City",
  }),
  columnHelper.accessor("contactInfoProvince-contacterInfoProvince-eng", {
    header: "Contact Province",
  }),
  columnHelper.accessor("contactInfoCountry-contactInfoPays-eng", {
    header: "Contact Country",
  }),
  columnHelper.accessor("noticeURL-URLavis-eng", {
    header: "Notice URL",
  }),
  columnHelper.accessor("attachment-piecesJointes-eng", {
    header: "Attachments",
  }),
  columnHelper.accessor("tenderDescription-descriptionAppelOffres-eng", {
    header: "Description",
  }),
];
