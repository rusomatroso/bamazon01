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
    //displayProducts();
    buyItem();
});

/*function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantaty);
        }
        console.log("-----------------------------------");
    });
};*/
function buyItem() {
    inquirer
        .prompt(
            {
                name: "enterID",
                type: "input",
                message: "What is the item# you would like to purchase? (e.g. enter 6 for Atlantic Shrimp)"
            }
            )
        .then(function (answer) {
            var query = "SELECT product_name, department_name, price FROM products WHERE ?";
            connection.query(query, {item_id: answer.enterID}, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("Thank you for purchasing: " + res[i].product_name + " || from our: " + res[i].department_name + " department for only $ " + res[i].price);
                }
            });
        });
};
