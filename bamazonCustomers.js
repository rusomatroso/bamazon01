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
    displayProducts();
});

function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantaty);
        }
        console.log("-----------------------------------");
        buyItem();
    });
};
function buyItem() {
    inquirer
        .prompt([{
            name: "enterID",
            type: "input",
            message: "What is the item# you would like to purchase? (e.g. enter 6 for Atlantic Shrimp)"
        },
            {
                name: "enterAmount",
                type: "input",
                message: "How many units would you like to purchase?"
            }])
        .then(function (answer) {
            console.log(answer);
            var query = "SELECT product_name, department_name, price, stock_quantaty FROM products WHERE ? LIMIT 1";
            connection.query(query, {item_id: answer.enterID}, function (err, res) {
                var product = res[0];
                var amount = parseInt(answer.enterAmount);
                if(product['stock_quantaty'] < amount) {
                    console.error('Unsufficient stock amount. We have only '+product['stock_quantaty']+' items in stock.' );
                    buyItem();
                } else {
                    console.log("Thank you for purchasing "+ amount + " " + product.product_name + " from our " + product.department_name + " department for only $ " + product.price+ "per item.");
                    var newQuantity = product['stock_quantaty']-amount;
                    var query = "UPDATE products SET stock_quantaty = "+newQuantity+" WHERE ? LIMIT 1";
                    connection.query(query, {item_id: answer.enterID}, function (err, res) {
                        if(err === null) {
                            console.log('Your total is: $'+amount*product['price']);
                        }   else {
                            console.error(err.sqlMessage);
                        }
                    });
                }

            });
        });
}
