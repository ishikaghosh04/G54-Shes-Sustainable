export function createShipment(userID, orderID) {
    const trackingNumber = `TRACK-${Math.floor(100000 + Math.random() * 900000)}`;
    const daysToDeliver = Math.floor(3 + Math.random() * 5); // 3–7 days
    estimatedDelivery.setDate(estimatedDelivery.getDate() + daysToDeliver);    

    // const estimatedDelivery = new Date();
    // estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  
    return {
      success: true,
      orderID,
      userID,
      trackingNumber,
      estimatedDelivery: estimatedDelivery.toISOString().split("T")[0],
      message: `Shipment created for order ${orderID} belonging to user ${userID}.`
    };
}
  
  