import {
  parseBidAndTendersDate,
  parseCanadianDate,
  parseOntarioDate,
} from "./scrapingDateParser";

/**
 * Clean HTML tags from description
 */
function cleanHtmlDescription(html: string): string | null {
  if (!html) return null;

  // Remove HTML tags and decode entities
  return (
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim() || null
  );
}

import { URLS } from "./scrapingUrls";

/**
 * Convert a raw BidsAndTenders tender row to the new simplified schema.
 * Works for Mississauga, Brampton, and Hamilton.
 */
function mapBidsAndTendersTender(
  row: any,
  city: "mississauga" | "brampton" | "hamilton" | "london"
) {
  const cityInfo = {
    mississauga: {
      name: "City of Mississauga",
      city: "Mississauga",
      location: "Mississauga, ON",
      baseUrl: URLS.BIDSANDTENDERS.MISSISSAUGA,
    },
    brampton: {
      name: "City of Brampton",
      city: "Brampton",
      location: "Brampton, ON",
      baseUrl: URLS.BIDSANDTENDERS.BRAMPTON,
    },
    hamilton: {
      name: "City of Hamilton",
      city: "Hamilton",
      location: "Hamilton, ON",
      baseUrl: URLS.BIDSANDTENDERS.HAMILTON,
    },
    london: {
      name: "City of London",
      city: "London",
      location: "London, ON",
      baseUrl: URLS.BIDSANDTENDERS.LONDON,
    },
  };

  const info = cityInfo[city];

  return {
    id: row.Id,
    source: city,
    source_reference: row.Title?.match(/^([A-Z]+\d+)/)?.[1] ?? row.Id,
    source_url: info.baseUrl.TENDER_DETAIL(row.Id),

    title: row.Title,
    description: cleanHtmlDescription(row.Description),
    status: row.Status?.toLowerCase(),

    published_date: parseBidAndTendersDate(row.DateAvailable),
    closing_date: parseBidAndTendersDate(row.DateClosing),
    contract_start_date: null,

    contracting_entity_name: info.name,
    contracting_entity_city: info.city,
    contracting_entity_province: "ON",
    contracting_entity_country: "CA",

    delivery_location: info.location,
    category_primary: row.Scope,
    procurement_type: "rfp",
    procurement_method: "open",

    estimated_value_min: null,
    currency: "CAD",

    contact_name: null,
    contact_email: null,
    contact_phone: null,

    gsin: null,
    unspsc: null,

    plan_takers_count: row.PlanTakers,
    submissions_count: row.Submitted,

    embedding: null,
    summary: null,

    last_scraped_at: new Date().toISOString(),
  };
}

// Legacy mappers for backward compatibility
function mapMississaugaTender(row: any) {
  return mapBidsAndTendersTender(row, "mississauga");
}

function mapBramptonTender(row: any) {
  return mapBidsAndTendersTender(row, "brampton");
}

function mapHamiltonTender(row: any) {
  return mapBidsAndTendersTender(row, "hamilton");
}

function mapLondonTender(row: any) {
  return mapBidsAndTendersTender(row, "london");
}

/**
 * Convert a raw Ontario Excel row to the new simplified schema.
 */
function mapOntarioTender(row: any) {
  return {
    id: row["Project Code"],
    source: "ontario",
    source_reference: row["Project Reference"] ?? row["Project Code"],
    source_url: row["Web Link"],

    title: row["Project Title"],
    description:
      [row["Detailed Description"], row["Scope of Work"]]
        .filter(Boolean)
        .join("\n\n") || null,
    status: "open",

    published_date: parseOntarioDate(row["Publication Date"]),
    closing_date: parseOntarioDate(
      row["Listing Expiry Date (dd/mm/yyyy hh:mm)"]
    ),
    contract_start_date: parseOntarioDate(
      row["Estimated Contract Start Date (dd/mm/yyyy)"]
    ),

    contracting_entity_name: row["Buyer Organization"],
    contracting_entity_city: null,
    contracting_entity_province: "ON",
    contracting_entity_country: "CA",

    delivery_location: "Ontario, CA",
    category_primary: row["Work Category"],
    procurement_type: row["Project Type"]?.toLowerCase().includes("rfp")
      ? "rfp"
      : "tender",
    procurement_method: row["Procurement Route"]?.toLowerCase(),

    estimated_value_min: row["Estimated Value of Contract"]
      ? parseFloat(row["Estimated Value of Contract"])
      : null,
    currency: "CAD",

    contact_name: row["Contact"],
    contact_email: row["Email"],
    contact_phone: null,

    gsin: null,
    unspsc: row["Project Categories"],

    plan_takers_count: null,
    submissions_count: null,

    embedding: null,
    summary: null,

    last_scraped_at: new Date().toISOString(),
  };
}

