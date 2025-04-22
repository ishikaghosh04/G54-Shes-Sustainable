import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import './Confirmation.css';

export default function ConfirmationPage() {
  const { state }     = useLocation();  // contains orderID, subtotal, etc.
  const navigate      = useNavigate();
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    if (!state?.orderID) return;
    API.get(`/shipping/order/${state.orderID}`)
      .then(({ data: rows }) => {
        // group by sellerID
        const bySeller = Object.values(
          rows.reduce((acc, r) => {
            // use r.sellerID only if you joined it
            // if you haven’t joined sellerID in SQL, you can pull it later via another call
            const key = r.sellerID;
            if (!acc[key]) {
              acc[key] = {
                sellerID:       r.sellerID,
                tracking:       r.trackingNumber,
                shippingCost:   Number(r.shippingCost),
                eta:            r.estDeliveryDate,
                items:          []
              };
            }
            acc[key].items.push({
              orderItemID: r.orderItemID,
              productID:   r.productID,
              productName: r.productName  // only if you SELECTed p.name as productName
            });
            return acc;
          }, {})
        );
        setShipments(bySeller);
      })
      .catch(() => {
        /* handle error */
      });
  }, [state]);

  if (!state?.orderID) {
    return <div>No order to confirm. <button onClick={()=>navigate('/product')}>Shop</button></div>;
  }

  return (
    <div className="confirmation-page">
      <h2> Thank you for your order! </h2>
      <p>Your payment was successful. Here are your order details:</p>
      <div className="order-summary">
      {shipments.map((ship, i) => (
        <section key={ship.sellerID}>
          <h3>Shipment {i+1}</h3>
          <p><strong>Tracking #:</strong> {ship.tracking}</p>
          <p><strong>Estimated Arrival:</strong> {new Date(ship.eta).toLocaleDateString()}</p>
          <p><strong>Shipping Cost:</strong> ${ship.shippingCost.toFixed(2)}</p>
          <p><strong>Items:</strong> {ship.items.map(it => it.productName).join(', ')}</p>
          {/* If you want seller contact you’ll need to include sellerName/email in the rows,
              or fetch it via `/users/:sellerID` per group */}
        </section>
      ))}

      <hr/>

      <p><strong>Items Total:</strong> ${state.subtotal.toFixed(2)}</p>
      <p><strong>Shipping Total:</strong> ${state.shippingTotal.toFixed(2)}</p>
      <p><strong>Grand Total:</strong> ${state.grandTotal.toFixed(2)}</p>

      <button onClick={() => navigate('/profile')} className="btn btn-primary">
        View Your Profile
      </button>
      </div>
    </div>
  );
}
