import { Container, Box } from './styled'
import React from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'

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
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface schemaEmpresasProps {
  data: SchemaEmpresaForm
}
export default function Vizualizar({ data }: schemaEmpresasProps) {
  return (
    <Container>
      <form>
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

            <TextInput title="Nome Fantasia" value={data.nome_fantasia} />
            <div style={{ width: '15%' }}>
              <TextInput title="CNPJ" value={data.cnpj} />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                type="text"
                title="Telefone Comercial"
                value={data.telefone_comercial}
              />
            </div>
          </Box>

          <Box>
            <TextInput title="Razao Social" value={data.razao_social} />

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
            <div style={{ width: '7%' }}>
              <TextInput type="number" title="CEP" value={data.cep} />
            </div>

            <TextInput title="Logadouro" value={data.logradouro} />
            <TextInput title="Logadouro" value={data.complemento} />
            <div style={{ width: '8%' }}>
              <TextInput type="number" title="Numero" value={data.numero} />
            </div>
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
              />
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
