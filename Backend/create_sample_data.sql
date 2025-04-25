-- --------------------------------------------------
-- 1) USERS
-- --------------------------------------------------
INSERT INTO User
  (email, phoneNumber, city, province, street, postalCode,
   firstName, lastName, password, isBuyer, isSeller, isAdmin)
VALUES
  ('sarah.johnson@email.com', '4165550101', 'Toronto', 'Ontario', '123 Queen St', 'M5V2A1',
   'Sarah', 'Johnson', '$2a$10$xJWp1tPjW9CGzYYPnOYtUe9RdygC1mcD0O2RpCH7x89U6TxJw3qfq',
   TRUE, TRUE, FALSE),
  ('michael.wong@email.com', '6475550202', 'Toronto', 'Ontario', '456 King St', 'M5V1B2',
   'Michael', 'Wong', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO',
   TRUE, FALSE, FALSE),
  ('emily.patel@email.com', '9055550303', 'Mississauga', 'Ontario', '789 Lakeshore Rd', 'L5H1J1',
   'Emily', 'Patel', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO',
   TRUE, TRUE, FALSE),
  ('david.lee@email.com', '5195550404', 'London', 'Ontario', '101 Richmond St', 'N6A3C5',
   'David', 'Lee', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO',
   TRUE, FALSE, FALSE),
  ('olivia.nguyen@email.com', '6135550505', 'Ottawa', 'Ontario', '202 Elgin St', 'K2P1L4',
   'Olivia', 'Nguyen', '$2a$10$JlW4dTNS1W24C3uSOGKvOutb.Sj4doaOJ3D8HEJPrNAji4MpZHTtO',
   TRUE, TRUE, FALSE);

-- --------------------------------------------------
-- 2) PRODUCTS
-- --------------------------------------------------
INSERT INTO Product
  (sellerID, price, name, size, picture, description, category, productCondition, dateCreated, isActive)
VALUES
  (1, 45.99, 'Vintage Denim Jacket', '0-3 Months',
    '/images/products/denim_jacket.jpg',
    'Classic vintage denim jacket in excellent condition.',
    'Outerwear',   'New',         '2025-03-15 14:30:00', TRUE),
  (3, 25.50, 'Floral Summer Dress', '0-3 Months',
    '/images/products/floral_dress.jpg',
    'Beautiful floral-print summer dress, worn once.',
    'Dresses',     'Gently Used', '2025-03-18 09:45:00', TRUE),
  (5, 30.00, 'Organic Cotton Sweater', '3-6 Months',
    '/images/products/cotton_sweater.jpg',
    'Cozy cotton sweater made from organic materials.',
    'Tops',        'New',         '2025-03-20 16:20:00', TRUE),
  (3, 22.99, 'Eco-friendly Yoga Pants', '3-6 Months',
    '/images/products/yoga_pants.jpg',
    'High-quality yoga pants made from recycled materials.',
    'Activewear',  'New',         '2025-04-01 10:30:00', TRUE),
  (5, 15.50, 'Vintage Graphic T-shirt', '6-9 Months',
    '/images/products/graphic_tshirt.jpg',
    'Retro graphic T-shirt with slight fading for vintage look.',
    'Tops',        'Well Loved',  '2025-04-05 13:45:00', TRUE),
  (1, 85.00, 'Designer Handbag', 'One Size',
    '/images/products/designer_handbag.jpg',
    'Authentic designer handbag in excellent condition.',
    'Accessories', 'New',         '2025-04-10 15:00:00', TRUE),
  (3, 35.25, 'Wool Winter Scarf', 'One Size',
    '/images/products/wool_scarf.jpg',
    'Warm wool scarf, perfect for winter layering.',
    'Accessories', 'Gently Used', '2025-04-12 09:10:00', TRUE);

-- --------------------------------------------------
-- 3) CARTS & CARTSTORES
-- --------------------------------------------------
INSERT INTO Cart (userID, dateCreated, isActive)
VALUES
  (2, '2025-04-15 10:30:00', TRUE),
  (4, '2025-04-16 14:45:00', TRUE),
  (2, '2025-03-10 11:20:00', FALSE),
  (4, '2025-03-05 16:30:00', FALSE);

INSERT INTO CartStores (cartID, productID, dateAdded)
VALUES
  (1, 1, '2025-04-15 10:35:00'),
  (1, 3, '2025-04-15 10:40:00'),
  (2, 5, '2025-04-16 14:50:00'),
  (2, 6, '2025-04-16 15:00:00'),
  (3, 2, '2025-03-10 11:25:00'),  -- historical
  (3, 4, '2025-03-10 11:30:00'),
  (4, 7, '2025-03-05 16:35:00'),
  (4, 1, '2025-03-05 16:40:00');

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

