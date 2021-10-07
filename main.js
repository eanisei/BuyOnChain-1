// free images: http://cliparts.co/free-jpeg-clip-art
const MORALIS_APPLICATION_ID = "o1P68RrKFrV57EziChYGwbH1ETwpN250qb9rAgK1";
const MORALIS_SERVER_URL = "https://uvoj28qnh9dj.moralishost.com:2053/server";
Moralis.initialize(MORALIS_APPLICATION_ID);
Moralis.serverURL = MORALIS_SERVER_URL;


$('.slider-nav').slick({
  slidesToShow: 12,
  slidesToScroll: 1,
  dots: false,
  focusOnSelect: true
});
// $('a[data-slide]').click(function(e) {
//   e.preventDefault();
//   var slideno = $(this).data('slide');
//   $('.slider-nav').slick('slickGoTo', slideno - 1);
// });

const productCategories = {
    "elec": "Electronics",
    "comp": "Computers",
    "smrt": "Amart home",
    "arts": "Arts & crafts",
    "auto": "Automotive",
    "baby": "Baby",
    "baeu": "Beauty & personal care",
    "womn": "Women's fashion",
    "mens": "Mens fashion",   
    "grls": "Girls fashion",
    "boys": "Boys fashion",
    "heal": "Health and houshold",
    "home": "Home and kitchen",
    "indu": "Industrial and scientific",
    "lugg": "Luggage",
    "mvie": "Movies and television",
    "pets": "Pet supplies",
    "sftw": "Software",
    "sprt": "Sports and outdoors",
    "tool": "Tools and home improvements",
    "toys": "Toys and games",
    "vdeo": "Video games",
    "othr": "Others"
  }

// showPage = (id) => {
//     console.log('showpage: ' + id);
//     const aboutus = document.getElementById("aboutus");
//     const social = document.getElementById("social");
//     const docs = document.getElementById("docs");
//     const whitepaper = document.getElementById("whitepaper");
//     const home = document.getElementById("home");

//     hideElement(aboutus);
//     hideElement(social);
//     hideElement(docs);
//     hideElement(whitepaper);
//     hideElement(home);

//     switch (id) {
//         case 'aboutus':
//             showElement(aboutus);
//             break;
//         case 'social':
//             showElement(social);
//             break;
//         case 'docs':
//             showElement(docs);
//             break;
//         case 'whitepaper':
//             showElement(whitepaper);
//             break;
//         case 'home': // fallthrough..
//         default:
//             showElement(home);
//             break;
//     }
// }


init = async() => {
    await Moralis.Web3.authenticate(); // for raw version done here (no UI)
  
    hideElement(userInfo);
    hideElement(listItemForm);
    hideElement(userStakeForm);
    window.web3 = await Moralis.Web3.enable();
    initUser();

  }

initUser = async()=> {
    if (await Moralis.User.current()){
      hideElement(userConnectButton);
      showElement(userProfileButton);

      hideElement(userStakeForm);
    }
    else{
      showElement(userConnectButton);
      hideElement(userProfileButton);
      // $('#addProductForm').modal('show');
      hideElement(userStakeForm);
    }
}

login = async () => {
    try {
        await Moralis.Web3.authenticate();
        initUser();
    } catch (error) {
        alert('login: ' + error.code + '=' + error.message);
    }
}

logout = async () => {
    await Moralis.User.logOut();
    $('#userInfo').modal('hide');
    // $('#addProductForm').modal('hide');
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

        $('#userInfo').modal('show');
    }
    else{
        login();
    }
}

