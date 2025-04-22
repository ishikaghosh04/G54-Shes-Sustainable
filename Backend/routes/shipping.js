import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { promisify } from "util";
import { createShipment } from "./mock/mockShipment.js"; // Assuming you still use a mock service for creating shipment estimates

const router = express.Router();

export default (db) => {
  const query = promisify(db.query).bind(db);
  const FLAT_RATE = 2.99; // constant shipping fee per seller

  // Estimate shipping cost & ETA grouped by seller (using orderID and checking items by seller)
  router.get("/order/:orderID/estimate", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);

    try {
      const orderCheck = await query(
        "SELECT 1 FROM `Order` WHERE orderID = ? AND buyerID = ?",
        [orderID, buyerID]
      );

      if (!orderCheck.length) {
        return res.status(403).json({ message: "Forbidden or invalid order." });
      }

      // Group order items by seller and fetch product IDs
      const groups = await query(
        `SELECT p.sellerID, GROUP_CONCAT(oi.productID) AS productIDs
           FROM OrderItem oi
           JOIN Product p ON oi.productID = p.productID
          WHERE oi.orderID = ?
          GROUP BY p.sellerID`,
        [orderID]
      );

      if (!groups.length) return res.status(400).json({ message: "No items in order." });

      const estimates = groups.map(row => {
        const productIDs = String(row.productIDs).split(",").map(Number);
        const mock = createShipment(buyerID, orderID); // Mock shipment details
        return {
          sellerID: row.sellerID,
          productIDs,
          shippingCost: FLAT_RATE,
          estimatedDelivery: mock.estimatedDelivery,
        };
      });

      res.json({ orderID, estimates });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Estimate failed" });
    }
  });

  // Input shipping details (occurs once button has been clicked after shipping address input)
  router.post("/order/:orderID", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);
    const {
      shippingStreet,
      shippingCity,
      shippingProvince,
      shippingPostalCode,
      useProfileAddress,
    } = req.body;
  
    try {
      const orderCheck = await query(
        "SELECT status FROM `Order` WHERE orderID = ? AND buyerID = ?",
        [orderID, buyerID]
      );
  
      // Check if the order exists and hasn't been processed yet
      if (!orderCheck.length || orderCheck[0].status !== "Pending") {
        return res.status(403).json({ message: "Order is already processed or invalid." });
      }

      // Clean up previous shipping attempts (if user is restarting checkout flow)
      await query(
        `DELETE s
          FROM Shipping s
          JOIN OrderItem oi ON s.orderItemID = oi.orderItemID
          WHERE oi.orderID = ?`,
        [orderID]
      );
  
      // If using profile address
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
      }else {
        if (!shippingStreet || !shippingCity || !shippingProvince || !shippingPostalCode) {
          return res.status(400).json({ message: "Please fill out all shipping address fields." });
        }
          // Validate postal code format (e.g., for Canada)
        if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(shippingPostalCode)) {
          return res.status(400).json({ message: "Invalid postal code format." });
        }
        finalStreet = shippingStreet;
        finalCity = shippingCity;
        finalProvince = shippingProvince;
        finalPostalCode = shippingPostalCode;
      }      
  
      // Group items by seller
      const groups = await query(
        `SELECT oi.orderItemID, p.sellerID, oi.productID
           FROM OrderItem oi
           JOIN Product p ON oi.productID = p.productID
          WHERE oi.orderID = ?`,
        [orderID]
      );
  
      if (!groups.length) return res.status(400).json({ message: "No items in the order." });
  
      const inserts = [];
      const shipments = [];
  
      // Process each seller's group of items
      const sellerGroups = {}; // A dictionary to store items grouped by seller
      groups.forEach(grp => {
        if (!sellerGroups[grp.sellerID]) {
          sellerGroups[grp.sellerID] = [];
        }
        sellerGroups[grp.sellerID].push(grp);
      });
  
      // Create shipment for each seller
      for (const sellerID in sellerGroups) {
        const orderItems = sellerGroups[sellerID];
        const shipment = createShipment(buyerID, orderID, sellerID, orderItems);
  
        // Prepare data for inserting shipping info into the database
        orderItems.forEach(item => {
          inserts.push([
            item.orderItemID,
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
          orderItems: shipment.orderItems
        });
      }
  
      // Insert shipping details into Shipping table
      await query(
        `INSERT INTO Shipping (
           orderItemID, trackingNumber, shippingCost,
           shippingStreet, shippingCity, shippingProvince, 
           shippingPostalCode, estDeliveryDate
         ) VALUES ?`,
        [inserts]
      );
  
      res.status(201).json({ orderID, shipments });
  
    } catch (err) {
      console.error("Commit shipping error:", err);
      res.status(500).json({ error: "Server error during shipping commit." });
    }
  });
  
  // Fetch shipping + order info for a specific order
  router.get("/order/:orderID", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);

    try {
        // Check if the order belongs to the buyer
        const orderCheck = await query(
            "SELECT 1 FROM `Order` WHERE orderID = ? AND buyerID = ?",
            [orderID, buyerID]
        );

        if (!orderCheck.length) {
            return res.status(403).json({ message: "Forbidden or invalid order." });
        }

        // Fetch shipping + order info for the order
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
           JOIN OrderItem oi ON oi.orderItemID = s.orderItemID
           JOIN Product p ON p.productID = oi.productID
           JOIN User u ON u.userID = p.sellerID
           WHERE oi.orderID = ?`,
          [orderID]
        );        

        // Return the shipping records
        res.json(rows);
    } catch (err) {
        console.error("Fetch shipping error:", err);
        res.status(500).json({ error: "Server error fetching shipping." });
    }
  });

  return router;
};