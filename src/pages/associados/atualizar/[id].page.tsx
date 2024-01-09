/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container, Text } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { SelectOptions } from '@/components/SelectOptions'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useArrayDate } from '@/utils/useArrayDate'
import axios from 'axios'
import { format } from 'date-fns'

const schemaAssociados = z.object({
  id: z.number(),
  numero_proposta_SBA: z.number(),
  matricula_SAERJ: z.number(),
  matricula_SBA: z.number(),
  situacao: z.string(),
  uf_crm: z.string(),
  crm: z.string(),
  nome_completo: z.string(),
  cpf: z.string(),
  sexo: z.string(),
  nome_profissional: z.string(),
  categoria: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.number(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
  pais: z.string(),
  telefone_celular: z.string(),
  telefone_residencial: z.string(),
  email: z.string(),
  nome_instituicao_ensino_graduacao: z.string(),
  ano_conclusao_graduacao: z.string(),
  residencia_mec_cnrm: z.string(),
  nivel_residencia: z.string(),
  nome_hospital_mec: z.string(),
  uf_prm: z.string(),
  comprovante_endereco: z.string(),
  carta_indicacao_2_membros: z.string(),
  declaracao_hospital: z.string(),
  diploma_medicina: z.string(),
  certidao_quitacao_crm: z.string(),
  certificado_conclusao_especializacao: z.string(),
  declaro_verdadeiras: z.string(),
  declaro_quite_SAERJ: z.string(),
  pendencias_SAERJ: z.string(),
  nome_presidente_regional: z.string(),
  sigla_regional: z.string(),
  comprovante_cpf: z.string(),

  // data_nascimento: z.string(),
  // data_inicio_especializacao: z.string(),
  // data_previsao_conclusao: z.string(),

  yearNasc: z.string(),
  monthNasc: z.string(),
  dayNasc: z.string(),

  dayInicioEspec: z.string(),
  monthInicioEspec: z.string(),
  yearInicioEspec: z.string(),

  dayPrevConcl: z.string(),
  monthPrevConcl: z.string(),
  yearPrevConcl: z.string(),
})

type SchemaAssociados = z.infer<typeof schemaAssociados>

interface schemaAssociados {
  data: {
    id: number
    data_nascimento: string
    data_inicio_especializacao: string
    data_previsao_conclusao: string
    comprovante_cpf: string
    numero_proposta_SBA: any
    matricula_SAERJ: number
    matricula_SBA: number
    situacao: string
    uf_crm: string
    crm: string
    nome_completo: string
    cpf: string
    sexo: string
    nome_profissional: string
    categoria: string
    cep: string
    logradouro: string
    numero: number
    complemento: string
    bairro: string
    cidade: string
    uf: string
    pais: string
    telefone_celular: string
    telefone_residencial: string
    email: string
    nome_instituicao_ensino_graduacao: string
    ano_conclusao_graduacao: string
    residencia_mec_cnrm: string
    nivel_residencia: string
    nome_hospital_mec: string
    uf_prm: string
    comprovante_endereco: string
    carta_indicacao_2_membros: string
    declaracao_hospital: string
    diploma_medicina: string
    certidao_quitacao_crm: string
    certificado_conclusao_especializacao: string
    declaro_verdadeiras: string
    declaro_quite_SAERJ: string
    pendencias_SAERJ: string
    nome_presidente_regional: string
    sigla_regional: string
  }
  dataCategoria: any
  dataSituacao: any
  dataPais: any
}
export default function AssociadosCadastro({
  data,
  dataCategoria,
  dataSituacao,
  dataPais,
}: schemaAssociados) {
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposCepInvalido, setDisableCamposCepInvalido] =
    useState(false)
  const router = useRouter()

  // const extrairDataNascimentoOriginal = useArrayDate.extrairComponentesData(
  //   data.data_nascimento,
  // )
  // console.log(extrairDataNascimentoOriginal)

  // const dataAssociados = data[0]

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaAssociados>()
  const cepValue = watch('cep')
  const dataNascimento = useArrayDate.DesestruturarDate(data.data_nascimento)

  const dataInicio = useArrayDate.DesestruturarDate(
    data.data_inicio_especializacao,
  )
  const dataPrevisao = useArrayDate.DesestruturarDate(
    data.data_previsao_conclusao,
  )
  async function handleCheckCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      checkedViaCep(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleGetAllParams(): Promise<void> {
    try {
      const response = await api.get('/parametros')
      setCepInvalido(response.data[0].cep_invalido)
    } catch (error) {
      console.log(error)
    }
  }

  function checkedViaCep(dataViaCep: any) {
    if (dataViaCep.erro === true) {
      if (cepInvalido === true) {
        toast.warn('você optou: aceitar cep inválido')
      } else {
        setDisableCamposCepInvalido(true)
        toast.warn('você optou: não aceitar cep inválido')
      }
    }

    if (!dataViaCep.erro) {
      setDisableCamposCepInvalido(false)
      setValue('bairro', dataViaCep.bairro)
      setValue('cidade', dataViaCep.localidade)
      setValue('uf', dataViaCep.uf)
      setValue('logradouro', dataViaCep.logradouro)
    }
  }

  async function handleOnSubmit(data: SchemaAssociados) {
    try {
      console.log(data)
      const dataNascimento = useArrayDate.MontarDate(
        data.yearNasc,
        data.monthNasc,
        data.dayNasc,
      )
      const dataInicioEspecializacao = useArrayDate.MontarDate(
        data.yearInicioEspec,
        data.monthInicioEspec,
        data.dayInicioEspec,
      )
      const dataPrevisaoConclusao = useArrayDate.MontarDate(
        data.yearPrevConcl,
        data.monthPrevConcl,
        data.dayPrevConcl,
      )

      data.cpf = data.cpf.replace(/[^\d]/g, '')
      data.cep = data.cep.replace(/[^\d]/g, '')

      data.telefone_residencial = data.telefone_residencial.replace(
        /[^\d]/g,
        '',
      )
      data.telefone_celular = data.telefone_celular.replace(/[^\d]/g, '')

      const {
        dayNasc,
        monthNasc,
        yearNasc,
        dayInicioEspec,
        monthInicioEspec,
        yearInicioEspec,
        dayPrevConcl,
        monthPrevConcl,
        yearPrevConcl,
        ...newData
      } = data

      await api.put('/associados/update', {
        ...newData,
        id: data.id,
        data_nascimento: dataNascimento,
        data_inicio_especializacao: dataInicioEspecializacao,
        data_previsao_conclusao: dataPrevisaoConclusao,
      })
      toast.success('Associado cadastrado')
      router.push('/associados')
    } catch (error) {
      console.log(error)
      toast.error('Oops algo deu errado...')
    }
  }

  useEffect(() => {
    setDisableCamposCepInvalido(false)
    handleGetAllParams()
    setValue('id', data.id)
    setValue('cep', data.cep ? data.cep : '')
    setValue('cpf', data.cpf ? data.cpf : '')
    setValue(
      'telefone_celular',
      data.telefone_celular ? data.telefone_celular : '',
    )
    setValue(
      'telefone_residencial',
      data.telefone_residencial ? data.telefone_residencial : '',
    )
    setValue('categoria', data.categoria)
    setValue('situacao', data.situacao)
    setValue('pais', data.pais)

    setValue('dayNasc', dataNascimento.dia)
    setValue('monthNasc', dataNascimento.mes)
    setValue('yearNasc', dataNascimento.ano)

    setValue('dayInicioEspec', dataInicio.dia)
    setValue('monthInicioEspec', dataInicio.mes)
    setValue('yearInicioEspec', dataInicio.ano)

    setValue('dayPrevConcl', dataPrevisao.dia)
    setValue('monthPrevConcl', dataPrevisao.mes)
    setValue('yearPrevConcl', dataPrevisao.ano)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ flexDirection: 'row-reverse' }}>
          <Link
            href="/associados"
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
            <Link href="/associados">Associados</Link>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '1rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Gerais</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={180}
                  title="Número proposta SBA"
                  defaultValue={data.numero_proposta_SBA}
                  {...register('numero_proposta_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  defaultValue={data.matricula_SAERJ}
                  title="Matrícula SAERJ"
                  {...register('matricula_SAERJ', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SBA"
                  defaultValue={data.matricula_SBA}
                  {...register('matricula_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>

              <SelectOptions
                w={260}
                description="Categoria"
                defaultValue={data.categoria}
                data={dataCategoria}
                {...register('categoria')}
              />
            </Box>

            <Box>
              <TextInput
                title="Residencia MEC-CNRM"
                defaultValue={data.residencia_mec_cnrm}
                {...register('residencia_mec_cnrm')}
              />
              <TextInput
                title="Nível Residencia"
                defaultValue={data.nivel_residencia}
                {...register('nivel_residencia')}
              />
              <TextInput
                defaultValue={data.nome_hospital_mec}
                title="Nome Hospital MEC"
                {...register('nome_hospital_mec')}
              />
              <TextInput
                title="UF PRM"
                defaultValue={data.uf_prm}
                {...register('uf_prm')}
              />
              <TextInput
                defaultValue={data.comprovante_endereco}
                title="Comprovante Endereço"
                {...register('comprovante_endereco')}
              />
              <TextInput
                defaultValue={data.carta_indicacao_2_membros}
                title="Carta Indicação 2 membros"
                {...register('carta_indicacao_2_membros')}
              />
              <TextInput
                defaultValue={data.declaracao_hospital}
                title="Declaração Hospital"
                {...register('declaracao_hospital')}
              />
            </Box>

            <Box>
              <TextInput
                defaultValue={data.diploma_medicina}
                title="Diploma Medicina"
                {...register('diploma_medicina')}
              />

              <TextInput
                defaultValue={data.certidao_quitacao_crm}
                title="Certidão Quitação CRM"
                {...register('certidao_quitacao_crm')}
              />
              <div>
                <TextInput
                  w={220}
                  defaultValue={data.certificado_conclusao_especializacao}
                  title="Certificado Conclusão Especialização"
                  {...register('certificado_conclusao_especializacao')}
                />
              </div>
              <TextInput
                defaultValue={data.declaro_verdadeiras}
                title="Declaro Verdadeiras"
                {...register('declaro_verdadeiras')}
              />
              <TextInput
                defaultValue={data.declaro_quite_SAERJ}
                title="Declaro Quite SAERJ"
                {...register('declaro_quite_SAERJ')}
              />
              <TextInput
                title="Pendências SERJ"
                defaultValue={data.pendencias_SAERJ}
                {...register('pendencias_SAERJ')}
              />
              <div>
                <TextInput
                  w={180}
                  defaultValue={data.nome_presidente_regional}
                  title="Nome Presidente Regional"
                  {...register('nome_presidente_regional')}
                />
              </div>
              <TextInput
                defaultValue={data.sigla_regional}
                title="Sigla Regional"
                {...register('sigla_regional')}
              />
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Pessoais</h2>
            </legend>

            <Box>
              <TextInput
                defaultValue={data.nome_completo}
                title="Nome Completo"
                {...register('nome_completo')}
              />
              <div>
                <TextInput
                  w={140}
                  title="CPF"
                  mask={'999.999.999-99'}
                  {...register('cpf')}
                />
              </div>
              <div>
                <TextInput
                  w={220}
                  defaultValue={data.comprovante_cpf}
                  title="Comprovante CPF"
                  {...register('comprovante_cpf')}
                />
              </div>

              {/* <div>
                <TextInput
                  title="Data nascimento"
                  {...register('data_nascimento')}
                />
              </div> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '28rem' }}
              >
                <Text>Data Nascimento</Text>

                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('dayNasc')}
                  defaultValue={{ label: dataNascimento.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthNasc')}
                  defaultValue={{ label: dataNascimento.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearNasc')}
                  defaultValue={{ label: dataNascimento.ano }}
                />
              </div>
            </Box>

            <Box>
              <TextInput
                title="Nome Profissional"
                {...register('nome_profissional')}
                defaultValue={data.nome_profissional}
              />
              <div>
                <TextInput
                  w={100}
                  title="Sexo"
                  {...register('sexo')}
                  defaultValue={data.sexo}
                />
              </div>
              <div>
                <SelectOptions
                  w={200}
                  description="Situação"
                  data={dataSituacao}
                  defaultValue={data.situacao}
                  {...register('situacao')}
                />
              </div>
              <div>
                <TextInput
                  w={100}
                  defaultValue={data.uf_crm}
                  title="UF CRM"
                  {...register('uf_crm')}
                />
              </div>

              <div>
                <TextInput
                  w={180}
                  title="CRM"
                  {...register('crm')}
                  defaultValue={data.crm}
                />
              </div>
            </Box>

            <Box>
              <TextInput
                title="Nome Instituição de Ensino Graduação"
                {...register('nome_instituicao_ensino_graduacao')}
                defaultValue={data.nome_instituicao_ensino_graduacao}
              />
              <div>
                <TextInput
                  w={180}
                  title="Ano de Conclusão Graduação"
                  {...register('ano_conclusao_graduacao')}
                  defaultValue={data.ano_conclusao_graduacao}
                />
              </div>
            </Box>
            <Box>
              {/* <TextInput
                title="Data Início Especialização"
                {...register('data_inicio_especializacao')}
              /> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '30rem' }}
              >
                <Text>Data Início Especialização</Text>

                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('dayInicioEspec')}
                  defaultValue={{ label: dataInicio.dia }}
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthInicioEspec')}
                  defaultValue={{ label: dataInicio.mes }}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearInicioEspec')}
                  defaultValue={{ label: dataInicio.ano }}
                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>

              {/* <TextInput
                title="Data Previsão Conclusão"
                {...register('data_previsao_conclusao')}
              /> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '30rem' }}
              >
                <Text>Data Previsão Conclusão</Text>

                <SelectOptions
                  description="Dia"
                  data={dataDays}
                  w={90}
                  {...register('dayPrevConcl')}
                  defaultValue={{ label: dataPrevisao.dia }}

                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthPrevConcl')}
                  defaultValue={{ label: dataPrevisao.mes }}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearPrevConcl')}
                  defaultValue={{ label: dataPrevisao.ano }}

                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Endereço</h2>
            </legend>

            <Box>
              <div>
                {/* <TextInput
                  title="Cep *"
                  w={110}
                  {...register('cep')}
                  mask={'99999-999'}
                /> */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <TextInput
                    w={110}
                    title="Cep *"
                    {...register('cep')}
                    mask="99999-999"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      handleCheckCep(cepValue)
                    }}
                    title="Buscar"
                    style={{ margin: '0px', width: '100%', fontSize: '12px' }}
                  />
                </div>
              </div>

              <TextInput
                disabled={disableCamposCepInvalido}
                title="Logradouro *"
                {...register('logradouro')}
                defaultValue={data.logradouro}
              />
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={90}
                  title="Número *"
                  {...register('numero', {
                    valueAsNumber: true,
                  })}
                  defaultValue={data.numero}
                />
              </div>
              <TextInput
                disabled={disableCamposCepInvalido}
                title="Complemento"
                {...register('complemento')}
                defaultValue={data.complemento}
              />
            </Box>

            <Box>
              <TextInput
                disabled={disableCamposCepInvalido}
                title="Bairro *"
                {...register('bairro')}
                defaultValue={data.bairro}
              />
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={220}
                  title="Cidade *"
                  {...register('cidade')}
                  defaultValue={data.cidade}
                />
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={50}
                  title="UF *"
                  {...register('uf')}
                  defaultValue={data.uf}
                />
              </div>
              <div>
                <SelectOptions
                  data={dataPais}
                  defaultValue={data.pais}
                  w={260}
                  description="País *"
                  {...register('pais')}
                />
              </div>
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={140}
                  title="Telefone Celular"
                  mask={'(99) 9.9999-9999'}
                  {...register('telefone_celular')}
                />
              </div>
              <div>
                <TextInput
                  w={140}
                  title="Telefone Residencial"
                  mask={'(99) 9999-9999'}
                  {...register('telefone_residencial')}
                />
              </div>
              <TextInput
                w={300}
                title="Email"
                {...register('email')}
                defaultValue={data.email}
              />
            </Box>
          </fieldset>
          <Button
            type="submit"
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
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
    const data = await prisma.associados.findFirst({
      where: {
        id: Number(id),
      },
    })
    const convertBigIntToString = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
          obj[key] = obj[key].toString()
        }
        if (obj[key] instanceof Date) {
          obj[key] = format(obj[key], 'yyyy-MM-dd') // ou o formato desejado
        }
      }
      return obj
    }

    const categoriaAssociado = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
      },
    })
    const dataCategoria = categoriaAssociado.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    const situacao = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Situação_Associado',
      },
    })
    const dataSituacao = situacao.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    const pais = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Pais',
      },
    })

    const dataPais = pais.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    return {
      props: {
        data: convertBigIntToString(data),
        dataCategoria,
        dataSituacao,
        dataPais,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
        dataCategoria: [],
        dataSituacao: [],
        dataPais: [],
      },
    }
  }
}
