export function createShipment(buyerID, orderNumber, sellerID, orderItems) {
  const trackingNumber = `TRACK-${Math.floor(100000 + Math.random() * 900000)}`;
  const daysToDeliver = Math.floor(3 + Math.random() * 5); // 3–7 days

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + daysToDeliver);    

  return {
    success: true,
    buyerID,
    orderNumber,
    sellerID,
    trackingNumber,
    estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
    orderItems,
    message: `Shipment created for order ${orderNumber} (user ${buyerID}) with seller ${sellerID}.`
  };
}