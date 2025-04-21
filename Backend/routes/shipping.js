import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { createShipment } from "./mock/mockShipment.js";
import { promisify } from "util";

export default (db) => {
  const query = promisify(db.query).bind(db);
  const router = express.Router();

  const FLAT_RATE = 2.99; // constant shipping fee per seller

  // Estimate shipping cost & ETA grouped by seller
  router.get("/order/:orderID/estimate", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);

    try {
      const own = await query(
        "SELECT 1 FROM `Order` WHERE orderID=? AND buyerID=?",
        [orderID, buyerID]
      );
      if (!own.length) return res.status(403).json({ message: "Forbidden" });

      const groups = await query(
        `SELECT p.sellerID, GROUP_CONCAT(oc.productID) AS productIDs
           FROM OrderContains oc
           JOIN Product p ON oc.productID = p.productID
          WHERE oc.orderID = ?
          GROUP BY p.sellerID`,
        [orderID]
      );

      if (!groups.length) return res.status(400).json({ message: "No items" });

      const estimates = groups.map(row => {
        const productIDs = String(row.productIDs).split(",").map(Number);
        const mock = createShipment(buyerID, orderID);
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

  // Commit shipping for all items in an order (orderID may be corrupted)
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
      const orderRows = await query(
        "SELECT status FROM `Order` WHERE orderID = ? AND buyerID = ?",
        [orderID, buyerID]
      );
      if (!orderRows.length || orderRows[0].status !== "Processed") {
        return res.status(403).json({ message: "Order not processed (payment missing) or forbidden." });
      }

      let finalStreet = shippingStreet;
      let finalCity = shippingCity;
      let finalProvince = shippingProvince;
      let finalPostalCode = shippingPostalCode;

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
      }

      const groups = await query(
        `SELECT p.sellerID, GROUP_CONCAT(oc.productID) AS productIDs
           FROM OrderContains oc
           JOIN Product p ON oc.productID = p.productID
          WHERE oc.orderID = ?
          GROUP BY p.sellerID`,
        [orderID]
      );

      if (!groups.length) return res.status(400).json({ message: "No items to ship." });

      const inserts = [];
      const shipments = [];

      for (const grp of groups) {
        const productIDs = grp.productIDs.split(",").map(Number);
        const { trackingNumber, estimatedDelivery } = createShipment(buyerID, orderID);

        productIDs.forEach(productID => {
          inserts.push([
            orderID, productID, trackingNumber,
            FLAT_RATE, finalStreet, finalCity,
            finalProvince, finalPostalCode, estimatedDelivery
          ]);
        });

        shipments.push({
          sellerID: grp.sellerID,
          productIDs,
          trackingNumber,
          shippingCost: FLAT_RATE,
          estDeliveryDate: estimatedDelivery
        });
      }

      await query(
        `INSERT INTO Shipping (
           orderID, productID, trackingNumber,
           shippingCost, shippingStreet, shippingCity,
           shippingProvince, shippingPostalCode, estDeliveryDate
         ) VALUES ?`,
        [inserts]
      );

      res.status(201).json({ orderID, shipments });
    } catch (err) {
      console.error("Commit shipping error:", err);
      res.status(500).json({ error: "Server error during shipping commit." });
    }
  });

  // Get all shipping records for an order
  router.get("/order/:orderID", verifyToken, async (req, res) => {
    const buyerID = req.user.userID;
    const orderID = Number(req.params.orderID);

    try {
      const own = await query(
        "SELECT 1 FROM `Order` WHERE orderID = ? AND buyerID = ?",
        [orderID, buyerID]
      );
      if (!own.length) return res.status(403).json({ message: "Forbidden" });

      const rows = await query(
        `SELECT shippingID, productID, trackingNumber,
                shippingCost, shippingStreet, shippingCity,
                shippingProvince, shippingPostalCode,
                estDeliveryDate, status, shippedDate, actualDeliveryDate
           FROM Shipping
          WHERE orderID = ?`,
        [orderID]
      );

      res.json(rows);
    } catch (err) {
      console.error("Fetch shipping error:", err);
      res.status(500).json({ error: "Server error fetching shipping." });
    }
  });

  return router;
};