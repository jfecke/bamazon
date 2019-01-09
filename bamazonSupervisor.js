var mysql = require("mysql")
var inquirer = require("inquirer");
const pageBreak = "------------------------------";
var product_list = [];
var product_names = [];
var product_names_simple = [];
var item_numbers = []; 
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
    startSupervising();
})

function startSupervising() {
    console.log('\033[2J');
    console.log(pageBreak);
    console.log("Welcome to Bamazon!!");
    console.log(pageBreak);
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "View Products for Sale") {
            viewProducts();
        } else if (response.choice == "View Low Inventory") {
            viewLow();
        } else if (response.choice == "Add to Inventory") {
            addInv();
        } else if (response.choice == "Add New Product") {
            addNew();
        } else {
            console.log("Sorry to hear that. Have a Good Day!")
        }   
    })
}

function viewProducts() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        product_list = results;
        console.log('\033[2J');
        console.log(pageBreak);
        console.log("Item Number | Product Name | Quantity | Price")
        for (var i in product_list) {
            console.log(pageBreak);
            console.log(" "+product_list[i].item_id + " | " + product_list[i].product_name + " | " + product_list[i].quantity+" | $" +product_list[i].price);
        }
        console.log(pageBreak);
        moreOptions()
    })
}

function viewLow() {
    connection.query("SELECT * FROM products where quantity <= 5", function(error, results) {
        if (error) throw error;
        product_list = results;
        console.log('\033[2J');
        console.log(pageBreak);
        console.log("Item Number | Product Name | Quantity | Price")
        for (var i in product_list) {
            console.log(pageBreak);
            console.log(" "+product_list[i].item_id + " | " + product_list[i].product_name + " | " + product_list[i].quantity+" | $" +product_list[i].price);
        }
        console.log(pageBreak);
        moreOptions()
    })
}

function addInv() {
    connection.query("SELECT * FROM products", function(error, results) {
        if (error) throw error;
        product_list = results;
        console.log('\033[2J');
        console.log(pageBreak);
        getNames();            
        var myArg = inquirer.prompt([
            {
                type: "list",
                message: "Which Item Would You Like to Add Inventory for?",
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
            message: "Comfirm cancel add inventory for this item?",
            choices: ["Yes", "No"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Yes") {
            console.log('\033[2J');
            startSupervising();
        } else {
            selectItem(item);
        }   
    })
}

function addItem(item, amount) {
    console.log('\033[2J');
    console.log(pageBreak);
    var update = "UPDATE products ";
    update += 'SET stock_quantity = ' + amount  + ' WHERE item_id = '+ item + ';'
    connection.query(update, function(error, results) {
        console.log(amount + "has been added to inventory for Item: " +products[item].product_name+ ", item number: " +  item + ".")
        startSupervising();
    })
    
}

function moreOptions() {
    var myArg = inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Return to Main Menu", "Quit"],
            name: "choice"
        }
    ]).then(function(response){
        if (response.choice == "Return to Main Menu") {
            startSupervising();
        } else {
            console.log("Sorry to hear that. Have a Good Day!")
        }   
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

function addNew() {
    console.log('\033[2J');
    console.log(pageBreak);
    console.log("UNDER CONSTRUCTION")
    startSupervising();
}