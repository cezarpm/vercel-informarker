import { Container, Table } from './styled'
import React from 'react'
import { Typography } from '@mui/material'

export default function Resultado() {
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
          <tr>
            <td>Chapa 1 - Situação</td>
            <td>700</td>
            <td>60.70%</td>
            <td>74,09</td>
          </tr>
          <tr>
            <td>Chapa 2 - Oposição</td>
            <td>300</td>
            <td>39.30%</td>
            <td>25,91</td>
          </tr>
          <tr>
            <td>Brancos</td>
            <td>100</td>
            <td>10.00%</td>
          </tr>
          <tr>
            <td>Nulos</td>
            <td>100</td>
            <td>10.00%</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>1206</td>
            <td>100%</td>
            <td>100%</td>
          </tr>
        </tfoot>
      </Table>
    </Container>
  )
}
