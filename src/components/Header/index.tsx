import Link from 'next/link'
import { Container } from './styled'
import { TemporaryDrawer } from '../DrawerMenu'
import Image from 'next/image'
import logo from '@/assets/logo.png'

export function Header() {
  return (
    <Container>
      <nav>
        <Link href={'/'}>
          <Image src={logo} alt="logo" height={50} />
        </Link>
        {/* <SubMenus title="Sobre nós" />
        <Link href="#">Seja sócio</Link>
        <Link href="#">46ª JAERJ</Link>
        <SubMenus title="Educação" />
        <SubMenus title="A anestesia" />
        <Link href="#">Novidades</Link>
        <Link href="#">Contato</Link>
        <Link href="#">Área do associado</Link> */}
        <TemporaryDrawer />
      </nav>
    </Container>
  )
}
