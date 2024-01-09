import { Container, Box } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const integranteSchema = z.object({
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
})

const schemaChapaForm = z.object({
  nome_da_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  integrantes: z.array(integranteSchema).nonempty(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoAtualizar({ data }) {
  const router = useRouter()

  const { id }: any = router.query
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'integrantes',
    control,
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    const dataToSend = {
      id: Number(id),
      nome_chapa: data.nome_da_chapa,
      membros_chapa: data.integrantes,
    }

    await api.put('/votacao/update', dataToSend)

    router.push('/votacao/lista')
    return toast.success('Chapa atualizada!')
  }

  useEffect(() => {
    setValue('nome_da_chapa', data.nome_chapa)
    setValue('integrantes', data.membros_chapa)
  }, [data, setValue])

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box>
          <Link
            href="/votacao/lista"
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
          <Box>
            <TextInput
              title="Nome da chapa *"
              {...register('nome_da_chapa')}
              helperText={errors.nome_da_chapa?.message}
              error={!!errors.nome_da_chapa?.message}
            />
          </Box>

          <Box>
            <h1>Composição da chapa</h1>
            <Button
              onClick={() => append({ foto: '', nome: '', cargo: '' })}
              type="button"
              title="+ Adicionar membro"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />
          </Box>

          {fields.map((membro, index) => {
            const errorForFieldText2 =
              errors?.integrantes?.[index]?.nome?.message

            const errorForFieldText3 =
              errors?.integrantes?.[index]?.cargo?.message

            return (
              <Box key={index}>
                <div>
                  <p
                    style={{
                      marginBottom: 16,
                      fontFamily: 'Roboto',
                      fontSize: '12px',
                      color: 'rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    Foto do membro
                  </p>
                  <input type="file" />
                </div>

                <TextInput
                  title="Nome do membro *"
                  {...register(`integrantes.${index}.nome` as const)}
                  error={!!errorForFieldText2}
                />

                <TextInput
                  title="Cargo do membro *"
                  {...register(`integrantes.${index}.cargo` as const)}
                  error={!!errorForFieldText3}
                />

                <Button
                  onClick={() => remove(index)}
                  type="button"
                  title="Remover membro"
                  style={{ margin: '0px', width: '100%', fontSize: '12px' }}
                />
              </Box>
            )
          })}

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.chapas.findFirst({
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
  } finally {
    prisma.$disconnect()
  }
}
