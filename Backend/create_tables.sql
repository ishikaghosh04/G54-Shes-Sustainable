-- new SQL script
CREATE DATABASE IF NOT EXISTS ShesSustainable;
USE ShesSustainable;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. User table (combined buyer/seller)
DROP TABLE IF EXISTS User;
CREATE TABLE User (
  userID        INT AUTO_INCREMENT,
  email         VARCHAR(100) NOT NULL UNIQUE,
  phoneNumber   VARCHAR(20),
  city          VARCHAR(50),
  province      VARCHAR(50),
  street        VARCHAR(100),
  postalCode    VARCHAR(10),
  firstName     VARCHAR(50) NOT NULL,
  lastName      VARCHAR(50) NOT NULL,
  password      VARCHAR(255) NOT NULL,  -- Added password column for authentication
  isBuyer       BOOLEAN DEFAULT TRUE,
  isSeller      BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (userID)
);

-- 2. Product table
DROP TABLE IF EXISTS Product;
CREATE TABLE Product (
  productID         INT AUTO_INCREMENT,
  sellerID          INT NOT NULL,
  price             DECIMAL(10,2) NOT NULL,
  name              VARCHAR(100) NOT NULL,
  size              VARCHAR(50),
  picture           VARCHAR(255),
  description       TEXT,
  quantity          INT NOT NULL DEFAULT 0,
  category          VARCHAR(50),
  productCondition  VARCHAR(50),
  dateCreated       DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  userID        INT NOT NULL,
  dateCreated   DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  quantity    INT NOT NULL DEFAULT 1,
  dateAdded   DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (cartID, productID),
  CONSTRAINT fk_cartitem_cart
    FOREIGN KEY (cartID) REFERENCES Cart(cartID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_cartitem_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 5. Order table
DROP TABLE IF EXISTS OrderContains;
DROP TABLE IF EXISTS `Order`;
CREATE TABLE `Order` (
  orderID         INT AUTO_INCREMENT,
  buyerID         INT NOT NULL,
  orderDate       DATETIME DEFAULT CURRENT_TIMESTAMP,
  totalAmount     DECIMAL(10,2) NOT NULL,
  status          VARCHAR(50) DEFAULT 'Pending',
  shippingAddress TEXT,
  billingAddress  TEXT,
  PRIMARY KEY (orderID),
  CONSTRAINT fk_order_buyer
    FOREIGN KEY (buyerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 6. OrderContains table
CREATE TABLE OrderContains (
  orderID     INT NOT NULL,
  productID   INT NOT NULL,
  quantity    INT NOT NULL DEFAULT 1,
  unitPrice   DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) NOT NULL,
  status      VARCHAR(50) DEFAULT 'Processing',
  PRIMARY KEY (orderID, productID),
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
  orderID          INT NOT NULL,
  trackingNumber   VARCHAR(100),
  shippingCost     DECIMAL(10,2) NOT NULL DEFAULT 0,
  shippedDate      DATETIME,
  estDeliveryDate  DATE,
  actualDeliveryDate DATE,
  status           VARCHAR(50) DEFAULT 'Pending',
  PRIMARY KEY (shippingID),
  CONSTRAINT fk_shipping_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 8. Payment table
DROP TABLE IF EXISTS Payment;
CREATE TABLE Payment (
  paymentID      INT AUTO_INCREMENT,
  orderID        INT NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  paymentDate    DATETIME DEFAULT CURRENT_TIMESTAMP,
  paymentMethod  VARCHAR(50) NOT NULL,
  status         VARCHAR(50) DEFAULT 'Pending',
  transactionRef VARCHAR(100),
  PRIMARY KEY (paymentID),
  CONSTRAINT fk_payment_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 9. Review table
DROP TABLE IF EXISTS Review;
CREATE TABLE Review (
  reviewID    INT AUTO_INCREMENT,
  buyerID     INT NOT NULL,
  productID   INT NOT NULL,
  orderID     INT NOT NULL,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  reviewDate  DATETIME DEFAULT CURRENT_TIMESTAMP,
  isVerified  BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (reviewID),
  UNIQUE KEY unique_review (buyerID, productID, orderID),
  CONSTRAINT fk_review_buyer
    FOREIGN KEY (buyerID) REFERENCES User(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_review_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_review_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;