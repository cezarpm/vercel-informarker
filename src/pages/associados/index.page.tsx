import { Box, Container, Text } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { SelectOptions } from '@/components/SelectOptions'
import { CaretRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'

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

  data_nascimento: z.string(),
  data_inicio_especializacao: z.string(),
  data_previsao_conclusao: z.string(),
})

type SchemaParametros = z.infer<typeof schemaParams>

interface schemaParametrosProps {
  data: any
}
export default function Associados({ data }: schemaParametrosProps) {
  const router = useRouter()
  const dataAssociados = data[0]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaParametros>()

  function DateDestructure(newDate: any) {
    const dia = newDate.getUTCDate().toString()
    const mes = (newDate.getUTCMonth() + 1).toString()
    const ano = newDate.getUTCFullYear().toString()

    return { dia, mes, ano }
  }

  async function handleOnSubmit(data: SchemaParametros) {
    try {
      await api.put('/associados/update', { ...data })
      alert('atualizado')
    } catch (error) {
      console.log(error)
      alert('erro')
    }
  }

  const dateInicioEspecializacao = new Date(
    dataAssociados.data_inicio_especializacao,
  )
  const dateNascimento = new Date(dataAssociados.data_nascimento)
  const datePrevisaoConclusao = new Date(dataAssociados.data_previsao_conclusao)
  useEffect(() => {
    setValue(
      'data_inicio_especializacao',
      DateDestructure(dateInicioEspecializacao).ano,
    )
    setValue('data_nascimento', DateDestructure(dateNascimento).ano)
    setValue(
      'data_previsao_conclusao',
      DateDestructure(datePrevisaoConclusao).ano,
    )
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <Link href="/parametros">Parametros</Link>
            <CaretRight size={14} />
            <span>Associados</span>
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
              <TextInput
                title="Número proposta SBA"
                {...register('numero_proposta_SBA', {
                  valueAsNumber: true,
                })}
                defaultValue={dataAssociados.numero_proposta_SBA}
              />
              <TextInput
                title="Matrícula SAERJ"
                {...register('matricula_SAERJ', {
                  valueAsNumber: true,
                })}
                defaultValue={dataAssociados.matricula_SAERJ}
              />

              <TextInput
                title="Matrícula SBA"
                {...register('matricula_SBA', {
                  valueAsNumber: true,
                })}
                defaultValue={dataAssociados.matricula_SBA}
              />
              <TextInput
                title="Categoria"
                {...register('categoria')}
                defaultValue={dataAssociados.categoria}
              />
            </Box>

            <Box>
              <TextInput
                title="Residencia MEC-CNRM"
                {...register('residencia_mec_cnrm')}
                defaultValue={dataAssociados.residencia_mec_cnrm}
              />
              <TextInput
                title="Nível Residencia"
                {...register('nivel_residencia')}
                defaultValue={dataAssociados.nivel_residencia}
              />
              <TextInput
                title="Nome Hospital MEC"
                {...register('nome_hospital_mec')}
                defaultValue={dataAssociados.nome_hospital_mec}
              />
              <TextInput
                title="UF PRM"
                {...register('uf_prm')}
                defaultValue={dataAssociados.uf_prm}
              />
              <TextInput
                title="Comprovante Endereço"
                {...register('comprovante_endereco')}
                defaultValue={dataAssociados.comprovante_endereco}
              />
              <TextInput
                title="Carta Indicação 2 membros"
                {...register('carta_indicacao_2_membros')}
                defaultValue={dataAssociados.carta_indicacao_2_membros}
              />
              <TextInput
                title="Declaração Hospital"
                {...register('declaracao_hospital')}
                defaultValue={dataAssociados.declaracao_hospital}
              />
            </Box>

            <Box>
              <TextInput
                title="Diploma Medicina"
                {...register('diploma_medicina')}
                defaultValue={dataAssociados.diploma_medicina}
              />

              <TextInput
                title="Certidão Quitação CRM"
                {...register('certidao_quitacao_crm')}
                defaultValue={dataAssociados.certidao_quitacao_crm}
              />
              <TextInput
                title="Certificado Conclusão Especialização"
                {...register('certificado_conclusao_especializacao')}
                defaultValue={
                  dataAssociados.certificado_conclusao_especializacao
                }
              />
              <TextInput
                title="Declaro Verdadeiras"
                {...register('declaro_verdadeiras')}
                defaultValue={dataAssociados.declaro_verdadeiras}
              />
              <TextInput
                title="Declaro Quite SAERJ"
                {...register('declaro_quite_SAERJ')}
                defaultValue={dataAssociados.declaro_quite_SAERJ}
              />
              <TextInput
                title="Pendências SERJ"
                {...register('pendencias_SAERJ')}
                defaultValue={dataAssociados.pendencias_SAERJ}
              />
              <TextInput
                title="Nome Presidente Regional"
                {...register('nome_presidente_regional')}
                defaultValue={dataAssociados.nome_presidente_regional}
              />
              <TextInput
                title="Sigla Regional"
                {...register('sigla_regional')}
                defaultValue={dataAssociados.sigla_regional}
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
                title="Nome Completo"
                {...register('nome_completo')}
                defaultValue={dataAssociados.nome_completo}
              />
              <TextInput
                title="CPF"
                {...register('cpf')}
                defaultValue={dataAssociados.cpf}
              />

              <TextInput
                title="Data nascimento"
                {...register('data_nascimento')}
                defaultValue={dataAssociados.data_nascimento}
              />
            </Box>

            <Box>
              <TextInput
                title="Nome Profissional"
                {...register('nome_profissional')}
                defaultValue={dataAssociados.nome_profissional}
              />
              <TextInput
                title="Sexo"
                {...register('sexo')}
                defaultValue={dataAssociados.sexo}
              />
              <TextInput
                w={440}
                title="Situação"
                {...register('situacao')}
                defaultValue={dataAssociados.situacao}
              />
              <TextInput
                title="UF CRM"
                {...register('uf_crm')}
                defaultValue={dataAssociados.uf_crm}
              />
              <TextInput
                title="CRM"
                {...register('crm', {
                  valueAsNumber: true,
                })}
                defaultValue={dataAssociados.crm}
              />
            </Box>

            <Box>
              <TextInput
                title="Nome Instituição de Ensino Graduação"
                {...register('nome_instituicao_ensino_graduacao')}
                defaultValue={dataAssociados.nome_instituicao_ensino_graduacao}
              />
              <TextInput
                title="Ano de Conclusão Graduação"
                {...register('ano_conclusao_graduacao')}
                defaultValue={dataAssociados.ano_conclusao_graduacao}
              />
            </Box>
            <Box>
              <TextInput
                title="Data Início Especialização"
                {...register('data_inicio_especializacao')}
                defaultValue={dataAssociados.data_inicio_especializacao}
              />

              <TextInput
                title="Data Previsão Conclusão"
                {...register('data_previsao_conclusao')}
                defaultValue={dataAssociados.data_previsao_conclusao}
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
              <h2>Endereço</h2>
            </legend>

            <Box>
              <TextInput
                title="Cep *"
                {...register('cep')}
                defaultValue={dataAssociados.cep}
              />

              <TextInput
                w={'100%'}
                title="Logradouro *"
                {...register('logradouro')}
                defaultValue={dataAssociados.logradouro}
              />
              <TextInput
                title="Número *"
                {...(register('numero'),
                {
                  valueAsNumber: true,
                })}
                defaultValue={dataAssociados.numero}
              />

              <TextInput
                title="Complemento"
                {...register('complemento')}
                defaultValue={dataAssociados.complemento}
              />
            </Box>

            <Box>
              <TextInput
                title="Bairro *"
                {...register('bairro')}
                defaultValue={dataAssociados.bairro}
              />

              <TextInput
                title="Cidade *"
                {...register('cidade')}
                defaultValue={dataAssociados.cidade}
              />

              <TextInput
                title="UF *"
                {...register('uf')}
                defaultValue={dataAssociados.uf}
              />

              <TextInput
                title="País *"
                {...register('pais')}
                defaultValue={dataAssociados.pais}
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
              <h2>Contato</h2>
            </legend>

            <Box>
              <TextInput
                title="Telefone Celular"
                {...register('telefone_celular')}
                defaultValue={dataAssociados.telefone_celular}
              />

              <TextInput
                title="Telefone Residencial"
                {...register('telefone_residencial')}
                defaultValue={dataAssociados.telefone_residencial}
              />

              <TextInput
                title="Email"
                {...register('email')}
                defaultValue={dataAssociados.email}
              />
            </Box>
          </fieldset>

          <Button
            disabled={isSubmitting}
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const newData = await prisma.associados.findMany({
      where: {
        id: 1,
      },
    })

    const data = newData?.map((item) => {
      let convertBigInt = null

      if (item.numero_proposta_SBA) {
        convertBigInt = item.numero_proposta_SBA.toString()
      }
      return {
        ...item,
        numero_proposta_SBA: convertBigInt,
      }
    })

    return {
      props: {
        data,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
