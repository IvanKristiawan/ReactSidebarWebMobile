// formatDate function will return dd-mm-yyyy for UI Indonesia
export const formatDate = (date) => {
  let tempDate = new Date(date);
  return `${tempDate.getDate().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}/${(tempDate.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}/${tempDate.getFullYear()}`;
};
