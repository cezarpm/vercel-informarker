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
  categoria_filter: z.string(),
  patrocinarora_filter: z.string(),
  faculdade_anestesiologia_filter: z.string(),
  empresa_ativa_filter: z.string(),
})

type SchemaFilter = z.infer<typeof shemaFilter>

export default function AssociadoList() {
  // {
  // data, dataSituacao }: any
  const router = useRouter()
  const { selectedRowIds } = useId()

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'id', flex: 1 },
    {
      field: 'situacao',
      headerName: 'Situação',
      flex: 1,
    },
    {
      field: 'categoria',
      headerName: 'Categoria',
      flex: 1,
    },
    {
      field: 'pendencias_saerj',
      headerName: 'Pendencias Saerj',
      flex: 1,
    },
  ]

  const { register, watch } = useForm<SchemaFilter>()

  // const categoriaFilter = watch('categoria_filter')
  // // const PatrocinadoraFilter = watch('patrocinarora_filter')
  // // const FaculdadeAnestesiologiaFilter = watch('faculdade_anestesiologia_filter')
  // // const EmpresaAtivaFilter = watch('empresa_ativa_filter')

  // // const filteredData = data.filter((item: any) => {
  // //   const tipoEmpresaMatch =
  // //     categoriaFilter === undefined ||
  // //     categoriaFilter === 'Todos' ||
  // //     item.tipo_empresa === categoriaFilter

  //   // const patrocinadoraMatch =
  //   //   PatrocinadoraFilter === undefined ||
  //   //   PatrocinadoraFilter === 'Todos' ||
  //   //   item.patrocinadora === PatrocinadoraFilter

  //   // const faculdadeMatch =
  //   //   FaculdadeAnestesiologiaFilter === undefined ||
  //   //   FaculdadeAnestesiologiaFilter === 'Todos' ||
  //   //   item.faculdade_anestesiologia === FaculdadeAnestesiologiaFilter

  //   // const empresaAtivaMatch =
  //   //   EmpresaAtivaFilter === undefined ||
  //   //   EmpresaAtivaFilter === 'Todos' ||
  //   //   item.empresa_ativa === EmpresaAtivaFilter

  //   return tipoEmpresaMatch
  //   // &&
  //   // patrocinadoraMatch &&
  //   // faculdadeMatch &&
  //   // empresaAtivaMatch
  // })
  const dataSimNao = [
    {
      id: 1,
      ocorrencia_tabela: 'sim',
    },
    {
      id: 2,
      ocorrencia_tabela: 'não',
    },
  ]

  return (
    <Container>
      <p>Associados</p>
      <form>
        {/* <Box style={{ marginTop: '1rem' }}>
          <SelectNoComplete
            value="Todos"
            title="Situação"
            data={dataSituacao}
            {...register('categoria_filter')}
          />
          <SelectNoComplete
            value="Todos"
            title="Patrocinadora"
            {...register('patrocinarora_filter')}
            data={dataSimNao}
          />
          <SelectNoComplete
            value="Todos"
            title="Faculdade Anestesiologia"
            {...register('faculdade_anestesiologia_filter')}
            data={dataSimNao}
          />
          <SelectNoComplete
            value="Todos"
            title="Empresa Ativa"
            {...register('empresa_ativa_filter')}
            data={dataSimNao}
          />
        </Box> */}
      </form>
      {/* <DataGridDemo columns={columns} rows={filteredData} w="100%" /> */}

      <Box>
        <Button
          style={{ backgroundColor: '#4471C6' }}
          title="Visualizar"
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou a empresa para visualizar')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 empresa para visualizar')
            } else {
              router.push(`/associados/visualizar/${selectedRowIds}`)
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
              toast.warn('selecione 1 associados para atualizar')
            } else {
              router.push(`/associados/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#ED7D31' }}
          onClick={() => {
            router.push('/associados/cadastro')
          }}
        />

        <Modal
          title="Excluir"
          bgColor="#BE0000"
          routeDelete="/associados/delete/"
          data={selectedRowIds}
          redirectRouter="/associados"
        />
      </Box>
    </Container>
  )
}
// export const getServerSideProps: GetServerSideProps = async () => {
//   try {
//     const response = await prisma.associados.findMany()
//     const data = response.map((item) => {
//       return {
//         ...item,
//       }
//     })

//     let dataSituacao

//     return {
//       props: {
//         data,
//         dataSituacao,
//       },
//     }
//   } catch (error) {
//     console.error('Erro ao obter dados da empresa:', error)
//     return {
//       props: {
//         data: [],
//       },
//     }
//   }

