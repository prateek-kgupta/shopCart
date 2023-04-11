SCHEMA NAME: Users_Info:
CREATE TABLE users_info(
Email VARCHAR(40) NOT NULL PRIMARY KEY,
Firstname VARCHAR(20) NOT NULL,
Lastname VARCHAR(20) NOT NULL,
Role VARCHAR(5) NOT NULL CHECK(role in (‘admin’,’user’)) DEFAULT ‘user’,
Password VARCHAR(30) NOT NULL
);

SCHEMA NAME: Product_info
CREATE TABLE product_info(
Product_id UUID NOT NULL PRIMARY KEY,
Product_name VARCHAR(100) NOT NULL,
Product_image BYTEA
Price NUMERIC(19,2) NOT NULL,
MRP NUMERIC(19,2) NOT NULL,
Discount_per NUMERIC NOT NULL,
Product_desc VARCHAR(200) NOT NULL,
Keyword1 VARCHAR(30),
Keyword2 VARCHAR(30),
Keyword3 VARCHAR(30),
Stock INTEGER NOT NULL
);

SCHEMA NAME: Cart_info
CREATE TABLE cart_info(
Product_id UUID REFERENCES product_info(product_id),
Email VARCHAR(40) REFERENCES users_info(email),
Item_id UUID NOT NULL PRIMARY KEY,
Quantity INTEGER NOT NULL DEFAULT 1
);

SCHEMA NAME: Sales_info
CREATE TABLE sales_info(
Product_id UUID REFERENCES product_info(product_id),
Email VARCHAR(40) REFERENCES users_info(email),
Quantity_purchased INTEGER NOT NULL,
Price_paid NUMERIC(19,2) NOT NULL
);
