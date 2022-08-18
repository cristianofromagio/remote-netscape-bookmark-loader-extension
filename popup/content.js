
document.getElementById("fetchContent").addEventListener('click', () => {

  $.fetch($('#bookmarkletLink').value, {
    method: "GET"
  }).then((result) => {
    const parser = new DOMParser();
    const bookmarksDoc = parser.parseFromString(result.response, 'text/html');

    $$("a", bookmarksDoc).forEach((a) => {
      const entry = $.create("li", {
        contents: {
          tag: "a",
          href: a.href,
          textContent: a.textContent
        }
      });

      $("#list").appendChild(entry);
    });

    function defaultMouseAction(ev) {
      ev.preventDefault();
      ev.stopPropagation();

      const link = ev.target;
      const code = `
        if (typeof bookmarkletLink === 'undefined') {
          let bookmarkletLink = document.createElement('a');
          bookmarkletLink.href = \`${link.href}\`;
          bookmarkletLink.style.opacity = 0;
          bookmarkletLink.style.position = 'absolute';
          bookmarkletLink.style.left = '-9999px';
          document.body.appendChild(bookmarkletLink);
          bookmarkletLink.click();
          document.body.removeChild(bookmarkletLink);
        } else {
          bookmarkletLink.href = \`${link.href}\`;
          document.body.appendChild(bookmarkletLink);
          bookmarkletLink.click();
          document.body.removeChild(bookmarkletLink);
        }
      `;

      browser.tabs.executeScript({
        // code: link.href
        // code: `console.log('location:', window.location.href);`
        // file: '/content_scripts/run_bookmarklet.js'
        code: code
      })
      .then(() => console.log('scripting worked'))
      .catch((err) => {
        console.log('scripting failed');
        console.log(err);
      });
    }

    $$("a", $("#list")).forEach((bookmarkletLink) => {
      bookmarkletLink.removeEventListener('click', defaultMouseAction);
      bookmarkletLink.addEventListener('click', defaultMouseAction);
    });
  }).catch((error) => console.error(error, "code: " + error.status));



  // $("a").each(function(index, a) {
  //     var $a = $(a);
  //     var title = $a.text();
  //     var url = $a.attr("href");
  //     var categories = getCategories($a);
  //     console.log(title, url, categories);
  // });

  // function getCategories($a) {
  //   var $node = $a.closest("DL").prev();
  //   var title = $node.text()
  //   if ($node.length > 0 && title.length > 0) {
  //       return [title].concat(getCategories($node));
  //   } else {
  //       return [];
  //   }
  // }

});

//   function modifyDOM() {
//       //You can play with your DOM here or check URL against your regex
//       console.log('Tab script:');
//       console.log(document.body);
//       return document.body.innerHTML;
//   }

//   //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
//   chrome.tabs.executeScript({
//       code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
//   }, (results) => {
//       //Here we have just the innerHTML and not DOM structure
//       console.log('Popup script:')
//       console.log(results[0]);
//   });
// });