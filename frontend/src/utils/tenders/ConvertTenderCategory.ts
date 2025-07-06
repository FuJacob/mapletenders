export function convertTenderCategory(category: string): string {
  switch (category) {
    case "CNST":
      return "Construction";
    case "GD":
      return "Goods";
    case "SRV":
      return "Services";
    case "SRVTGD":
      return "Service related to Goods";
    default:
      return "Unknown";
  }
}
