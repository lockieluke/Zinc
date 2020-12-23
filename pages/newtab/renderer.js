document.body.onload = async () => {
  document.body.style.display = 'block';
  getJSON(
    'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US',
    (_err, data) => {
      const backurl = data.images[0].url;
      const fullurl = `https://www.bing.com/${backurl}`;
      document.body.style.backgroundImage = `url("${fullurl}")`;
    },
  );
};

const searchfield = document.getElementById('searchfield');
let suggestions = [];
let focusedSuggestion = 0;

searchfield.addEventListener('input', (event) => {
  if (searchfield.value !== '') {
    const autocompletefield = document.createElement('div');
    autocompletefield.className = 'autocomplete';
    autocompletefield.id = 'autocomplete';
    if (!document.getElementById('autocomplete')) {
      document.getElementById('locationbox').appendChild(autocompletefield);
    }
    const suggestionChildren = document.getElementById('autocomplete');
    suggestionChildren.innerHTML = '';
    readGoogleSuggestion();
    if (validURL(searchfield.value)) {
      const suggestionItem = document.createElement('h6');
      suggestionItem.innerText = searchfield.value;
      suggestionItem.className = 'autocomplete-item';
      document.getElementById('autocomplete').appendChild(suggestionItem);
    }
    for (let i = 0; i < suggestions.length; i++) {
      const suggestionItem = document.createElement('h6');
      suggestionItem.innerText = suggestions[i];
      suggestionItem.className = 'autocomplete-item';
      suggestionItem.tabIndex = i;
      suggestionItem.id = 'suggestion-' + i;
      document.getElementById('autocomplete').appendChild(suggestionItem);
    }
    focusedsuggestion = -1;
    resetAutoSuggestions();
    initListenersForSuggestions();
    hightlightURLs();
  } else {
    const suggestionChildren = document.getElementById('autocomplete');
    suggestionChildren.innerHTML = '';
    document.getElementById('autocomplete').remove();
  }
});

searchfield.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (focusedsuggestion == 0) {
      focusedsuggestion = suggestions.length;
    } else {
      focusedsuggestion--;
    }
    resetAutoSuggestions();
    document
      .getElementById('autocomplete')
      .children.item(focusedsuggestion).style.backgroundColor = '#bebebe';
    searchfield.value = document
      .getElementById('autocomplete')
      .children.item(focusedsuggestion).innerText;
    hightlightURLs();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (focusedsuggestion == suggestions.length) {
      focusedsuggestion = 0;
    } else {
      focusedsuggestion++;
    }
    resetAutoSuggestions();
    document
      .getElementById('autocomplete')
      .children.item(focusedsuggestion).style.backgroundColor = '#bebebe';
    searchfield.value = document
      .getElementById('autocomplete')
      .children.item(focusedsuggestion).innerText;
    hightlightURLs();
  } else if (event.key == 'Enter') {
    checkIfQueryOrURL(searchfield.value);
  }
});

function checkIfQueryOrURL(term) {
  if (isURL(term)) {
    const newurl = term.indexOf('://') === -1 ? `http://${term}` : term;
    window.location.href = prefixHttp(newurl);
  } else if (term !== 'about:blank') {
    window.location.href = 'https://www.google.com/search?q=' + term;
  }
}

function initListenersForSuggestions() {
  for (let i = 0; i < suggestions.length; i++) {
    document
      .getElementById('suggestion-' + i)
      .addEventListener('click', (event) => {
        window.location.href =
          'http://www.google.com/search?q=' + event.target.innerText;
      });
  }
}

function resetAutoSuggestions() {
  const suggestionChildren = document.getElementById('autocomplete');
  suggestionChildren.innerHTML = '';
  for (let i = 0; i < suggestions.length; i++) {
    const suggestionItem = document.createElement('h6');
    suggestionItem.innerText = suggestions[i];
    suggestionItem.className = 'autocomplete-item';
    suggestionItem.tabIndex = i;
    suggestionItem.id = 'suggestion-' + i;
    document.getElementById('autocomplete').appendChild(suggestionItem);
  }
}

function hightlightURLs() {
  for (let i = 0; i < suggestions.length; i++) {
    if (isURL(document.getElementById('suggestion-' + i).innerText)) {
      document.getElementById('suggestion-' + i).style.color = '#00b6ff';
    }
  }
}

function readGoogleSuggestion() {
  var request = new XMLHttpRequest();
  request.open(
    'GET',
    'https://clients1.google.com/complete/search?hl=en&output=toolbar&q=' +
      searchfield.value,
    true,
  );
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  request.onload = function () {
    if (request.readyState === request.DONE) {
      if (request.status === 200) {
        const searchSuggestions = request.responseXML.getElementsByTagName(
          'CompleteSuggestion',
        );
        let readableSuggestions = [];
        for (let i = 0; i < searchSuggestions.length; i++) {
          const suggestion = searchSuggestions.item(i).innerHTML;
          let readableSuggestion = '';
          for (let j = 18; j < suggestion.length - 3; j++) {
            readableSuggestion += suggestion.charAt(j);
          }
          readableSuggestions.push(readableSuggestion);
        }
        suggestions = readableSuggestions;
      }
    } else {
      return null;
    }
  };
  request.send(null);
}

function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
}

const getJSON = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = () => {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
