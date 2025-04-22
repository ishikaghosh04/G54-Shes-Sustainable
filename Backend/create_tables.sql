-- Follows traditional EERD Modelling
CREATE DATABASE IF NOT EXISTS ShesSustainable;
USE ShesSustainable;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. User table (strong entity - buyer/seller, or admin)
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
  isBuyer       BOOLEAN DEFAULT TRUE,
  isSeller      BOOLEAN DEFAULT FALSE,
  isAdmin       BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (userID)
);

-- 2. Product table (strong entity)
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
  isActive          BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (productID),
  CONSTRAINT fk_product_seller
    FOREIGN KEY (sellerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 3. Cart table (weak entity - dependent on User)
DROP TABLE IF EXISTS CartStores;
DROP TABLE IF EXISTS Cart;
CREATE TABLE Cart (
  userID        INT NOT NULL, -- Part of composite PK instead of cartID
  cartNumber    INT NOT NULL, -- Additional identifier for multiple carts per user
  dateCreated   DATETIME DEFAULT CURRENT_TIMESTAMP,
  isActive      BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (userID, cartNumber), -- Composite primary key
  CONSTRAINT fk_cart_user
    FOREIGN KEY (userID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 4. CartStores table (weak entity - dependent on Cart and Product)
CREATE TABLE CartStores (
  userID      INT NOT NULL,
  cartNumber  INT NOT NULL,
  productID   INT NOT NULL,
  dateAdded   DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userID, cartNumber, productID), -- Composite primary key
  CONSTRAINT fk_cartitem_cart
    FOREIGN KEY (userID, cartNumber) REFERENCES Cart(userID, cartNumber)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_cartitem_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  -- Enforce that each product can only exist in ONE cart at a time
  CONSTRAINT unique_product_per_cart UNIQUE (productID)
);

-- 5. Order table (weak entity - dependent on User)
DROP TABLE IF EXISTS OrderItem;
DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
  buyerID         INT NOT NULL,
  orderNumber     INT NOT NULL, -- Additional identifier for multiple orders per user
  orderDate       DATETIME DEFAULT CURRENT_TIMESTAMP,
  totalAmount     DECIMAL(10,2) NOT NULL,
  status          VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (buyerID, orderNumber), -- Composite primary key
  CONSTRAINT fk_order_buyer
    FOREIGN KEY (buyerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 6. OrderItem table (weak entity - dependent on Order and Product)
CREATE TABLE OrderItem (
  buyerID      INT NOT NULL,
  orderNumber  INT NOT NULL,
  productID    INT NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (buyerID, orderNumber, productID), -- Composite primary key
  CONSTRAINT fk_orderitem_order
    FOREIGN KEY (buyerID, orderNumber) REFERENCES `Order`(buyerID, orderNumber)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 7. Shipping table (weak entity - dependent on OrderItem)
DROP TABLE IF EXISTS Shipping;
CREATE TABLE Shipping (
  buyerID          INT NOT NULL,
  orderNumber      INT NOT NULL,
  productID        INT NOT NULL,
  trackingNumber   VARCHAR(100),
  shippingCost     DECIMAL(10,2) NOT NULL DEFAULT 0,
  shippedDate      DATETIME DEFAULT CURRENT_TIMESTAMP,
  shippingStreet   VARCHAR(100),
  shippingCity     VARCHAR(50),
  shippingProvince VARCHAR(50),
  shippingPostalCode VARCHAR(10),
  estDeliveryDate  DATE,
  status           VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (buyerID, orderNumber, productID), -- Composite primary key matching OrderItem
  CONSTRAINT fk_shipping_orderItem
    FOREIGN KEY (buyerID, orderNumber, productID) REFERENCES OrderItem(buyerID, orderNumber, productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 8. Payment table (weak entity - dependent on Order)
DROP TABLE IF EXISTS Payment;
CREATE TABLE Payment (
  buyerID         INT NOT NULL,
  orderNumber     INT NOT NULL,
  paymentMethod   VARCHAR(50) NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  cardNumber      VARCHAR(20),
  expirationDate  VARCHAR(5),
  cvv             VARCHAR(4),
  billingStreet   VARCHAR(100),
  billingCity     VARCHAR(50),
  billingProvince VARCHAR(50),
  billingPostalCode VARCHAR(10),
  paymentDate     DATETIME DEFAULT CURRENT_TIMESTAMP,
  status          VARCHAR(50) DEFAULT 'Pending',
  transactionRef  VARCHAR(100),
  PRIMARY KEY (buyerID, orderNumber), -- Composite primary key matching Order
  CONSTRAINT fk_payment_order
    FOREIGN KEY (buyerID, orderNumber) REFERENCES `Order`(buyerID, orderNumber)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 9. Review table (weak entity - dependent on User and Product)
DROP TABLE IF EXISTS Review;
CREATE TABLE Review (
  buyerID     INT NOT NULL,
  productID   INT NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  reviewDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (buyerID, productID), -- Composite primary key
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