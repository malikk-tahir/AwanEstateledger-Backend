import ErrorHandler from "./ErrorHandler.js";

export const getDateFilter = (query) => {
  const { startDate, endDate } = query;
  const dateFilter = {};

  if (startDate) {
    const parsedStartDate = new Date(startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw new ErrorHandler("Invalid startDate format", 400);
    }
    dateFilter.$gte = parsedStartDate;
  }

  if (endDate) {
    const parsedEndDate = new Date(
      /^\d{4}-\d{2}-\d{2}$/.test(endDate)
        ? `${endDate}T23:59:59.999Z`
        : endDate,
    );
    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new ErrorHandler("Invalid endDate format", 400);
    }
    dateFilter.$lte = parsedEndDate;
  }

  if (dateFilter.$gte && dateFilter.$lte && dateFilter.$gte > dateFilter.$lte) {
    throw new ErrorHandler("startDate must be before or equal to endDate", 400);
  }

  return dateFilter;
};
