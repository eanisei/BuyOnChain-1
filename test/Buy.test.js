const Buy = artifacts.require ("Buy")

contract("Buy", (accounts)=>{
    //console.log(accounts)
    before(async()=>{
        buy= await Buy.deployed()
    })
    it("gives the owner of the token 1M tokens", async()=>{
        let balance=await buy.balanceOf(accounts[0])
        balance =web3.utils.fromWei(balance, 'ether')
        assert.equal(balance,'1000000', "Balance should be 1M tokens")
    })
})