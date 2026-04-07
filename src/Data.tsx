import { getDataFromFirebase } from '../api/data.ts';

// noinspection JSUnusedGlobalSymbols
export function getRecent(): Promise<object | null> {
	return getDataFromFirebase('/recentlyUsed/');
}
