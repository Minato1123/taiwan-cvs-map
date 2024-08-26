import { writeFile } from 'fs/promises'

async function updateLastUpdatedDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() +1 }`.padStart(2, '0')
  const date =  `${today.getDate()}`.padStart(2, '0')

  const path = './src/assets/json/last_updated_date.json'
  await writeFile(path, JSON.stringify({
    date: `${year}/${month}/${date}`
  }, null, 2))
}

updateLastUpdatedDate()