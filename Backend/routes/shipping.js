// routes/shipping.js
import express from "express";
import verifyToken from "./middlewares/verifyToken.js";
import { createShipment } from "../mock/mockShipment.js";
import { promisify } from "util";

export default (db) => {
  const query = promisify(db.query).bind(db);
  const router = express.Router();

  const FLAT_RATE = 2.99;  // one shipping fee per seller

  /**
   * 1) Estimate shipping cost & ETA grouped by seller.
   * GET /api/orders/:orderID/shipping/estimate
   */
  router.get(
    "/orders/:orderID/shipping/estimate",
    verifyToken,
    async (req, res) => {
      const buyerID = req.user.userID;
      const orderID = Number(req.params.orderID);

      try {
        // Verify owner
        const own = await query(
          "SELECT 1 FROM `Order` WHERE orderID=? AND buyerID=?",
          [orderID, buyerID]
        );
        if (!own.length) return res.status(403).json({ message: "Forbidden" });

        // Group productIDs by sellerID
        const groups = await query(
          `SELECT p.sellerID, GROUP_CONCAT(oc.productID) AS productIDs
             FROM OrderContains oc
             JOIN Product p ON oc.productID = p.productID
            WHERE oc.orderID = ?
            GROUP BY p.sellerID`,
          [orderID]
        );
        if (!groups.length) return res.status(400).json({ message: "No items" });

        // Build estimates
        const estimates = groups.map(row => {
          const productIDs = String(row.productIDs)
            .split(",")
            .map(id => Number(id));
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
    }
  );
    /**
     * POST /api/orders/:orderID/shipping
     * Commits shipping for all items in an order, grouped by seller.
     * Requires:
     *  - order.status = 'Processed' (i.e. payment done)
     *  - buyer owns the order
     */
    router.post(
      "/orders/:orderID/shipping",
      verifyToken,
      async (req, res) => {
        const buyerID = req.user.userID;
        const orderID = Number(req.params.orderID);
        const {
          shippingAddress,
          shippingCity,
          shippingProvince,
          shippingPostalCode,
        } = req.body;
  
        try {
          // 1) Verify payment done & ownership
          const [orderRows] = await query(
            `SELECT status 
               FROM \`Order\` 
              WHERE orderID = ? 
                AND buyerID = ?`,
            [orderID, buyerID]
          );
          if (!orderRows || orderRows.status !== "Processed") {
            return res
              .status(403)
              .json({ message: "Order not processed (payment missing) or forbidden." });
          }
  
          // 2) Group items by seller
          const groups = await query(
            `SELECT p.sellerID, GROUP_CONCAT(oc.productID) AS productIDs
               FROM OrderContains oc
               JOIN Product p ON oc.productID = p.productID
              WHERE oc.orderID = ?
              GROUP BY p.sellerID`,
            [orderID]
          );
          if (!groups.length) {
            return res.status(400).json({ message: "No items to ship." });
          }
  
          // 3) Build bulk‑insert of one tracking number per group
          const inserts = [];
          const shipments = [];
  
          for (let grp of groups) {
            const productIDs = grp.productIDs
              .split(",").map(id => Number(id));
            const mock = createShipment(buyerID, orderID);
            const trackingNumber = mock.trackingNumber;
            const eta = mock.estimatedDelivery;
  
            productIDs.forEach(pid => {
              inserts.push([
                orderID, pid, trackingNumber,
                FLAT_RATE, shippingAddress,
                shippingCity, shippingProvince,
                shippingPostalCode, eta
              ]);
            });
  
            shipments.push({
              sellerID: grp.sellerID,
              productIDs,
              trackingNumber,
              shippingCost: FLAT_RATE,
              estDeliveryDate: eta
            });
          }
  
          // 4) Insert into Shipping
          await query(
            `INSERT INTO Shipping
               (orderID, productID, trackingNumber,
                shippingCost, shippingAddress,
                shippingCity, shippingProvince,
                shippingPostalCode, estDeliveryDate)
             VALUES ?`,
            [inserts]
          );
  
          res.status(201).json({ orderID, shipments });
        } catch (err) {
          console.error("Commit shipping error:", err);
          res.status(500).json({ error: "Server error during shipping commit." });
        }
      }
    );
  
    /**
     * GET /api/orders/:orderID/shipping
     * List all shipping records for an order.
     */
    router.get(
      "/orders/:orderID/shipping",
      verifyToken,
      async (req, res) => {
        const buyerID = req.user.userID;
        const orderID = Number(req.params.orderID);
  
        try {
          // optional: verify owner
          await query(
            "SELECT 1 FROM `Order` WHERE orderID = ? AND buyerID = ?",
            [orderID, buyerID]
          );
  
          const rows = await query(
            `SELECT shippingID, productID, trackingNumber,
                    shippingCost, shippingAddress, shippingCity,
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
      }
    );
  
    return router;
  };
  