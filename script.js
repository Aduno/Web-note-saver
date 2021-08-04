import Tabs from "./Tabs.js";

var i = 0;
var myTab = new Tabs();
var deleted;
var CHAR_PER_TAB = 186;

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
            searchInStorage(myTab.title);
        });
    }else{
        //Updates the main-info with the saved information 
        let currentComment = document.querySelector("textarea");
        currentComment.textContent = (saved[2]);//[2] -- index 2 stores the comment associated with the tab
    }
}

//Updates the side tabs with items from the storage
function updateTabs(){
    let webTitle;
    let currentChar=0;
    chrome.storage.sync.get(null, item =>{
        for (let x of Object.values(item)){
            webTitle = x[0]; //gets the title of page
            //Cuts the length of title if it exceeds 60 chars
            if(webTitle.length>60){
                webTitle = webTitle.substring(0,59)+"...";
            }
            currentChar+=webTitle.length;
            console.log(currentChar)
            console.log(webTitle.length)
            if(currentChar>CHAR_PER_TAB){
                newPage();
            }
            var ul = document.querySelector("#savedURLS");
            var li = document.createElement("li");
            var aTag = document.createElement("a");
            aTag.href = x[1];//[1] --contains the URL of the tab
            aTag.target = "_blank";
            aTag.setAttribute("id","saved")
            aTag.appendChild(document.createTextNode(webTitle));

            li.appendChild(aTag)
            ul.appendChild(li);
        }
    });
}
//Creates a multipage ul list that can be navigated with buttons
function newPage(){

}

//Gets the number of items in storage
function count(callback){
    chrome.storage.sync.get(null,function(elem){
        i =0;
        for(let item of Object.values(elem)){
            i++;
        }
       callback(i);
    });
}

// Adds/edits the tab information and comments
function addToStorage(index){
    if(typeof index=="undefined"){
        myTab.comment = document.querySelector('textarea').value;
        //Change this so that it finds the index of the item in the storage and changes only the comment
        let site = String("website"+i);
        chrome.storage.sync.set({[site]: [myTab.title,myTab.url,myTab.comment]})
    }else{
        myTab.comment = document.querySelector('textarea').value;
        let site = String("website"+index);
        chrome.storage.sync.set({[site]: [myTab.title,myTab.url,myTab.comment]})
    }
}

//Called when the save button is clicked. This function chooses to either save or edit the information into storage
// depending on whehter there was prior data saved
function saveComment(){
    let found = false;
    chrome.storage.sync.get(null,function(item){
        let index = 0;
        let indexSaved; //Static variable used to store the index position where the identical item is stored
        //Checks if the object already exists in the list 
        for(let title of Object.values(item)){
            //If it finds saved data, only the comment is updated
            if(title[0]==myTab.title){
                found=true;
                indexSaved = index;
                //Updates current number of items saved before updating
                count(value =>{
                    i = value;
                    addToStorage(indexSaved);
                })
            }
            index++;
        }
        //If the item is not found, creates a new item in storage
        if(!found){
            count(value =>{
                i = value;
                addToStorage();
                updateTabs();
            })
        }
    });
}

//Searches if the current tab has information stored and if so, updates the textarea with the saved data
function searchInStorage(title){
    chrome.storage.sync.get(null,function(item){
        //Checks if the object already exists in the list 
        for(let title of Object.values(item)){
            //If it finds saved data, the textarea is updated
            if(title[0]==myTab.title){
                updateMainInfo(title);
            }
        }
    });
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
updateTabs();