import Tabs from "./Tabs.js";

var i = 0;
var myTab = new Tabs();
//Used to update the current tab info for the main-info div
function updateMainInfo(){
    chrome.tabs.query({currentWindow: true, active: true }, function(tabs){    
        var currentURL = document.querySelector("#URL");
        var currentTitle = document.querySelector("#Title")

        myTab.url = tabs[0].url;
        if(myTab.url.length>100){
            myTab.url = myTab.url.substring(0,99)+"...";
        }
        myTab.title = tabs[0].title;
        currentTitle.textContent = myTab.title;
        currentURL.textContent = myTab.url;
    });
    var list = document.querySelector("#savedURLS");
    var savedItems;
}

function saveComment(){
    myTab.comment = document.querySelector('textarea').value
    console.log(i);
    let site = String("website"+i);
    chrome.storage.sync.set({[site]: [myTab.title,myTab.url,myTab.comment]})
    chrome.storage.sync.get(null,item=>{
        console.log(item);
    })
    i++;
    updateTabsInfo();
}

//Used for updating the main-info with information loaded from saved tabs
function updateTabsInfo(){  
    var webTitle,webUrl,webComment;
    chrome.storage.sync.get(null, item =>{
        for (let x of Object.values(item)){
            webTitle = x[0]; //gets the title of page
            var ul = document.querySelector("#savedURLS");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(webTitle));
            ul.appendChild(li);
        }
    });
}

function updateTabInfo(){

}

function getStorageLength(){

}


function addListeners(){
    document.querySelector("#save").addEventListener("click",function(){
        saveComment();
        updateMainInfo();
    });
}

function updateComments(){

}

function getSavedTabs(){
    chrome.storage.sync.get()
    return ;
}

addListeners();
updateTabsInfo();
updateMainInfo();



