const Store = require('electron-store')
const store = new Store()

function storeHistory(title, url, time, date) {
    let length
    if (store.has('history-site-length')) {
        length = store.get('history-site-length').toString()
    } else {
        length = 0
    }
    store.set('history-site-title-' + length, title)
    store.set('history-site-url-' + length, url)
    store.set('history-site-time-' + length, time)
    store.set('history-site-date-' + length, date)

    store.set('history-site-length', parseInt(length) + 1)
}

function clearHistory() {
    for (let i = 0; i < parseInt(store.get('history-site-length')); i++) {
        store.delete('history-site-title-' + i)
        store.delete('history-site-url-' + i)
        store.delete('history-site-time-' + i)
        store.delete('history-site-date-' + i)
    }
    store.delete('history-site-length')
}

async function readHistory(callback) {
    if (store.has('history-site-length')) {
        const length = store.get('history-site-length')
        let title = []
        let url = []
        let time = []
        let date = []

        for (let i = 0; i < parseInt(length.toString()); i++) {
            title.push(await store.get('history-site-title-' + i.toString()))
            url.push(await store.get('history-site-url-' + i.toString()))
            time.push(await store.get('history-site-time-' + i.toString()))
            date.push(await store.get('history-site-date-' + i.toString()))
        }

        callback(title, url, time, date)
    } else {
        throw new Error('History is not yet initialized')
    }
}

module.exports = {storeHistory, clearHistory, readHistory}