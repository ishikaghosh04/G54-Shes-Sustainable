import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";
import { createShipment } from "./mock/mockShipment.js"; // Assuming you still use a mock service for creating shipment estimates

const router = express.Router();

// NOTE: calculating dynamically shippedDate

export default (db) => {
  const query = promisify(db.query).bind(db);
  const FLAT_RATE = 2.99; // constant shipping fee per seller

  // RENAMED FROM /order/:orderID/estimate

  // Estimate shipping cost & ETA grouped by seller
  router.get("/order/:orderNumber/estimate", verifyToken, async (req, res) => {
      const buyerID = req.user.userID;
      const orderNumber = Number(req.params.orderNumber);
  
      try {
        // 1. Check if the order exists and belongs to the user
        const orderCheck = await query(
          "SELECT 1 FROM `Order` WHERE buyerID = ? AND orderNumber = ?",
          [buyerID, orderNumber]
        );
  
        if (!orderCheck.length) {
          return res.status(403).json({ message: "Forbidden or invalid order." });
        }
  
        // 2. Group order items by sellerID
        const groups = await query(
          `SELECT p.sellerID, GROUP_CONCAT(oi.productID) AS productIDs
           FROM OrderItem oi
           JOIN Product p ON oi.productID = p.productID
           WHERE oi.buyerID = ? AND oi.orderNumber = ?
           GROUP BY p.sellerID`,
          [buyerID, orderNumber]
        );
  
        if (!groups.length) return res.status(400).json({ message: "No items in order." });
  
        // 3. Mock estimates per seller
        const estimates = groups.map(row => {
          const productIDs = String(row.productIDs).split(",").map(Number);
          const mock = createShipment(buyerID, orderNumber); // Generate mock ETA
          return {
            sellerID: row.sellerID,
            productIDs,
            shippingCost: FLAT_RATE,
            estimatedDelivery: mock.estimatedDelivery,
          };
        });
  
        res.json({ buyerID, orderNumber, estimates });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Estimate failed", details: err.message });
      }
  });
  
  // RENAMED FROM /order/:orderID

  router.post("/order/:orderNumber", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderNumber = Number(req.params.orderNumber);
    const {
      shippingStreet,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      useProfileAddress,
    } = req.body;
  
    try {
      const orderCheck = await query(
        "SELECT status FROM `Order` WHERE orderNumber = ? AND buyerID = ?",
        [orderNumber, buyerID]
      );
  
      if (!orderCheck.length || orderCheck[0].status !== "Pending") {
        return res.status(403).json({ message: "Order is already processed or invalid." });
      }
  
      // Clean up previous shipping records
      await query(
        `DELETE FROM Shipping WHERE buyerID = ? AND orderNumber = ?`,
        [buyerID, orderNumber]
      );
  
      let finalStreet, finalCity, finalProvince, finalPostalCode;
  
      if (useProfileAddress) {
        const profile = await query(
          "SELECT street, city, province, postalCode FROM User WHERE userID = ?",
          [buyerID]
        );
  
        if (!profile.length) return res.status(404).json({ message: "User profile not found." });
  
        const { street, city, province, postalCode } = profile[0];
        if (!street || !city || !province || !postalCode) {
          return res.status(400).json({ message: "Incomplete address in user profile." });
        }
  
        finalStreet = street;
        finalCity = city;
        finalProvince = province;
        finalPostalCode = postalCode;
      } else {
        if (!shippingStreet || !shippingCity || !shippingProvince || !shippingPostalCode) {
          return res.status(400).json({ message: "Please fill out all shipping address fields." });
        }
  
        if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(shippingPostalCode)) {
          return res.status(400).json({ message: "Invalid postal code format." });
        }
  
        finalStreet = shippingStreet;
        finalCity = shippingCity;
        finalProvince = shippingProvince;
        finalPostalCode = shippingPostalCode;
      }
  
      // Group products by seller for this order
      const groups = await query(
        `SELECT p.sellerID, oi.productID
           FROM OrderItem oi
           JOIN Product p ON oi.productID = p.productID
          WHERE oi.orderNumber = ? AND oi.buyerID = ?`,
        [orderNumber, buyerID]
      );
  
      if (!groups.length) return res.status(400).json({ message: "No items in the order." });
  
      const sellerGroups = {};
      for (const item of groups) {
        if (!sellerGroups[item.sellerID]) {
          sellerGroups[item.sellerID] = [];
        }
        sellerGroups[item.sellerID].push(item.productID);
      }
  
      const inserts = [];
      const shipments = [];
  
      for (const sellerID in sellerGroups) {
        const productIDs = sellerGroups[sellerID];
        const shipment = createShipment(buyerID, orderNumber, sellerID, productIDs);
  
        // Prepare insert values: one row per product
        productIDs.forEach(productID => {
          inserts.push([
            buyerID,
            orderNumber,
            productID,
            shipment.trackingNumber,
            FLAT_RATE,
            finalStreet,
            finalCity,
            finalProvince,
            finalPostalCode,
            shipment.estimatedDelivery
          ]);
        });
  
        shipments.push({
          sellerID,
          trackingNumber: shipment.trackingNumber,
          shippingCost: FLAT_RATE,
          estDeliveryDate: shipment.estimatedDelivery,
          productIDs
        });
      }
  
      // Insert shipping details
      await query(
        `INSERT INTO Shipping (
           buyerID, orderNumber, productID, trackingNumber, shippingCost,
           shippingStreet, shippingCity, shippingProvince, 
           shippingPostalCode, estDeliveryDate
         ) VALUES ?`,
        [inserts]
      );
  
      res.status(201).json({ orderNumber, shipments });
  
    } catch (err) {
      console.error("Commit shipping error:", err);
      res.status(500).json({ error: "Server error during shipping commit." });
    }
  });
  
  
  // Fetch shipping + order info for a specific order
  router.get("/order/:orderNumber", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderNumber = Number(req.params.orderNumber);
  
    try {
      // Check if the order belongs to the buyer
      const orderCheck = await query(
        "SELECT 1 FROM `Order` WHERE orderNumber = ? AND buyerID = ?",
        [orderNumber, buyerID]
      );
  
      if (!orderCheck.length) {
        return res.status(403).json({ message: "Forbidden or invalid order." });
      }
  
      // Fetch shipping + order info using new schema
      const rows = await query(
        `SELECT 
            s.trackingNumber,
            s.shippingCost,
            s.estDeliveryDate,
            s.status,
            s.shippedDate,
            p.name AS productName,
            u.firstName AS sellerFirstName,
            u.lastName AS sellerLastName,
            u.email AS sellerEmail
         FROM Shipping s
         JOIN OrderItem oi 
           ON s.buyerID = oi.buyerID 
          AND s.orderNumber = oi.orderNumber 
          AND s.productID = oi.productID
         JOIN Product p ON p.productID = oi.productID
         JOIN User u ON u.userID = p.sellerID
         WHERE s.buyerID = ? AND s.orderNumber = ?`,
        [buyerID, orderNumber]
      );
  
      res.json(rows);
    } catch (err) {
      console.error("Fetch shipping error:", err);
      res.status(500).json({ error: "Server error fetching shipping." });
    }
  });  

  return router;
};