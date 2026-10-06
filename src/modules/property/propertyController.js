import ErrorHandler from "../../utills/ErrorHandler.js";
import HandleAsyncError from "../../middleware/HandleAsyncErr.js";
import Property from "./propertyModel.js";

export const createProperty = HandleAsyncError(async (req, res, next) => {
  const {
    name,
    propertyType,
    location,
    size,
    isOwned,
    ownerName,
    ownerContact,
    purchasePrice,
    demandPrice,
    finalSellingPrice,
    taxPercentage,
    status,
  } = req.body;

  const newProperty = await Property.create({
    name,
    propertyType,
    location,
    size,
    isOwned,
    ownerName,
    ownerContact,
    purchasePrice,
    demandPrice,
    finalSellingPrice,
    taxPercentage,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: newProperty,
  });
});

export const addPaymentToProperty = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { amount, paymentType, note, date } = req.body;

  const property = await Property.findById(id);

  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }

  const newPayment = {
    amount,
    paymentType,
    note,
    date: date || Date.now(),
  };

  property.payments.push(newPayment);
  await property.save();

  res.status(200).json({
    success: true,
    message: "Payment added to property successfully",
    data: property,
  });
});

export const getAllProperties = HandleAsyncError(async (req, res, next) => {
  const properties = await Property.find().sort({ createdAt: -1 });

  // console.log(properties);
  res.status(200).json({
    success: true,
    message: "Properties retrieved successfully",
    data: properties,
  });
});

export const getPropertyById = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Property retrieved successfully",
    data: property,
  });
});

export const updateProperty = HandleAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    propertyType,
    location,
    size,
    isOwned,
    ownerName,
    ownerContact,
    purchasePrice,
    demandPrice,
    finalSellingPrice,
    taxPercentage,
    status,
  } = req.body;

  const property = await Property.findByIdAndUpdate(
    id,
    {
      name,
      propertyType,
      location,
      size,
      isOwned,
      ownerName,
      ownerContact,
      purchasePrice,
      demandPrice,
      finalSellingPrice,
      taxPercentage,
      status,
    },
    { new: true },
  );

  if (!property) {
    return next(new ErrorHandler("Property not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    data: property,
  });
});
