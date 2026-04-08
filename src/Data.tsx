import { getDataFromFirebase } from '@shared/data.ts';

// noinspection JSUnusedGlobalSymbols
export function getRecent(): Promise<object | null> {
	return getDataFromFirebase('/recentlyUsed/');
}
