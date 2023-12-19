import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Container } from './styled'
import { Button } from '../Button'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #f3f3f3',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
}
interface schemaModal {
  title: string
  bgColor?: string
  data: any
  routeDelete: string
  redirectRouter: string
}
export default function Modal({
  title,
  bgColor,
  data,
  routeDelete,
  redirectRouter,
}: schemaModal) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const router = useRouter()
  async function handleDeleteItemsSelected(data: any) {
    try {
      await api.delete(`${routeDelete}`, { data })
      setOpen(false)
      toast.success('Deletado com sucesso!')
      router.push(`${redirectRouter}`)
    } catch (error) {
      console.log(error)
    }
  }
  // console.log('data: model', data)
  return (
    <div>
      <Button
        style={{ backgroundColor: `${bgColor}` }}
        title={title}
        onClick={() => {
          if (data.length === 0) {
            toast.warn('Selecione um item para deletar')
          } else {
            handleOpen()
          }
        }}
      />
      <Container
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Você deseja realmente delatar os items selecionados?
          </Typography>
          <Button
            title="Sim"
            onClick={() => {
              handleDeleteItemsSelected(data)
            }}
          />
          <Button title="Não" onClick={handleClose} />
        </Box>
      </Container>
    </div>
  )
}
