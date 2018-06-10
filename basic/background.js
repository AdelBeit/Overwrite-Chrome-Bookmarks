// chrome.commands.onCommand.addListener(function(command){
//     console.log("Command:", command);
// });
chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(null, {file: "testScript.js"});
});