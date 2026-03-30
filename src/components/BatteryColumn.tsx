import SortableItem from './SortableItem'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
    DndContext,
    type DragEndEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Droppable } from './Droppable'
import { useEffect, useState } from 'react'
import { ref, onValue, update } from 'firebase/database'
import { db } from './../firebase/firebaseConfig'

type BatteryEntry = {
    index: number
    count: number
}

type BatteryData = Record<string, BatteryEntry | string>
type BatteryUpdates = Record<string, BatteryEntry | string>

const getBatteryEntry = (source: BatteryData, key: string): BatteryEntry | undefined => {
    const value = source[key]
    if (!value || typeof value !== 'object') {
        return undefined
    }
    const entry = value as Partial<BatteryEntry>
    if (typeof entry.index !== 'number' || typeof entry.count !== 'number') {
        return undefined
    }
    return { index: entry.index, count: entry.count }
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
        const query = ref(db, 'batteries')
        onValue(query, (snapshot) => {
            const dbData = snapshot.val() as BatteryData
            if (snapshot.exists()) {
                setData(dbData)
                localStorage.setItem('batteryData', JSON.stringify(dbData))
                const nextBatteryList: string[] = []
                Object.keys(dbData)
                    .filter((key) => key !== 'donot' && key !== 'Active Battery')
                    .sort((a, b) => {
                        const aIndex = getBatteryEntry(dbData, a)?.index ?? Number.MAX_SAFE_INTEGER
                        const bIndex = getBatteryEntry(dbData, b)?.index ?? Number.MAX_SAFE_INTEGER
                        return aIndex - bIndex
                    })
                    .forEach((key) => {
                        if (getBatteryEntry(dbData, key)?.index === -1) return
                        nextBatteryList.push(key)
                    })
                setActiveBattery(typeof dbData['Active Battery'] === 'string' ? dbData['Active Battery'] : '')
                setBatteryList(nextBatteryList)
            }
        })
    }, [])

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    function handleActiveBatteryChange(event: DragEndEvent): string[] {
        const { active, over } = event
        if (!over) return [...batteryList]

        const activeId = String(active.id)
        const overId = String(over.id)
        const newBatteryList: string[] = [...batteryList]

        if (activeId !== overId) {
            setActiveBattery(activeId)
            const activeIndex = batteryList.indexOf(activeId)
            const overIndex = batteryList.indexOf(overId)

            if (activeIndex === -1) return newBatteryList

            newBatteryList.splice(activeIndex, 1)
            const lastActive = overIndex === -1
            newBatteryList.splice(lastActive ? activeIndex : overIndex, 0, lastActive ? overId : activeId)
        } else {
            const activeIndex = batteryList.indexOf(activeId)
            if (activeIndex !== -1) {
                newBatteryList.splice(activeIndex, 1)
            }
        }

        return newBatteryList
    }

    function sendDatabaseChange(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = String(active.id)
        const overId = String(over.id)
        const activeEntry = getBatteryEntry(data, activeId)
        const overEntry = getBatteryEntry(data, overId)
        if (!activeEntry || !overEntry) return

        const updates: BatteryUpdates = {
            [activeId]: { index: batteryList.indexOf(overId), count: activeEntry.count },
            [overId]: { index: batteryList.indexOf(activeId), count: overEntry.count + 1 },
            'Active Battery': activeId,
        }
        updateDatabase(updates)
    }

    function updateDatabase(updates: BatteryUpdates) {
        update(ref(db, 'batteries'), updates).then(() => {
            console.log('Database updated successfully')
        })
        const updatedData = { ...data, ...updates }
        setData(updatedData)
        localStorage.setItem('batteryData', JSON.stringify(updatedData))
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = String(active.id)
        const overId = String(over.id)
        let newBatteryList = [...batteryList]

        if (activeBattery !== overId) {
            const oldIndex = batteryList.indexOf(activeId)
            const newIndex = batteryList.indexOf(overId)
            if (oldIndex === -1 || newIndex === -1) return

            newBatteryList = arrayMove(batteryList, oldIndex, newIndex)
            const updates: BatteryUpdates = {}

            newBatteryList.forEach((battery, index) => {
                const entry = getBatteryEntry(data, battery)
                if (!entry) return
                updates[battery] = { index, count: entry.count }
            })

            updates['Active Battery'] = activeBattery
            updateDatabase(updates)
        } else if (activeId !== overId) {
            sendDatabaseChange(event)
            newBatteryList = handleActiveBatteryChange(event)
        }

        setBatteryList(newBatteryList)
    }

    return (
        <div>
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                sensors={[mouseSensor, touchSensor]}
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
