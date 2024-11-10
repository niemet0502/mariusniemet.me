const months = [
  "January",
  "February",
  "March",
  "April",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const transformDateToMonthYearLetter = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);

  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};
