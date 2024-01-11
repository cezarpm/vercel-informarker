/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Container, Text } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { SelectOptions } from '@/components/SelectOptions'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useArrayDate } from '@/utils/useArrayDate'
import SelectNoComplete from '@/components/SelectNoComplete'
import axios from 'axios'

const schemaParams = z.object({
  numero_proposta_SBA: z.number(),
  matricula_SAERJ: z.number(),
  matricula_SBA: z.number(),
  situacao: z.string(),
  uf_crm: z.string(),
  crm: z.number(),
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

type SchemaParametros = z.infer<typeof schemaParams>

interface schemaParametrosProps {
  data: any
  dataCategoria: any
  dataSituacao: any
  dataPais: any
}
export default function AssociadosCadastro({
  data,
  dataCategoria,
  dataSituacao,
  dataPais,
}: schemaParametrosProps) {
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposCepInvalido, setDisableCamposCepInvalido] =
    useState(false)
  const router = useRouter()
  const dataAssociados = data[0]

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaParametros>()
  const cepValue = watch('cep')

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

  async function handleOnSubmit(data: SchemaParametros) {
    try {
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
      // console.log(dataNascimento, dataInicioEspecializacao, dataPrevisaoConclusao)
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
      console.log(newData)

      await api.post('/associados/cadastro', {
        ...newData,
        data_nascimento: dataNascimento,
        data_inicio_especializacao: dataInicioEspecializacao,
        data_previsao_conclusao: dataPrevisaoConclusao,
      })
      toast.success('Associado cadastrado')
      // router.push('/associados')
    } catch (error) {
      console.log(error)
      toast.error('Oops algo deu errado...')
    }
  }
  useEffect(() => {
    setDisableCamposCepInvalido(false)
    handleGetAllParams()
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
            <span>Incluir</span>
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
                  {...register('numero_proposta_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <div>
                <TextInput
                  w={180}
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
                  {...register('matricula_SBA', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <SelectOptions
                w={260}
                data={dataCategoria}
                description="Categoria"
                // data={() => []}
                {...register('categoria')}
              />
            </Box>

            <Box>
              <TextInput
                title="Residencia MEC-CNRM"
                {...register('residencia_mec_cnrm')}
              />
              <TextInput
                title="Nível Residencia"
                {...register('nivel_residencia')}
              />
              <TextInput
                title="Nome Hospital MEC"
                {...register('nome_hospital_mec')}
              />
              <TextInput title="UF PRM" {...register('uf_prm')} />
              <TextInput
                title="Comprovante Endereço"
                {...register('comprovante_endereco')}
              />
              <TextInput
                title="Carta Indicação 2 membros"
                {...register('carta_indicacao_2_membros')}
              />
              <TextInput
                title="Declaração Hospital"
                {...register('declaracao_hospital')}
              />
            </Box>

            <Box>
              <TextInput
                title="Diploma Medicina"
                {...register('diploma_medicina')}
              />

              <TextInput
                title="Certidão Quitação CRM"
                {...register('certidao_quitacao_crm')}
              />
              <div>
                <TextInput
                  w={220}
                  title="Certificado Conclusão Especialização"
                  {...register('certificado_conclusao_especializacao')}
                />
              </div>
              <TextInput
                title="Declaro Verdadeiras"
                {...register('declaro_verdadeiras')}
              />
              <TextInput
                title="Declaro Quite SAERJ"
                {...register('declaro_quite_SAERJ')}
              />
              <TextInput
                title="Pendências SERJ"
                {...register('pendencias_SAERJ')}
              />
              <div>
                <TextInput
                  w={180}
                  title="Nome Presidente Regional"
                  {...register('nome_presidente_regional')}
                />
              </div>
              <TextInput
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
              <TextInput title="Nome Completo" {...register('nome_completo')} />
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
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthNasc')}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearNasc')}
                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
            </Box>

            <Box>
              <TextInput
                title="Nome Profissional"
                {...register('nome_profissional')}
              />
              <div>
                <TextInput w={100} title="Sexo" {...register('sexo')} />
              </div>
              <div>
                <SelectOptions
                  w={200}
                  description="Situação"
                  data={dataSituacao}
                  {...register('situacao')}
                />
              </div>
              <div>
                <TextInput w={100} title="UF CRM" {...register('uf_crm')} />
              </div>

              <div>
                <TextInput w={180} title="CRM" {...register('crm')} />
              </div>
            </Box>

            <Box>
              <TextInput
                title="Nome Instituição de Ensino Graduação"
                {...register('nome_instituicao_ensino_graduacao')}
              />
              <div>
                <TextInput
                  w={180}
                  title="Ano de Conclusão Graduação"
                  {...register('ano_conclusao_graduacao')}
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
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthInicioEspec')}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearInicioEspec')}
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
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  data={dataMonths}
                  description="Mês"
                  w={90}
                  {...register('monthPrevConcl')}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={dataYears}
                  {...register('yearPrevConcl')}
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
                    helperText={errors.cep?.message}
                    error={!!errors.cep?.message}
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
              />
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={90}
                  title="Número *"
                  {...register('numero', {
                    valueAsNumber: true,
                  })}
                />
              </div>
              <TextInput
                disabled={disableCamposCepInvalido}
                title="Complemento"
                {...register('complemento')}
              />
            </Box>

            <Box>
              <TextInput
                disabled={disableCamposCepInvalido}
                title="Bairro *"
                {...register('bairro')}
              />
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={220}
                  title="Cidade *"
                  {...register('cidade')}
                />
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={50}
                  title="UF *"
                  {...register('uf')}
                />
              </div>
              <div>
                <SelectOptions
                  data={dataPais}
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
              <TextInput w={300} title="Email" {...register('email')} />
            </Box>
          </fieldset>

          <Button
            type="submit"
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
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
        data: [],
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
        newDataCategory: [],
      },
    }
  }
}
