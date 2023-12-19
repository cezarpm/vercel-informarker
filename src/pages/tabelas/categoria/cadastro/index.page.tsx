import { Container, Box } from './styled'
import React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import { TextInput } from '@/components/TextInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'

const schemaCargos = z.object({
  name: z.string().min(5, { message: 'campo precisa conter min 5 caracteres' }),
})

type SchemaCargos = z.infer<typeof schemaCargos>

export default function Tratamentos() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SchemaCargos>({
    resolver: zodResolver(schemaCargos),
  })

  async function handleOnSubmit(data: SchemaCargos) {
    try {
      console.log(data)
      await api.post('/categorias/cadastro', { ...data })
      router.push('/tabelas/categoria')
      return toast.success('Categoria cadastrada!')
    } catch (error) {
      console.log(error)
      return toast.error('Ops algo deu errado...')
    }
  }
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <fieldset>
          <legend>
            <span>
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            <Link href={'/tabelas/categoria'}>Categoria</Link>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>
          <Box>
            <TextInput
              title="Nome"
              {...register('name')}
              messageError={errors.name?.message}
            />
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
