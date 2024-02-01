/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
import { Container, Box } from './styled'
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

const schemaEmpresaForm = z.object({
  id: z.number(),
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  data_recebimento_dia: z.string(),
  data_recebimento_mes: z.string(),
  data_recebimento_ano: z.string(),
  data_envio_dia: z.string(),
  data_envio_mes: z.string(),
  data_envio_ano: z.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.string(),
  data_encerramento_protocolo_mes: z.string(),
  data_encerramento_protocolo_ano: z.string(),
  usuario_encerramento: z.any(), // ALTERAR PARA USUÁRIO
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface schemaEmpresasProps {
  data: SchemaEmpresaForm
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
                value={data.num_protocolo}
              />
            </div>
            <TextInput
              title="Tipo Protocolo"
              w={200}
              value={data.tipo_protocolo}
            />
          </Box>

          <Box>
            <TextInput
              title="Assunto Protocolo"
              w={500}
              value={data.assunto_protocolo}
            />
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
                maxWidth: '120px',
                width: '100%',
              }}
            >
              Data de Recebimento
            </p>

            <div>
              <TextInput
                title="Dia"
                w={100}
                value={data.data_recebimento_dia}
              />
            </div>

            <div>
              <TextInput
                title="Mês"
                w={100}
                value={data.data_recebimento_mes}
              />
            </div>

            <div>
              <TextInput
                title="Ano"
                w={100}
                value={data.data_recebimento_ano}
              />
            </div>

            <div>
              <TextInput
                title="Meio de Recebimento"
                w={225}
                value={data.meio_recebimento}
              />
            </div>
            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                defaultChecked={data.obrigatoria_resp_receb}
                disabled={true}
              />
            </div>
            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Entregue em mãos?"
                defaultChecked={data.entregue_em_maos}
                disabled={true}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
                maxWidth: '120px',
                width: '100%',
              }}
            >
              Data de Envio
            </p>

            <div>
              <TextInput title="Dia" w={100} value={data.data_envio_dia} />
            </div>

            <div>
              <TextInput title="Mês" w={100} value={data.data_envio_mes} />
            </div>

            <div>
              <TextInput title="Ano" w={100} value={data.data_envio_ano} />
            </div>
            <div>
              <TextInput
                title="Meio de Envio"
                w={225}
                value={data.meio_envio}
              />
            </div>
          </Box>

          <Box>
            <p
              style={{
                borderBottomColor: '#A9A9B2',
                fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                fontWeight: '400',
                lineHeight: '1.4375em',
                letterSpacing: '0.00938em',
              }}
            >
              Data de Encerramento do Protocolo
            </p>

            <div>
              <TextInput
                title="Dia"
                w={100}
                value={data.data_encerramento_protocolo_dia}
              />
            </div>

            <div>
              <TextInput
                title="Mês"
                w={100}
                value={data.data_encerramento_protocolo_mes}
              />
            </div>

            <div>
              <TextInput
                title="Ano"
                w={100}
                value={data.data_encerramento_protocolo_ano}
              />
            </div>
            <div style={{ width: '30%' }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                value={data.usuario_encerramento}
              />
            </div>
          </Box>

          <Box>
            <div style={{ width: '60%' }}>
              <TextInput title="Anexos" value={data.anexos} disabled={true} />
            </div>
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

    if (data) {
      const dataRecebimento =
        data.data_recebimento != undefined
          ? new Date(data.data_recebimento)
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null

      const dataEnvio =
        data.data_envio != undefined
          ? new Date(data.data_envio)
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null

      const dataEncerramento =
        data.data_encerramento != undefined
          ? new Date(data.data_encerramento)
              .toISOString()
              .replace(/T.*/, '')
              .split('-')
              .reverse()
              .join('/')
          : null

      // Converter as propriedades de data para strings no formato ISO 8601
      const serializedData = {
        ...data,
        data_recebimento: dataRecebimento,
        data_recebimento_dia: Number(dataRecebimento?.split('/')[0]),
        data_recebimento_mes: Number(dataRecebimento?.split('/')[1]),
        data_recebimento_ano: Number(dataRecebimento?.split('/')[2]),
        data_envio: dataEnvio,
        data_envio_dia: Number(dataEnvio?.split('/')[0]),
        data_envio_mes: Number(dataEnvio?.split('/')[1]),
        data_envio_ano: Number(dataEnvio?.split('/')[2]),
        data_encerramento: dataEncerramento,
        // data_encerramento_protocolo_dia: Number(
        //   dataEncerramento?.split('/')[0],
        // ),
        // data_encerramento_protocolo_mes: Number(
        //   dataEncerramento?.split('/')[1],
        // ),
        // data_encerramento_protocolo_ano: Number(
        //   dataEncerramento?.split('/')[2],
        // ),
      }

      return {
        props: {
          data: serializedData,
        },
      }
    } else {
      console.error('Registro não encontrado')
      return {
        props: {
          data: {},
        },
      }
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: {},
      },
    }
  }
}
