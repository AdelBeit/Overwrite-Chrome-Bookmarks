chrome.commands.onCommand.addListener(function(command){
    alert(command);
    
});
// chrome.browserAction.onClicked.addListener(function(tab){
//     // chrome.tabs.executeScript(null, {file: "popup.js"});
//     // console.log("Command:", command);
//     alert('ok');
// });