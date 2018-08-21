drop database if exists bamazonDB;
create database bamazonDB;
use bamazonDB;

CREATE TABLE products(
	item_id integer auto_increment not null,
	product_name CHAR(50) not null,
	department_name CHAR(50) not null,
	price DECIMAL(10,2) NULL,
	stock_quantaty INT UNSIGNED NULL,
    primary key (item_id)
);

INSERT INTO products (item_id, product_name, department_name, price,stock_quantaty)
VALUES (001, 'Veal Stake', 'Meats', 15.99, 250),
(002, 'Ground Beef', 'Meats', 6.99, 500),
(003, 'Prok ribs', 'Meats', 7.99, 180),
(004, 'T-bone', 'Meats', 17.99, 120),
(005, 'Laker fillet', 'Fish', 14.99, 100),
(006, 'Atlantic Shrimp', 'Fish', 9.99, 330),
(007, 'Crab legs', 'Fish', 22.99, 80),
(008, 'Sea Bass', 'Fish', 13.99, 210),
(009, 'Bananas', 'Fruits', 2.99, 400),
(010, 'Watermelon', 'Fruits', 6.99, 240),
(011, 'Pears', 'Fruits', 5.99, 140);

select * from products;