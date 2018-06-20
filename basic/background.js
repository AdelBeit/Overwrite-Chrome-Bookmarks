var geturl = true;
var hostsearch = "";
var taburl = "";
var bookmarked = false;

// grab website url
chrome.commands.onCommand.addListener(function(command){
    if (command == "overwrite-bookmark"){

      if(geturl){
        // get the url 
        chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
          hostsearch = message.hostname;
          geturl = false;
        });

        // send url to background
        chrome.tabs.executeScript({
          code: `var g = {};
          for (var k in window.location){
            if (typeof window.location[k] !== 'function') {
                g[k] = window.location[k];
            }
          }
          chrome.runtime.sendMessage(g);`
        });
      }
      
      // overwrite the bookmark
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
          
        chrome.bookmarks.getTree(function (bookmarkNodes) {
          var bmfolder = bookmarkNodes[0].children[0];
          var title = tab[0].title;
          taburl = tab[0].url;

          // delete all of them
          bmfolder.children.map((e) => {
            if (e.url == taburl){
              bookmarked = true;
            }
            if (e.url.includes(hostsearch) && hostsearch != "") {
              // removes from bookmarks
              chrome.bookmarks.remove(String(e.id));
            }
          });

          if(bookmarked){
            // delete all of them
            bmfolder.children.map((e) => {
              if (e.url == taburl && bookmarked){
                bookmarked = false;
                // removes from bookmarks
                chrome.bookmarks.remove(String(e.id));
              }
            });
          }
          else{
            // add new bookmark
            chrome.bookmarks.create({
              parentId: bmfolder.id,
              title: title,
              url: taburl
            });
          }
        });
      });

    }
});