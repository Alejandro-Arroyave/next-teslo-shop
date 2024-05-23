export * from "./generatePaginationNumbers";
export * from "./sleep";
export * from "./currencyFormat";

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
