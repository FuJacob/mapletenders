/**
 * Calculate the number of days remaining until a specified date
 * @param dateString ISO date string or Date object
 * @returns Number of days remaining (negative if date has passed)
 */
export function getDaysRemaining(dateString: string): number {
  const targetDate = new Date(dateString);
  const currentDate = new Date();

  // Reset hours to compare just the dates
  targetDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate difference in milliseconds
  const differenceMs = targetDate.getTime() - currentDate.getTime();

  // Convert to days
  const daysDifference = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  return daysDifference;
}
