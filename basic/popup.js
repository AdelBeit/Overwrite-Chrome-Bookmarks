// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var print = e => console.log(e);

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

var dummy = 'spike';
var newdum = 'bullet';
var checkdum = newdum;

// outdated method, wont work when multiple windonws open
// chrome.tabs.getSelected((tab) => {
  // console.log(tab.url.hostname);
// });

var uuu = 'e';

// gets current url
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tab) {
  console.log(tab[0].url);
  uuu = tab[0].url;
});

// on click make a dummy bookmark for test
$(function () {

  $('#makeone').click(function () {

    chrome.bookmarks.getTree(function (bm) {
      $('#bookmarks').empty();
      $('#search').val(dummy);

      addOrEdit(bm);

      // var l = bm[0].children[0];
      // var c = l.children[l.children.length - 1];
      // var exists = 0;
      // var dumurl = 'https://lensdump.com/';

      // l = bm[0].children[0];
      // c = l.children[l.children.length - 1];

      // l.children.map((e) => {
      //   if (e.title == dummy) {
      //     exists++;
      //   }
      // });

      // if (exists == 10) {
      //   l.children.map((e) => {
      //     if (e.title == dummy) {
      //       // edit the bookmark
      //       chrome.bookmarks.update(String(e.id), {
      //         title: newdum
      //       });
      //     }
      //   });
      // }

      // // if (!exists){
      // // add new bookmark
      // chrome.bookmarks.create({
      //   parentId: l.id,
      //   title: dummy,
      //   url: dumurl
      // });
      // // }

      dumpBookmarks(dummy);
      dumpBookmarks(newdum);

    });

  });

  $('#deleteone').click(function () {

    chrome.bookmarks.getTree(function (bm) {
      $('#bookmarks').empty();

      // var l = bm[0].children[0];
      // var c = l.children[l.children.length - 1];

      // l.children.map((e) => {
      //   if (e.title == newdum || e.title == dummy) {
      //     // removes from bookmarks
      //     chrome.bookmarks.remove(String(e.id));
      //   }

      // });

      dumpBookmarks(dummy);
      dumpBookmarks(newdum);

      deleteNodes(bm);
    });

  });

  $('#checkone').click(function () {
    $('#bookmarks').empty();
    // dumpBookmarks(dummy);
    // dumpBookmarks(newdum);
  });
});

function addOrEdit(bookmarkNodes) {
  var l = bookmarkNodes[0].children[0];
  var c = l.children[l.children.length - 1];
  var exists = 0;
  var dumurl = 'https://lensdump.com/';

  // delete all of them
  l.children.map((e) => {
    if (e.title == dummy) {
      // removes from bookmarks
      chrome.bookmarks.remove(String(e.id));
    }
  });

  // add new bookmark
  chrome.bookmarks.create({
    parentId: l.id,
    title: dummy,
    url: dumurl
  });

  // delete this later
  // dumpBookmarks(dummy);
  // dumpBookmarks(newdum);

  // l.children.map((e) => {
  //   if (e.title == dummy) {
  //     exists++;
  //   }
  // });

  // if (exists == 10) {
  //   l.children.map((e) => {
  //     if (e.title == dummy) {
  //       // edit the bookmark
  //       chrome.bookmarks.update(String(e.id), {
  //         title: newdum
  //       });
  //     }
  //   });
  // }
}

function deleteNodes(bookmarkNodes) {
  var l = bookmarkNodes[0].children[0];
  var c = l.children[l.children.length - 1];

  l.children.map((e) => {
    if (e.title == newdum || e.title == dummy) {
      // removes from bookmarks
      chrome.bookmarks.remove(String(e.id));
    }

  });

  // delete this later
  // dumpBookmarks(dummy);
  // dumpBookmarks(newdum);
}

// Search the bookmarks when entering the search keyword.
// $(function () {
//   $('#search').change(function () {
//     $('#bookmarks').empty();
//     dumpBookmarks($('#search').val());
//   });
// });

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function (bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}

// get all the folders and bookmarks
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
  }
  return list;
}

// grab/return a bookmark
function dumpNode(bookmarkNode, query) {

  // if query term is not found
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
    // else make a link
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    anchor.text(bookmarkNode.title);
    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function () {
      chrome.tabs.create({
        url: bookmarkNode.url
      });
    });
    // if bookmark has children (is a folder) make add button
    // else it is a bookmark itself, make edit and delete buttons
    var span = $('<span>');
    var options = bookmarkNode.children ?
      $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
      $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
        'href="#">Delete</a>]</span>');
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
      '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
      '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.
    //////////// this doesnt work becuase dialog throws an error
    span.hover(function () {
        span.append(options);
        $('#deletelink').click(function () {
          $('#deletedialog').empty();
          // removes from bookmarks
          chrome.bookmarks.remove(String(bookmarkNode.id));
          span.parent().remove();
        })
        $('#addlink').click(function () {
          $('#adddialog').empty().append(edit);
          // add new bookmark
          chrome.bookmarks.create({
            parentId: bookmarkNode.id,
            title: $('#title').val(),
            url: $('#url').val()
          });
          $('#bookmarks').empty();
          window.dumpBookmarks();
        });
        $('#editlink').click(function () {
          edit.val(anchor.text());
          $('#editdialog').empty().append(edit);
          // edit the bookmark
          chrome.bookmarks.update(String(bookmarkNode.id), {
            title: edit.val()
          });
          anchor.text(edit.val());
          $('#bookmarks').empty();
          window.dumpBookmarks();
        });
        options.fadeIn();
      },
      // unhover
      function () {
        options.remove();
      }).append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});