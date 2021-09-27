Moralis.initialize("o1P68RrKFrV57EziChYGwbH1ETwpN250qb9rAgK1");

Moralis.serverURL = 'https://uvoj28qnh9dj.moralishost.com:2053/server'

init = async() => {
    hideElement(userInfo);
    hideElement(listItemForm);
    window.web3 = await Moralis.Web3.enable();
    initUser();
}

initUser = async()=>{
    if (await Moralis.User.current()){
        hideElement(userConnectButton);
        showElement(userProfileButton);
        showElement(openListItemButton);
    }
    else{
        showElement(userConnectButton);
        hideElement(userProfileButton);
        hideElement(openListItemButton);
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

        showElement(userInfo);
    }
    else{
        login();
    }
}

saveUserInfo = async () => {
    user.set('email', userEmailField.value);
    user.set('username', userUsernameField.value);

    if(userAvatarFile.files.length>0){
        const avatar =new Moralis.File("avatar.jpg", userAvatarFile.files[0]);
        user.set('avatar', avatar);
    }
    await user.save();
    alert ("User info saved successfully!");
    openUserInfo();
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

const openListItemButton= document.getElementById("btnOpenListItem");
openListItemButton.onclick = () =>showElement(listItemForm);

//User Profile
const userInfo= document.getElementById("userInfo");
const userUsernameField= document.getElementById("txtUsername");
const userEmailField = document.getElementById("txtEmail");
const userAvatarImg = document.getElementById("imgAvatar");
const userAvatarFile= document.getElementById("fileAvatar");

document.getElementById("btnCloseUserInfo").onclick = () => hideElement(userInfo);
document.getElementById("btnLogout").onclick=logout; 
document.getElementById("btnSaveUserInfo").onclick=saveUserInfo; 

//List Item
const listItemForm= document.getElementById("listItem");

const listItemNameField= document.getElementById("txtListItemName");
const listItemDescriptionField= document.getElementById("txtListItemDescription");
const listItemPriceField= document.getElementById("numListItemPrice");
const listItemStatusField= document.getElementById("selectListItemStatus");
const listItemFile= document.getElementById("fileListItem");
document.getElementById("btnCloseListItem").onclick= () => hideElement(listItemForm); 
document.getElementById("btnListItem").onclick= listItem; 


init();