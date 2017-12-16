const log = function() {
    console.log(...arguments)
}

const insertImg = function(urls) {
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
        if (i === 4) {
            i = first_column
        } else {
            i += 1
        }
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
    for (var i = 0; i < 5; i++) {
        columns.eq(i).find('.lazy').lazyload()
    }
}

const main = function() {
    $.ajax({
        url: '/rank',
        success: function(result){
            insertDate(result.date)
            insertImg(result.urls)
            lazyload()
        }
    })
}

main()
