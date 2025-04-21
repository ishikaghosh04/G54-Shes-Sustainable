-- REVIEW PRIOR TO RUNNING

-- Enable foreign key checks to ensure data integrity
SET FOREIGN_KEY_CHECKS = 1;
USE ShesSustainable;

-- 1. Insert User data
INSERT INTO User (email, phoneNumber, city, province, street, postalCode, firstName, lastName, password, isBuyer, isSeller) VALUES
('sarah.johnson@email.com', '416-555-0101', 'Toronto', 'Ontario', '123 Queen St', 'M5V 2A1', 'Sarah', 'Johnson', '$2a$10$xJWp1tPjW9CGzYYPnOYtUe9RdygC1mcD0O2RpCH7x89U6TxJw3qfq', TRUE, TRUE),
('michael.wong@email.com', '647-555-0202', 'Toronto', 'Ontario', '456 King St', 'M5V 1B2', 'Michael', 'Wong', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO', TRUE, FALSE),
('emily.patel@email.com', '905-555-0303', 'Mississauga', 'Ontario', '789 Lakeshore Rd', 'L5H 1J1', 'Emily', 'Patel', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO', TRUE, TRUE),
('david.lee@email.com', '519-555-0404', 'London', 'Ontario', '101 Richmond St', 'N6A 3C5', 'David', 'Lee', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO', TRUE, FALSE),
('olivia.nguyen@email.com', '613-555-0505', 'Ottawa', 'Ontario', '202 Elgin St', 'K2P 1L4', 'Olivia', 'Nguyen', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO', TRUE, TRUE);

-- 2. Insert Product data
INSERT INTO Product (sellerID, price, name, size, picture, description, category, productCondition, dateCreated, isActive) VALUES
(1, 45.99, 'Vintage Denim Jacket', 'M', '/images/products/denim_jacket.jpg', 'Classic vintage denim jacket in excellent condition. Perfect for layering in any season.', 'Outerwear', 'Excellent', '2025-03-15 14:30:00', TRUE),
(3, 25.50, 'Floral Summer Dress', 'S', '/images/products/floral_dress.jpg', 'Beautiful floral print summer dress, worn only once for a special occasion.', 'Dresses', 'Like New', '2025-03-18 09:45:00', TRUE),
(5, 30.00, 'Sustainable Cotton Sweater', 'L', '/images/products/cotton_sweater.jpg', 'Cozy cotton sweater made from organic materials. Minimal wear, very comfortable.', 'Tops', 'Good', '2025-03-20 16:20:00', TRUE),
(1, 65.75, 'Designer Leather Boots', '8', '/images/products/leather_boots.jpg', 'Premium leather boots by a sustainable designer. Some wear on soles but overall great condition.', 'Footwear', 'Good', '2025-03-25 11:15:00', TRUE),
(3, 22.99, 'Eco-friendly Yoga Pants', 'M', '/images/products/yoga_pants.jpg', 'High-quality yoga pants made from recycled materials. Stretchy and comfortable.', 'Activewear', 'Excellent', '2025-04-01 10:30:00', TRUE),
(5, 15.50, 'Vintage Graphic T-shirt', 'S', '/images/products/graphic_tshirt.jpg', 'Retro graphic t-shirt with unique design. Slight fading adds to the vintage appeal.', 'Tops', 'Good', '2025-04-05 13:45:00', TRUE),
(1, 85.00, 'Designer Handbag', 'One Size', '/images/products/designer_handbag.jpg', 'Authentic designer handbag in excellent condition. Barely used, comes with dust bag.', 'Accessories', 'Like New', '2025-04-10 15:00:00', TRUE),
(3, 35.25, 'Wool Winter Scarf', 'One Size', '/images/products/wool_scarf.jpg', 'Warm wool scarf in neutral colors. Perfect for winter layering.', 'Accessories', 'Excellent', '2025-04-12 09:10:00', TRUE);

-- 3. Insert Cart data
INSERT INTO Cart (userID, dateCreated, isActive) VALUES
(2, '2025-04-15 10:30:00', TRUE),
(4, '2025-04-16 14:45:00', TRUE),
(2, '2025-03-10 11:20:00', FALSE), -- Previous cart that's been checked out
(4, '2025-03-05 16:30:00', FALSE); -- Previous cart that's been checked out

-- 4. Insert CartStores data
INSERT INTO CartStores (cartID, productID, dateAdded) VALUES
(1, 1, '2025-04-15 10:35:00'),
(1, 3, '2025-04-15 10:40:00'),
(2, 6, '2025-04-16 14:50:00'),
(2, 8, '2025-04-16 15:00:00'),
(3, 2, '2025-03-10 11:25:00'), -- Historical cart items
(3, 4, '2025-03-10 11:30:00'),
(4, 5, '2025-03-05 16:35:00'),
(4, 7, '2025-03-05 16:40:00');

-- 5. Insert Order data
INSERT INTO `Order` (buyerID, cartID, orderDate, totalAmount, status) VALUES
(2, 3, '2025-03-10 12:00:00', 91.25, 'Completed'),
(4, 4, '2025-03-05 17:00:00', 107.99, 'Completed'),
(2, NULL, '2025-04-01 09:30:00', 35.25, 'Processing'), -- One-off order not from cart
(4, NULL, '2025-04-05 14:15:00', 15.50, 'Shipped'); -- One-off order not from cart

-- 6. Insert OrderContains data
INSERT INTO OrderContains (orderID, productID, price, status) VALUES
(1, 2, 25.50, 'Delivered'),
(1, 4, 65.75, 'Delivered'),
(2, 5, 22.99, 'Delivered'),
(2, 7, 85.00, 'Delivered'),
(3, 8, 35.25, 'Processing'),
(4, 6, 15.50, 'Shipped');

-- 7. Insert Shipping data
INSERT INTO Shipping (orderID, productID, trackingNumber, shippingCost, shippedDate, shippingStreet, shippingCity, shippingProvince, shippingPostalCode, estDeliveryDate, status) VALUES
(1, 2, 'TRACK123456789', 5.99, '2025-03-11 09:30:00', '456 King St', 'Toronto', 'Ontario', 'M5V 1B2', '2025-03-15', 'Delivered'),
(1, 4, 'TRACK123456790', 5.99, '2025-03-11 09:30:00', '456 King St', 'Toronto', 'Ontario', 'M5V 1B2', '2025-03-15', 'Delivered'),
(2, 5, 'TRACK987654321', 7.50, '2025-03-06 10:15:00', '101 Richmond St', 'London', 'Ontario', 'N6A 3C5', '2025-03-10', 'Delivered'),
(2, 7, 'TRACK987654322', 7.50, '2025-03-06 10:15:00', '101 Richmond St', 'London', 'Ontario', 'N6A 3C5', '2025-03-10', 'Delivered'),
(3, 8, 'TRACK567891234', 6.75, '2025-04-02 11:00:00', '456 King St', 'Toronto', 'Ontario', 'M5V 1B2', '2025-04-06', 'In Transit'),
(4, 6, 'TRACK456789123', 5.99, '2025-04-06 09:45:00', '101 Richmond St', 'London', 'Ontario', 'N6A 3C5', '2025-04-10', 'Shipped');

-- 8. Insert Payment data
INSERT INTO Payment (orderID, amount, paymentMethod, cardNumber, expirationDate, cvv, billingStreet, billingCity, billingProvince, billingPostalCode, paymentDate, status, transactionRef) VALUES
(1, 91.25, 'Credit Card', '************4321', '12/26', '***', '456 King St', 'Toronto', 'Ontario', 'M5V 1B2', '2025-03-10 12:00:00', 'Completed', 'TXN-12345-ABCDE'),
(2, 107.99, 'Credit Card', '************8765', '09/25', '***', '101 Richmond St', 'London', 'Ontario', 'N6A 3C5', '2025-03-05 17:00:00', 'Completed', 'TXN-67890-FGHIJ'),
(3, 35.25, 'PayPal', NULL, NULL, NULL, '456 King St', 'Toronto', 'Ontario', 'M5V 1B2', '2025-04-01 09:30:00', 'Completed', 'TXN-24680-KLMNO'),
(4, 15.50, 'Credit Card', '************1357', '05/27', '***', '101 Richmond St', 'London', 'Ontario', 'N6A 3C5', '2025-04-05 14:15:00', 'Completed', 'TXN-13579-PQRST');

-- 9. Insert Review data
INSERT INTO Review (buyerID, productID, orderID, rating, comment, reviewDate, isVerified) VALUES
(2, 2, 1, 5, 'Beautiful dress, exactly as described! Arrived in perfect condition.', '2025-03-18 14:30:00', TRUE),
(2, 4, 1, 4, 'Great boots, very comfortable. Just a bit more worn than I expected but still great value.', '2025-03-18 14:35:00', TRUE),
(4, 5, 2, 5, 'These yoga pants are amazing! So comfortable and sustainable. Will definitely buy from this seller again.', '2025-03-15 16:20:00', TRUE),
(4, 7, 2, 4, 'Beautiful bag, just as described. Prompt shipping and great communication.', '2025-03-15 16:25:00', TRUE),
(4, 6, 4, 5, 'Love this vintage t-shirt! Great quality and exactly as pictured.', '2025-04-12 11:15:00', TRUE);