saveUserInfo = async () => {
    try {
        user.set('email', userEmailField.value);
        user.set('username', userUsernameField.value);
        user.set('address', userAddressField.value);


        if(userAvatarFile.files.length>0){
            const avatar =new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
            user.set('avatar', avatar);
        }
        await user.save();
        alert ("User info saved successfully!");
        $('#userInfo').modal('hide');
        openUserInfo();
    } catch (error) {
        alert('Save: ' + error.code + '=' + error.message);
    }
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


saveProduct = async () => {
    console.log('saveProduct...');
    if (addProductImageFile.files.length==0){
      alert("Please select an image file!");
    } else if (addProductNameField.value.length==0){
        alert("Please give the product a name!");
    } else {
      try {
        // the larger image file
        const productImageFile = new Moralis.File("imageFile.jpg", addProductImageFile.files[0])
        await productImageFile.saveIPFS();
        const productImageFilePath = productImageFile.ipfs();
        const productImageFileHash = productImageFile.hash();
        // create the thumbnail version.. see https://npm.io/package/react-image-file-resizer
        let thumbnailImage = "";
        await window.imageResize.imageFileResizer(addProductImageFile.files[0],
          150,150,"JPEG",100,0,(blob)=>{thumbnailImage=blob},"base64");
        console.log(thumbnailImage);
        const thumbnailImageFile = new Moralis.File("imageFile.jpg", thumbnailImage)
        await thumbnailImageFile.saveIPFS();
        const thumbnailImagePath = thumbnailImageFile.ipfs();
        const thumbnailImageFileHash = thumbnailImageFile.hash();
  
        console.log(numAddProductPrice.value);
        const priceWEI = Moralis.Units.ETH(numAddProductPrice.value);
  
        // add other extra fields to metadata..
        const productMetadata={
          description: addProductDescriptionField.value,
          imageFilePath: productImageFilePath,
          imageFileHash: productImageFileHash
        };
        const productMetadataFile = new Moralis.File("productMetadata.json", {base64: btoa(JSON.stringify(productMetadata))});
        await productMetadataFile.saveIPFS();
        const productMetadataFilePath= productMetadataFile.ipfs();
        const productMetadataFileHash= productMetadataFile.hash();
  
        const Product = Moralis.Object.extend("Products");
        const product = new Product();
        product.set('category', addProductCategoryField.value);
        product.set('name', addProductNameField.value);
        product.set('priceWEI', priceWEI);
        product.set('status','forSale');
        product.set('thumbnailImageFilePath', thumbnailImageFilePath);
        product.set('thumbnailImageFileHash', thumbnailImageFileHash);
        product.set('metadataFilePath', productMetadataFilePath);
        product.set('metadataFileHash', productMetadataFileHash);
        await product.save();
        const msg = "Product '"+addProductNameField.value+"' is successfully added!";
        console.log(msg);
        alert(msg);
        console.log(product);
        $('#addProductForm').modal('hide');
      } catch (error) {
        const msg = "saveProduct error: " + error.code +"="+ error.message;
        console.log(msg);
        alert(msg);
      }
    }
  }
  
  // Add new Product
  const btnAddProduct = document.getElementById("btnAddProduct");
  btnAddProduct.onclick = () => {
    console.log('Open addProductForm...');
    for (const key in productCategories) {
      $("#selectAddProductCategory").append($(document.createElement("option")).prop({
        value: key, 
        text: productCategories[key]
      }));
    }
    $("#addProductForm").modal('show');
  }
  const addProductForm=document.getElementById("addProductForm");
  const addProductNameField=document.getElementById("txtAddProductName");
  const addProductDescriptionField=document.getElementById("txtAddProductDescription");
  const addProductPriceField=document.getElementById("numAddProductPrice");
  const addProductImageFile=document.getElementById("fileAddProductImage");
  const addProductCategoryField=document.getElementById("selectAddProductCategory");
  document.getElementById("btnCloseAddProduct").onclick= () => { 
    console.log('Close addProductForm...');
    $("#addProductForm").modal('hide'); 
  }
  document.getElementById("btnSaveAddProduct").onclick= saveProduct; 
  





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
item.set('itemFilePath', itemFilePath);
item.set('itemFileHash', itemFileHash);
item.set('metadataFilePath', itemFileMetadataPath);
item.set('metadataFileHash', itemFileMetadataHash);
await item.save();
console.log(item);
}

hideElement = (element) => element.style.display = "none";
showElement = (element) => element.style.display = "block";

//Navbar
const userConnectButton= document.getElementById("btnConnect");
userConnectButton.onclick=login;

const userProfileButton= document.getElementById("btnUserInfo");
userProfileButton.onclick= openUserInfo;

// const openListItemButton= document.getElementById("btnOpenListItem");
// openListItemButton.onclick = () =>showElement(listItemForm);

const openStakeFormButton= document.getElementById("btnStakeForm");
openStakeFormButton.onclick = () =>showElement(userStakeForm);

//User Profile
const userInfo= document.getElementById("userInfo");
const userUsernameField= document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAddressField =document.getElementById("txtAddress")
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile= document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => { $('#userInfo').modal('hide'); }
document.getElementById("btnLogout").onclick=logout; 
document.getElementById("btnSaveUserInfo").onclick=saveUserInfo; 

//Stake
const userStakeForm= document.getElementById("userStakeForm")
const stakeAmount= document.getElementById("numStakeAmount");
document.getElementById("btnCloseStakeForm").onclick=() => hideElement(userStakeForm)
document.getElementById("btnStakeConfirm").onclick= userStake; 


//List Item
const listItemForm= document.getElementById("listItem");

const listItemNameField= document.getElementById("txtListItemName");
const listItemDescriptionField= document.getElementById("txtListItemDescription");
const listItemPriceField= document.getElementById("numListItemPrice");
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

document.getElementById("btnHome").onclick = () => { showPage('home'); }
document.getElementById("btnAboutUs").onclick = () => { showPage('aboutus'); }
document.getElementById("btnSocial").onclick = () => { showPage('social'); }
document.getElementById("btnDocs").onclick = () => { showPage('docs'); }
document.getElementById("btnWhitepaper").onclick = () => {  }

init();

  function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }