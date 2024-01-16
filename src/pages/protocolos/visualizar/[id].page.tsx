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

const schemaEmpresaForm = z.object({
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  remetente: z.string(),
  destinatario: z.string(),
  data_recebimento: z.number(),
  data_envio: z.number(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_documento_a_ser_enviado: z.string(),
  entregue_em_maos: z.boolean(),
  doc_entrada_requer_resposta: z.boolean(),
  anexos: z.string(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo: z.number(),
  usuario_encerramento_protocolo: z.string(), // ALTERAR PARA USUÁRIO
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface schemaEmpresasProps {
  data: SchemaEmpresaForm
}
export default function Vizualizar({ data }: schemaEmpresasProps) {
  const dayOptionsData = Array.from({ length: 31 }, (_, index) => ({
    id: index + 1,
    label: `${index + 1}`,
  }))

  const monthOptionsData = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    label: `${index + 1}`,
  }))

  const currentYear = new Date().getFullYear()

  const yearOptionsData = Array.from(
    { length: currentYear - (currentYear - 30) + 1 },
    (_, index) => ({
      id: currentYear - 30 + index,
      label: `${currentYear - 30 + index}`,
    }),
  )

  const formatDate = (date: number, partDate: string) => {
    const dt = new Date(date)
    const dt_day = dt.getDay() + 1 < 10 ? '0' + dt.getDay() : dt.getDay()
    const dt_month =
      dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1
    const dt_year = dt.getFullYear()

    if (partDate == 'day') {
      return dt_day
    } else if (partDate == 'month') {
      return dt_month
    } else if (partDate == 'year') {
      return dt_year
    }

    const dtReturn = dt_year + '-' + dt_month + '-' + dt_day

    return dtReturn
  }

  return (
    <Container>
      <form>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/protocolos"
            style={{
              textDecoration: 'none',
              fontFamily: 'Roboto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#000',
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
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
                  width: '100%'
                }}
              >

              Data de Recebimento
            </p>

            <div>
              <TextInput
                title="Dia"
                w={100}
                value={formatDate(data.data_recebimento, 'day')}
              />
            </div>

            <div>
              <TextInput
                title="Mês"
                w={100}
                value={formatDate(data.data_recebimento, 'month')}
              />
            </div>

            <div>
              <TextInput
                title="Ano"
                w={100}
                value={formatDate(data.data_recebimento, 'year')}
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
                defaultChecked={data.doc_entrada_requer_resposta}
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
                  width: '100%'
                }}
              >

              Data de Envio
            </p>

            <div>
              <TextInput
                title="Dia"
                w={100}
                value={formatDate(data.data_envio, 'day')}
              />
            </div>

            <div>
              <TextInput
                title="Mês"
                w={100}
                value={formatDate(data.data_envio, 'month')}
              />
            </div>

            <div>
              <TextInput
                title="Ano"
                w={100}
                value={formatDate(data.data_envio, 'year')}
              />
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
                value={formatDate(data.data_encerramento_protocolo, 'day')}
              />
            </div>

            <div>
              <TextInput
                title="Mês"
                w={100}
                value={formatDate(data.data_encerramento_protocolo, 'month')}
              />
            </div>

            <div>
              <TextInput
                title="Ano"
                w={100}
                value={formatDate(data.data_encerramento_protocolo, 'year')}
              />
            </div>
            <div style={{ width: '30%' }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                value={data.usuario_encerramento_protocolo}
              />
            </div>
          </Box>

          <Box>
            <div style={{ width: '60%' }}>
              <TextInput title="Anexos" value={data.anexos} disabled={true}/>
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
      let data_recebimento
      let data_envio
      let data_encerramento_protocolo

      if (
        data.data_recebimento_ano &&
        data.data_recebimento_mes &&
        data.data_recebimento_dia
      ) {
        data_recebimento = new Date(
          data.data_recebimento_ano,
          data.data_recebimento_mes - 1,
          data.data_recebimento_dia,
        )
      }

      if (data.data_envio_ano && data.data_envio_mes && data.data_envio_dia) {
        data_envio = new Date(
          data.data_envio_ano,
          data.data_envio_mes - 1,
          data.data_envio_dia,
        )
      }

      if (
        data.data_encerramento_protocolo_ano &&
        data.data_encerramento_protocolo_mes &&
        data.data_encerramento_protocolo_dia
      ) {
        data_encerramento_protocolo = new Date(
          data.data_encerramento_protocolo_ano,
          data.data_encerramento_protocolo_mes - 1,
          data.data_encerramento_protocolo_dia,
        )
      }

      // Converter as propriedades de data para strings no formato ISO 8601
      const serializedData = {
        ...data,
        data_recebimento: data_recebimento
          ? data_recebimento.toISOString()
          : null,
        data_envio: data_envio ? data_envio.toISOString() : null,
        data_encerramento_protocolo: data_encerramento_protocolo
          ? data_encerramento_protocolo.toISOString()
          : null,
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
