import { Container, Box, TextAreaInput } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { SelectOptions } from '@/components/SelectOptions'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'
import { TextArea } from '@ignite-ui/react'

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

  home_page: z.string(),
  inscricao_estadual: z.string(),
  inscricao_municipal: z.string(),
  observacoes: z.string(),
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface shemaTabelas {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}

export default function Vizualizar({
  data,
  dataTipoEmpresa,
  dataPais,
  dataCargo,
  dataTratamento,
}: any) {
  const router = useRouter()
  const [cepInvalido, setCepInvalido] = useState()
  const [disabledButtonCep, setDisabledButtonCep] = useState(false)

  const newDataTipoEmpresa = dataTipoEmpresa?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataPais = dataPais?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataCargo = dataCargo?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataTratamento = dataTratamento?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<SchemaEmpresaForm>()

  async function OnSubmit(data: any) {
    if (disabledButtonCep === true) {
      return toast.warn('Não é possivel atualizar com CEP inválido')
    }
    try {
      await api.put('/empresa/update', { ...data })
      toast.success('Empresa atualizada!')
      router.push('/empresas')
    } catch (error) {
      console.log(error)
    }
  }

  // API VIA CEP
  const cepValue = watch('cep')
  async function handleCheckCep(cep: any) {
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
        toast.warn('Você optou: aceitar cep inválido')
      } else {
        setDisabledButtonCep(true)
        toast.warn('Você optou: não aceitar cep inválido')
        toast('Botão Enviar Desabilitado!')
      }
    }

    if (!dataViaCep.erro) {
      setDisabledButtonCep(false)
      setValue('bairro', dataViaCep.bairro)
      setValue('cidade', dataViaCep.localidade)
      setValue('uf', dataViaCep.uf)
      setValue('logradouro', dataViaCep.logradouro)
    }
  }
  // VALIDAR CNPJ
  const cnpj = watch('cnpj')
  async function handleCheckCnpj(cnpj: any) {
    try {
      const response = await api.get(`/util/checkCnpj?cnpj=${cnpj}`)
      // console.log(response)
      if (response.data.message) {
        toast.warn('CNPJ Inválido')
      } else {
        toast.success('CNPJ Válido')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setValue('id', data.id)
    setValue('cod_empresa', data.cod_empresa)
    setValue('nome_fantasia', data.nome_fantasia)
    setValue('cnpj', data.cnpj || '')
    setValue('telefone_comercial', data.telefone_comercial || '')
    setValue('razao_social', data.razao_social)
    setValue('tipo_empresa', data.tipo_empresa)
    setValue('cep', data.cep || '')
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
    setValue('telefone_contato_primario', data.telefone_contato_primario || '')
    setValue('nome_contato_secundario', data.nome_contato_secundario)
    setValue(
      'tratamento_contato_secundario',
      data.tratamento_contato_secundario,
    )
    setValue('cargo_contato_secundario', data.cargo_contato_secundario)
    setValue('email_contato_secundario', data.email_contato_secundario)
    setValue(
      'telefone_contato_secundario',
      data.telefone_contato_secundario || '',
    )
    handleGetAllParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box>
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
            {/* <input type="hidden" {...register('id')} value={Number(data.id)} /> */}
            <span>
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>
          <Box>
            <div style={{ width: '10%' }}>
              <TextInput title="Codigo Empresa" {...register('cod_empresa')} />
            </div>

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
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextInput
                title="CNPJ *"
                {...register('cnpj')}
                mask="99.999.999/9999-99"
              />
              <Button
                type="button"
                onClick={() => {
                  handleCheckCnpj(cnpj)
                }}
                title="Validar"
                style={{ margin: '0px', width: '100%', fontSize: '12px' }}
              />
            </div>
            <TextInput title="Nome Fantasia" {...register('nome_fantasia')} />

            <TextInput title="Razao Social" {...register('razao_social')} />
            {/* <TextInput title="CNPJ" {...register('cnpj')} /> */}
          </Box>

          <Box>
            <TextInput
              title="Inscrição Estadual"
              {...register('inscricao_estadual')}
              defaultValue={data.inscricao_estadual}
            />

            <TextInput
              title="Inscrição Municipal"
              {...register('inscricao_municipal')}
              defaultValue={data.inscricao_municipal}
            />
          </Box>

          <Box>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <TextInput title="Cep *" {...register('cep')} mask="99999-999" />
              <Button
                type="button"
                onClick={() => {
                  handleCheckCep(cepValue)
                }}
                title="Buscar"
                style={{ margin: '0px', width: '100%', fontSize: '12px' }}
              />
            </div>

            <TextInput title="Logadouro" disabled {...register('logradouro')} />
            <div style={{ width: '8%' }}>
              <TextInput title="Numero" {...register('numero')} />
            </div>
            <TextInput title="Complemento" {...register('complemento')} />
          </Box>

          <Box>
            <div>
              <TextInput
                disabled
                w={450}
                title="Bairro"
                {...register('bairro')}
              />
            </div>

            <TextInput disabled title="Cidade" {...register('cidade')} />

            <div>
              <TextInput w={35} title="UF" disabled {...register('uf')} />
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
            <div style={{ width: '15%' }}>
              <TextInput
                type="text"
                title="Telefone Comercial"
                mask="(99) 9999-9999"
                {...register('telefone_comercial')}
              />
            </div>
          </Box>

          <Box>
            <TextInput
              title="Nome do Contato Primario"
              {...register('nome_contato_primario')}
            />
            <SelectOptions
              description="Tratamento"
              data={newDataTratamento}
              w={300}
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
          </Box>

          <Box>
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
                mask="(99) 9.9999-9999"
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
              w={300}
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
          </Box>

          <Box>
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
                mask="(99) 9.9999-9999"
                {...register('telefone_contato_secundario')}
              />
            </div>
          </Box>
          <TextInput
            title="Home Page"
            w="100%"
            {...register('home_page')}
            defaultValue={data.home_page}
          />
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
              <TextAreaInput
                {...register('observacoes')}
                defaultValue={data.observacoes}
              />
            </label>
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

    const dataTipoEmpresa = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Empresa',
      },
    })
    const dataPais = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'pais',
      },
    })

    const dataCargo = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Cargos_Empresa',
      },
    })
    const dataTratamento = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tratamento',
      },
    })

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
  } finally {
    prisma.$disconnect()
  }
}
