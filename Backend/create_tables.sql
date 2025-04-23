-- UPDATED SQL SCRIPT (matches diagrams)
CREATE DATABASE IF NOT EXISTS ShesSustainable;
USE ShesSustainable;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. User table (buyer/seller, or admin)
DROP TABLE IF EXISTS User;
CREATE TABLE User (
  userID        INT AUTO_INCREMENT,
  email         VARCHAR(100) NOT NULL UNIQUE,
  phoneNumber   VARCHAR(10),
  city          VARCHAR(50),
  province      VARCHAR(50),
  street        VARCHAR(100),
  postalCode    VARCHAR(10),
  firstName     VARCHAR(50) NOT NULL,
  lastName      VARCHAR(50) NOT NULL,
  password      VARCHAR(255) NOT NULL, 
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  isBuyer       BOOLEAN DEFAULT TRUE,
  isSeller      BOOLEAN DEFAULT FALSE,
  isAdmin       BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (userID)
);

-- 2. Product table
DROP TABLE IF EXISTS Product;
CREATE TABLE Product (
  productID         INT AUTO_INCREMENT,
  sellerID          INT NOT NULL,
  price             DECIMAL(10,2) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  size              VARCHAR(50) NOT NULL,
  picture           VARCHAR(255) NOT NULL,
  description       TEXT NOT NULL,
  category          VARCHAR(50) NOT NULL,
  productCondition  VARCHAR(50) NOT NULL,
  dateCreated       DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- 0 when sold, 1 when listed
  isActive          BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (productID),
  CONSTRAINT fk_product_seller
    FOREIGN KEY (sellerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 3. Cart table
DROP TABLE IF EXISTS CartStores;
DROP TABLE IF EXISTS Cart;
CREATE TABLE Cart (
  cartID        INT AUTO_INCREMENT,
  userID        INT NOT NULL, -- buyer
  dateCreated   DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- 0 if no longer in use, 1 if in use:
  isActive      BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (cartID),
  CONSTRAINT fk_cart_user
    FOREIGN KEY (userID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 4. CartStores table
CREATE TABLE CartStores (
  cartID      INT NOT NULL, 
  productID   INT NOT NULL,
  dateAdded   DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cartID, productID),
  CONSTRAINT fk_cartitem_cart
    FOREIGN KEY (cartID) REFERENCES Cart(cartID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_cartitem_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  -- Enforce that each product can only exist in ONE cart at a time
  CONSTRAINT unique_product_per_cart UNIQUE (productID)
);

-- 5. Order table
DROP TABLE IF EXISTS OrderItem;
DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
  orderID         INT AUTO_INCREMENT,
  buyerID         INT NOT NULL,
  orderDate       DATETIME DEFAULT CURRENT_TIMESTAMP,
  totalAmount     DECIMAL(10,2) NOT NULL,
  status          VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (orderID),
  CONSTRAINT fk_order_buyer
    FOREIGN KEY (buyerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 6. OrderItem table (changed) -- previously was OrderItem for pk
CREATE TABLE OrderItem (
  orderItemID INT AUTO_INCREMENT,
  orderID     INT NOT NULL,
  productID   INT NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (OrderItemID),
  CONSTRAINT fk_orderitem_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 7. Shipping table
DROP TABLE IF EXISTS Shipping;
CREATE TABLE Shipping (
  shippingID       INT AUTO_INCREMENT,
	orderItemID      INT NOT NULL,
	trackingNumber   VARCHAR(100),
  shippingCost     DECIMAL(10,2) NOT NULL DEFAULT 0,
  shippedDate      DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Shipping details
  shippingStreet VARCHAR(100), -- added
  shippingCity VARCHAR(50), -- added
  shippingProvince VARCHAR(50), -- added
  shippingPostalCode VARCHAR(10), -- added
  estDeliveryDate  DATE,
  status           VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (shippingID),
  CONSTRAINT fk_shipping_orderItem
    FOREIGN KEY (orderItemID) REFERENCES `OrderItem`(orderItemID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 8. Payment table
DROP TABLE IF EXISTS Payment;
CREATE TABLE Payment (
  paymentID      INT AUTO_INCREMENT,
  orderID        INT NOT NULL,
  amount         DECIMAL(10,2) NOT NULL, -- taken from Order
  paymentMethod  VARCHAR(50) NOT NULL, -- specify somewhere (else remove)
  -- MOCK card info (for demo/testing only)
  cardNumber       VARCHAR(20),
  expirationDate   VARCHAR(5), -- format: MM/YY
  cvv              VARCHAR(4),
  -- Billing address
  billingStreet   VARCHAR(100),
  billingCity      VARCHAR(50),
  billingProvince  VARCHAR(50),
  billingPostalCode VARCHAR(10),
  paymentDate    DATETIME DEFAULT CURRENT_TIMESTAMP,
  status         VARCHAR(50) DEFAULT 'Pending',
  transactionRef VARCHAR(100), -- specify in backend
  PRIMARY KEY (paymentID),
  CONSTRAINT fk_payment_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 9. Review table (a buyer can only review a product once)
DROP TABLE IF EXISTS Review;
CREATE TABLE Review (
  reviewID    INT AUTO_INCREMENT, 
  buyerID     INT NOT NULL,
  productID   INT NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  reviewDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reviewID),
  UNIQUE KEY unique_review (buyerID, productID),
  CONSTRAINT fk_review_buyer
    FOREIGN KEY (buyerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_review_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;