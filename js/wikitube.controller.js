'use strict'


function onInit() {
    const searchInput = getEl('.search-input')
    searchInput.value = 'tracer 7'
    onSearch()
    searchInput.value = ''
}

function onSearch() {
    const searchInput = getEl('.search-input').value
    if (!searchInput) return
    getVideos(searchInput).then(videos => {
        renderVideoList(videos)
        renderVideo(videos[0].id, videos[0].title)
    })
    getWikis(searchInput).then(wikis => renderWikis(wikis))
}

function renderVideoList(videos) {
    const elVideoList = getEl('.video-list')
    let strHTML = videos.map(video => `
            <div class="video-in-list" onclick="onVideoSelect(event,'${video.id}','${video.title}')">
            <img src="${video.img.url}" alt="${video.title}"/>
            <p>${video.title}<p>
            </div>
            `)
    elVideoList.innerHTML = strHTML.join('')
}

function renderVideo(videoId) {
    const embededVideo = getEl('.video-player iframe')
    const videoTitle = getEl('.embeded-video-title')
    embededVideo.src = `https://www.youtube.com/embed/${videoId}`
}

function onVideoSelect(event, videoId, videoTitle) {
    console.log('Selected videoId:', videoId, 'Selected videoTitle:', videoTitle)
    renderVideo(videoId, videoTitle)
}

function renderWikis(wikis) {
    const elWikiList = getEl('.wiki-results')
    let strHTML = wikis.map(wiki => `
        <div class="wiki-result">
            <a href="https://en.wikipedia.org/wiki/${wiki.title}">
            ${wiki.title}
            </a>
            <p>${wiki.snippet}</p>
            </div>
        `)
    elWikiList.innerHTML = strHTML.join('')
}