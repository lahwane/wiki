'use strict'

const YT_API_KEY = 'AIzaSyBtEAwTFRXhUGsKiCibAqiXHCZGdu0qj-E'
const gCachedVideos = {}
const gCachedWikis = {}
const YT_STORAGE_KEY = 'youetubeDB'
const WIKI_STORAGE_KEY = 'wikisDB'
var useFileData = false
console.log(getVideos('rihana'))

function getVideos(searchInput) {
    if (useFileData) {
        console.log('Using file data..')
        return Promise.resolve(youtubeData.items.map(video => ({
            id: video.id.videoId,
            title: video.snippet.title,
            img: {
                url: video.snippet.thumbnails.default.url,
                width: video.snippet.thumbnails.default.width,
                height: video.snippet.thumbnails.default.height,
            },
        }))
        )

    } else {
        const savedVideos = loadFromStorage(YT_STORAGE_KEY)
        if (savedVideos && savedVideos[searchInput]) {
            console.log('Loading videos from storage...')
            return Promise.resolve(savedVideos[searchInput])
        }

        console.log('Calling YouTube API..')
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_API_KEY}&q=${searchInput}`
        return axios.get(url)
            .then(res => {
                if (!res.data.items) {
                    console.error('No videos found')
                    return
                }
                const videos = res.data.items.map(video => ({
                    id: video.id.videoId,
                    title: video.snippet.title,
                    img: {
                        url: video.snippet.thumbnails.default.url,
                        width: video.snippet.thumbnails.default.width,
                        height: video.snippet.thumbnails.default.height,
                    },
                }))
                gCachedVideos[searchInput] = videos
                saveToStorage(YT_STORAGE_KEY, gCachedVideos)
                return videos
            })
            .catch(err => {
                console.error('Error in API call', err)
                return
            })
    }
}

function getWikis(searchInput) {

    const savedWikis = loadFromStorage(WIKI_STORAGE_KEY)
    if (savedWikis && savedWikis[searchInput]) {
        console.log('Loading wikis from storage...')
        return Promise.resolve(savedWikis[searchInput])
    }
    const url = `https://en.wikipedia.org/w/api.php?&origin=*&action=query&list=search&srsearch=${searchInput}&format=json`
    return axios.get(url)
        .then(res => {
            console.log(res)
            if (!res.data.query.search) {
                console.error('No wikis found')
                return
            }
            const wikis = res.data.query.search.map(res => ({
                title: res.title,
                snippet: res.snippet,
            })).splice(0, 4)
            gCachedWikis[searchInput] = wikis
            saveToStorage(WIKI_STORAGE_KEY, gCachedWikis)
            return wikis
        })
        .catch(err => {
            console.error('Error in API call', err)
            return
        })
}

// console.log(getWiki('tracer 7'))