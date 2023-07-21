pragma solidity ^0.5.0; 					// declaring the version of solidity we use

contract summer {						// the smartcontract which we make
	 string public name;				// using public here
	 uint public productCount = 0;			// variable to count how many pdts
	 mapping(uint => Product) public products;
	 

	 struct Product {					// creating product as a seller
	 	uint id;
	 	string name;
	 	uint price;
	 	address payable owner;
	 	bool purchased;
	 }

	 event ProductCreated(
	 	uint id,
	 	string name,
	 	uint price, 
	 	address payable owner, 
	 	bool purchased
	 	);

	 event ProductPurchased(
	 	uint id,
	 	string name,
	 	uint price, 
	 	address payable owner, 
	 	bool purchased
	 	);


	 constructor() public {				// function inside smart contract
	 
	 name = "Chandan Soni is a billionaire";
	 
	 }	

	 function createProduct(string memory _name, uint _price  ) public {		// underscore '_' shows that the respective variable is local variable, not state variable		// creating a function			
	 	// things we want to do
	 	// make sure parameters ar correct

	 	// requirea a valid name
	 	require(bytes(_name).length > 0);

	 	// require a valid price
	 	require(_price > 0);

	 	// increament product count
	 	productCount ++;

	 	// create the product
	 	products[productCount] = Product(productCount, _name, _price, msg.sender, false);
	 	
	 	// trigger an event
	 	emit ProductCreated(productCount, _name, _price, msg.sender, false);
	}

	function purchaseProduct(uint _id) public payable {
		// fetch the product
		Product memory _product = products[_id];		// using this underscore makes it a local independent variable instead of the state variable
		// fetch the owner
		address payable _seller = _product.owner;
		// make sure the product is valid
		require(_product.id > 0 && _product.id <= productCount);
		// require that there is enough ether in the transaction
		require(msg.value >= _product.price);
		// require that the product has not been purchased already
		require(!_product.purchased);
		// require that the buyer is not the seller
		require(_seller != msg.sender);
		// transfer ownership to the buyer
		_product.owner = msg.sender;
		// Mark as purchased
		_product.purchased = true;
		// update the product
		products[_id] = _product;
		// paying the seller by sending them Ether
		address(_seller).transfer(msg.value);
		// trigger an event
	 	emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
	}
}


