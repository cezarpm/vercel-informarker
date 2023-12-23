/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Box } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { SwitchInput } from '@/components/SwitchInput'

const schemaCargos = z.object({
  id: z.number(),
  codigo_tabela: z.string(),
  ocorrencia_tabela: z.string(),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.string(),
})

type SchemaCategoria = z.infer<typeof schemaCargos>

interface schemaCategoria {
  data: SchemaCategoria
}

export default function Vizualizar({ data }: schemaCategoria) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaCategoria>()

  async function OnSubmit(data: SchemaCategoria) {
    // console.log(data)
    try {
      await api.put('/tabelas/update', { ...data })
      toast.success('tabela atualizado!')
      router.push('/tabelas')
    } catch (error) {
      console.log(error)
      toast.success('Oops... algo deu errado!')
    }
  }
  useEffect(() => {
    setValue('id', data.id)
    setValue('codigo_tabela', data.codigo_tabela)
    setValue('ocorrencia_tabela', data.ocorrencia_tabela)
    setValue(
      'complemento_ocorrencia_selecao',
      data.complemento_ocorrencia_selecao,
    )
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <fieldset>
          <legend>
            <span>
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            {/* <Link href={'/tabelas/tratamentos'}>Tratamento</Link>
            <CaretRight size={14} /> */}
            <span>Atualizar</span>
          </legend>
          <Box>
            <TextInput title="Código tabela" {...register('codigo_tabela')} />
            <TextInput
              title="Ocorrência tabela"
              {...register('ocorrencia_tabela')}
            />
            <TextInput
              title="Complemento ocorrência para seleção"
              {...register('complemento_ocorrencia_selecao')}
            />
            <SwitchInput
              title="Ocorrência Ativa?"
              defaultChecked={data.ocorrencia_ativa}
              {...register('ocorrencia_ativa')}
            />
          </Box>
          <Button
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
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
    const data = await prisma.tabelas.findFirst({
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
