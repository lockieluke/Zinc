document.body.onload = async function () {
    const {readHistory} = require('../../index/components/history/index')
    console.log("Started reading histories")

    await readHistory(function (title, url, time, date) {
        let namelist = []
        let urllist = []
        let index = title.length - 1
        for (let i = 0; i < title.length; i++) {
            namelist.push(title[index])
            urllist.push(url[index])
            index--
        }
        console.log("Finished reading histories")

        let anidelay = 0.2

        for (let i = 0; i < namelist.length; i++) {
            const histitem = document.createElement('div')
            histitem.className = 'history-item'
            const histtitle = document.createElement("h3")
            histtitle.innerText = namelist[i]
            histitem.appendChild(histtitle)
            const histurl = document.createElement('h5')
            histurl.innerText = urllist[i]
            histitem.appendChild(histurl)
            histitem.style.animationDelay = anidelay + 's'
            histitem.addEventListener('animationend', ()=>{
                histitem.style.opacity = '1'
            })
            document.getElementById('histories').appendChild(histitem)
            anidelay += 0.1
        }

        namelist = null
        urllist = null
        title = null
        url = null
        date = null
        date = null
    })
}

const clearHistBtn = document.getElementById('clearhist')

clearHistBtn.addEventListener('click', ()=>{
    const {clearHistory} = require('../../index/components/history/index')

    clearHistory()
    document.getElementById('histories').innerHTML = ''
})