var dummy = 'spike';
var newdum = 'bullet';
var checkdum = newdum;

var uuu = 'e';

// var print = args => console.log(args);
var print = args => alert(args);

// grab website url
chrome.commands.onCommand.addListener(function(command){
    if (command == "overwrite-bookmark"){

      // 
      chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
        
        alert(message.hostname);
        alert(message.host);
        alert(message.href);
        
      });

      chrome.tabs.executeScript({
        code: `var g = {};
        for (var k in window.location){
          if (typeof window.location[k] !== 'function') {
               g[k] = window.location[k];
          }
        }
        chrome.runtime.sendMessage(g);`
      });

      // gets current url
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
        chrome.bookmarks.getTree(function (bm) {
          addOrEdit(bm,tab);
        });
      });

      // chrome.tabs.executeScript({file: "script.js"});
      // chrome.tabs.executeScript({code: dumpBookmarks()});
    }

});

// when you have the url search with this
// dumpBookmarks($('#search').val());

// removes from bookmarks
// chrome.bookmarks.remove(String(bookmarkNode.id));

// add new bookmark
// chrome.bookmarks.create({
//   parentId: bookmarkNode.id,
//   title: $('#title').val(),
//   url: $('#url').val()
// });

// edit the bookmark
// chrome.bookmarks.update(String(bookmarkNode.id), {
//   title: edit.val()
// });


function addOrEdit(bookmarkNodes,tab) {
  var l = bookmarkNodes[0].children[0];
  var title = tab[0].title;
  var erl = tab[0].url;

  title = deleteCurrent(l,erl);
  title = (title == 0) ? tab[0].title : title;

  // add new bookmark
  chrome.bookmarks.create({
    parentId: l.id,
    title: title,
    url: erl
  });

}

function deleteCurrent(l,erl){
  var title = 0;  
  // delete all of them
  l.children.map((e) => {
    if (e.url == erl) {
      title = e.title;
      // removes from bookmarks
      chrome.bookmarks.remove(String(e.id));
    }
  });
  return title;
}