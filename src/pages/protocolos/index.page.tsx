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
import { useEffect, useState } from 'react'

export default function ProtocoloList({ data }: any) {
  const router = useRouter()
  const { selectedRowIds } = useId()
  

  // console.log(selectedRowIds)
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50},
    { field: 'num_protocolo', headerName: 'Número'},
    { field: 'assunto_protocolo', headerName: 'Assunto', width: 180 },
    { field: 'tipo_protocolo', headerName: 'Tipo', width: 150 },
    { field: 'data_recebimento', headerName: 'Data de Recebimento', width: 180},
    { field: 'data_envio', headerName: 'Data de Envio', width: 180},
    { field: 'meio_recebimento', headerName: 'Meio de Recebimento', width: 180},
    { field: 'meio_envio', headerName: 'Meio de Envio', width: 180},
    { field: 'quem_redigiu_documento_a_ser_enviado', headerName: 'Quem redigiu o documento', width: 210},
    { field: 'entregue_em_maos', headerName: 'Entregue em Mãos', width: 180},
    { field: 'doc_entrada_requer_resposta', headerName: 'Requer resposta?', width: 180},
    { field: 'anexos', headerName: 'Anexos', width: 180},
    { field: 'data_encerramento_protocolo', headerName: 'Data encerramento', width: 180},
    { field: 'usuario_encerramento_protocolo', headerName: 'Usuário Encerramento', width: 180},
  ];  

  // PRECISO ATUALIZAR A LISTA PRO USUARIO VER O ITEM QUE FOI DELETADO SUMIR
  // SE EXISTIR O ID=4 E O ID=4 FOR DELETADO, AO DELETAR ATUALIZAR A LISTA PARA NÃO MOSTRAR ELE!
  return (
    <Container>
      <p>Protocolos</p>
      <DataGridDemo columns={columns} rows={data} w="100%" />
      <Box>

      <Button
          title="Visualizar"
          style={{ backgroundColor: '#5484C4' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou nenhum protocolo para visualizar!')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 protocolo para visualizar!')
            } else {
              router.push(`/protocolos/visualizar/${selectedRowIds}`)
            }
          }}
        />
        <Button
          title="Atualizar"
          style={{ backgroundColor: '#6f9622' }}
          onClick={() => {
            if (selectedRowIds.length === 0) {
              toast.warn('Você não selecionou nenhum protocolo para atualizar!')
            } else if (selectedRowIds.length >= 2) {
              toast.warn('Selecione apenas 1 protocolo para atualizar!')
            } else {
              router.push(`/protocolos/atualizar/${selectedRowIds}`)
            }
          }}
        />

        <Button
          title="Incluir"
          style={{ backgroundColor: '#f67200' }}
          onClick={() => {
            router.push('/protocolos/incluir')
          }}
        />
        
        <Modal
          title="Excluir"
          bgColor="#ff0000"
          routeDelete="/protocolos/excluir"
          data={selectedRowIds}
          redirectRouter="/protocolos"
        />
      </Box>
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // ADEQUAR QUANDO DESENVOLVER FUNCIONALIDADES!
    const response = await prisma.protocolos.findMany()
    const data = response.map((item) => {
      var data_recebimento;
      var data_envio;
      var data_encerramento_protocolo;

      if (item.data_recebimento_ano && item.data_recebimento_mes && item.data_recebimento_dia ) {
        data_recebimento = new Date(
          item.data_recebimento_ano,
          item.data_recebimento_mes - 1,
          item.data_recebimento_dia
        );
      }
      
      if (item.data_envio_ano && item.data_envio_mes && item.data_envio_dia) {
        data_envio = new Date(
          item.data_envio_ano,
          item.data_envio_mes - 1,
          item.data_envio_dia
        );
      }

      if (item.data_encerramento_protocolo_ano && item.data_encerramento_protocolo_mes && item.data_encerramento_protocolo_dia) {
        data_encerramento_protocolo = new Date(
          item.data_encerramento_protocolo_ano,
          item.data_encerramento_protocolo_mes - 1,
          item.data_encerramento_protocolo_dia
        );
      }
      return {
        ...item,
        data_recebimento: data_recebimento != undefined ? data_recebimento.toISOString().replace(/T.*/,'').split('-').reverse().join('/') : null,
        data_envio: data_envio != undefined ? data_envio.toISOString().replace(/T.*/,'').split('-').reverse().join('/'):  null,
        data_encerramento_protocolo: data_encerramento_protocolo != undefined ? data_encerramento_protocolo.toISOString().replace(/T.*/,'').split('-').reverse().join('/') :  null,
        entregue_em_maos: item.entregue_em_maos != undefined ? item.entregue_em_maos == true ? 'Sim' : 'Não' : null,
        doc_entrada_requer_resposta: item.doc_entrada_requer_resposta != undefined ? item.doc_entrada_requer_resposta == true ? 'Sim' : 'Não' : null,
      }
    })
    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados do protocolo:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
