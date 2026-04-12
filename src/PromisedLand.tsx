import { getDataFromFirebase } from '../shared/data';
import { type JsonData } from '../shared/types';

// Data Retrival

export async function getLatestUsed() {
	return (await getDataFromFirebase('/recentlyUsed')) as JsonData[];
}

export async function getNumData() {
	return (await getDataFromFirebase('/num')) as object;
}
