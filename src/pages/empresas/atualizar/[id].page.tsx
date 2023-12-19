import { Container, Box } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { SelectOptions } from '@/components/SelectOptions'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

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

export default function Vizualizar({
  data,
  dataTipoEmpresa,
  dataPais,
  dataCargo,
  dataTratamento,
}: any) {
  const router = useRouter()
  async function OnSubmit(data: any) {
    console.log(data)
    try {
      await api.put('/empresa/update', { ...data })
      toast.success('Empresa atualizada!')
      router.push('/empresas')
    } catch (error) {
      console.log(error)
    }
  }
  const newDataTipoEmpresa = dataTipoEmpresa?.map((item: any) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataPais = dataPais?.map((item: any) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataCargo = dataCargo?.map((item: any) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataTratamento = dataTratamento?.map((item: any) => {
    return {
      label: item.name,
      id: item.id,
    }
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaEmpresaForm>()

  useEffect(() => {
    setValue('id', data.id)
    setValue('cod_empresa', data.cod_empresa)
    setValue('cod_empresa', data.cod_empresa)
    setValue('nome_fantasia', data.nome_fantasia)
    setValue('cnpj', data.cnpj)
    setValue('telefone_comercial', data.telefone_comercial)
    setValue('razao_social', data.razao_social)
    setValue('tipo_empresa', data.tipo_empresa)
    setValue('cep', data.cep)
    setValue('logradouro', data.logradouro)
    setValue('complemento', data.complemento)
    setValue('numero', data.numero)
    setValue('bairro', data.bairro)
    setValue('cidade', data.cidade)
    setValue('uf', data.uf)
    setValue('pais', data.pais)
    setValue('nome_contato_primario', data.nome_contato_primario)
    setValue('tratamento_contato_primario', data.tratamento_contato_primario)
    setValue('cargo_contato_primario', data.cargo_contato_primario)
    setValue('email_contato_primario', data.email_contato_primario)
    setValue('telefone_contato_primario', data.telefone_contato_primario)
    setValue('nome_contato_secundario', data.nome_contato_secundario)
    setValue(
      'tratamento_contato_secundario',
      data.tratamento_contato_secundario,
    )
    setValue('cargo_contato_secundario', data.cargo_contato_secundario)
    setValue('email_contato_secundario', data.email_contato_secundario)
    setValue('telefone_contato_secundario', data.telefone_contato_secundario)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <fieldset>
          <legend>
            {/* <input type="hidden" {...register('id')} value={Number(data.id)} /> */}
            <span>
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput title="Codigo Empresa" {...register('cod_empresa')} />
            </div>

            <TextInput title="Nome Fantasia" {...register('nome_fantasia')} />
            <div style={{ width: '15%' }}>
              <TextInput title="CNPJ" {...register('cnpj')} />
            </div>
            <div style={{ width: '15%' }}>
              <TextInput
                type="text"
                title="Telefone Comercial"
                {...register('telefone_comercial')}
              />
            </div>
          </Box>

          <Box>
            <TextInput title="Razao Social" {...register('razao_social')} />

            <SelectOptions
              description="Tipo Empresa"
              data={newDataTipoEmpresa}
              w={280}
              {...register('tipo_empresa')}
              defaultValue={{ label: data.tipo_empresa }}
            />

            <SwitchInput
              title="Patrocinadora?"
              {...register('patrocinadora')}
              defaultChecked={data.patrocinadora}
            />

            <SwitchInput
              title="Faculdade Anestesiologia?"
              {...register('faculdade_anestesiologia')}
              defaultChecked={data.faculdade_anestesiologia}
            />
            <SwitchInput
              title="Empresa Ativa?"
              {...register('empresa_ativa')}
              defaultChecked={data.empresa_ativa}
            />
          </Box>

          <Box>
            <div style={{ width: '7%' }}>
              <TextInput type="number" title="CEP" {...register('cep')} />
            </div>

            <TextInput title="Logadouro" {...register('logradouro')} />
            <TextInput title="Logadouro" {...register('complemento')} />
            <div style={{ width: '8%' }}>
              <TextInput type="number" title="Numero" {...register('numero')} />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput w={450} title="Bairro" {...register('bairro')} />
            </div>

            <TextInput title="Cidade" {...register('cidade')} />

            <div>
              <TextInput w={35} title="UF" {...register('uf')} />
            </div>

            <div>
              <SelectOptions
                description="País"
                w={140}
                data={newDataPais}
                {...register('pais')}
                defaultValue={{ label: data.pais }}
              />
            </div>
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Primario"
              {...register('nome_contato_primario')}
            />
            <SelectOptions
              description="Tratamento"
              data={newDataTratamento}
              w={180}
              {...register('tratamento_contato_primario')}
              defaultValue={{ label: data.tratamento_contato_primario }}
            />
            <SelectOptions
              description="Cargo"
              data={newDataCargo}
              w={180}
              {...register('cargo_contato_primario')}
              defaultValue={{ label: data.cargo_contato_primario }}
            />
            <div>
              <TextInput
                type="email"
                title="Email"
                {...register('email_contato_primario')}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                {...register('telefone_contato_primario')}
              />
            </div>
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Secundario"
              {...register('nome_contato_secundario')}
            />

            <SelectOptions
              data={newDataTratamento}
              w={180}
              description="Tratamento"
              {...register('tratamento_contato_secundario')}
              defaultValue={{ label: data.tratamento_contato_secundario }}
            />
            {/* <TextInput
              title="Cargo"
              {...register('cargo_contato_secundario')}
            /> */}
            <SelectOptions
              data={newDataCargo}
              description="Cargo"
              w={180}
              {...register('cargo_contato_secundario')}
              defaultValue={{ label: data.cargo_contato_secundario }}
            />
            <div>
              <TextInput
                type="email"
                title="Email"
                {...register('email_contato_secundario')}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                {...register('telefone_contato_secundario')}
              />
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
    const data = await prisma.empresa.findFirst({
      where: {
        id: Number(id),
      },
    })

    const dataTipoEmpresa = await prisma.tipoEmpresa.findMany()
    const dataPais = await prisma.pais.findMany()
    const dataCargo = await prisma.cargos.findMany()
    const dataTratamento = await prisma.tratamentos.findMany()

    return {
      props: {
        data,
        dataTipoEmpresa,
        dataPais,
        dataCargo,
        dataTratamento,
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
