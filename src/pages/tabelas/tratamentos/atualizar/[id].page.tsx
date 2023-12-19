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

const schemaCargos = z.object({
  id: z.string(),
  name: z.string().min(5, { message: 'campo precisa conter min 5 caracteres' }),
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
    console.log(data)
    try {
      await api.put('/tratamento/update', { ...data })
      toast.success('Tratamento atualizado!')
      router.push('/tabelas/tratamentos')
    } catch (error) {
      console.log(error)
      toast.success('Oops... algo deu errado!')
    }
  }
  useEffect(() => {
    setValue('id', data.id)
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
            <Link href={'/tabelas/tratamentos'}>Tratamento</Link>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>
          <Box>
            {/* <input type="hidden" {...register('id')} value={data.id} /> */}
            <TextInput
              title="Nome"
              defaultValue={data.name}
              {...register('name')}
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
    const data = await prisma.tratamentos.findFirst({
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
