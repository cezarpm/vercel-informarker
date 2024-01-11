/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Box } from './styled'
import React from 'react'
import { z } from 'zod'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { SwitchInput } from '@/components/SwitchInput'
import { zodResolver } from '@hookform/resolvers/zod'

const schemaCadastro = z.object({
  codigo_tabela: z.string().min(3, { message: 'Campo obrigatório' }),
  ocorrencia_tabela: z.string().min(3, { message: 'Campo obrigatório' }),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.boolean(),
})

type SchemaCadastro = z.infer<typeof schemaCadastro>

export default function CadastroTabelas() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
  })

  async function OnSubmit(data: SchemaCadastro) {
    // console.log(data)
    try {
      await api.post('/tabelas/cadastro', { ...data })
      toast.success('cadastrado!')
      router.push('/tabelas')
    } catch (error) {
      console.log(error)
      toast.success('Oops... algo deu errado!')
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box style={{ justifyContent: 'flex-end' }}>
          <Link
            href="/tabelas"
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
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            <span>Cadastro</span>
          </legend>
          <Box>
            <TextInput
              title="Código tabela *"
              {...register('codigo_tabela')}
              helperText={errors.codigo_tabela?.message}
              error={!!errors.codigo_tabela?.message}
            />
            <TextInput
              title="Ocorrência tabela *"
              {...register('ocorrencia_tabela')}
              helperText={errors.ocorrencia_tabela?.message}
              error={!!errors.ocorrencia_tabela?.message}
            />
            <TextInput
              title="Complemento ocorrência para seleção"
              {...register('complemento_ocorrencia_selecao')}
            />
            <SwitchInput
              title="Ocorrência Ativa?"
              {...register('ocorrencia_ativa')}
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
