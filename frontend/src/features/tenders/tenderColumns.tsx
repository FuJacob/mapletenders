import { createColumnHelper } from "@tanstack/react-table";
import { type TenderNoticeInterface } from "./types";

import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { convertTenderCategory, formatTenderLocation } from "../../utils";
const columnHelper = createColumnHelper<TenderNoticeInterface>();

export const tenderColumns = [
  columnHelper.accessor("title", {
    header: "Tender",
    cell: (info) => {
      const row = info.row.original;
      const title = info.getValue();
      const organization = row.contracting_entity_name || "-";
      const location = formatTenderLocation(row.regions_of_delivery) || "-";

      return (
        <a
          href={row.notice_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block space-y-2 py-1 hover:underline"
        >
          <div className="font-medium text-blue-900" title={title}>
            {title || "-"} <ArrowSquareOutIcon size={16} className="inline" />
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div title={organization}>
              <span className="font-medium">Organization:</span> {organization}
            </div>
            <div title={location}>
              <span className="font-medium">Location:</span> {location}
            </div>
          </div>
        </a>
      );
    },
    size: 450,
    minSize: 350,
  }),
  columnHelper.accessor("procurement_category", {
    header: "Category",
    cell: (info) => {
      const raw = info.getValue();
      if (!raw) return "-";

      const categoryCodes = raw.split("*").filter(Boolean);
      const categories = categoryCodes.map((code) =>
        convertTenderCategory(code.trim())
      );

      const displayText = categories.join(", ");
      return (
        <div className="truncate max-w-[150px]" title={displayText}>
          {displayText || "-"}
        </div>
      );
    },
    size: 150,
  }),
  columnHelper.accessor("publication_date", {
    header: "Dates",
    cell: (info) => {
      const row = info.row.original;
      const pubDate = row.publication_date;
      const closeDate = row.tender_closing_date;

      return (
        <div className="space-y-1 py-1">
          <div className="text-xs">
            <span className="font-medium">Published:</span>{" "}
            {pubDate ? new Date(pubDate).toLocaleDateString() : "-"}
          </div>
          <div className="text-xs">
            <span className="font-medium">Closing:</span>{" "}
            {closeDate ? new Date(closeDate).toLocaleDateString() : "-"}
          </div>
        </div>
      );
    },
    size: 150,
    minSize: 120,
  }),
];
