function getURL(term) {
    switch (term) {
        case 'newtab':
            return 'pages/newtab/index.html'

        case 'history':
            return 'pages/history/index.html'

        case 'about':
            return 'pages/about/index.html'

        case 'apps':
            return 'pages/apps/index.html'
    }
}

module.exports = {getURL}