import { getDataFromFirebase } from '../shared/data';
import { type JsonData, type Header } from '../shared/types';

// Data Retrival

export async function getLatestUsed() {
	return (await getDataFromFirebase('/recentlyUsed')) as JsonData[];
}

export async function getNumData() {
	return (await getDataFromFirebase('/num')) as object;
}

export async function getCurrentlyUsed() {
	return (await getDataFromFirebase('/latest')) as Header;
}
