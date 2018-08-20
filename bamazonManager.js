var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});


connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    managerMenu();
});

function displayProducts(condition) {
    var query = "SELECT * FROM products";
    if (condition === 'low') {
        query = "SELECT * FROM products WHERE stock_quantaty <= 5";
    }
    connection.query(query, function (err, res) {
        if (!res || res.length === 0) {
            console.log('No low stock products...');
        } else {
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantaty);
            }
        }
        console.log("-----------------------------------");
        managerMenu();
    });
};

function managerMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "Welcome, Manager! Please select what you would like to do:",
            choices: [
                "View products for sale",
                "View Low inventory",
                "Add to Inventory",
                "Add New Product"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View products for sale":
                    displayProducts('all');
                    break;
                case "View Low inventory":
                    displayProducts('low');
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
            }
        });
}

function addToInventory() {
    inquirer
        .prompt([{
            name: "enterID",
            type: "input",
            message: "What is the item# you would like to add to Inventory? (e.g. enter 6 for Atlantic Shrimp)"
        },
            {
                name: "enterAmount",
                type: "input",
                message: "How many units would you like to add to Inventory?"
            }])
        .then(function (answer) {
            var query = "SELECT product_name, price, stock_quantaty FROM products WHERE ? LIMIT 1";
            connection.query(query, {item_id: answer.enterID}, function (err, res) {
                if (err !== null) {
                    console.log('No such product....');
                    addToInventory();
                    return;
                }
                var product = res[0];
                var amount = parseInt(answer.enterAmount);

                var newQuantity = product['stock_quantaty'] + amount;
                var query = "UPDATE products SET stock_quantaty = " + newQuantity + " WHERE ? LIMIT 1";
                connection.query(query, {item_id: answer.enterID}, function (err, res) {
                    if (err === null) {
                        console.log('Your inventory has been updated.');
                    } else {
                        console.error(err.sqlMessage);
                    }
                    managerMenu();
                });


            });
        });
}

function addNewProduct() {
    inquirer
        .prompt([{
            name: "enterName",
            type: "input",
            message: "What is the product name you would like to add?"
        },
            {
                name: "enterAmount",
                type: "input",
                message: "How many units would you like to add"
            },
            {
                name: "enterPrice",
                type: "input",
                message: "What is the price per unit?"
            },
            {
                name: "enterDep",
                type: "input",
                message: "What is the Department?"
            }])
        .then(function (answer) {
            console.log(answer);
            var query = "INSERT INTO products SET ?";
            connection.query(query,
                {
                    product_name: answer.enterName,
                    stock_quantaty: parseInt(answer.enterAmount),
                    price: parseFloat(answer.enterPrice),
                    department_name: answer.enterDep,

                }, function (err, res) {
                    if (err !== null) {
                        console.log('Could not add a product. ' + err.sqlMessage);
                        addNewProduct();
                        return;
                    }
                    console.log('Your product has been added.');
                    managerMenu();
                });
        });
}

