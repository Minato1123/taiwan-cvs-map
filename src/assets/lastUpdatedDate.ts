export let lastUpdatedDate: string = '2024/05/17'

export function updateLastUpdatedDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() +1 }`.padStart(2, '0')
  const date =  `${today.getDate()}`.padStart(2, '0')
  lastUpdatedDate = `${year}/${month}/${date}`
}