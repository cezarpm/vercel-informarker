/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
import { Container, Box, Text } from './styled'
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
import { ButtonDownload } from '@/components/ButtonDownload'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'

// import 'react-date-picker/dist/DatePicker.css';
// import 'react-calendar/dist/Calendar.css';

const schemaProtocoloForm = z.object({
  id: z.number(),
  num_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  assunto_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  tipo_protocolo: z.string().min(1, { message: "Campo obrigatório" }),
  data_recebimento_dia: z.string(),
  data_recebimento_mes: z.string(),
  data_recebimento_ano: z.string(),
  data_envio_dia: z.string(),
  data_envio_mes: z.string(),
  data_envio_ano: z.string(),
  meio_recebimento: z.string(),
  meio_envio: z.string(),
  entregue_em_maos: z.boolean(),
  obrigatoria_resp_receb: z.boolean(),
  anexos: z.any(), // ALTERAR PARA ANEXO DE ARQUIVO
  data_encerramento_protocolo_dia: z.string(),
  data_encerramento_protocolo_mes: z.string(),
  data_encerramento_protocolo_ano: z.string(),
  usuario_encerramento: z.any(), // ALTERAR PARA USUÁRIO
})

const dataDays = useArrayDate.Dia()
const dataMonths = useArrayDate.Mes()
const dataYears = useArrayDate.AnoAtualMenor()

const tipoProtocoloOptionsData = [
  { id: 1, label: 'Entrada' },
  { id: 2, label: 'Saída' },
]

const meioProtocoloOptionsData = [
  { id: 1, label: 'Corrêio' },
  { id: 2, label: 'Email' },
  { id: 3, label: 'Whatsapp' },
  { id: 4, label: 'Web Site' },
]
const usuarioEncerramento = [
  {
    id: 1,
    label: 'ALM - Andrea Laino Marinho',
  },
  {
    id: 2,
    label: 'MAA - Marcelo Artur Almeida Santos'
  },
  {
    id: 2,
    label: 'TSA - Tania Santos de Andrade Barbosa'
  }
]

