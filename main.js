const axios = require('axios')
const cheerio = require('cheerio')

const searchUrl =
  'https://www.astrgorod.ru/search/node/%D0%9F%D0%BB%D0%B0%D0%BD%D0%BE%D0%B2%D0%BE%D0%B5%20%D0%BE%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8D%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%B8%D0%B8'
const dateNow = new Date()
const sendMessage =
  ' http://pushmebot.ru/send?key=8dd3ec0dc7244fc6fa28b7ed91092dd3&message=Свет вырубят'
const arr = []

function settingDateFromLocal(strDate) {
  const dateArr = strDate.split('.')
  const date = new Date(dateArr[2], dateArr[1] - 1, dateArr[0])
  return date
}

function matchWithNowDate(str, href) {
  const strDate = str.match(/(\d+).(\d+).(\d+)/)
  const date = settingDateFromLocal(strDate[0])
  if (date >= dateNow) {
    axios.get(href).then((html) => {
      const $ = cheerio.load(html.data)
      $('#node-content > table > tbody > tr > td > p').each((i, elem) => {
        console.log(i)
        // const foundElem = elem.children[0].data?.match(/Заводская/)
        const foundNameStreet = elem.children[0].data?.indexOf('пл.Заводская')
        const foundNumber = elem.children[0].data?.indexOf('15')
        if (foundNameStreet >= 0 && foundNumber >= 0) {
          console.log(elem.children[0].data)
          axios.get(sendMessage + ` ${strDate[0]}`)
        }
      })
    })
  }
}

axios.get(searchUrl).then((html) => {
  const $ = cheerio.load(html.data)

  $('#content_main > div.box > div > dl > dt > a').each((i, elem) => {
    const searchString = elem.children[0].data
    const href = elem.attribs.href
    matchWithNowDate(searchString, href)
  })
})
