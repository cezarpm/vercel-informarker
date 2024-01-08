import { Button } from '@/components/Button'
import { Container, Box } from './styled'
import { useRouter } from 'next/router'
import DataGridDemo from '@/components/TableList'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { useId } from '@/context'
import { GridColDef } from '@mui/x-data-grid'
import { toast } from 'react-toastify'
import Modal from '@/components/Modal'
import SelectNoComplete from '@/components/SelectNoComplete'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const shemaFilter = z.object({
  tipo_empresa_filter: z.string(),
  patrocinarora_filter: z.string(),
  faculdade_anestesiologia_filter: z.string(),
  empresa_ativa_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

export default function EmpresaList({ data, dataTipoEmpresa }: any) {
  const router = useRouter()
  const { selectedRowIds } = useId()

 
  // console.log(dataTipoEmpresa)
  return (
    <Container>
      <p>Empresas</p>
      
      <DataGridDemo dataTipoEmpresa={dataTipoEmpresa} data={data} w="100%" />

      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para visualizar')
            } else {
              router.push(`/empresas/visualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Atualizar"
          style={{ backgroundColor: '#528035' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('você não selecionou a empresa para atualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('selecione 1 empresa para atualizar')
            } else {
              router.push(`/empresas/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/empresas/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/empresa/delete/"
          data={selectedRowIds}
          redirectRouter="/empresas"
        />

        {/* <Button
          title="Retornar"
          style={{ backgroundColor: '#b34db2' }}
          onClick={() => {
            router.push('/')
          }}
        /> */}
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await prisma.empresa.findMany()
    const data = response.map((item) => {
      return {
        id: item.id,
        patrocinadora: item.patrocinadora ? 'sim' : 'não',
        faculdade_anestesiologia: item.faculdade_anestesiologia ? 'sim' : 'não',
        empresa_ativa: item.empresa_ativa ? 'sim' : 'não',
        tipo_empresa: item.tipo_empresa,
        razao_social: item.razao_social,
        nome_fantasia: item.nome_fantasia,
        cnpj: item.cnpj,
        cidade: item.cidade,
        uf: item.uf,
        nome_contato_primario: item.nome_contato_primario,
        email_contato_primario: item.email_contato_primario,
      }
    })

    const dataTipoEmpresa = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Empresa',
      },
    })

    return {
      props: {
        data,
        dataTipoEmpresa,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da empresa:', error)
    return {
      props: {
        data: [],
        dataTipoEmpresa: [],
      },
    }
  }
}
