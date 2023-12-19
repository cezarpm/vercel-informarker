import { Container, Box } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import axios from 'axios'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { SwitchInput } from '@/components/SwitchInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

interface schemaTipoEmpresa {
  id: number
  name: string
}
interface schemaEndereco {
  id: number
  name: string
}
interface schemaTratamento {
  id: number
  name: string
}
interface schemaCargo {
  id: number
  name: string
}
interface schemaEmpresasProps {
  dataTipoEmpresa: schemaTipoEmpresa[]
  dataBairro: schemaEndereco[]
  dataCidade: schemaEndereco[]
  dataUf: schemaEndereco[]
  dataPais: schemaEndereco[]
  dataCargo: schemaCargo[]
  dataTratamento: schemaTratamento[]
}

const schemaEmpresaForm = z.object({
  cod_empresa: z
    .string()
    .min(5, { message: 'campo precisa conter min 5 caracteres' }),
  tipo_empresa: z.string(),
  patrocinadora: z.boolean(),
  faculdade_anestesiologia: z.boolean(),
  empresa_ativa: z.boolean(),
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
  cep: z.string(),
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

export default function Empresas({
  dataTipoEmpresa,
  dataPais,
  dataCargo,
  dataTratamento,
}: schemaEmpresasProps) {
  const [cidade, setCidade] = useState('')
  const [bairro, setBairro] = useState('')
  const [uf, setUf] = useState('')
  const [logradouro, setLogradouro] = useState('')
  const [cepChecked, setCepChecked] = useState(false)
  const [cepInvalido, setCepInvalido] = useState()
  const [disableCamposCepInvalido, setDisableCamposCepInvalido] =
    useState(false)
  const router = useRouter()
  const newDataTipoEmpresa = dataTipoEmpresa?.map((item) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataPais = dataPais?.map((item) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataCargo = dataCargo?.map((item) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  const newDataTratamento = dataTratamento?.map((item) => {
    return {
      label: item.name,
      id: item.id,
    }
  })

  async function handleGetAllParams() {
    try {
      const response = await api.get('/parametros')
      setCepInvalido(response.data[0].cep_invalido)
    } catch (error) {
      console.log(error)
    }
  }
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaEmpresaForm>({
    resolver: zodResolver(schemaEmpresaForm),
  })

  async function handleOnSubmit(data: SchemaEmpresaForm) {
    try {
      console.log(data)
      await api.post('/empresa/cadastro', { ...data })
      router.push('/empresas')
      return toast.success('Empresa cadastrada!')
    } catch (error) {
      console.log(error)
      return toast.error('Ops algo deu errado...')
    }
  }
  const cepValue = watch('cep')

  if (typeof cepValue === 'string' && cepValue.length === 8 && !cepChecked) {
    handleCheckCep(cepValue)
  }

  async function handleCheckCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      const checkParametroCepInvalido = response.data
      if (checkParametroCepInvalido.erro) {
        if (cepInvalido === false) {
          toast.warn('você optou: não aceitar cep inválido')
          setDisableCamposCepInvalido(true)
        } else if (cepInvalido === true) {
          toast.warn('você optou: aceitar cep inválido')
        }
      }

      setValue('bairro', response.data.bairro)
      setValue('cidade', response.data.localidade)
      setValue('uf', response.data.uf)
      setValue('logradouro', response.data.logradouro)
      setCepChecked(true)
      setCidade(response.data.localidade)
      setBairro(response.data.bairro)
      setUf(response.data.uf)
      setLogradouro(response.data.logradouro)
    } catch (error) {
      console.log(error)
    }
  }

  // const logradouroValue = watch('logradouro')
  // console.log(logradouroValue)

  useEffect(() => {
    setCepChecked(false)
    setDisableCamposCepInvalido(false)
    handleGetAllParams()
  }, [cepValue])

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <span>
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput
                title="Codigo Empresa"
                {...register('cod_empresa')}
                messageError={errors.cod_empresa?.message}
              />
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
            />
            <SwitchInput
              title="Patrocinadora?"
              {...register('patrocinadora')}
            />

            <SwitchInput
              title="Faculdade Anestesiologia?"
              {...register('faculdade_anestesiologia')}
            />
            <SwitchInput
              title="Empresa Ativa?"
              {...register('empresa_ativa')}
            />
          </Box>

          <Box>
            <div style={{ width: '7%' }}>
              <TextInput title="Cep" {...register('cep')} />
            </div>

            <TextInput
              title="Logradouro"
              {...register('logradouro')}
              disabled={disableCamposCepInvalido}
              value={logradouro}
            />

            <TextInput
              title="Complemento"
              {...register('complemento')}
              disabled={disableCamposCepInvalido}
            />

            <div style={{ width: '8%' }}>
              <TextInput
                title="Número"
                {...register('numero', { valueAsNumber: true })}
                // disabled={disableCamposCepInvalido}
              />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput
                w={450}
                title="Bairro"
                {...register('bairro')}
                value={bairro}
                disabled={disableCamposCepInvalido}
              />
            </div>

            <TextInput
              title="Cidade"
              {...register('cidade')}
              value={cidade}
              disabled={disableCamposCepInvalido}
            />

            <div>
              <TextInput
                w={35}
                title="UF"
                {...register('uf')}
                value={uf}
                disabled={disableCamposCepInvalido}
              />
            </div>

            <SelectOptions
              description="País"
              w={140}
              data={newDataPais}
              {...register('pais')}
              disabled={disableCamposCepInvalido}
            />
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
            />
            <SelectOptions
              description="Cargo"
              data={newDataCargo}
              w={180}
              {...register('cargo_contato_primario')}
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
                w={180}
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
            />
            <SelectOptions
              data={newDataCargo}
              description="Cargo"
              w={180}
              {...register('cargo_contato_secundario')}
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
                w={180}
                title="Telefone"
                {...register('telefone_contato_secundario')}
              />
            </div>
          </Box>
          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const dataTipoEmpresa: schemaTipoEmpresa[] =
      await prisma.tipoEmpresa.findMany()
    const dataPais: schemaEndereco[] = await prisma.pais.findMany()
    const dataCargo: schemaCargo[] = await prisma.cargos.findMany()
    const dataTratamento: schemaCargo[] = await prisma.tratamentos.findMany()
    return {
      props: {
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
        dataTipoEmpresa: [],
        dataPais: [],
        dataCargo: [],
        dataTratamento: [],
      },
    }
  }
}
