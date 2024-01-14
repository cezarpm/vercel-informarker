import { Container, Box } from './styled'
import React, { use, useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'


const placeHolderImage = [
  "https://this-person-does-not-exist.com/img/avatar-gen11080ba46e2948ca0f20c6c9463f302e.jpg",
  "https://this-person-does-not-exist.com/img/avatar-gen114548412138b56a953eaf4a109c9278.jpg",
  "https://this-person-does-not-exist.com/img/avatar-gen1cd8f7740afa986a8905887813e1045a.jpg"
]

const integranteSchema = z.object({
  nome: z.string().min(1, { message: 'O campo nome é obrigatório' }),
  cargo: z.string().min(1, { message: 'O campo cargo é obrigatório' }),
  image: z.string().min(1, { message: 'O campo imagem é obrigatório' }),
})

const schemaChapaForm = z.object({
  nome_chapa: z
    .string()
    .min(1, { message: 'O campo nome da chapa é obrigatório' }),
  membros_chapa: z.array(integranteSchema).nonempty(),
})

type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoCreate() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<SchemaChapaForm>({
    resolver: zodResolver(schemaChapaForm),
  })

  const { fields, append, remove } = useFieldArray({
    name: 'membros_chapa',
    control,
  })

  async function handleOnSubmit(data: SchemaChapaForm) {
    await api.post('/votacao/cadastro', data)

    router.push('/chapas')
    return toast.success('Chapa cadastrada!')
  }

  useEffect(() => {
    if (errors.membros_chapa) {
      toast.error("A votação precisa ter no mínimo 1 membro!")
    }

  }, [errors])


  async function handleOnSubmit(data: SchemaChapaForm) {
    await api.post('/votacao/cadastro', data)

    router.push('/chapas')
    return toast.success('Chapa cadastrada!')
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/chapas"
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
              <Link href={'/chapas'}>Chapas</Link>
            </span>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>
          <Box>
            <TextInput
              title="Nome da chapa *"
              {...register('nome_chapa')}
              helperText={errors.nome_chapa?.message}
              error={!!errors.nome_chapa?.message}
            />
          </Box>

          <Box>
            <h1>Composição da chapa</h1>
            <Button
              onClick={() => append({ cargo: '', nome: '', image: placeHolderImage[Math.floor(Math.random() * placeHolderImage.length)] })}
              type="button"
              title="+ Adicionar membro"
              style={{ margin: '0px', width: '100%', fontSize: '12px' }}
            />
          </Box>

          {fields.map((membro, index) => {
            const errorForFieldText2 =
              errors?.membros_chapa?.[index]?.nome?.message

            const errorForFieldText3 =
              errors?.membros_chapa?.[index]?.cargo?.message

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
                  {...register(`membros_chapa.${index}.nome` as const)}
                  error={!!errorForFieldText2}
                  helperText={errorForFieldText2}
                />

                <TextInput
                  title="Cargo do membro *"
                  {...register(`membros_chapa.${index}.cargo` as const)}
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
