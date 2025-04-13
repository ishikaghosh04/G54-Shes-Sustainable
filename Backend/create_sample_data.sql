-- PASSWORDS MUST BE HASHED WHEN STORING (SECURITY)!
USE ShesSustainable;

-- Insert Users (some are buyers, some are sellers, one is both)
INSERT INTO User (email, phoneNumber, city, province, street, postalCode, firstName, lastName, password, isBuyer, isSeller)
VALUES 
('sarah.jones@email.com', '416-555-1234', 'Toronto', 'Ontario', '123 Maple Ave', 'M5V 2T6', 'Sarah', 'Jones', '$2y$10$xyz123hashedpassword1', TRUE, FALSE),
('michael.chen@email.com', '647-555-6789', 'Vancouver', 'British Columbia', '456 Pine St', 'V5K 0A1', 'Michael', 'Chen', '$2y$10$xyz123hashedpassword2', TRUE, TRUE),
('emma.patel@email.com', '905-555-4321', 'Montreal', 'Quebec', '789 Oak Blvd', 'H2Y 1Z1', 'Emma', 'Patel', '$2y$10$xyz123hashedpassword3', FALSE, TRUE);

-- Insert Products
INSERT INTO Product (sellerID, price, name, size, picture, description, quantity, category, productCondition)
VALUES 
(2, 45.99, 'Vintage Denim Jacket', 'M', 'denim_jacket.jpg', 'Lightly worn vintage denim jacket in excellent condition', 1, 'Outerwear', 'Used - Like New'),
(2, 25.50, 'Cotton Summer Dress', 'S', 'summer_dress.jpg', 'Floral pattern summer dress, perfect for casual outings', 2, 'Dresses', 'Used - Good'),
(3, 60.00, 'Designer Wool Sweater', 'L', 'wool_sweater.jpg', 'Luxury wool sweater, worn only a few times', 1, 'Knitwear', 'Used - Excellent');

-- Insert Carts
INSERT INTO Cart (userID, dateCreated, isActive)
VALUES 
(1, '2025-03-30 14:22:15', TRUE),
(2, '2025-03-31 09:45:30', TRUE);

-- Insert Cart Items (CartStores)
INSERT INTO CartStores (cartID, productID, quantity, dateAdded)
VALUES 
(1, 3, 1, '2025-03-30 14:25:10'),
(1, 2, 1, '2025-03-30 14:28:45'),
(2, 1, 1, '2025-03-31 09:46:20');

-- Insert Orders
INSERT INTO `Order` (buyerID, orderDate, totalAmount, status, shippingAddress, billingAddress)
VALUES 
(1, '2025-03-15 13:10:25', 60.00, 'Delivered', '123 Maple Ave, Toronto, Ontario, M5V 2T6', '123 Maple Ave, Toronto, Ontario, M5V 2T6'),
(1, '2025-03-28 11:32:40', 25.50, 'Shipped', '123 Maple Ave, Toronto, Ontario, M5V 2T6', '123 Maple Ave, Toronto, Ontario, M5V 2T6'),
(2, '2025-03-29 15:05:10', 60.00, 'Processing', '456 Pine St, Vancouver, British Columbia, V5K 0A1', '456 Pine St, Vancouver, British Columbia, V5K 0A1');

-- Insert Order Items (OrderContains)
INSERT INTO OrderContains (orderID, productID, quantity, unitPrice, subtotal, status)
VALUES 
(1, 3, 1, 60.00, 60.00, 'Delivered'),
(2, 2, 1, 25.50, 25.50, 'Shipped'),
(3, 3, 1, 60.00, 60.00, 'Processing');

-- Insert Shipping Information
INSERT INTO Shipping (orderID, trackingNumber, shippingCost, shippedDate, estDeliveryDate, actualDeliveryDate, status)
VALUES 
(1, 'CP12345678CA', 12.99, '2025-03-16 09:30:00', '2025-03-20', '2025-03-19', 'Delivered'),
(2, 'CP98765432CA', 12.99, '2025-03-29 14:15:00', '2025-04-03', NULL, 'In Transit'),
(3, NULL, 12.99, NULL, '2025-04-05', NULL, 'Processing');

-- Insert Payment Information
INSERT INTO Payment (orderID, amount, paymentDate, paymentMethod, status, transactionRef)
VALUES 
(1, 72.99, '2025-03-15 13:10:25', 'Credit Card', 'Completed', 'TXN12345'),
(2, 38.49, '2025-03-28 11:32:40', 'PayPal', 'Completed', 'PAYPAL67890'),
(3, 72.99, '2025-03-29 15:05:10', 'Credit Card', 'Completed', 'TXN54321');

-- Insert Reviews (only for delivered items)
INSERT INTO Review (buyerID, productID, orderID, rating, comment, reviewDate, isVerified)
VALUES 
(1, 3, 1, 5, 'Beautiful sweater, exactly as described and in perfect condition!', '2025-03-21 16:45:30', TRUE);