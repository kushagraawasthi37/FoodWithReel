export function truncateDescription(description, maxLength = 100) {
  if (description.length <= maxLength) {
    return description;
  }
  return description.slice(0, maxLength) + "...";
}
