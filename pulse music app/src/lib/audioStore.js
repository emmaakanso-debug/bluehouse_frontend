const DB_NAME = 'pulse-audio-db'
const DB_VERSION = 1
const FILES = 'files'
const PEAKS = 'peaks'

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES)
      if (!db.objectStoreNames.contains(PEAKS)) db.createObjectStore(PEAKS)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function saveFile(id, blob) {
  const db = await openDb()
  const tx = db.transaction(FILES, 'readwrite')
  tx.objectStore(FILES).put(blob, id)
  await txDone(tx)
  db.close()
}

export async function getFile(id) {
  const db = await openDb()
  const value = await new Promise((resolve, reject) => {
    const request = db.transaction(FILES, 'readonly').objectStore(FILES).get(id)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
  db.close()
  return value
}

export async function savePeaks(id, peaks) {
  const db = await openDb()
  const tx = db.transaction(PEAKS, 'readwrite')
  tx.objectStore(PEAKS).put(peaks, id)
  await txDone(tx)
  db.close()
}

export async function getPeaks(id) {
  const db = await openDb()
  const value = await new Promise((resolve, reject) => {
    const request = db.transaction(PEAKS, 'readonly').objectStore(PEAKS).get(id)
    request.onsuccess = () => resolve(request.result ?? null)
    request.onerror = () => reject(request.error)
  })
  db.close()
  return value
}

export async function deleteTrackAssets(id) {
  const db = await openDb()
  const tx = db.transaction([FILES, PEAKS], 'readwrite')
  tx.objectStore(FILES).delete(id)
  tx.objectStore(PEAKS).delete(id)
  await txDone(tx)
  db.close()
}
