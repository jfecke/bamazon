var mysql = require("mysql")
var inquirer = require("inquirer");
const pageBreak = "------------------------------";
var product_list = [];
var product_names = [];
var product_names_simple = [];
var item_numbers = [];
var cart = {};
var products = {};
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected as ID " + connection.threadId);
    startShopping();
})

function startShopping() {
    console.log('\033[2J');
    console.log(pageBreak);
    console.log("Welcome to Bamazon!!");
    console.log(pageBreak);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Would you like to view our products?",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Yes") {
            getProducts();
        } else {
            console.log("Sorry to hear that. Have a Good Day!")
        }   
    })
}

function getProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        product_list = results;
        getNames();
        viewProducts()
    })
}
function getNames() {
    for (var j in product_list) {
        product_names.push(String(parseInt(j)+1) + ": " +product_list[j].product_name);
        product_names_simple.push(product_list[j].product_name)
        item_numbers.push(product_list[j].item_id);
        products[product_list[j].item_id] = product_list[j];
    }
    product_names.push("Checkout", "Quit Shopping");
}


function viewProducts() {
    console.log('\033[2J');
    console.log(pageBreak);
    console.log("Product Name | Department Name | Price")
    for (var i in product_list) {
        console.log(pageBreak);
        console.log(" "+product_list[i].product_name + " | " + product_list[i].department_name + " | $" +product_list[i].price);
    }
    console.log(pageBreak);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Which Item Would You Like to Add to Your Cart?",
            choices: product_names,
            name: "choice"
        }
    ]).then(function(response){
        let selection = response.choice.split(":")[0];
        let itemNumber = item_numbers[selection-1];
        if (response.choice == "Quit Shopping") {
            quitShopping();
        } else if (response.choice == "Checkout") {
            checkout();
        } else {
            console.log('\033[2J');
            console.log(pageBreak);
            selectItem(itemNumber)
        }   
    })
}

function selectItem(item) {
    var myArg = inquirer.prompt([
        {
            type: "input",
            message: "How many "+ products[item].product_name +" would you like to add to your cart?",
            name: "choice"
        }
    ]).then(function(response){
        
        let choice = parseInt(response.choice);
        if (!Number.isInteger(choice)) {
            console.log('\033[2J');
            console.log(pageBreak);
            console.log("Please enter a whole number.")
            selectItem(item);
        } else if (choice == 0) {
            verifyCancel(item);
        } else if (choice > products[item].stock_quantity){
            console.log('\033[2J');
            console.log(pageBreak);
            console.log("Please choose a quantity less than " +products[item].stock_quantity+".");
            selectItem(item);
        } else {
            addItem(item, choice);
        }
    })
}
 function verifyCancel(item) {
    console.log('\033[2J');
    console.log(pageBreak);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Comfirm cancel add item to cart?",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Yes") {
            console.log('\033[2J');
            viewProducts();
        } else {
            selectItem(item);
        }   
    })
 }

function addItem(item, amount) {
    console.log('\033[2J');
    console.log(pageBreak);
    if (cart[item]) {
        cart[item] += amount;
    } else {
        cart[item] = amount;
    }
    
    console.log("Added "+ amount + " " + products[item].product_name + "(s) to your cart.")
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Would you like to keep shopping",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Yes") {
            console.log('\033[2J');
            viewProducts();
        } else {
            checkout();
        }   
    })
}

function quitShopping() {
    console.log('\033[2J');
    console.log(pageBreak);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Are you sure? Your cart will be lost.",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Yes") {
            console.log('\033[2J');
            console.log(pageBreak);
            console.log("Sorry to hear that. Have a Good Day!")
            console.log(pageBreak);
        } else {
            viewProducts();
        }   
    })
}

function checkout() {
    let items = Object.keys(cart);
    let amounts = Object.values(cart)
    let total_price = 0;
    console.log('\033[2J');
    console.log(pageBreak);
    console.log("Your Cart:");
    console.log(pageBreak);
    console.log("Product Name | Price | Quantity | Total Price");
    console.log(pageBreak);
    for (let i in items) {
        console.log(" "+product_list[items[i]].product_name + " | $" +product_list[items[i]].price+" | " + amounts[i] + " | $" + (amounts[i]*product_list[items[i]].price));
        console.log(pageBreak);
        total_price += amounts[i]*product_list[items[i]].price;
    }
    console.log(pageBreak);
    console.log("Cart Total: $" + total_price);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "Purchase Items",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "No") {
            console.log('\033[2J');
            console.log(pageBreak);
            console.log("Sorry to hear that. Have a Good Day!")
            console.log(pageBreak);
        } else {
            buyItems();
        }   
    })
}

function buyItems() {
    var update = "UPDATE products "
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        product_list = results;
        getNames();
        let ids = Object.keys(cart);
        for (let i in ids) {
            update += 'SET stock_quantity = ' + (products[ids[i]].stock_quantity - cart[ids[i]])  + ' WHERE item_id = '+ ids[i] + ';'
            console.log(update);
        }
        connection.query(update, function(error, results) {
            if (error) throw error;
            checkResults();
        })
    })
}
function checkResults() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        product_list = results;
        connection.end();
        console.log('\033[2J');
        console.log(pageBreak);
        console.log("Product Name | Department Name | Price")
        for (var i in product_list) {
            console.log(pageBreak);
            console.log(" "+product_list[i].product_name + " | " + product_list[i].department_name + " | $" +product_list[i].price+ " | "+ product_list[i].stock_quantity) ;
        }
        console.log(pageBreak);
    })
}