import React, { createContext, useState, useEffect } from 'react';

export const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const load = (key, def) => {
        const json = localStorage.getItem(key);
        try { return json ? JSON.parse(json) : def; }
        catch { return def; }
    };

    const [orderSummary, setOrderSummary]   = useState(() => load('orderSummary', null));
    const [shippingInfo,  setShippingInfo]  = useState(() => load('shippingInfo', {}));
    const [paymentInfo,   setPaymentInfo]   = useState(() => load('paymentInfo', {}));
    
    useEffect(() => {
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
      }, [orderSummary]);
    
      useEffect(() => {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
      }, [shippingInfo]);
    
      useEffect(() => {
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
      }, [paymentInfo]);


  return (
    <CheckoutContext.Provider value={{
      shippingInfo,   setShippingInfo,
      paymentInfo,    setPaymentInfo,
      orderSummary,   setOrderSummary
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};
