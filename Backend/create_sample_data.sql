-- REVIEW PRIOR TO RUNNING
-- Needs Changes

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

-- --------------------------------------------------
-- 4) ORDERS
-- --------------------------------------------------
INSERT INTO `Order` (buyerID, orderDate, totalAmount, status)
VALUES
  (2, '2025-03-10 12:00:00', 71.49, 'Completed'),
  (4, '2025-03-05 17:00:00', 38.49, 'Completed'),
  (2, '2025-04-01 09:30:00', 22.99, 'Processing');

-- --------------------------------------------------
-- 5) ORDERITEMS
-- --------------------------------------------------
INSERT INTO OrderItem (orderID, productID, price)
VALUES
  (1,  2,  25.50),
  (1,  4, 45.99),   -- denim jacket sold too
  (2,  3,  30.00),
  (2,  5, 15.50),
  (3,  6, 85.00);   -- one‑off handbag order

-- --------------------------------------------------
-- 6) SHIPPING
-- --------------------------------------------------
INSERT INTO Shipping
  (orderItemID, trackingNumber, shippingCost,
   shippedDate, shippingStreet, shippingCity,
   shippingProvince, shippingPostalCode,
   estDeliveryDate, status)
VALUES
  (1,  'TRACK123456789', 5.99, '2025-03-11 09:30:00',
       '456 King St', 'Toronto', 'Ontario', 'M5V1B2',
       '2025-03-15', 'Delivered'),
  (2,  'TRACK123456790', 5.99, '2025-03-11 09:30:00',
       '456 King St', 'Toronto', 'Ontario', 'M5V1B2',
       '2025-03-15', 'Delivered'),
  (3,  'TRACK987654321', 7.50, '2025-03-06 10:15:00',
       '101 Richmond St', 'London', 'Ontario', 'N6A3C5',
       '2025-03-10', 'Delivered');

-- --------------------------------------------------
-- 7) PAYMENTS
-- --------------------------------------------------
INSERT INTO Payment
  (orderID, amount, paymentMethod, cardNumber,
   expirationDate, cvv, billingStreet, billingCity,
   billingProvince, billingPostalCode,
   paymentDate, status, transactionRef)
VALUES
  (1,  71.49, 'Credit Card', '************4321', '12/26', '***',
       '456 King St', 'Toronto', 'Ontario', 'M5V1B2',
       '2025-03-10 12:00:00', 'Completed', 'TXN-12345-ABCDE'),
  (2,  38.49, 'Credit Card', '************8765', '09/25', '***',
       '101 Richmond St', 'London', 'Ontario', 'N6A3C5',
       '2025-03-05 17:00:00', 'Completed', 'TXN-67890-FGHIJ'),
  (3,  22.99, 'PayPal',      NULL,           NULL,   NULL,
       '789 Lakeshore Rd', 'Mississauga', 'Ontario', 'L5H1J1',
       '2025-04-01 09:30:00', 'Completed', 'TXN-24680-KLMNO');

-- --------------------------------------------------
-- 8) REVIEWS
-- --------------------------------------------------
INSERT INTO Review
  (buyerID, productID, rating, comment, reviewDate)
VALUES
  (2, 2, 5, 
    'Beautiful floral dress! Perfect for my daughter''s first photoshoot. Fabric is soft and high quality.',
    '2025-03-18 14:30:00'),
  
  (2, 4, 4, 
    'These yoga pants fit my baby well and are made from great material. Took off one star only because they run slightly small.',
    '2025-03-19 09:15:00'),
  
  (4, 3, 5, 
    'This organic cotton sweater is amazing! So soft and cozy for my little one. Will definitely buy from this seller again.',
    '2025-03-12 16:20:00'),
  
  (4, 5, 4, 
    'Love this vintage t-shirt! The "well loved" description was accurate - it has that perfect worn-in feel but still in great condition.',
    '2025-03-14 11:25:00'),
  
  (2, 6, 5, 
    'The designer handbag is exactly as described. Great quality and perfect for carrying baby essentials in style!',
    '2025-04-10 13:45:00'),
  
  (4, 7, 5, 
    'Beautiful wool scarf, perfect for wrapping my baby during our winter walks. Very soft material that doesn''t irritate sensitive skin.',
    '2025-04-08 10:30:00');