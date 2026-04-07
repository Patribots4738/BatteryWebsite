import { getDataFromFirebase } from '../api/data.ts';

function getRecent() {
    getDataFromFirebase(`/recentlyUsed/`)
}