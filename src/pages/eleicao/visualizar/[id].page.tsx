import { Container, Box,Text } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next/types'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { SelectOptions } from '@/components/SelectOptions'
import { Typography } from '@mui/material'

 // array dias
 const days = Array.from({ length: 31 }, (_, index) => ({
  label: (index + 1).toString(),
}))

const dataDays = days.map((item) => item)

// array mes
const months = Array.from({ length: 12 }, (_, index) => ({
  label: (index + 1).toString(),
}))

const dataMonths = months.map((item) => item)

// array anos
const yearCurrent = new Date().getFullYear()
const years = Array.from({ length: 10 }, (_, index) =>
  (yearCurrent + index).toString(),
)

const dataYears = years.map((year) => {
  return {
    label: year,
  }
})



type SchemaChapaForm = z.infer<typeof schemaChapaForm>

export default function VotacaoRead({ data, chapas }) {
  const newDate = new Date(data.data_votacao_inicio)
  const diaMes = String(newDate.getDate())
  const mesAno = String(newDate.getMonth() + 1)
  const anoTotal = String(newDate.getFullYear())

  const endData = new Date(data.data_votacao_fim)
  const diaMesEnd = String(endData.getDate())
  const mesAnoEnd = String(endData.getMonth() + 1)
  const anoTotalEnd = String(endData.getFullYear())

  return (
    <Container>
      <form>
        <Box>
          <Link
            href="/eleicao/lista"
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
            <Link href={'/chapas'}>Eleição</Link>
          </span>
          <CaretRight size={14} />
          <span>Visualizar</span>
        </legend>
          <Box>
            <div style={{ width: '30%' }}>
              <TextInput
                title="Nome da eleicao *"
                defaultValue={data.matricula_saerj}
              />

             
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '31rem' }}>
              <Text>
                Data de início da votação
              </Text>

              <TextInput
                title="Dia *"
                defaultValue={diaMes}
              />


              <TextInput
                title="Mês *"
                defaultValue={mesAno}
              />

              <TextInput
                title="Ano *"
                defaultValue={anoTotal}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'end', width: '32rem' }}>
              <Text>
                Data de término da votação
              </Text>

              <TextInput
                title="Dia *"
                defaultValue={diaMesEnd}
              />

              <TextInput
                title="Mês *"
                defaultValue={mesAnoEnd}
              />

              <TextInput
                title="Ano *"
                defaultValue={anoTotalEnd}
              />
            </div>

            <SelectOptions
                description="Selecione a chapa"
                data={['ATIVO', 'INATIVO']}
                w={280}
                defaultValue={data.status}
              />

          </Box>

          <Box>
            <Typography variant="h6" component="div">
              Adicionar chapas na eleição
            </Typography>
          </Box>


          {data?.chapas.chapas.map((membro, index) =>
           <Box key={index}>
             <TextInput
                w={280}
                title={"Chapa " + (index + 1)}
                defaultValue={membro.nome_chapa}
                
              />
             </Box>
            )}

         
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.votacao.findFirst({
      where: {
        id: Number(id),
      },
    })

    console.log(data?.chapas.chapas);
    
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
