import type { TenderRow } from "./types";

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

export function mapCanadianTender(row: TenderRow) {
  return {
    tender_id: row["tenderId-identifiantAppelOffres"],
    title: row["title-titre"],
    description: row["description-description"],
    category_primary: mapCanadianCategoryToCentral(row["procurementCategory-categorieApprovisionnement"]),
    location: row["location-lieu"],
    publish_date: row["publishDate-datePublication"],
    closing_date: row["closingDate-dateCloture"],
    url: row["url-url"],
  };
}
