Moralis.initialize("o1P68RrKFrV57EziChYGwbH1ETwpN250qb9rAgK1");

Moralis.serverURL = 'https://uvoj28qnh9dj.moralishost.com:2053/server'

init = async() => {
    hideElement(userInfo);
    hideElement(listItemForm);
    hideElement(userStakeForm);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async()=>{
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openListItemButton);
        hideElement(userStakeForm);
    }
    else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openListItemButton);
        hideElement(userStakeForm);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert(error);
    }
}

logout = async () => {
    await Moralis.User.logOut();
    hideElement(userInfo);
    initUser();

}

openUserInfo = async () =>{
    user = await Moralis.User.current();
    if (user){
        const email = user.get('email');
        if(email){
            userEmailField.value=email;
        }
        else{
            userEmailField.value="";
        }

        userUsernameField.value=user.get('username');

        const userAvatar= user.get('avatar');
        if(userAvatar){
            userAvatarImg.src= userAvatar.url();
            showElement(userAvatarImg);
        }
        else{
            hideElement(userAvatarImg);
        }
        const userAddress= user.get('address');
        if(userAddress){
            userAddressField.value= userAddress;
            
        }
        else{
            userAddressField.value="";
        }

        showElement(userInfo);
    }
    else{
        login();
    }
}

saveUserInfo = async () => {
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);
    user.set('address', userAddressField.value);

    if(userAvatarFile.files.length>0){
        const avatar =new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
        user.set('avatar', avatar);
    }
    await user.save();
    alert ("User info saved successfully!");
    openUserInfo();
}

userStake= async()=>{
    if (stakeAmount.value<0.05){
        alert("Please stake more than or equal to 0.05 ether!");
        return;
    }

    //solidity and web3 integration
    async function stake_Amount(){
    let _amount= stakeAmount.value*Math.pow(10,18);
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(stake.abi, "0xeF37E296d3f58E35ED0c1B6959AF29fB2990F568")
    contractInstance.methods.stake().send({from: ethereum.selectedAddress, value: _amount})
    .on('receipt', function(receipt){
        console.log(receipt);
        alert(receipt.events.Staked.returnValues);
    })
  }
  stake_Amount();
  
}

listItem= async()=>{
    if (listItemFile.files.length==0){
        alert("Please select a file!");
        return;
    }
    else if(listItemNameField.value.length==0){
        alert("Please give the item a name!");
        return;
    }
    
    const itemFile = new Moralis.File("itemFile.jpg", listItemFile.files[0])
    await itemFile.saveIPFS();

    const itemFilePath= itemFile.ipfs();
    const itemFileHash=itemFile.hash();

    const metadata={
     name: listItemNameField.value,
     description: listItemDescriptionField.value,
     price: listItemPriceField.value,
     itemFilePath: itemFilePath,
     itemFileHash: itemFileHash
    };


  const itemFileMetadata = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
  await itemFileMetadata.saveIPFS();

  const itemFileMetadataPath= itemFileMetadata.ipfs();
  const itemFileMetadataHash= itemFileMetadata.hash();

  const Item = Moralis.Object.extend("Item");

  //Create a new instance of that class.
  const item =new Item();
  item.set('name', listItemNameField.value);
  item.set('description', listItemDescriptionField.value);
  item.set('price', listItemPriceField.value);
  item.set('itemFilePath', itemFilePath);
  item.set('itemFileHash', itemFileHash);
  item.set('metadataFilePath', itemFileMetadataPath);
  item.set('metadataFileHash', itemFileMetadataHash);
  await item.save();
  console.log(item);

  //solidity and web3 integration
  async function list_Item(){
    let _name= listItemNameField.value;
    let _price= listItemPriceField.value;
    let _quantity= listItemQuantityField.value;
    window.web3 = await Moralis.Web3.enable();
    let contractInstance = new web3.eth.Contract(window.abi, "0xcdEc06999de5EEF40DA3542D8ccc29062bbe037b")
    contractInstance.methods.listItem(_name, _price, _quantity).send({from: ethereum.selectedAddress})
    .on('receipt', function(receipt){
        console.log(receipt);
        alert(receipt.events.newProduct.returnValues);
    })
  }
  list_Item();
  
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";

//Navbar
const userConnectButton= document.getElementById("btnConnect");
userConnectButton.onclick=login;

const userProfileButton= document.getElementById("btnUserInfo");
userProfileButton.onclick= openUserInfo;

const openListItemButton= document.getElementById("btnOpenListItem");
openListItemButton.onclick = () =>showElement(listItemForm);

const openStakeFormButton= document.getElementById("btnStakeForm");
openStakeFormButton.onclick = () =>showElement(userStakeForm);

//User Profile
const userInfo= document.getElementById("userInfo");
const userUsernameField= document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAddressField =document.getElementById("txtAddress")
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile= document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick=logout; 
document.getElementById("btnSaveUserInfo").onclick=saveUserInfo; 

//Stake
const userStakeForm= document.getElementById("userStakeForm")
const stakeAmount= document.getElementById("numStakeAmount");
document.getElementById("btnCloseStakeForm").onclick=() => hideElement(userStakeForm)
document.getElementById("btnStakeConfirm").onclick= userStake; 

//List Item
const listItemForm= document.getElementById("listItemForm");

const listItemNameField= document.getElementById("txtListItemName");
const listItemDescriptionField= document.getElementById("txtListItemDescription");
const listItemPriceField= document.getElementById("numListItemPrice");
const listItemQuantityField= document.getElementById("numListItemQuantity");
const listItemTypeField= document.getElementById("selectListItemType");
const listItemStatusField= document.getElementById("selectListItemStatus");
const listItemFile= document.getElementById("fileListItem");
document.getElementById("btnCloseListItem").onclick= () => hideElement(listItemForm); 
document.getElementById("btnListItem").onclick= listItem; 

// Burger menu 

const burger = document.querySelector('.burger');
const menuNav = document.querySelector('.menu');
const burgerLine = document.querySelector('.burger__line');

if (burger) {
    burger.addEventListener('click', (e) => {
        document.body.classList.toggle('_lock');
        e.currentTarget.classList.toggle('burger--active');
        burgerLine.classList.toggle('burger__line--active');
        menuNav.classList.toggle('menu--active');
    });
}

init();





  function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }