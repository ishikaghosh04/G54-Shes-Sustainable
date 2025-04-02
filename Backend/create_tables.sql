CREATE DATABASE IF NOT EXISTS ShesSustainable;
USE ShesSustainable;

-- 1. Buyer
CREATE TABLE Buyer (
  userID        INT NOT NULL,
  email         VARCHAR(100) NOT NULL,
  phoneNumber   VARCHAR(20),
  city          VARCHAR(50),
  province      VARCHAR(50),
  street        VARCHAR(100),
  postalCode    VARCHAR(10),
  firstName     VARCHAR(50),
  lastName      VARCHAR(50),  PRIMARY KEY (userID)
);

-- 2. Seller
CREATE TABLE Seller (
  userID        INT NOT NULL,
  email         VARCHAR(100) NOT NULL,
  phoneNumber   VARCHAR(20),
  city          VARCHAR(50),
  province      VARCHAR(50),
  street        VARCHAR(100),
  postalCode    VARCHAR(10),
  firstName     VARCHAR(50),
  lastName      VARCHAR(50),
  PRIMARY KEY (userID)
);

-- 3. Product table
CREATE TABLE Product (
  productID         INT AUTO_INCREMENT,
  userID            INT NOT NULL,
  price             DECIMAL(10,2),
  name              VARCHAR(100),
  size              VARCHAR(50),
  picture           VARCHAR(255),
  description       TEXT,
  quantity          INT,
  category          VARCHAR(50),
  condition         VARCHAR(50),
  PRIMARY KEY (productID),
  CONSTRAINT fk_product_seller
    FOREIGN KEY (userID) REFERENCES Seller(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 4. Review table
CREATE TABLE Review (
  reviewID   INT,
  userID     INT,
  productID  INT,
  rating     INT,
  comment    TEXT,
  PRIMARY KEY (reviewID, userID, productID),
  CONSTRAINT fk_review_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_review_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 5. Cart table
CREATE TABLE Cart (
  cartID  INT,
  userID  INT,
  PRIMARY KEY (cartID, userID),
  CONSTRAINT fk_cart_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 6. Stores
CREATE TABLE Stores (
  cartID   INT,
  userID   INT,
  productID INT,
  PRIMARY KEY (cartID, userID, productID),
  CONSTRAINT fk_stores_cart
    FOREIGN KEY (cartID) REFERENCES Cart(cartID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_stores_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_stores_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 7. Buys
CREATE TABLE Buys (
  userID   INT,
  productID INT,
  PRIMARY KEY (userID, productID),
  CONSTRAINT fk_buys_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_buys_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 9. Order
CREATE TABLE `Order` (
  orderID     INT,
  userID      INT,
  productID   INT,
  orderDate   DATE,
  totalAmount DECIMAL(10,2),
  status      VARCHAR(50),
  PRIMARY KEY (orderID, userID, productID),
  CONSTRAINT fk_order_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_order_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 10. Contains
CREATE TABLE Contains (
  productID INT,
  orderID   INT,
  userID    INT,
  PRIMARY KEY (productID, orderID, userID),
  CONSTRAINT fk_contains_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_contains_order
    FOREIGN KEY (orderID, userID, productID) REFERENCES `Order`(orderID, userID, productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 11. Shipping Details
CREATE TABLE ShippingDetails (
  shippingID       INT,
  userID           INT,
  orderID          INT,
  shippingCost     DECIMAL(10,2),
  estDeliveryDate  DATE,
  street           VARCHAR(100),
  postalCode       VARCHAR(10),
  city             VARCHAR(50),
  province         VARCHAR(50),
  PRIMARY KEY (shippingID),
  CONSTRAINT fk_shipping_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_shipping_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

-- 12. Receives
CREATE TABLE Receives (
  userID      INT,
  shippingID  INT,
  orderID     INT,
  PRIMARY KEY (userID, shippingID, orderID),
  CONSTRAINT fk_receives_buyer
    FOREIGN KEY (userID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_receives_shipping
    FOREIGN KEY (shippingID) REFERENCES ShippingDetails(shippingID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_receives_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

--13. Payment Details
CREATE TABLE PaymentDetails (
  transactionID  INT,
  buyerID        INT,
  orderID        INT,
  sellerID       INT,
  totalAmount    DECIMAL(10,2),
  billingAddress VARCHAR(100),
  paymentDate    DATE,
  paymentMethod  VARCHAR(50),
  PRIMARY KEY (transactionID, buyerID),
  CONSTRAINT fk_payment_buyer
    FOREIGN KEY (buyerID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_payment_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_payment_seller
    FOREIGN KEY (sellerID) REFERENCES Seller(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

--14. Ships
CREATE TABLE Ships (
  sellerID   INT,
  orderID    INT,
  buyerID    INT,
  productID  INT,
  PRIMARY KEY (sellerID, orderID, buyerID, productID),
  CONSTRAINT fk_ships_seller
    FOREIGN KEY (sellerID) REFERENCES Seller(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_ships_order
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_ships_buyer
    FOREIGN KEY (buyerID) REFERENCES Buyer(userID)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_ships_product
    FOREIGN KEY (productID) REFERENCES Product(productID)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);