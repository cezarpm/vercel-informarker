/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Container,
  Text,
  Fieldset,
  ContainerInputFile,
  ContentInputFile,
  FormError,
} from './styled'
import React, { Suspense, useEffect, useState } from 'react'
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
import Checkbox from '@mui/material/Checkbox'
import SelectNoComplete from '@/components/SelectNoComplete'
import { useArrayUfBrasil } from '@/utils/useArrayUfBrasil'
import { BackPage } from '@/components/BackPage'
import { schemaCadastro } from './schemaCadastro'
import { zodResolver } from '@hookform/resolvers/zod'
import { SwitchInput } from '@/components/SwitchInput'

type SchemaCadastro = z.infer<typeof schemaCadastro>

interface schemaParametrosProps {
  dataCategoria: any
  dataSituacao: any
  dataPais: any
  dataNivelResidencia: any
}

export default function AssociadosCadastro({
  dataCategoria,
  dataSituacao,
  dataPais,
  dataNivelResidencia,
}: schemaParametrosProps) {
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposCepInvalido, setDisableCamposCepInvalido] =
    useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
  })

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMenor()

  const cepValue = watch('cep')

  const checkEmailValidade = watch('confirmarEmail')
  const checkEmail = watch('email')

  const checkCategoria = watch('categoria')

  const nomeArquivoComprovanteCpf = watch('comprovante_cpf')
  const nomeArquivoComprovanteEndereco = watch('comprovante_endereco')
  const nomeArquivoCartaIndicacao2Membros = watch('carta_indicacao_2_membros')
  const nomeArquivoCertidaoQuitacaoCrm = watch('certidao_quitacao_crm')
  const nomeArquivoCertificadoConclusaoEspecializacao = watch(
    'certificado_conclusao_especializacao',
  )
  const nomeArquivoDeclaracaoHospital = watch('declaracao_hospital')
  const nomeArquivoDiplomaMedicina = watch('diploma_medicina')

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

  async function handleOnSubmit(data: SchemaCadastro) {
    console.log(data)
    try {
      let dataNascimento
      let dataInicioEspecializacao
      let dataPrevisaoConclusao

      if (data.yearNasc && data.monthNasc && data.dayNasc) {
        dataNascimento = useArrayDate.MontarDate(
          data.yearNasc,
          data.monthNasc,
          data.dayNasc,
        )
      }

      if (
        data.yearInicioEspec &&
        data.monthInicioEspec &&
        data.dayInicioEspec
      ) {
        dataInicioEspecializacao = useArrayDate.MontarDate(
          data.yearInicioEspec,
          data.monthInicioEspec,
          data.dayInicioEspec,
        )
      }

      if (data.yearPrevConcl && data.monthPrevConcl && data.dayPrevConcl) {
        dataPrevisaoConclusao = useArrayDate.MontarDate(
          data.yearPrevConcl,
          data.monthPrevConcl,
          data.dayPrevConcl,
        )
      }

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
        confirmarEmail,
        ...newData
      } = data

      const formData = new FormData()
      formData.append('comprovante_cpf', data.comprovante_cpf[0])
      formData.append('comprovante_endereco', data.comprovante_endereco[0])
      formData.append(
        'carta_indicacao_2_membros',
        data.carta_indicacao_2_membros[0],
      )
      formData.append('certidao_quitacao_crm', data.certidao_quitacao_crm[0])
      formData.append(
        'certificado_conclusao_especializacao',
        data.certificado_conclusao_especializacao[0],
      )

      formData.append('declaracao_hospital', data.declaracao_hospital[0])
      formData.append('diploma_medicina', data.diploma_medicina[0])

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(
        newData,
        dataNascimento,
        dataInicioEspecializacao,
        dataPrevisaoConclusao,
        response.data.names_arquivos,
      )

      await api.post('/associados/cadastro', {
        ...newData,
        residencia_mec_cnrm: String(data.residencia_mec_cnrm),
        declaro_quite_SAERJ: String(data.declaro_quite_SAERJ),
        declaro_verdadeiras: String(data.declaro_verdadeiras),
        comprovante_cpf: await response.data.names_arquivos[0],
        comprovante_endereco: await response.data.names_arquivos[1],
        carta_indicacao_2_membros: await response.data.names_arquivos[2],
        certidao_quitacao_crm: await response.data.names_arquivos[3],
        certificado_conclusao_especializacao:
          await response.data.names_arquivos[4],
        declaracao_hospital: await response.data.names_arquivos[5],
        diploma_medicina: await response.data.names_arquivos[6],
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

  function valuesInitial() {
    setValue('numero', 0)
    setValue('numero_proposta_SBA', 0)
    setValue('matricula_SAERJ', 0)
    setValue('matricula_SBA', 0)
    setValue('cpf', '')
  }

  const arraySexo = [
    {
      label: 'Masculino',
    },
    {
      label: 'Feminino',
    },
  ]

  useEffect(() => {
    setDisableCamposCepInvalido(false)
    handleGetAllParams()
    valuesInitial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <span>Criar sua conta de associado</span>
          </legend>

          <Fieldset>
            <legend>
              <h2>Dados de contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Celular"
                  mask={'(99) 9.9999-9999'}
                  {...register('telefone_celular')}
                  error={!!errors?.telefone_celular?.message}
                  helperText={errors?.telefone_celular?.message}
                />
              </div>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Residencial"
                  mask={'(99) 9999-9999'}
                  {...register('telefone_residencial')}
                />
              </div>
              <TextInput
                type="email"
                title="Email"
                {...register('email')}
                error={!!errors?.email?.message}
                helperText={errors?.email?.message}
              />
              {checkEmail === checkEmailValidade ? (
                <>
                  <TextInput
                    title="Confirmação email"
                    {...register('confirmarEmail')}
                  />
                </>
              ) : (
                <TextInput
                  title="Confirmação email"
                  {...register('confirmarEmail')}
                  error
                  helperText={'Email não confere'}
                />
              )}
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de endereço</h2>
            </legend>
            <Box>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <TextInput
                    w={150}
                    title="Cep *"
                    {...register('cep')}
                    mask="99999-999"
                    helperText={errors?.cep?.message}
                    error={!!errors?.cep?.message}
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

              <div>
                <SelectOptions
                  data={dataPais}
                  w={260}
                  description="País onde reside *"
                  {...register('pais')}
                />
                <FormError>{errors?.pais?.message}</FormError>
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={100}
                  title="UF *"
                  {...register('uf')}
                  error={!!errors?.uf?.message}
                  helperText={errors?.uf?.message}
                />
              </div>
              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={350}
                  title="Cidade *"
                  {...register('cidade')}
                  error={!!errors?.cidade?.message}
                  helperText={errors?.cidade?.message}
                />
              </div>

              <div>
                <TextInput
                  w={200}
                  disabled={disableCamposCepInvalido}
                  title="Bairro *"
                  {...register('bairro')}
                  error={!!errors?.bairro?.message}
                  helperText={errors?.bairro?.message}
                />
              </div>
            </Box>
            <Box>
              <div>
                <TextInput
                  w={400}
                  disabled={disableCamposCepInvalido}
                  title="Logradouro *"
                  {...register('logradouro')}
                  error={!!errors?.logradouro?.message}
                  helperText={errors?.logradouro?.message}
                />
              </div>

              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  w={90}
                  title="Número *"
                  {...register('numero', {
                    valueAsNumber: true,
                  })}
                  error={!!errors?.numero?.message}
                  helperText={errors?.numero?.message}
                />
              </div>

              <div>
                <TextInput
                  disabled={disableCamposCepInvalido}
                  title="Complemento *"
                  w={400}
                  {...register('complemento')}
                />
              </div>
            </Box>
          </Fieldset>



          <Button
            type="submit"
            title={isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataCategoria = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
      },
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

    const nivelResidencia = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Nivel_Residencia',
      },
    })
    const dataNivelResidencia = nivelResidencia.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    return {
      props: {
        dataCategoria,
        dataSituacao,
        dataPais,
        dataNivelResidencia,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        dataCategoria: [],
        dataSituacao: [],
        dataPais: [],
        dataNivelResidencia: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
