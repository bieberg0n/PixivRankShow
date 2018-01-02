const log = function() {
    console.log(...arguments)
}

var urls = []

const insertImg = function() {
    if (urls.length === 0) {
        return
    } else {
        const columns = document.querySelectorAll('column')
        const first_column = 0
        var i = first_column
        for (let url of urls) {
            const id = url.split('/').slice(-1)[0].split('_')[0]
            const html = `
                <imgBox>
                    <a target='_blank' href='https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${id}'>
                        <img class="lazy" data-original="${url}" alt="img">
                    </a>
                </imgBox>
                `
            columns[i].insertAdjacentHTML('beforeEnd', html)
            if (i === columns.length - 1) {
                i = first_column
            } else {
                i += 1
            }
        }
        lazyload()
    }
}

const insertDate = function(date) {
    const pos = document.querySelector('h1')
    const text = `
        <h3>${date}</h3>
    `
    pos.insertAdjacentHTML('afterEnd', text)
}

const lazyload = function() {
    const columns = $('column')
    for (var i = 0; i < columns.length; i++) {
        columns.eq(i).find('.lazy').lazyload()
    }
}

const clientWidth = function() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
}

// function isMobile() {
//     return (/(iPhone|iPad|iPod|iOS|android)/i.test(navigator.userAgent))
// }

const _pushColumn = function() {
    var winWidth = 0
    const someWidth = [200, 420, 640, 860, 1080].map(i => i + 16)
    const _push = function() {
        // if (isMobile()) {
        //     var goodWidths = [200, 420]
        // } else {
        //     var goodWidths = someWidth.filter(width => width < clientWidth())
        // }
        const cw = clientWidth()
        var goodWidths = someWidth.filter(width => width <= cw)
        log(cw, goodWidths)
        const greatWidth = _.last(goodWidths)
        if (greatWidth != winWidth) {
            // log(goodWidths)
            $("imgFlow").empty()
            goodWidths.forEach(_ => $("imgFlow").append('<column></column>'))
            winWidth = greatWidth
        }
    }
    return _push
}

const pushColumn = _pushColumn()

const eventBind = function() {
    // const pushCol = pushColumn()
    window.onresize = _.throttle(function() {
        log('resize.')
        pushColumn()
        insertImg()
    }, 100)
}

const main = function() {
    pushColumn()
    eventBind()
    $.ajax({
        url: '/rank',
        success: function(result) {
            insertDate(result.date)
            urls = result.urls
            insertImg()
        }
    })
}

main()
