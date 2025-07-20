import {
  parseBidAndTendersDate,
  parseCanadianDate,
  parseOntarioDate,
} from "./scrapingDateParser";

/**
 * Clean HTML tags from description
 */
export function cleanHtmlDescription(html: string): string | null {
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
export function mapBidsAndTendersTender(
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
export function mapMississaugaTender(row: any) {
  return mapBidsAndTendersTender(row, "mississauga");
}

export function mapBramptonTender(row: any) {
  return mapBidsAndTendersTender(row, "brampton");
}

export function mapHamiltonTender(row: any) {
  return mapBidsAndTendersTender(row, "hamilton");
}

export function mapLondonTender(row: any) {
  return mapBidsAndTendersTender(row, "london");
}

/**
 * Convert a raw Ontario Excel row to the new simplified schema.
 */
export function mapOntarioTender(row: any) {
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
export function mapTorontoTender(row: any) {
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
export function mapCanadianTender(row: any): any {
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
    category_primary: mapCanadianCategoryToCentral(
      row["procurementCategory-categorieApprovisionnement"]
    ),
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

// Place this at the top of your file or export as needed
export const QUEBEC_CATEGORY_MAP: Record<number, string> = {
  52: "Buildings",
  53: "Civil engineering work",
  51: "Other construction work",
  54: "Concession",
  1: "Aerospace",
  20: "Air Conditioning and Refrigeration Equipment",
  4: "Armaments",
  27: "Chemicals and Chemical Specialties",
  5: "Communications, Detection and Fibre Optics",
  18: "Construction Products",
  7: "Cosmetics and Toiletries",
  21: "EDP Hardware and Software",
  9: "EDP and Office Equipment Maintenance",
  26: "Electrical and Electronics",
  8: "Energy",
  22: "Engines, Turbines, Components and Accessories",
  28: "Fabricated Materials",
  10: "Fire Fighting, Security and Safety Equipment",
  2: "Food",
  24: "Food Preparation and Serving Equipment",
  3: "Furniture",
  12: "Industrial Equipment",
  16: "Machinery and Tools",
  17: "Marine",
  13: "Medical Equipment, Supplies, and Pharmaceuticals",
  25: "Miscellaneous Goods",
  19: "Office Equipment",
  23: "Office Stationery and Supplies",
  6: "Prefabricated Structures",
  29: "Publications, Forms, and Paper Products",
  14: "Scientific Instruments",
  31: "Special Purpose Vehicles",
  15: "Systems Integration",
  30: "Textiles and Apparel",
  11: "Transportation Equipment and Spares",
  56: "Sales of immovable property",
  55: "Sales of movable property",
  57: "Undefined",
  58: "Partnership",
  38: "Research and Development (R&D)",
  34: "Special Studies and Analysis",
  39: "Architect and Engineering Services",
  50: "Information Processing and Related Telecommunications Services",
  46: "Environmental Services",
  42: "Natural Resources Services",
  43: "Health and Social Services",
  32: "Quality Control, Testing, Inspection, and Technical Representative Services",
  33: "Maintenance, Repair, Modification, Rebuilding, and Installation of Goods/Equipment",
  41: "Custodial Operations and Related Services",
  47: "Financial and Related Services",
  35: "Government Operation",
  44: "Professional, Administrative, and Management Support Services",
  49: "Utilities",
  40: "Communications, Photographic, Mapping, Printing, and Publication Services",
  48: "Educational and Training Services",
  45: "Transportation, Travel, and Relocation Services",
  36: "Lease and Rental of Equipment",
  37: "Leasing or Rental of Facilities",
};

/**
 * Converts a Quebec tender row to the unified schema.
 * Assumes quebecCategoryMapper() is in scope.
 */
export function mapQuebecTender(row: any) {
  // Status mapping (6 = open, otherwise closed or other logic if needed)
  let status = null;
  if (typeof row.statutAvisId === "number") {
    status = row.statutAvisId === 6 ? "open" : "closed";
  }

  return {
    id: row.id || row.uuid,
    source: "quebec",
    source_reference: row.numero,
    source_url: `${URLS.QUEBEC.TENDER_DETAIL(row.uuid)}`,

    title: row.titre,
    description: null, // No description in sample. Add if you get it.
    status,

    published_date: row.datePublicationUtc,
    closing_date: row.dateFermetureUtc,
    contract_start_date: null, // Not present in Quebec data

    contracting_entity_name: row.nomDonneurOuvrage,
    contracting_entity_city: null, // Not in data
    contracting_entity_province: "QC",
    contracting_entity_country: "CA",

    delivery_location: Array.isArray(row.regionIds)
      ? row.regionIds.join(", ")
      : null,
    category_primary: mapQuebecCategoryToCentral(row.categorieId),
    procurement_type: "tender", // If you want to map typeAvisId to 'rfp', add logic here
    procurement_method: "open",

    estimated_value_min: null,
    currency: "CAD",

    contact_name: null,
    contact_email: null,
    contact_phone: null,

    gsin: null,
    unspsc: null,

    plan_takers_count: null,
    submissions_count: null,

    embedding: null,
    summary: null,

    last_scraped_at: new Date().toISOString(),
  };
}

export const CENTRALIZED_CATEGORIES = [
  "Construction",
  "Engineering",
  "IT & Software",
  "Professional Services",
  "Medical & Healthcare",
  "Transportation",
  "Education & Training",
  "Facilities & Maintenance",
  "Utilities & Energy",
  "Office & Supplies",
  "Food & Catering",
  "Security & Safety",
  "Real Estate & Leasing",
  "Environmental",
  "Telecommunications",
  "Scientific & Lab Services",
  "Administrative Services",
  "Financial Services",
  "Research & Development",
  "Manufacturing & Industrial",
  "Miscellaneous",
];

function mapCanadianCategoryToCentral(code: string): string {
  switch (code) {
    case "CNST":
      return "Construction";
    case "GD":
      return "Office & Supplies";
    case "SRV":
      return "Professional Services";
    case "SRVTGD":
      return "Facilities & Maintenance";
    default:
      return "Miscellaneous";
  }
}

/**
 * Maps Quebec category IDs to centralized categories.
 */
function mapQuebecCategoryToCentral(categorieId: number): string {
  const map: Record<number, string> = {
    52: "Construction",
    53: "Construction",
    51: "Construction",
    39: "Engineering",
    50: "IT & Software",
    1: "Transportation",
    20: "Facilities & Maintenance",
    4: "Security & Safety",
    27: "Manufacturing & Industrial",
    5: "Telecommunications",
    18: "Construction",
    7: "Medical & Healthcare",
    21: "IT & Software",
    9: "Facilities & Maintenance",
    26: "Manufacturing & Industrial",
    8: "Utilities & Energy",
    22: "Transportation",
    28: "Manufacturing & Industrial",
    10: "Security & Safety",
    2: "Food & Catering",
    24: "Food & Catering",
    3: "Office & Supplies",
    12: "Manufacturing & Industrial",
    16: "Manufacturing & Industrial",
    17: "Transportation",
    13: "Medical & Healthcare",
    25: "Miscellaneous",
    19: "Office & Supplies",
    23: "Office & Supplies",
    6: "Construction",
    29: "Office & Supplies",
    14: "Scientific & Lab Services",
    31: "Transportation",
    15: "IT & Software",
    30: "Office & Supplies",
    11: "Transportation",
    56: "Real Estate & Leasing",
    55: "Real Estate & Leasing",
    57: "Miscellaneous",
    58: "Miscellaneous",
    38: "Research & Development",
    34: "Research & Development",
    46: "Environmental",
    42: "Environmental",
    43: "Medical & Healthcare",
    32: "Scientific & Lab Services",
    33: "Facilities & Maintenance",
    41: "Facilities & Maintenance",
    47: "Financial Services",
    35: "Administrative Services",
    44: "Professional Services",
    49: "Utilities & Energy",
    40: "Telecommunications",
    48: "Education & Training",
    45: "Transportation",
    36: "Real Estate & Leasing",
    37: "Real Estate & Leasing",
  };

  return map[categorieId] || "Miscellaneous";
}
