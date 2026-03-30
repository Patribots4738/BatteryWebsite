import { useSortable } from '@dnd-kit/sortable'
import Paper from '@mui/material/Paper'
import { CSS } from '@dnd-kit/utilities'
import { Card, styled } from '@mui/material'
import Battery80Icon from '@mui/icons-material/Battery80'

const Item = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(1.2),
    padding: theme.spacing(1),
    cursor: 'grab',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    backgroundColor: '#656565',
}))

export default function SortableItem({ id, index, count }: { id: string, index: number, count: number }) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} {...attributes} {...listeners}>
            <Card
                variant="outlined"
                style={{
                    ...style,
                    backgroundColor: '#989898',
                    padding: 0.5,
                    margin: 15,
                }}
            >
                <Item elevation={index}>
                    <Battery80Icon />
                    {id} {" | Usages: "} {count}
                </Item>
            </Card>
        </div>
    )
}
