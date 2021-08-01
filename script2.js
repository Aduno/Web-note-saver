import Tabs from "./Tabs.js";

var i = 0;
var myTab = new Tabs();


function updateMainInfo(saved){
    //Gets the current tab information (title,url)
    if(typeof saved=="undefined"){
        chrome.tabs.query({currentWindow: true, active: true }, function(tabs){    
            //Selects the URL and TITLE divs from the html
            let currentURL = document.querySelector("#URL");
            let currentTitle = document.querySelector("#Title")
            let displayURL;

            myTab.url = tabs[0].url;
            displayURL = myTab.url;
            if(myTab.url.length>100){
                displayURL = myTab.url.substring(0,99)+"...";
            }
            myTab.title = tabs[0].title;
            currentTitle.textContent = myTab.title;
            currentURL.textContent = displayURL;
            count();
            console.log(i);
        });
    }else{
        //Updates the main-info with the saved information object
    }
}

//Updates the side tabs with items from the storage
function updateTabs(){
    let webTitle;
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

function count(){
    //Doesnt work because its an asynchronus call(?)
    chrome.storage.sync.get(null,function(elem){
        i =0;
        for(let item of Object.values(elem)){
            i++;
        }
    });
}
function updateStorage(tabObject){
    myTab.comment = document.querySelector('textarea').value;
    console.log(i);
    //Change this so that it finds the index of the item in the storage and changes only the comment
    let site = String("website"+i);
    chrome.storage.sync.set({[site]: [myTab.title,myTab.url,myTab.comment]})
    chrome.storage.sync.get(null,item=>{
        console.log(item);
    })
}
function saveComment(){
    let found = false;
    //Fix this as well
    chrome.storage.sync.get(null,function(item){
        //Checks if the object already exists in the list 
        for(let title of Object.values(item)[0]){
            if(title==myTab.title){
                found=true;
                updateStorage();
            }
        }
        if(!found){
            console.log("not found");
            addToStorage();
        }else{
            //Found in storage
            console.log("found")
        }
    });
    //If it doesn't find a saved tab, create a new element to store
    
}

function removeComment(){

}

function addEventListener(){
    document.querySelector("#save").addEventListener("click",function(){
        saveComment();
        updateMainInfo();
    });

    // document.querySelector("#delete").addEventListener("click",function(){
    //     removeComment();
    //     updateStorage();
    // });
}

addEventListener();
updateMainInfo();