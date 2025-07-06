import { createColumnHelper } from "@tanstack/react-table";
import { type TenderNoticeInterface } from "./types";

import {
  LinkSimpleHorizontal,
  ClockCountdown,
  Warning,
} from "@phosphor-icons/react";
import React from "react";
import { convertTenderCategory, formatTenderLocation } from "../../utils";
const columnHelper = createColumnHelper<TenderNoticeInterface>();

export const tenderColumns = [
  columnHelper.accessor("title", {
    header: "Title",
  }),
  columnHelper.accessor("procurement_category", {
    header: "Category",
    cell: (info) => {
      const raw = info.getValue();
      const categoryCodes = raw.split("*").filter(Boolean); // split on whitespace
      const categories = categoryCodes.map((code) =>
        convertTenderCategory(code.trim().slice(1))
      ); // remove "*"
      return categories.join(", ");
    },
  }),
  columnHelper.accessor("publication_date", {
    header: "Publication Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("tender_closing_date", {
    header: "Closing Date",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("contracting_entity_name", {
    header: "Organization",
  }),
  columnHelper.accessor("regions_of_delivery", {
    header: "Location",
    cell: (info) => formatTenderLocation(info.getValue()),
  }),
  columnHelper.accessor("notice_url", {
    header: "View Notice",
    cell: (info) => {
      const url = info.getValue();
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
        >
          <LinkSimpleHorizontal size={16} />
          View
        </a>
      );
    },
  }),
];
