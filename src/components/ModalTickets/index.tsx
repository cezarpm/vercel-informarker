import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Container } from './styled'
import { Button } from '../Button'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EtiquetaPDFCompany } from '@/utils/ticketsCompany'
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

interface EtiquetaProps {
  id: number
  cod_empresa?: string
  tipo_empresa?: string
  patrocinadora?: boolean
  faculdade_anestesiologia?: boolean
  empresa_ativa?: boolean
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  cep?: string
  logradouro?: string
  numero?: number
  complemento?: string
  cidade?: string
  uf?: string
  pais?: string
  bairro?: string
  telefone_comercial?: string
  tratamento_contato_primario?: string
  nome_contato_primario?: string
  cargo_contato_primario?: string
  email_contato_primario?: string
  telefone_contato_primario?: string
  tratamento_contato_secundario?: string
  nome_contato_secundario?: string
  cargo_contato_secundario?: string
  email_contato_secundario?: string
  telefone_contato_secundario?: string
  home_page?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  observacoes?: string
}

interface schemaModal {
  title: string
  bgColor?: string
  data: any
}
export default function ModalTickets({
  title,
  bgColor,

  data

}: schemaModal) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


 // const [dataSelected, setDataSelected] = useState<EtiquetaProps[]>([])

  //useEffect(() => {
  //  setDataSelected([])
   // data.map(async (item: any) => {
 //     try {
     //   const response = await fetch(`${route}${item}`)
   //     const data = await response.json()
 //       setDataSelected((prev) => [...prev, data])
//      } catch (error) {
//        toast.success('Erro ao gerar etiquetas')
//        console.error('Erro ao buscar empresas:', error)
//      }
//    })
//  }, [data])


  const gerarEtiqueta = (primario: boolean) => {
    EtiquetaPDFCompany(data, primario)
  }

  return (
    <div>
      <Button
        style={{ backgroundColor: `${bgColor}`,  margin: '0px', fontSize: '12px', border: 'solid 1px', padding: '0.5rem', }}
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
            Deseja emitir etiquetas para contato primária ou secundário?
          </Typography>
          <Button
            title="Primário"
            onClick={() => {
              gerarEtiqueta(true);
              handleClose()
            }}
          />
          <Button
            title="Secundário"
            onClick={() => {
              gerarEtiqueta(false);
              handleClose()
            }}
          />
        </Box>
      </Container>
    </div>
  )
}
