/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { Container, Box } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { SwitchInput } from '@/components/SwitchInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useArrayDate } from '../../../utils/useArrayDate'
import { BackPage } from '../../../components/BackPage'

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  id: z.number(),
  num_protocolo: z.string(),
  assunto_protocolo: z.string(),
  tipo_protocolo: z.string(),
  data_recebimento: z.string(),
  data_recebimento_dia: z.number(),
  data_recebimento_mes: z.number(),
  data_recebimento_ano: z.number(),
  data_envio: z.string(),
  data_envio_dia: z.number(),
  data_envio_mes: z.number(),
  data_envio_ano: z.number(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  quem_redigiu_documento_a_ser_enviado: z.string(),
  entregue_em_maos: z.boolean(),
  doc_entrada_requer_resposta: z.boolean(),
  anexos: z.string(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo: z.string(),
  data_encerramento_protocolo_dia: z.number(),
  data_encerramento_protocolo_mes: z.number(),
  data_encerramento_protocolo_ano: z.number(),
  usuario_encerramento_protocolo: z.string(), // ALTERAR PARA USUÁRIO
})

const dataDays = useArrayDate.Dia()
const dataMonths = useArrayDate.Mes()
const dataYears = useArrayDate.AnoAtualMenor()

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - TIPO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Tipo_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const tipoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        tipoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const tipoProtocoloOptionsData = [
  { id: 1, label: 'Entrada' },
  { id: 2, label: 'Saída' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - MEIO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Meio_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const meioProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        meioProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const meioProtocoloOptionsData = [
  { id: 1, label: 'Corrêio' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Whatsapp' },
  { id: 4, label: 'Web Site' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - ASSUNTO PROTOCOLO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Assunto_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const assuntoProtocoloOptions = []
      for(let i = 1; i <= finalResponse.length; i++){
        assuntoProtocoloOptions.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const assuntoProtocoloOptionsData = [
  { id: 1, label: 'Protocolo de Entrada' },
  { id: 2, label: 'Protocolo de Saída' },
  { id: 3, label: 'Confidencial' },
]

// ATUALIZAR QUANDO HOUVER API CORRESPONDENTE - QUEM REDIGIU O DOCUMENTO A SER ENVIADO

/* 
      const response = await api.get('/tabelas')
      const filteredResponse = response.data.filter(tabela => {
        tabela.Cod_Tabela === "Quem_Redigiu_Documento_Protocol"
      })
      const finalResponse = []
      filteredResponse.forEach(response => finalResponse.push(response.Ocorrencia_Tab))

      const quemRedigiuDocumentoOptionsData = []
      for(let i = 1; i <= finalResponse.length; i++){
        quemRedigiuDocumentoOptionsData.push({
          id: i,
          label: finalResponse[i]
        })
      }
  */
const quemRedigiuDocumentoOptionsData = [{ id: 1, label: 'Dr. Calazan' }]

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>
interface schemaProtocoloProps {
  data: SchemaProtocoloForm
}

export default function ProtocolosAtualizar({ data }: schemaProtocoloProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files
    if (fileList) {
      const filesArray = Array.from(fileList)
      setSelectedFiles(filesArray)
    }
  }

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<SchemaProtocoloForm>()

  async function OnSubmit(dataSubmit: SchemaProtocoloForm) {
    const datasRecebimento = verificaData(dataSubmit, 'recebimento')
    const datasEncerramento = verificaData(dataSubmit, 'encerramento')

    let dataEnvio
    let dataRecebimento
    let dataEncerramento

    if (dataSubmit.data_envio_dia && dataSubmit.data_envio_mes && dataSubmit.data_envio_ano) {
      dataEnvio = useArrayDate.MontarDate(
        dataSubmit.data_envio_ano,
        dataSubmit.data_envio_mes,
        dataSubmit.data_envio_dia,
      )
    }

    if (
      dataSubmit.data_recebimento_dia &&
      dataSubmit.data_recebimento_mes &&
      dataSubmit.data_recebimento_ano
    ) {
      dataRecebimento = useArrayDate.MontarDate(
        dataSubmit.data_recebimento_ano,
        dataSubmit.data_recebimento_mes,
        dataSubmit.data_recebimento_dia,
      )
    }

    if (
      dataSubmit.data_encerramento_protocolo_dia &&
      dataSubmit.data_encerramento_protocolo_mes &&
      dataSubmit.data_encerramento_protocolo_ano
    ) {
      dataEncerramento = useArrayDate.MontarDate(
        dataSubmit.data_encerramento_protocolo_ano,
        dataSubmit.data_encerramento_protocolo_mes,
        dataSubmit.data_encerramento_protocolo_dia,
      )
    }

    if (
      dataSubmit.num_protocolo == '' ||
      dataSubmit.tipo_protocolo == '' ||
      dataSubmit.assunto_protocolo == '' ||
      Number.isNaN(dataSubmit.data_envio_dia) ||
      Number.isNaN(dataSubmit.data_envio_mes) ||
      Number.isNaN(dataSubmit.data_envio_ano)
    ) {
      toast.error('Preencha os campos obrigatórios (*).')
    } else if (
      (dataEnvio != null &&
      dataRecebimento != null) &&
      new Date(dataRecebimento) < new Date(dataEnvio)
    ) {
      toast.error('A data de recebimento deve ser maior que a data de envio.')
    } else if (datasRecebimento == false) {
      toast.error(
        'A data de recebimento deve ser toda preenchida (dia, mês e ano).',
      )
    } else if (datasEncerramento == false) {
      toast.error(
        'A data de encerramento deve ser toda preenchida (dia, mês e ano).',
      )
    } else {
      const {
        data_envio_dia,
        data_envio_mes,
        data_envio_ano,
        data_recebimento_dia,
        data_recebimento_mes,
        data_recebimento_ano,
        data_encerramento_protocolo_dia,
        data_encerramento_protocolo_mes,
        data_encerramento_protocolo_ano,
        ...newData
      } = dataSubmit

      try {
        await api.put('/protocolos/update', {
          ...newData,
          data_envio: dataEnvio,
          data_recebimento: dataRecebimento,
          data_encerramento_protocolo: dataEncerramento,
        })
        toast.success('Protocolo Atualizado')
        router.push('/protocolos')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const verificaData = (data: SchemaProtocoloForm, tipoData: string) => {
    if (tipoData == 'encerramento') {
      if (
        !Number.isNaN(data.data_encerramento_protocolo_dia) ||
        !Number.isNaN(data.data_encerramento_protocolo_mes) ||
        !Number.isNaN(data.data_encerramento_protocolo_ano)
      ) {
        if (
          Number.isNaN(data.data_encerramento_protocolo_dia) ||
          Number.isNaN(data.data_encerramento_protocolo_mes) ||
          Number.isNaN(data.data_encerramento_protocolo_ano)
        ) {
          return false
        } else {
          return true
        }
      }
    }

    if (tipoData == 'recebimento') {
      if (
        !Number.isNaN(data.data_recebimento_dia) ||
        !Number.isNaN(data.data_recebimento_mes) ||
        !Number.isNaN(data.data_recebimento_ano)
      ) {
        if (
          Number.isNaN(data.data_recebimento_dia) ||
          Number.isNaN(data.data_recebimento_mes) ||
          Number.isNaN(data.data_recebimento_ano)
        ) {
          return false
        } else {
          return true
        }
      }
    }
  }

  function setInitialValues(){
    setValue('id', data.id)
    setValue('num_protocolo', data.num_protocolo)
    setValue('assunto_protocolo', data.assunto_protocolo)
    setValue('tipo_protocolo', data.tipo_protocolo)
    setValue('data_recebimento_dia', data.data_recebimento_dia)
    setValue('data_recebimento_mes', data.data_recebimento_mes)
    setValue('data_recebimento_ano', data.data_recebimento_ano)
    setValue('data_envio_dia', data.data_envio_dia)
    setValue('data_envio_mes', data.data_envio_mes)
    setValue('data_envio_ano', data.data_envio_ano)
    setValue('meio_recebimento', data.meio_recebimento)
    setValue('meio_envio', data.meio_envio)
    setValue(
      'quem_redigiu_documento_a_ser_enviado',
      data.quem_redigiu_documento_a_ser_enviado,
    )
    setValue('entregue_em_maos', data.entregue_em_maos)
    setValue('doc_entrada_requer_resposta', data.doc_entrada_requer_resposta)
    setValue(
      'data_encerramento_protocolo_dia',
      data.data_encerramento_protocolo_dia,
    )
    setValue(
      'data_encerramento_protocolo_mes',
      data.data_encerramento_protocolo_mes,
    )
    setValue(
      'data_encerramento_protocolo_ano',
      data.data_encerramento_protocolo_ano,
    )
    setValue(
      'usuario_encerramento_protocolo',
      data.usuario_encerramento_protocolo,
    )
  }

  useEffect(() => {
    setInitialValues()
  }, [])

  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <BackPage backRoute="/protocolos" discartPageBack />
        </Box>
        <fieldset>
          <legend>
            <span>
              <Link href={'/protocolos'}>Protocolos</Link>
            </span>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Número do Protocolo"
                {...register('num_protocolo')}
                defaultValue={data.num_protocolo}
                disabled={true}
              />
            </div>

            <div>
              <SelectOptions
                data={tipoProtocoloOptionsData}
                description="Tipo Protocolo"
                w={200}
                {...register('tipo_protocolo')}
                defaultValue={
                  tipoProtocoloOptionsData.find(
                    (option) => option.label === data.tipo_protocolo,
                  ) || null
                }
              />
            </div>

            <div  style={{ width: '40%' }}>
              <TextInput
                title="Assunto Protocolo"
                {...register('assunto_protocolo')}
                defaultValue={data.assunto_protocolo}
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
              Data de Recebimento
            </p>

            <div>
              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_recebimento_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataDays.find(
                    (option) =>
                      option.label == String(data.data_recebimento_dia),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_recebimento_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataMonths.find(
                    (option) =>
                      option.label == String(data.data_recebimento_mes),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_recebimento_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataYears.find(
                    (option) =>
                      option.label == String(data.data_recebimento_ano),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
                defaultValue={
                  meioProtocoloOptionsData.find(
                    (option) => option.label === data.meio_recebimento,
                  ) || null
                }
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('doc_entrada_requer_resposta')}
                defaultChecked={data.doc_entrada_requer_resposta}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
                defaultChecked={data.entregue_em_maos}
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
              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_envio_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataDays.find(
                    (option) => option.label == String(data.data_envio_dia),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_envio_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataMonths.find(
                    (option) => option.label == String(data.data_envio_mes),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_envio_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataYears.find(
                    (option) => option.label == String(data.data_envio_ano),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
                defaultValue={
                  meioProtocoloOptionsData.find(
                    (option) => option.label == data.meio_envio,
                  ) || null
                }
              />
            </div>
          </Box>

          <Box>
            <div>
              <SelectOptions
                data={quemRedigiuDocumentoOptionsData}
                description="Quem redigiu documento a ser enviado?"
                w={500}
                {...register('quem_redigiu_documento_a_ser_enviado')}
                defaultValue={
                  quemRedigiuDocumentoOptionsData.find(
                    (option) =>
                      option.label == data.quem_redigiu_documento_a_ser_enviado,
                  ) || null
                }
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
              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_encerramento_protocolo_dia', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataDays.find(
                    (option) =>
                      option.label ==
                      String(data.data_encerramento_protocolo_dia),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_encerramento_protocolo_mes', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataMonths.find(
                    (option) =>
                      option.label ==
                      String(data.data_encerramento_protocolo_mes),
                  ) || null
                }
              />
            </div>

            <div>
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_encerramento_protocolo_ano', {
                  valueAsNumber: true, // Essa opção indica que o valor deve ser tratado como número
                  setValueAs: (value) => parseInt(value), // Função para converter o valor para número
                })}
                defaultValue={
                  dataYears.find(
                    (option) =>
                      option.label ==
                      String(data.data_encerramento_protocolo_ano),
                  ) || null
                }
              />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                title="Usuário Encerramento Protocolo"
                {...register('usuario_encerramento_protocolo')}
                defaultValue={data.usuario_encerramento_protocolo}
              />
            </div>
          </Box>

          <Box>
            <div>
              <h4
                style={{
                  borderBottomColor: '#A9A9B2',
                  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                  fontWeight: '400',
                  lineHeight: '1.4375em',
                  letterSpacing: '0.00938em',
                }}
                className="files_names"
              >
                Anexos
              </h4>
              <input type="file" multiple onChange={handleFileChange} />
              {selectedFiles.length > 0 && (
                <div>
                  <b>
                    <h4
                      style={{
                        borderBottomColor: '#A9A9B2',
                        fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                        fontWeight: 'bold',
                        lineHeight: '1.4375em',
                        letterSpacing: '0.00938em',
                      }}
                    >
                      Arquivos selecionados:
                    </h4>
                  </b>

                  <ul
                    style={{
                      borderBottomColor: '#A9A9B2',
                      fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
                      fontWeight: '400',
                      lineHeight: '1.4375em',
                      letterSpacing: '0.00938em',
                    }}
                  >
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Atualizar'}
            type="submit"
            disabled={isSubmitting}
          />
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
        data.data_encerramento_protocolo != undefined
          ? new Date(data.data_encerramento_protocolo)
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
        data_encerramento_protocolo: dataEncerramento,
        data_encerramento_protocolo_dia: Number(
          dataEncerramento?.split('/')[0],
        ),
        data_encerramento_protocolo_mes: Number(
          dataEncerramento?.split('/')[1],
        ),
        data_encerramento_protocolo_ano: Number(
          dataEncerramento?.split('/')[2],
        ),
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
        data: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