/**
 * Convert a raw Toronto OData tender row to the new simplified schema.
 */
function mapTorontoTender(row: any) {
  return {
    id: row.id,
    source: "toronto",
    source_reference: row.Solicitation_Document_Number,
    source_url: row.Ariba_Discovery_Posting_Link?.trim(),

    title: row.Posting_Title,
    description: row.Solicitation_Document_Description,
    status: row.Status?.toLowerCase(),

    published_date: row.Publish_Date,
    closing_date: row.Closing_Date_Formatted,
    contract_start_date: null,

    contracting_entity_name: Array.isArray(row.Client_Division)
      ? row.Client_Division[0]
      : "City of Toronto",
    contracting_entity_city: "Toronto",
    contracting_entity_province: "ON",
    contracting_entity_country: "CA",

    delivery_location: Array.isArray(row.Client_Division)
      ? row.Client_Division.join(", ")
      : "Toronto, ON",
    category_primary: row.High_Level_Category,
    procurement_type: row.Solicitation_Form_Type?.toLowerCase().includes("rfp")
      ? "rfp"
      : "tender",
    procurement_method: row.Limited_Suppliers === "Yes" ? "limited" : "open",

    estimated_value_min: null,
    currency: "CAD",

    contact_name: row.Buyer_Name,
    contact_email: row.Buyer_Email,
    contact_phone: row.Buyer_Phone_Number,

    gsin: null,
    unspsc: null,

    plan_takers_count: null,
    submissions_count: null,

    embedding: null,
    summary: null,

    last_scraped_at: new Date().toISOString(),
  };
}

/**
 * Convert a raw Canadian CSV row to the new simplified schema.
 */
function mapCanadianTender(row: any): any {
  return {
    id: row["referenceNumber-numeroReference"] || row.id,
    source: "canadian",
    source_reference: row["referenceNumber-numeroReference"],
    source_url: row["noticeURL-URLavis-eng"],

    title: row["title-titre-eng"],
    description: row["tenderDescription-descriptionAppelOffres-eng"],
    status: row["tenderStatus-appelOffresStatut-eng"]?.toLowerCase(),

    published_date: parseCanadianDate(row["publicationDate-datePublication"]),
    closing_date: parseCanadianDate(
      row["tenderClosingDate-appelOffresDateCloture"]
    ),
    contract_start_date: parseCanadianDate(
      row["expectedContractStartDate-dateDebutContratPrevue"]
    ),

    contracting_entity_name:
      row["contractingEntityName-nomEntitContractante-eng"],
    contracting_entity_city:
      row["contractingEntityAddressCity-entiteContractanteAdresseVille-eng"],
    contracting_entity_province:
      row[
        "contractingEntityAddressProvince-entiteContractanteAdresseProvince-eng"
      ],
    contracting_entity_country:
      row[
        "contractingEntityAddressCountry-entiteContractanteAdressePays-eng"
      ] || "Canada",

    delivery_location: row["regionsOfDelivery-regionsLivraison-eng"],
    category_primary: row["procurementCategory-categorieApprovisionnement"],
    procurement_type: row["noticeType-avisType-eng"]
      ?.toLowerCase()
      .includes("rfp")
      ? "rfp"
      : row["noticeType-avisType-eng"]?.toLowerCase().includes("rfq")
      ? "rfq"
      : "tender",
    procurement_method:
      row["procurementMethod-methodeApprovisionnement-eng"]?.toLowerCase(),

    estimated_value_min: null,
    currency: "CAD",

    contact_name: row["contactInfoName-informationsContactNom"],
    contact_email: row["contactInfoEmail-informationsContactCourriel"],
    contact_phone: row["contactInfoPhone-contactInfoTelephone"],

    gsin: row["gsin-nibs"],
    unspsc: row["unspsc"],

    plan_takers_count: null,
    submissions_count: null,

    embedding: null,
    summary: null,

    last_scraped_at: new Date().toISOString(),
  };
}

export {
  mapBidsAndTendersTender,
  mapMississaugaTender,
  mapBramptonTender,
  mapHamiltonTender,
  mapLondonTender,
  mapOntarioTender,
  mapTorontoTender,
  mapCanadianTender,
};
