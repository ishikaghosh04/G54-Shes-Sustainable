export function createShipment(userID, orderID, sellerID, orderItems) {
  const trackingNumber = `TRACK-${Math.floor(100000 + Math.random() * 900000)}`;
  const daysToDeliver = Math.floor(3 + Math.random() * 5); // 3–7 days

  // Assume the current date for the delivery date
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + daysToDeliver);    

  return {
    success: true,
    orderID,
    userID,
    sellerID,
    trackingNumber,
    estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
    orderItems, // Include the items that are part of this shipment
    message: `Shipment created for order ${orderID} belonging to user ${userID} with seller ${sellerID}.`
  };
}