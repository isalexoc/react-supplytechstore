const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "America/Caracas", // Adjust as necessary for your specific South American time zone
  }).format(date);
};

export default formatDate;
