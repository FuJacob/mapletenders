/**
 * Parse Mississauga date format "/Date(1749216600000)/" to ISO string
 */
export function parseBidAndTendersDate(dateStr: string): string | null {
  if (!dateStr || !dateStr.includes("/Date(")) return null;

  const match = dateStr.match(/\/Date\((\d+)\)\//);
  if (!match) return null;

  const timestamp = parseInt(match[1]);
  return new Date(timestamp).toISOString();
}

/**
 * Parse Canadian date string format and return ISO string or null
 */
export function parseCanadianDate(dateString: string): string | null {
  if (!dateString || dateString.trim() === "") return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Parse Ontario date string format and return ISO string or null
 */
export function parseOntarioDate(dateInput: any): string | null {
  if (dateInput == null) return null; // handles undefined/null
  if (typeof dateInput === "number" && !isNaN(dateInput)) {
    // Excel serial number
    const excelEpoch = Date.UTC(1899, 11, 30);
    const millis = Math.round(dateInput * 24 * 60 * 60 * 1000);
    const date = new Date(excelEpoch + millis);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof dateInput === "string" && dateInput.trim()) {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}
