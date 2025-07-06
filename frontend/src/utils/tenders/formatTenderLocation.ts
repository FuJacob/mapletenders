export function formatTenderLocation(locationString: string): string {
  const locations = locationString.split("*").filter(Boolean);
  const cleanedLocations = locations.map((location) => {
    return location.trim();
  });
  return cleanedLocations.join(", ");
}
