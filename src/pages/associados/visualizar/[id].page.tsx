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
import { format } from 'date-fns'

const schemaAssociados = z.object({
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
    crm: number
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
}
export default function AssociadosCadastro({ data }: schemaAssociados) {
  const router = useRouter()

  const dataInicio = useArrayDate.DesestruturarDate(
    data.data_inicio_especializacao,
  )
  const dataPrevisao = useArrayDate.DesestruturarDate(
    data.data_previsao_conclusao,
  )
  const dataNascimento = useArrayDate.DesestruturarDate(data.data_nascimento)

  return (
    <Container>
      <form>
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
            <span>Vizualizar</span>
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
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  defaultValue={data.matricula_SAERJ}
                  title="Matrícula SAERJ"
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SBA"
                  defaultValue={data.matricula_SBA}
                />
              </div>
              <TextInput
                w={260}
                title="Categoria"
                defaultValue={data.categoria}
                // data={() => []}
              />
            </Box>

            <Box>
              <TextInput
                title="Residencia MEC-CNRM"
                defaultValue={data.residencia_mec_cnrm}
              />
              <TextInput
                title="Nível Residencia"
                defaultValue={data.nivel_residencia}
              />
              <TextInput
                defaultValue={data.nome_hospital_mec}
                title="Nome Hospital MEC"
              />
              <TextInput title="UF PRM" defaultValue={data.uf_prm} />
              <TextInput
                defaultValue={data.comprovante_endereco}
                title="Comprovante Endereço"
              />
              <TextInput
                defaultValue={data.carta_indicacao_2_membros}
                title="Carta Indicação 2 membros"
              />
              <TextInput
                defaultValue={data.declaracao_hospital}
                title="Declaração Hospital"
              />
            </Box>

            <Box>
              <TextInput
                defaultValue={data.diploma_medicina}
                title="Diploma Medicina"
              />

              <TextInput
                defaultValue={data.certidao_quitacao_crm}
                title="Certidão Quitação CRM"
              />
              <div>
                <TextInput
                  w={220}
                  defaultValue={data.certificado_conclusao_especializacao}
                  title="Certificado Conclusão Especialização"
                />
              </div>
              <TextInput
                defaultValue={data.declaro_verdadeiras}
                title="Declaro Verdadeiras"
              />
              <TextInput
                defaultValue={data.declaro_quite_SAERJ}
                title="Declaro Quite SAERJ"
              />
              <TextInput
                title="Pendências SERJ"
                defaultValue={data.pendencias_SAERJ}
              />
              <div>
                <TextInput
                  w={180}
                  defaultValue={data.nome_presidente_regional}
                  title="Nome Presidente Regional"
                />
              </div>
              <TextInput
                defaultValue={data.sigla_regional}
                title="Sigla Regional"
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
              />
              <div>
                <TextInput
                  w={140}
                  value={data.cpf}
                  title="CPF"
                  mask={'999.999.999-99'}
                />
              </div>
              <div>
                <TextInput
                  w={220}
                  defaultValue={data.comprovante_cpf}
                  title="Comprovante CPF"
                />
              </div>

              {/* <div>
                <TextInput
                  title="Data nascimento"
                 
                />
              </div> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '28rem' }}
              >
                <Text>Data Nascimento</Text>

                <SelectOptions
                  description="Dia"
                  w={90}
                  data={useArrayDate.Dia()}
                  defaultValue={{ label: dataNascimento.dia }}
                />

                <SelectOptions
                  description="Mês"
                  w={90}
                  data={useArrayDate.Mes()}
                  defaultValue={{ label: dataNascimento.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={useArrayDate.AnoAtualMenor()}
                  defaultValue={{ label: dataNascimento.ano }}
                />
              </div>
            </Box>

            <Box>
              <TextInput
                title="Nome Profissional"
                defaultValue={data.nome_profissional}
              />
              <div>
                <TextInput w={100} title="Sexo" defaultValue={data.sexo} />
              </div>
              <div>
                <TextInput
                  w={200}
                  title="Situação"
                  defaultValue={data.situacao}
                />
              </div>
              <div>
                <TextInput w={100} title="UF CRM" defaultValue={data.uf_crm} />
              </div>

              <div>
                <TextInput w={180} title="CRM" defaultValue={data.crm} />
              </div>
            </Box>

            <Box>
              <TextInput
                defaultValue={data.nome_instituicao_ensino_graduacao}
                title="Nome Instituição de Ensino Graduação"
              />
              <div>
                <TextInput
                  w={180}
                  title="Ano de Conclusão Graduação"
                  defaultValue={data.ano_conclusao_graduacao}
                />
              </div>
            </Box>
            <Box>
              {/* <TextInput
                title="Data Início Especialização"
               
              /> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '30rem' }}
              >
                <Text>Data Início Especialização</Text>

                <SelectOptions
                  description="Dia"
                  data={useArrayDate.Dia()}
                  w={90}
                  defaultValue={{ label: dataInicio.dia }}
                />

                <SelectOptions
                  data={useArrayDate.Mes()}
                  description="Mês"
                  w={90}
                  defaultValue={{ label: dataInicio.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={useArrayDate.AnoAtualMenor()}
                  defaultValue={{ label: dataInicio.ano }}
                />
              </div>

              {/* <TextInput
                title="Data Previsão Conclusão"
               
              /> */}

              <div
                style={{ display: 'flex', alignItems: 'end', width: '30rem' }}
              >
                <Text>Data Previsão Conclusão</Text>

                <SelectOptions
                  description="Dia"
                  data={useArrayDate.Dia()}
                  w={90}
                  defaultValue={{ label: dataPrevisao.dia }}
                />

                <SelectOptions
                  data={useArrayDate.Mes()}
                  description="Mês"
                  w={90}
                  defaultValue={{ label: dataPrevisao.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  data={useArrayDate.AnoAtualMaior()}
                  defaultValue={{ label: dataPrevisao.ano }}
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
                    value={data.cep}
                    mask="99999-999"
                  />
                </div>
              </div>

              <TextInput title="Logradouro *" defaultValue={data.logradouro} />
              <div>
                <TextInput w={90} title="Número *" defaultValue={data.numero} />
              </div>
              <TextInput title="Complemento" defaultValue={data.complemento} />
            </Box>

            <Box>
              <TextInput title="Bairro *" defaultValue={data.bairro} />
              <div>
                <TextInput
                  w={220}
                  title="Cidade *"
                  defaultValue={data.cidade}
                />
              </div>
              <div>
                <TextInput w={50} title="UF *" defaultValue={data.uf} />
              </div>
              <div>
                <TextInput defaultValue={data.pais} w={260} title="País *" />
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
                  value={data.telefone_celular}
                  title="Telefone Celular"
                  mask={'(99) 9.9999-9999'}
                />
              </div>
              <div>
                <TextInput
                  w={140}
                  title="Telefone Residencial"
                  value={data.telefone_residencial}
                  mask={'(99) 9999-9999'}
                />
              </div>
              <TextInput w={300} title="Email" defaultValue={data.email} />
            </Box>
          </fieldset>
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
    // const convertBigIntToString = (obj: any) => {
    //   for (const key in obj)
    //     typeof obj[key] === 'bigint' && (obj[key] = obj[key].toString())
    //   return obj
    // }

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

    return {
      props: {
        data: convertBigIntToString(data),
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
