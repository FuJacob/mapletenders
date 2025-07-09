import { useEffect, useState } from "react";
import { getFilteredTenderNoticesFromDB } from "../api";
import { type Tender } from "../features/tenders/types";

export function FilteredTenderData() {
  const [tableData, setTableData] = useState<Tender[]>([]);

  useEffect(() => {
    const getOpenTenderNoticesData = async function () {
      setTableData(await getFilteredTenderNoticesFromDB());
    };
    getOpenTenderNoticesData();
  }, []);

  const TenderTable = ({ data }: { data: Tender[] }) => {
    const headers = Object.keys(data[0]);

    return (
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header, cellIndex) => (
                <td key={cellIndex}>
                  <div className="max-h-12 overflow-y-auto">
                    {String(
                      (row as unknown as Record<string, unknown>)[header] || ""
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {tableData && tableData.length > 0 ? (
        <TenderTable data={tableData} />
      ) : null}
    </>
  );
}

export default FilteredTenderData;
