import BatteryColumn from './BatteryColumn'
import './BatteryContainer.css'
import { Stack } from '@mui/material'

export default function BatteryContainer() {
    return (
        <div className="battery-container">
            <Stack
                direction="column-reverse"
                spacing={0.5}
                justifyContent="center"
            >
                Hi this should do something maybe
                <BatteryColumn />
            </Stack>
        </div>
    )
}