type SchemaProtocoloForm = z.infer<typeof schemaProtocoloForm>
interface schemaProtocoloProps {
  data: any
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
  } = useForm<SchemaProtocoloForm>({
    resolver: zodResolver(schemaProtocoloForm)
  })

  async function OnSubmit(dataSubmit: SchemaProtocoloForm) {
    const datasRecebimento = verificaData(dataSubmit, 'recebimento')
    const datasEncerramento = verificaData(dataSubmit, 'encerramento')
    console.log(dataSubmit)
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
 
    if (String(dataSubmit.tipo_protocolo.toLowerCase()) === String('saída')) {
      if (dataSubmit.meio_envio === '') {
        return toast.warn('Meio Envio Obrigatório')
      } else if (dataEnvio === undefined) {
        return toast.warn('Data Envio Obrigatório')
      }
    }

    if (String(dataSubmit.tipo_protocolo.toLowerCase()) === String('entrada')) {
      if (dataSubmit.meio_recebimento === '') {
        return toast.warn('Meio Recebimento Obrigatório')
      } else if (dataRecebimento === undefined) {
        return toast.warn('Data Recebimento Obrigatória')
      }
    }

    if (
      dataSubmit.num_protocolo == '' ||
      dataSubmit.tipo_protocolo == '' ||
      dataSubmit.assunto_protocolo == ''
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
    } 
//    else if (datasEncerramento == false) {
//      toast.error(
//        'A data de encerramento deve ser toda preenchida (dia, mês e ano).',
//      )
//    } 
    else {
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
      console.log(newData)

      try {
        const formData = new FormData()

        formData.append('anexos', dataSubmit.anexos[0])
        const handlePostUpload = async () => {
          try {
            const response = await axios.post('/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            const nameFile = response.data.names_arquivos?.map((item: any) => {
              return item.anexoProtocolo
            })
            return nameFile
          } catch (error: any) {
            toast.error(error?.response?.data.error)
            console.log(error?.response?.data.error)
          }
        }

        const NameUpload = await handlePostUpload()

        await api.put('/protocolos/update', {
          ...newData,
          data_envio: dataEnvio || null,
          data_recebimento: dataRecebimento || null,
          data_encerramento: dataEncerramento || null,
          anexos: NameUpload[0]
        })
        toast.success('Operação concluída com sucesso')
        return router.push('/protocolos')
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

  function setInitialValues() {
    setValue('id', data[0].id)
    setValue('num_protocolo', data[0].num_protocolo)
    setValue('assunto_protocolo', data[0].assunto_protocolo)
    setValue('tipo_protocolo', data[0].tipo_protocolo)
    setValue('data_recebimento_dia', data[0].data_recebimento.dia || '')
    setValue('data_recebimento_mes', data[0].data_recebimento.mes || '')
    setValue('data_recebimento_ano', data[0].data_recebimento.ano || '')
    setValue('data_envio_dia', data[0].data_envio.dia || '')
    setValue('data_envio_mes', data[0].data_envio.mes || '')
    setValue('data_envio_ano', data[0].data_envio.ano || '')
    setValue('meio_recebimento', data[0].meio_recebimento)
    setValue('meio_envio', data[0].meio_envio)
    setValue('entregue_em_maos', data[0].entregue_em_maos)
    setValue('obrigatoria_resp_receb', data[0].obrigatoria_resp_receb)
    setValue(
      'data_encerramento_protocolo_dia',
      data[0].data_encerramento.dia || ''
    )
    setValue(
      'data_encerramento_protocolo_mes',
      data[0].data_encerramento.mes || ''
    )
    setValue(
      'data_encerramento_protocolo_ano',
      data[0].data_encerramento.ano || ''
    )
    setValue(
      'usuario_encerramento',
      data[0].usuario_encerramento,
    )
  }

  useEffect(() => {
    setInitialValues()
  }, [])
  console.log(errors)
  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <BackPage backRoute="/protocolos" />
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
                defaultValue={data[0].num_protocolo}
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
                    (option) => option.label === data[0].tipo_protocolo,
                  ) || null
                }
                helperText={errors.tipo_protocolo?.message}
                error={!!errors.tipo_protocolo?.message}
              />
            </div>

            <div style={{ width: '40%' }}>
              <TextInput
                title="Assunto Protocolo"
                {...register('assunto_protocolo')}
                defaultValue={data[0].assunto_protocolo}
                helperText={errors.assunto_protocolo?.message}
                error={!!errors.assunto_protocolo?.message}
              />
            </div>
          </Box>

          <Box>

            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'end',
                  width: '24rem',
                }}
              >
                <Text>Data de Recebimento:</Text>
                <SelectOptions
                  data={dataDays}
                  description="Dia"
                  w={100}
                  {...register('data_recebimento_dia')}
                  defaultValue={data[0].data_recebimento.dia}
                />
                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={100}
                  {...register('data_recebimento_mes')}
                  defaultValue={data[0].data_recebimento.mes}
                />
                <SelectOptions
                  data={dataYears}
                  description="Ano"
                  w={150}
                  {...register('data_recebimento_ano')}
                  defaultValue={data[0].data_recebimento.ano}
                />
              </div>

            </div>

            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Recebimento"
                w={225}
                {...register('meio_recebimento')}
                defaultValue={data[0].meio_recebimento}
              />
            </div>




            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Documento de entrada requer resposta?"
                {...register('obrigatoria_resp_receb')}
                defaultChecked={data[0].obrigatoria_resp_receb}
              />
            </div>

            <div style={{ width: '15%' }}>
              <SwitchInput
                title="Entregue em mãos?"
                {...register('entregue_em_maos')}
                defaultChecked={data[0].entregue_em_maos}
              />
            </div>
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '25rem',
              }}
            >
              <Text>Data de Envio:</Text>

              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_envio_dia')}
                defaultValue={data[0].data_envio.dia}
              />



              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_envio_mes')}
                defaultValue={data[0].data_envio.mes}
              />

              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_envio_ano')}
                defaultValue={data[0].data_envio.ano}
              />

            </div>
            <div>
              <SelectOptions
                data={meioProtocoloOptionsData}
                description="Meio de Envio"
                w={225}
                {...register('meio_envio')}
                defaultValue={String(data[0].meio_envio)}
              />
            </div>
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                width: '25rem',
              }}
            >
              <Text>Data de Encerramento do Protocolo:</Text>

              <SelectOptions
                data={dataDays}
                description="Dia"
                w={100}
                {...register('data_encerramento_protocolo_dia')}
                defaultValue={data[0].data_encerramento.dia}
              />
              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={100}
                {...register('data_encerramento_protocolo_mes')}
                defaultValue={data[0].data_encerramento.mes}
              />
              <SelectOptions
                data={dataYears}
                description="Ano"
                w={150}
                {...register('data_encerramento_protocolo_ano')}
                defaultValue={data[0].data_encerramento.ano}
              />
            </div>
            <div>
              <SelectOptions
                w={300}
                data={usuarioEncerramento}
                description="Usuário Encerramento Protocolo"
                {...register('usuario_encerramento')}
                defaultValue={data[0].usuario_encerramento}
              />
            </div>
          </Box>

          <Box>

            <ButtonDownload
              nameButton='Baixar Arquivo'
              nameFile={data[0].anexos}
            />
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
              <input type="file" multiple accept="application/pdf" {...register('anexos')} onChange={handleFileChange} />
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

    const newData = [data]?.map((item: any) => {
      let dataRecebimento
      let dataEnvio
      let dataEncerramento
      if (item.data_recebimento !== null) {
        dataRecebimento = useArrayDate.DesestruturarDate(
          item.data_recebimento,
        )
      } else {
        dataRecebimento = ''
      }

      if (item.data_envio !== null) {
        dataEnvio = useArrayDate.DesestruturarDate(item.data_envio)
      } else {
        dataEnvio = ''
      }

      if (item.data_encerramento !== null) {
        dataEncerramento = useArrayDate.DesestruturarDate(item.data_encerramento)
      } else {
        dataEncerramento = ''
      }

      return {
        ...data,
        data_recebimento: dataRecebimento,
        data_envio: dataEnvio,
        data_encerramento: dataEncerramento,
      }
    })

    return {
      props: {
        data: newData,
      },
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
