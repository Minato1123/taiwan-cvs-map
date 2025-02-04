import { ofetch } from 'ofetch'
import { writeFile } from 'fs/promises'

type TownListType = {
  post: string
  town: string
  city: string
}

type OriginStoreDataType = {
  NAME: string
  TEL: string
  POSTel: string
  px: number
  py: number
  addr: string
  SERID: number
  pkey: string
  oldpkey: string
  post: string
  all: string
  road: string
  twoice: 'Y' | null
}

type NewStoreDataType = {
    name: string
    id: string
    tel: string
    lat: number
    lng: number
    city: string
    area: string
    road: string
    address: string
    service: string[]
}

const serviceConversionTable = {
  locoffee: 'coffee-hybrid-shop',
  super: 'fami-super',
  laundry: 'fami-laundry',
  smart: 'smart-coffee',
  cooknow: 'cook-now',
  hd: 'hot-dog',
  tea: 'formosa-tea',
  sweetpotato: 'sweat-potato',
  rpotato: 'baked-potato',
  fresh: 'steam-fresh',
  tripk: 'spicy-egg',
  grill: 'sohot-grill',
  dessert: 'sohot-dessert',
  ice: 'famiice',
  icecream: 'single-famiice',
  twoice: 'two-famiice',
  famiice: 'special-famiice',
  dri: 'drink-famiice',
  card: 'picard',
  tanhou: 'tianhe-fresh',
  veg: 'fresh-vegetables',
  costco: 'costco-shelf',
  hogan: 'hogan',
  bear: 'bear-snack',
  npork: 'no-pork',
  eco: 'recyclable-cup',
  photo: 'polaroid',
  cs: 'charge-spot',
  goro:	'gogoro-battery-exchange',
  jp: 'jpy-atm',
  evc: 'ecar-charging',
  rest: 'rest-area',
  toilet: 'toilet',
}

const signConversionTable = {
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  '－': '-',
  '，': '、',
  '．': '、',
  '。': '、',
  '＆': '、',
  '；': '、',
  'Ａ': 'A',
  'Ｂ': 'B',
  'Ｃ': 'C',
  'Ｄ': 'D',
  'Ｅ': 'E',
  'Ｆ': 'F',
  'Ｇ': 'G',
  'Ｈ': 'H',
  'Ｉ': 'I',
  'Ｊ': 'J',
  'Ｋ': 'K',
  'Ｌ': 'L',
  'Ｍ': 'M',
  'Ｎ': 'N',
  'Ｏ': 'O',
  'Ｐ': 'P',
  'Ｑ': 'Q',
  'Ｒ': 'R',
  'Ｓ': 'S',
  'Ｔ': 'T',
  'Ｕ': 'U',
  'Ｖ': 'V',
  'Ｗ': 'W',
  'Ｘ': 'X',
  'Ｙ': 'Y',
  'Ｚ': 'Z',
  'ａ': 'A',
  'ｂ': 'B',
  'ｃ': 'C',
  'ｄ': 'D',
  'ｅ': 'E',
  'ｆ': 'F',
  'ｇ': 'G',
  'ｈ': 'H',
  'ｉ': 'I',
  'ｊ': 'J',
  'ｋ': 'K',
  'ｌ': 'L',
  'ｍ': 'M',
  'ｎ': 'N',
  'ｏ': 'O',
  'ｐ': 'P',
  'ｑ': 'Q',
  'ｒ': 'R',
  'ｓ': 'S',
  'ｔ': 'T',
  'ｕ': 'U',
  'ｖ': 'V',
  'ｗ': 'W',
  'ｘ': 'X',
  'ｙ': 'Y',
  'ｚ': 'Z'
}

const cities = [
  '基隆市', '台北市', '新北市', '桃園市',
  '新竹市', '新竹縣', '苗栗縣', '台中市',
  '彰化縣', '南投縣', '雲林縣', '嘉義市',
  '嘉義縣', '台南市', '高雄市', '屏東縣',
  '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣',
  '金門縣', '連江縣'
]


async function getTownList(city: string): Promise<TownListType[]> {
  return await ofetch(`https://api.map.com.tw/net/familyShop.aspx?searchType=ShowTownList&type=&city=${city}&fun=storeTownList&key=6F30E8BF706D653965BDE302661D1241F8BE9EBC`, {
    headers: {
      Referer: 'https://www.family.com.tw/'
    },
    parseResponse(responseText) {
      return JSON.parse(responseText.replace('storeTownList(', '').replace(')', ''))
    },
  })
}

const signRegex = /[Ａ-Ｚａ-ｚ０-９－，．＆。；]/g
const numAlphaRegex = /([a-zA-Z0-9]+)/g
const puncRegex = /\s+([\p{P}\p{S}])\s+/gu

function normalizeAddress(address: string) {
  return address.replace(signRegex, (s) => signConversionTable[s]).replace(numAlphaRegex, ' $1 ').replace(puncRegex, '$1').trim()
}

function refactorStoreData(list: OriginStoreDataType[], city: string, area: string): NewStoreDataType[] {
  return list.map((item) => {
    return {
      name: item.NAME,
      id: item.pkey,
      tel: item.TEL,
      lat: item.py,
      lng: item.px,
      city,
      area,
      road: item.road,
      address: normalizeAddress(item.addr),
      service: item.all == null ? [] : item.all.split(',').map(i => serviceConversionTable[i.toLowerCase()]).filter((i) => i != null )
    }
  })
}

async function getAreaStoreList(city: string, area: string): Promise<NewStoreDataType[]> {
  const url = `https://api.map.com.tw/net/familyShop.aspx?searchType=ShopList&type=&city=${city}&area=${area}&road=&fun=showStoreList&key=6F30E8BF706D653965BDE302661D1241F8BE9EBC`
  return await ofetch(url, {
    headers: {
      Referer: 'https://www.family.com.tw/'
    },
    parseResponse(responseText) {
      try {
        return refactorStoreData(JSON.parse(responseText.replace('showStoreList(', '').replace(')', '')), city, area)
      } catch(error) {
        console.log(error, responseText, city, area)
      }
    },
  })
}

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms))
}

const path = './src/assets/json/f_data.json'
async function execute() {
  const storeList: NewStoreDataType[] = []

  for (const city of cities) {
    const townList = await getTownList(city)
    console.log(city)
    for (const town of townList) {
      const theStoreList = await getAreaStoreList(town.city, town.town)
      storeList.push(...theStoreList)
    }
    await delay(3000)
  }

  await writeFile(path, JSON.stringify(storeList, null, 2))
  console.log(storeList.length)
}

execute()