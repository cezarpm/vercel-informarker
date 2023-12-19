import CardTable from '@/components/CardTable'
import { Container } from './styled'
import { useRouter } from 'next/router'

export default function Tabelas() {
  const router = useRouter()
  return (
    <Container>
      <p>Tabelas</p>
      <div>
        <CardTable
          onClick={() => {
            router.push('/tabelas/tratamentos')
          }}
          title="Tratamentos"
          description="Cadastre, Delete e Altere os Tratamentos"
        />
        <CardTable
          onClick={() => {
            router.push('/tabelas/cargos')
          }}
          title="Cargos"
          description="Cadastre, Delete e Altere os Cargos"
        />

        <CardTable
          onClick={() => {
            router.push('/tabelas/categoria')
          }}
          title="Categorias"
          description="Cadastre, Delete e Altere as Categorias"
        />

        <CardTable
          onClick={() => {
            router.push('/tabelas/tipoEmpresa')
          }}
          title="Tipo Empresa"
          description="Cadastre, Delete e Altere as Categorias"
        />
      </div>
    </Container>
  )
}
