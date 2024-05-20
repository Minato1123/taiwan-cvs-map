import type { MartDataType } from "@/types"
import type { MaybeRef } from "vue"
import { Fzf } from 'fzf'

export function useMartList({
  allMartList
}: {
  allMartList: MartDataType[]
}) {

  function getRecommendMartList(address: MaybeRef<string>): MartDataType[] {
    address = unref(address).replace(' ', '')
    const fzf = new Fzf(allMartList, {
      selector: (mart) => mart.address,
      limit: 10
    })
    const recommendList = fzf.find(address)
    return recommendList.map((item) => {
      const theItem = {...item.item}
      Array.from(item.positions).forEach((index) => {
        theItem.address = theItem.address.replace(theItem.address[index], `<span class="search-keyword">${theItem.address[index]}</span>`)
      })
      return theItem
    })
  }

  function searchByMartName(name: MaybeRef<string>): MartDataType | null {
    const theMart = allMartList.find((mart) => mart.name.includes(unref(name)))
    if (theMart == null) return null
    return theMart
  }

  function searchByMartNumber(number: MaybeRef<string>): MartDataType | null {
    const theMart = allMartList.find((mart) => mart.id.startsWith(unref(number)))
    if (theMart == null) return null
    return theMart
  }

  return {
    getRecommendMartList,
    searchByMartName,
    searchByMartNumber
  }
}