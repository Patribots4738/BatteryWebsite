import SortableItem from './SortableItem';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Droppable } from './Droppable';
import { useEffect, useState } from 'react';
import { getDataFromFirebase, type JsonData } from '../../api/data.ts';
import { closestCenter, DndContext } from '@dnd-kit/core';

type BatteryData = Record<string, JsonData | string>;

const getBatteryEntry = (source: BatteryData, key: string): JsonData | undefined => {
    const value = source[key];
    if (!value || typeof value !== 'object') {
        return;
    }
    const entry = value as Partial<JsonData>
    if (typeof entry.index !== 'number' || typeof entry.count !== 'number') {
        return;
    }
    return { index: entry.index, count: entry.count };
}

const readStoredBatteryData = (): BatteryData => {
    const stored = localStorage.getItem('batteryData')
    if (!stored) {
        return {}
    }
    return JSON.parse(stored) as BatteryData
}

export default function BatteryColumn() {
    const [data, setData] = useState<BatteryData>(() => readStoredBatteryData())
    const [batteryList, setBatteryList] = useState<string[]>(() =>
        Object.keys(data).filter(key => key !== 'Active Battery' && key !== 'donot')
    )
    const [activeBattery, setActiveBattery] = useState(() =>
        typeof data['Active Battery'] === 'string' ? data['Active Battery'] : ''
    )

    useEffect(() => {
        getDataFromFirebase('batteries')
            .then((firebaseData) => {
                setData(firebaseData)
                localStorage.setItem('batteryData', JSON.stringify(firebaseData))
                const nextBatteryList: string[] = []
                Object.keys(firebaseData)
                    .filter((key) => key !== 'donot' && key !== 'Active Battery')
                    .sort((a, b) => {
                        const aIndex = getBatteryEntry(firebaseData, a)?.index ?? Number.MAX_SAFE_INTEGER
                        const bIndex = getBatteryEntry(firebaseData, b)?.index ?? Number.MAX_SAFE_INTEGER
                        return aIndex - bIndex
                    })
                    .forEach((key) => {
                        if (getBatteryEntry(dbData, key)?.index === -1) return
                        nextBatteryList.push(key)
                    })
                setActiveBattery(typeof dbData['Active Battery'] === 'string' ? dbData['Active Battery'] : '')
                setBatteryList(nextBatteryList)
            });
        },
    []);

    return (
        <div>
            <DndContext
                collisionDetection={closestCenter}
                autoScroll={{ threshold: { x: 0, y: 0.2 } }}
            >
                <Droppable id={activeBattery} count={getBatteryEntry(data, activeBattery)?.count ?? 0} />
                <SortableContext
                    items={batteryList}
                    strategy={verticalListSortingStrategy}
                >
                    {batteryList.map((battery, index) => (
                        <SortableItem
                            key={battery}
                            id={battery}
                            index={index}
                            count={getBatteryEntry(data, battery)?.count ?? 0}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    )
}
