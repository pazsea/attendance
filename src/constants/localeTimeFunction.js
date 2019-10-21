export function localeTime(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1; //1
  let year = date.getYear();

  if (year < 1000) {
    year = year + 1900;
  }

  if (month < 10) {
    month = "0" + month;
  } //3

  if (day < 10) {
    day = "0" + day;
  } //4

  return year + "" + month + "" + day;
}
