/* test/test.js */
describe("CloseSea", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const CloseSea = await ethers.getContractFactory("CloseSea")
    const closesea = await CloseSea.deploy()
    await closesea.deployed()

    let listingPrice = await closesea.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await closesea.createToken("https://www.mynftlocation.com", auctionPrice, { value: listingPrice })
    await closesea.createToken("https://www.mynftlocation2.com", auctionPrice, { value: listingPrice })
      
    const [_, buyerAddress] = await ethers.getSigners()
  
    /* execute sale of token to another user */
    await closesea.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    /* resell a token */
    await closesea.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* withdraw */
    await closesea.withdraw()

    /* query for and return the unsold items */
    items = await closesea.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await closesea.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})