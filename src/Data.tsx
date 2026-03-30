import { ref, get } from 'firebase/database'
import 'firebase/database'
import { db } from './firebase/firebaseConfig'

export async function getBatteries() {
    const dbRef = ref(db, 'batteries')
    const snapshot = await get(dbRef)
    return snapshot.exists() ? snapshot.val() : null
}

export async function getBattery(battery: string) {
    const dbRef = ref(db, `batteries/${battery}`)
    const snapshot = await get(dbRef)
    return snapshot.exists() ? snapshot.val() : null
}
