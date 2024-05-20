import { ofetch } from 'ofetch'
import { writeFile } from 'fs/promises'
import { xml2json } from 'xml-js'

type TownListType = {
  cityId: string
  city: string
  town: string
}

type OriginStoreDataType = {
  POIID: { _text: string }
  POIName: { _text: string }
  X: { _text: string }
  Y: { _text: string }
  Telno: { _text: string }
  FaxNo: { _text?: string }
  Address: { _text: string }
  SpecialStore_Kind: { _text?: string }
  Store_URL: { _text?: string }
  StoreImageTitle: { _text: string }
}

type NewStoreDataType = {
  id: string
  name: string
  tel: string
  address: string
  lat: number
  lng: number
  city: string
  area: string
  service: string[]
}

const serviceConversionTable = {
  '01停車場': 'parking',
  '02廁所': 'toilet',
  '03ATM': 'atm',
  '04座位區': 'seat',
  '05ibon WiFi': 'ibon-wifi',
  '06思樂冰': 'slurpee',
  '07OPEN! STORE': 'open-store',
  '08寵物生活專區': 'pet',
  '09OPEN! PLAZA專櫃': 'open-plaza',
  '11千禧血壓站': 'blood-pressure',
  '12行動電源租賃': 'power-rental',
  '13台塑有機蔬菜': 'organic-vegetable',
  '14酷聖石': 'cold-stone',
  '15Mister Donut甜甜圈': 'mister-donut',
  '16美妝': 'cosmetic',
  '17甜點專櫃': 'dessert',
  '18高效智慧回收機': 'recycle',
  '19ibon': 'ibon',
  '20酒BAR': 'bar',
  '21現萃茶': 'fresh-tea',
  '22現蒸地瓜': 'sweet-potato',
  '24霜淇淋': 'ice-cream',
  '25OPEN!兒童閱覽室': 'open-kids-room',
  '27K·Seren': 'k-seren',
  '2821TOGO': 'togo',
  '29聖娜麵包': 'santa-bread',
  '30不可思議咖啡': 'unbelievable-coffee',
  '31博客來': 'books',
  '32糖果屋': 'candy',
  '33OPEN iECO循環杯': 'open-eco-cup',
  '34CITY系列熱燕麥飲': 'city-oatmeal',
  '36精品咖啡': 'specialty-coffee',
  '37天素地蔬': 'vegetable',
  '38嚴選素材冷凍鮮物': 'frozen-fresh-food',
  '39原賞熱壓土司': 'hot-pressed-toast',
  '66冷凍交貨便': 'frozen-delivery',
  '68CITY CAFE氮氣飲品': 'city-cafe-nitrogen-drinks',
  '78拋棄式隱形眼鏡': 'contact-lens',
  '79精品威士忌咖啡': 'whisky-coffee',
  '80霹靂DVD': 'dvd',
  '81哈燒': 'ha-burn',
  '82天素地蔬複合店': 'vegetable-complex',
  '83蒸包機': 'steamed-bun-machine',
  '84gogoro': 'gogoro',
  '85ionex': 'ionex',
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
  '台北市', '基隆市', '新北市', '桃園市',
  '新竹市', '新竹縣', '苗栗縣', '台中市', '',
  '彰化縣', '南投縣', '雲林縣', '嘉義市',
  '嘉義縣', '台南市', '', '高雄市', '', '屏東縣',
  '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣', '連江縣',
  '金門縣'
]


async function getTownList(city: string, cityId: string): Promise<TownListType[]> {
  console.log('現在要拿的資料是來自於：', city)
  return await ofetch(`https://emap.pcsc.com.tw/EMapSDK.aspx?commandid=GetTown&cityid=${cityId}`, {
    headers: {
      Referer: 'https://emap.pcsc.com.tw/'
    },
    parseResponse(responseText) {
      const jsonData = JSON.parse(xml2json(responseText, { compact: true, spaces: 4 }))
      const dataList = jsonData.iMapSDKOutput.GeoPosition

      if (!dataList) return []

      return dataList.map((data) => ({
        cityId,
        city,
        town: data.TownName._text,
      }))
    },
    
  })
}

const signRegex = /[Ａ-Ｚａ-ｚ０-９－，．＆。；]/g
const numAlphaRegex = /([a-zA-Z0-9]+)/g
const puncRegex = /\s+([\p{P}\p{S}])\s+/gu

function normalizeAddress(address: string) {
  return address.replace(signRegex, (s) => signConversionTable[s]).replace(numAlphaRegex, ' $1 ').replace(puncRegex, '$1').trim()
}

function refactorStoreData(list: OriginStoreDataType[], city: string, town: string): NewStoreDataType[] {
  return (Array.isArray(list) ? list : [list]).map((item) => {
    return {
      id: item.POIID._text.trim(),
      name: item.POIName._text + '門市',
      tel: (item.Telno._text ?? '').trim(),
      address: normalizeAddress(item.Address._text),
      lat: +item.Y._text / 10**6,
      lng: +item.X._text / 10**6,
      city,
      area: town,
      service: (item.StoreImageTitle._text ?? '').split(',').map(i => serviceConversionTable[i]).filter((i) => i != null )
    }
  })
}

async function getAreaStoreList(city: string, town: string): Promise<NewStoreDataType[]> {
  const url = `https://emap.pcsc.com.tw/EMapSDK.aspx?commandid=SearchStore&city=${city}&town=${town}`
  return await ofetch(url, {
    headers: {
      Referer: 'https://emap.pcsc.com.tw/'
    },
    parseResponse(responseText) {
      const jsonData = JSON.parse(xml2json(responseText, { compact: true, spaces: 4 }))
      const dataList = jsonData.iMapSDKOutput.GeoPosition
      console.log(dataList.length)
      return refactorStoreData(dataList, city, town)
    },
  })
}

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms))
}

const path = './src/assets/json/s_data.json'
async function execute() {
  const storeList: NewStoreDataType[] = []

  for (let i = 0; i < cities.length; i++) {
    const cityId = `${i+1}`.padStart(2, '0')
    const city = cities[i]
    const townList = await getTownList(city, cityId)
    console.log(townList)
    for (const town of townList) {
      const theStoreList = await getAreaStoreList(city, town.town)
      storeList.push(...theStoreList)
    }
    await delay(3000)
  }

  await writeFile(path, JSON.stringify(storeList, null, 2))
  console.log(storeList.length)
}

execute()