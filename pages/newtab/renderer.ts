import { isURL, prefixHttp } from "./url";

document.body.onload = function() {
  document.body.style.display = "block";
  getJSON(
    "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US",
    (_err, data) => {
      const backurl: string = data.images[0].url;
      const fullurl: string = `https://www.bing.com/${backurl}`;
      document.body.style.backgroundImage = `url("${fullurl}")`;
    }
  );
};

const searchfield: HTMLInputElement = <HTMLInputElement>document.getElementById("searchfield");
let suggestions: string[] = [];
let focusedSuggestion: number = 0;

searchfield.addEventListener("input", (event) => {
  if (searchfield.value !== "") {
    const autocompletefield: HTMLDivElement = document.createElement("div");
    autocompletefield.className = "autocomplete";
    autocompletefield.id = "autocomplete";
    if (!document.getElementById("autocomplete")) {
      document.getElementById("locationbox").appendChild(autocompletefield);
    }
    const suggestionChildren = document.getElementById("autocomplete");
    suggestionChildren.innerHTML = "";
    readGoogleSuggestion();
    if (validURL(searchfield.value)) {
      const suggestionItem = document.createElement("h6");
      suggestionItem.innerText = searchfield.value;
      suggestionItem.className = "autocomplete-item";
      document.getElementById("autocomplete").appendChild(suggestionItem);
    }

    focusedSuggestion = -1;
    resetAutoSuggestions();
    initListenersForSuggestions();
    hightlightURLs();
  } else {
    const suggestionChildren = document.getElementById("autocomplete");
    suggestionChildren.innerHTML = "";
    document.getElementById("autocomplete").remove();
  }
});

searchfield.addEventListener("keydown", (event) => {
  const focusedSuggestionElement: HTMLElement = <HTMLElement>document.getElementById("autocomplete").children.item(focusedSuggestion);
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (focusedSuggestion == 0) {
      focusedSuggestion = suggestions.length;
    } else {
      focusedSuggestion--;
    }
    resetAutoSuggestions();
    focusedSuggestionElement.style.backgroundColor = "#bebebe";
    searchfield.value = focusedSuggestionElement.innerText;
    hightlightURLs();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (focusedSuggestion == suggestions.length) {
      focusedSuggestion = 0;
    } else {
      focusedSuggestion++;
    }
    resetAutoSuggestions();
    focusedSuggestionElement.style.backgroundColor = "#bebebe";
    searchfield.value = focusedSuggestionElement.innerText;
    hightlightURLs();
  } else if (event.key == "Enter") {
    checkIfQueryOrURL(searchfield.value);
  }
});

function checkIfQueryOrURL(term) {
  if (isURL(term)) {
    const newurl = term.indexOf("://") === -1 ? `http://${term}` : term;
    window.location.href = prefixHttp(newurl);
  } else if (term !== "about:blank") {
    window.location.href = "https://www.google.com/search?q=" + term;
  }
}

function initListenersForSuggestions() {
  for (let i = 0; i < suggestions.length; i++) {
    document
      .getElementById("suggestion-" + i)
      .addEventListener("click", (event) => {
        window.location.href =
          "http://www.google.com/search?q=" + (event.target as HTMLElement).innerText;
      });
  }
}

function resetAutoSuggestions() {
  const suggestionChildren = document.getElementById("autocomplete");
  suggestionChildren.innerHTML = "";
  addSuggestions();
}

function hightlightURLs(): void {
  for (let i = 0; i < suggestions.length; i++) {
    if (isURL(document.getElementById("suggestion-" + i).innerText)) {
      document.getElementById("suggestion-" + i).style.color = "#00b6ff";
    }
  }
}

function readGoogleSuggestion() {
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://clients1.google.com/complete/search?hl=en&output=toolbar&q=" +
    searchfield.value,
    true
  );
  request.responseType = "document";
  request.overrideMimeType("text/xml");
  request.onload = function() {
    if (request.readyState === request.DONE) {
      if (request.status === 200) {
        const searchSuggestions = request.responseXML.getElementsByTagName(
          "CompleteSuggestion"
        );
        let readableSuggestions = [];
        for (let i = 0; i < searchSuggestions.length; i++) {
          const suggestion = searchSuggestions.item(i).innerHTML;
          let readableSuggestion = "";
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

function validURL(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

function addSuggestions(): void {
  for (let i = 0; i < suggestions.length; i++) {
    const suggestionItem = document.createElement("h6");
    suggestionItem.innerText = suggestions[i];
    suggestionItem.className = "autocomplete-item";
    suggestionItem.tabIndex = i;
    suggestionItem.id = "suggestion-" + i;
    document.getElementById("autocomplete").appendChild(suggestionItem);
  }
}

function getJSON(url: string, callback: (status: number, response: any) => void): void {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};
