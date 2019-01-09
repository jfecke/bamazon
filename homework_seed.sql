DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

-- Creates the table "people" within animals_db --
CREATE TABLE products (
  item_id int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  product_name varchar(50) NOT NULL,
  department_name varchar(50),
  price FLOAT(8) NOT NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY(item_id)
  );
  
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("pen", "Office Supplies", 0.50, 1000);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("pencil", "Office Supplies", 0.35, 1000);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("eraser", "Office Supplies", 0.15, 10000);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("stapler", "Office Supplies", 1.50, 300);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("staples (Pack of 100)", "Office Supplies", 1.00 , 1000);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("baseball bat", "Sporting Goods", 20, 100);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("baseball glove", "Sporting Goods", 50, 100);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("baseball (pack of 10)", "Sporting Goods", 25, 100);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("basketball", "Sporting Goods", 10, 100);
INSERT INTO products (product_name,department_name, price, stock_quantity) VALUES ("batting glove", "Sporting Goods", 35, 100);

