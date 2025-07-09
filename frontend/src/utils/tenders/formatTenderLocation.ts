export function formatTenderLocation(locationString: string | null): string {
  if (!locationString) return "-";
  const locations = locationString.split("*").filter(Boolean);
  const cleanedLocations = locations.map((location) => {
    return location.trim();
  });
  return cleanedLocations.join(", ");
}
