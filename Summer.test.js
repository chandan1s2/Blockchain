const Summer = artifacts.require('./Summer.sol')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Summer', ([deployer, seller, buyer]) => {
	let summer

	before(async () => {
		summer = await Summer.deployed()
	})

	describe('deployment', async() => {
		it('deploys successfully', async () => {
			const address = await summer.address
			assert.notEqual(address, 0x0)
			assert.notEqual(address, ' ')
			assert.notEqual(address, null)
			assert.notEqual(address, undefined)
		})

		it('has a name', async () =>{
			const name = await summer.name()
			assert.equal(name, 'Chandan Soni is a billionaire')
		})
	})

	describe('products', async() => {
		let result, productCount

		before(async () => {
			result = await summer.createProduct('Iphone X', web3.utils.toWei('1', 'Ether'), { from: seller }) 
			productCount = await summer.productCount()
		}) 

		it('creates products', async () =>{
			// success case
			assert.equal(productCount, 1)
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'Iphone X', 'name is correct')
			assert.equal(event.price, '1000000000000000000', 'price is correct')
			assert.equal(event.owner, seller , 'is correct')
			assert.equal(event.purchased, false, 'purchased is correct') 

			// failure: Product must have a name
			await await summer.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected; 

			// failure: Product must have a name
			await await summer.createProduct('Iphone X', 0, { from: seller }).should.be.rejected; 
		})
 	
		it('lists products', async () => {
			const product = await summer.products(productCount)

			assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(product.name, 'Iphone X', 'name is correct')
			assert.equal(product.price, '1000000000000000000', 'price is correct')
			assert.equal(product.owner, seller , 'is correct')
			assert.equal(product.purchased, false, 'purchased is correct') 
		})

		it('sells products', async () =>{
			// track the seller balance before purchase
			let oldSellerBalance
			oldSellerBalance = await web3.eth.getBalance(seller)
			oldSellerBalance = new web3.utils.BN(oldSellerBalance)	// BN = big number

			// Success: buyer makes purchase
			result = await summer.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('1', 'Ether') })

			// check logs
			const event = result.logs[0].args
			assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
			assert.equal(event.name, 'Iphone X', 'name is correct')
			assert.equal(event.price, '1000000000000000000', 'price is correct')
			assert.equal(event.owner, buyer , 'is correct')
			assert.equal(event.purchased, true, 'purchased is correct')

			// check that seller received funds
			let newSellerBalance
			newSellerBalance = await web3.eth.getBalance(seller)
			newSellerBalance = new web3.utils.BN(oldSellerBalance)

			let price
			price =  web3.utils.toWei('1', 'Ether')
			price = new web3.utlis.BN(price)

			const expectedBalance = oldSellerBalance.add(price)
			assert.equal(newSellerBalance.toString(), expectedBalace.toString())

			await summer.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected;

			

		})	
})
})