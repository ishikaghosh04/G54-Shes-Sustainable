export function processPayment(userID, amount) {
    const isSuccess = Math.random() > 0.1; // 90% success rate
  
    if (!isSuccess) {
      return { 
        success: false, 
        message: `Payment of $${amount.toFixed(2)} for user ${userID} failed. Please try again.` 
      };
    }
  
    return {
      success: true,
      transactionID: `TXN-${Date.now()}-${userID}`,
      amount: amount.toFixed(2),
      message: `Payment of $${amount.toFixed(2)} for user ${userID} processed successfully.`
    };
} 