/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
import { Container, Box, Text } from './styled'
import React from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { TextAreaInput } from '../atualizar/styled'
import { SelectOptions } from '@/components/SelectOptions'
import { BackPage } from '../../../components/BackPage'
import { ButtonDownload } from '@/components/ButtonDownload'
import { useArrayDate } from '@/utils/useArrayDate'

const schemaEmpresaForm = z.object({
  id: z.number(),
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  data_recebimento: z.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(),
  usuario_encerramento: z.any(),
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface schemaEmpresasProps {
  data: any
}
export default function Vizualizar({ data }: schemaEmpresasProps) {
  console.log(data)
  return (
    <Container>
      <form>
        <Box style={{ justifyContent: 'end' }}>
          <BackPage backRoute="/protocolos" />
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={'/protocolos'}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>

          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Número de Protocolo"
                value={data[0].num_protocolo}
              />
            </div>
            <TextInput
              title="Tipo Protocolo"
              w={200}
              value={data[0].tipo_protocolo}
            />
          </Box>

          <Box>
            <TextInput
              title="Assunto Protocolo"
              w={500}
              value={data[0].assunto_protocolo}
            />
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '28rem',
              }}
            >
              <Text>Data de Recebimento:</Text>

              <TextInput
                title="Dia"
                w={100}
                defaultValue={data[0].data_recebimento?.dia}
              />

              <TextInput
                title="Mês"
                w={100}
                defaultValue={data[0].data_recebimento?.mes}
              />

              <TextInput
                title="Ano"
                w={150}
                defaultValue={data[0].data_recebimento?.ano}
              />
            </div>
            <div>
              <TextInput
                title="Meio de Recebimento"
                w={225}
                defaultValue={data[0].meio_recebimento}
              />
            </div>
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '28rem',
              }}
            >
              <Text>Data de Envio:</Text>

              <TextInput
                title="Dia"
                w={100}
                defaultValue={data[0].data_envio?.dia}
              />

              <TextInput
                title="Mês"
                w={100}
                defaultValue={data[0].data_envio?.mes}
              />

              <TextInput
                title="Ano"
                w={150}
                defaultValue={data[0].data_envio?.ano}
              />
            </div>
            <div>
              <TextInput
                title="Meio de Envio"
                w={225}
                defaultValue={data[0].meio_envio}
              />
            </div>
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '28rem',
              }}
            >
              <Text>Data de Encerramento:</Text>

              <TextInput
                title="Dia"
                w={100}
                defaultValue={data[0].data_encerramento?.dia}
              />

              <TextInput
                title="Mês"
                w={100}
                defaultValue={data[0].data_encerramento?.mes}
              />

              <TextInput
                title="Ano"
                w={150}
                defaultValue={data[0].data_encerramento?.ano}
              />
            </div>
            <div>
              <TextInput
                title="Usuário Encerramento Protocolo"
                w={225}
                defaultValue={data[0].usuario_encerramento}
              />
            </div>
          </Box>

          <Box>
            <ButtonDownload
              nameButton="Baixar Arquivo"
              nameFile={data.anexos}
            />
          </Box>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.protocolos.findFirst({
      where: {
        id: Number(id),
      },
    })

    const newData = [data]?.map((item: any) => {
      const desestrutureDateRecebimento = useArrayDate.DesestruturarDate(
        item.data_recebimento || '',
      )
      const desestrutureDateEnvio = useArrayDate.DesestruturarDate(
        item.data_envio || '',
      )
      const desestrutureDateEncerramento = useArrayDate.DesestruturarDate(
        item.data_encerramento || '',
      )
      return {
        ...data,
        data_recebimento: desestrutureDateRecebimento,
        data_envio: desestrutureDateEnvio,
        data_encerramento: desestrutureDateEncerramento,
      }
    })

    // if (data) {
    //   const dataRecebimento =
    //     data.data_recebimento != undefined
    //       ? new Date(data.data_recebimento)
    //           .toISOString()
    //           .replace(/T.*/, '')
    //           .split('-')
    //           .reverse()
    //           .join('/')
    //       : null

    //   const dataEnvio =
    //     data.data_envio != undefined
    //       ? new Date(data.data_envio)
    //           .toISOString()
    //           .replace(/T.*/, '')
    //           .split('-')
    //           .reverse()
    //           .join('/')
    //       : null

    //   const dataEncerramento =
    //     data.data_encerramento != undefined
    //       ? new Date(data.data_encerramento)
    //           .toISOString()
    //           .replace(/T.*/, '')
    //           .split('-')
    //           .reverse()
    //           .join('/')
    //       : null

    //   // Converter as propriedades de data para strings no formato ISO 8601
    //   const serializedData = {
    //     ...data,
    //     data_recebimento: dataRecebimento,
    //     data_recebimento_dia: Number(dataRecebimento?.split('/')[0]),
    //     data_recebimento_mes: Number(dataRecebimento?.split('/')[1]),
    //     data_recebimento_ano: Number(dataRecebimento?.split('/')[2]),
    //     data_envio: dataEnvio,
    //     data_envio_dia: Number(dataEnvio?.split('/')[0]),
    //     data_envio_mes: Number(dataEnvio?.split('/')[1]),
    //     data_envio_ano: Number(dataEnvio?.split('/')[2]),
    //     data_encerramento: dataEncerramento,
    //     // data_encerramento_protocolo_dia: Number(
    //     //   dataEncerramento?.split('/')[0],
    //     // ),
    //     // data_encerramento_protocolo_mes: Number(
    //     //   dataEncerramento?.split('/')[1],
    //     // ),
    //     // data_encerramento_protocolo_ano: Number(
    //     //   dataEncerramento?.split('/')[2],
    //     // ),
    //   }

    return {
      props: {
        data: newData,
      },
    }
    // } else {
    //   console.error('Registro não encontrado')
    //   return {
    //     props: {
    //       data: {},
    //     },
    //   }
    // }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: {},
      },
    }
  }
}
