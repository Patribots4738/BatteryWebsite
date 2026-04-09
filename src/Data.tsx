//import { useState } from 'react'
import { getDataFromFirebase } from '../shared/data';
/*
import { 
	BatteryNames,
	type JsonData, 
} from '../shared/types'
*/

// Data Retrival
export async function getAllData() {
	const data = await getDataFromFirebase('/allData/');
	console.log(data);
	console.log(typeof data);
}

//const [allData, setAllData] = useState('/allData/')
//const [latetBattery, setLatestBattery] = useState('/latest/')
//const [numData, setNumData] = useState('/num/')
//const [recentBattery, setRecentBattery] = useState('/recentlyUsed/')
