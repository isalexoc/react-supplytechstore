export const capitalizeString = (string) => {
  let finalString = string.toLowerCase();
  finalString = finalString.charAt(0).toUpperCase() + finalString.slice(1);
  return finalString;
};
