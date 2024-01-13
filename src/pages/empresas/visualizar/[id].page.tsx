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

const schemaEmpresaForm = z.object({
  id: z.number(),
  cod_empresa: z.string(),
  tipo_empresa: z.string(),
  patrocinadora: z.boolean(),
  faculdade_anestesiologia: z.boolean(),
  empresa_ativa: z.boolean(),
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
  cep: z.number(),
  logradouro: z.string(),
  numero: z.number(),
  complemento: z.string(),
  cidade: z.string(),
  pais: z.string(),
  bairro: z.string(),
  uf: z.string(),
  telefone_comercial: z.string(),
  tratamento_contato_primario: z.string(),
  nome_contato_primario: z.string(),
  cargo_contato_primario: z.string(),
  email_contato_primario: z.string(),
  telefone_contato_primario: z.string(),
  tratamento_contato_secundario: z.string(),
  nome_contato_secundario: z.string(),
  cargo_contato_secundario: z.string(),
  email_contato_secundario: z.string(),
  telefone_contato_secundario: z.string(),

  home_page: z.string(),
  inscricao_estadual: z.string(),
  inscricao_municipal: z.string(),
  observacoes: z.string(),
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
          <Link
            href="/empresas"
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
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput title="Codigo Empresa" value={data.cod_empresa} />
            </div>
            <TextInput title="Tipo Empresa" w={280} value={data.tipo_empresa} />

            <SwitchInput
              title="Patrocinadora?"
              defaultChecked={data.patrocinadora}
            />

            <SwitchInput
              title="Faculdade Anestesiologia?"
              defaultChecked={data.faculdade_anestesiologia}
            />
            <SwitchInput
              title="Empresa Ativa?"
              defaultChecked={data.empresa_ativa}
            />
          </Box>

          <Box>
            <div style={{ width: '15%' }}>
              <TextInput
                title="CNPJ"
                value={data.cnpj}
                mask="99.999.999/9999-99"
              />
            </div>
            <TextInput title="Razao Social" value={data.razao_social} />
            <TextInput title="Nome Fantasia" value={data.nome_fantasia} />
            <div>
              <TextInput
                title="Inscrição Estadual"
                value={data.inscricao_estadual}
                w="100"
              />
            </div>
            <div>
              <TextInput
                w="100"
                title="Inscrição Municipal"
                value={data.inscricao_municipal}
              />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput title="CEP" value={data.cep} mask="99999-999" />
            </div>

            <TextInput title="Logadouro" value={data.logradouro} />
            <div style={{ width: '8%' }}>
              <TextInput title="Número" value={data.numero} />
            </div>
            <TextInput title="Complemento" value={data.complemento} />
          </Box>

          <Box>
            <div>
              <TextInput w={450} title="Bairro" value={data.bairro} />
            </div>

            <TextInput title="Cidade" value={data.cidade} />

            <div>
              <TextInput w={35} title="UF" value={data.uf} />
            </div>

            <div>
              <TextInput title="País" w={140} value={data.pais} />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                type="text"
                title="Telefone Comercial"
                value={data.telefone_comercial}
                mask="(99) 9999-9999"
              />
            </div>
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Primario"
              value={data.nome_contato_primario}
            />
            <TextInput
              title="Tratamento"
              value={data.tratamento_contato_primario}
            />
            <TextInput title="Cargo" value={data.cargo_contato_primario} />
          </Box>

          <Box>
            <div>
              <TextInput
                type="email"
                title="Email"
                value={data.email_contato_primario}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                value={data.telefone_contato_primario}
                mask="(99) 9.9999-9999"
              />
            </div>
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Secundario"
              value={data.nome_contato_secundario}
            />

            <TextInput
              title="Tratamento"
              value={data.tratamento_contato_secundario}
            />
            <TextInput title="Cargo" value={data.cargo_contato_secundario} />
          </Box>
          <Box>
            <div>
              <TextInput
                type="email"
                title="Email"
                value={data.email_contato_secundario}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                value={data.telefone_contato_secundario}
                mask="(99) 9.9999-9999"
              />
            </div>
          </Box>
          <TextInput title="Home Page" value={data.home_page} />
          <Box>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Roboto',
                fontSize: '12px',
                color: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
              }}
            >
              Observações
              <TextAreaInput defaultValue={data.observacoes} />
            </label>
          </Box>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.empresa.findFirst({
      where: {
        id: Number(id),
      },
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
