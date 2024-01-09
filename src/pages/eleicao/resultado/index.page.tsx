import { Container, Table } from './styled'
import React from 'react'
import { Typography } from '@mui/material'
import { api } from '@/lib/axios'

export default function Resultado() {
  const [votation, setVotation] = React.useState(null)

  const getResults = async () => {
    const { data } = await api.get('/votos/votos')

    setVotation(data)
  }

  const calculatePercentage = (count: number) => {
    const percentage = (count / votation?.votosCount) * 100

    return percentage.toFixed(2)

  }

  const calculatePercentageOfValidVotes = (count: number) => {
    const total = votation?.votosChapas[0].count + votation?.votosChapas[1].count

    console.log(total, 'deca');


    const percentage = (count / total) * 100

    return percentage.toFixed(2)
  }

  React.useEffect(() => {
    getResults()
  }, [])

  console.log(votation);


  return (
    <Container>
      <Typography
        style={{
          textAlign: 'center',
        }}
        variant="h4"
        component="h1"
        gutterBottom
      >
        Resultados
      </Typography>

      <Typography
        style={{
          textAlign: 'center',
        }}
        variant="h6"
        component="h2"
        gutterBottom
      >
        Resultado Votação Eleição SAERJ 12 - 2024
      </Typography>

      <Table>
        <thead>
          <tr>
            <th>Chapas</th>
            <th>Votos</th>
            <th>% Total</th>
            <th>% Válidos</th>
          </tr>
        </thead>
        <tbody>

          {votation?.votosChapas.map((item, index) => (
            <tr key={index}>
              <td>{item.chapaNome}</td>
              <td>{item.count}</td>
              <td>{calculatePercentage(item.count, votation?.votosCount)}%</td>
              <td>{calculatePercentageOfValidVotes(item.count)}%</td>
            </tr>
          ))}


          <tr>
            <td>Brancos</td>
            <td>{votation?.votosBranco}</td>
            <td>{calculatePercentage(votation?.votosBranco, votation?.votosCount)}%</td>
          </tr>
          <tr>
            <td>Nulos</td>
            <td>{votation?.votosNulo}</td>
            <td>{calculatePercentage(votation?.votosNulo, votation?.votosCount)}%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>{votation?.votosCount}</td>
            <td>100%</td>
            <td>100%</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  )
}
