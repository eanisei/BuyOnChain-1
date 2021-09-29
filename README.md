# BuyOnChain
<img src="logo/Buy.gif" width="100">

https://dev.buyonchain.live/

Procedure:
   
1)All users have to stake 0.05 ether to use the marketplace.

2)Sellers will list the product{name, price, quantity}. The address will be stored as seller and an unique productId will be assigned to each product. The seller cannot buy his own product.              

3)Buyers can then buy the product {productId, quantity}. You have to pay the exact amount{price*quantity}, otherwise the transaction will get reverted. The money will get stored in the contract.    

4)Only the buyer can confirm after the product gets delivered. The money will then go from the contract to seller.

5)Two unique NFTs will get minted after successful transaction. One will go to the buyer and the other to the seller. These NFTs will be used as a proof of purchase and sell.

<img src="logo/scheme.png">