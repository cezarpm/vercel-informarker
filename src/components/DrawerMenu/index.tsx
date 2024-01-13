import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import {
  Buildings,
  CloudArrowUp,
  Function,
  SignOut,
  Table,
  Balloon,
  ArchiveTray,
  User,
  ArchiveBox,
  UsersFour,
  Article

} from 'phosphor-react'
import { useRouter } from 'next/navigation'
import { Twirl as Hamburger } from 'hamburger-react'
type Anchor = 'left'

export function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  })

  const [isOpen, setOpen] = React.useState(false)

  const router = useRouter()

  // const { Logs } = useId()

  function handleNextPage(text: string): void {
    if (text === 'Parametros') {
      router.push('/parametros')
    } else if (text === 'Empresas') {
      router.push('/empresas')
    } else if (text === 'Tabelas') {
      router.push('/tabelas')
    } else if (text === 'Associados') {
      router.push('/associados')

    } else if (text === 'Logs') {
      router.push('/logs')
    } else if (text === 'Aniversariantes') {
      router.push('/associados/aniversariantes')
    }else if (text === 'Protocolos') {
      router.push('/protocolos')
    }else if (text === 'Chapas') {
      router.push('/chapas')
    } else if (text === 'Diretorias') {
      router.push('/diretorias')
    } else if (text === 'Eleicoes') {
      router.push('/eleicoes')
    } 

  }

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setState({ ...state, [anchor]: open })
      setOpen(open)
    }

  const arrayIcons = [
    <>
      <CloudArrowUp size={30} color="#fff" />
    </>,
    <>
      <Buildings size={30} color="#fff" />
    </>,
    <>
      <Table size={30} color="#fff" />
    </>,
    <>
      <UsersFour size={30} color="#fff" />
    </>,
    <>
      <ArchiveTray size={30} color="#fff" />
    </>,
    <>
      <Article size={30} color="#fff" /> 
    </>,
    <>
      <User size={30} color="#fff" />
    </>,
    <>
      <ArchiveBox size={30} color="#fff" />
    </>,
    <>
      <UsersFour size={30} color="#fff" />
    </>,
  ]
  const arrayIconsTwoList = [
    <>
      <Function size={30} color="#fff" />
    </>,
  ]
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
      //   bgcolor={'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)'}
      style={{
        height: '100%',
        background: 'linear-gradient(180deg, #0DA9A4 45%, #00F2FF 89%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '2rem 0rem',
        }}
      >
        <Image src={logo} alt="logo" width={210} quality={100} />
      </div>

      <List>

        {[
          'Parametros',
          'Empresas',
          'Tabelas',
          'Associados',
          'Aniversariantes',
          'Protocolos',
          'Chapas',
          'Diretorias',
          'Eleicoes',
         ].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                handleNextPage(text)
              }}
            >
              <ListItemIcon>{arrayIcons[index]}</ListItemIcon>
              <ListItemText primary={text} style={{ color: '#fff' }} />
            </ListItemButton>
          </ListItem>
        ))}

      </List>
      <Divider />
      {/* two list */}
      <List>
        {['Logs'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => {
                handleNextPage(text)
              }}
            >
              <ListItemIcon>{arrayIconsTwoList[index]}</ListItemIcon>
              <ListItemText primary={text} style={{ color: '#fff' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            style={{ color: '#fff' }}
            onClick={toggleDrawer(anchor, true)}
          >
            <Hamburger toggled={isOpen} />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
            <div
              style={{
                backgroundColor: '#00F2FF',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <SignOut size={30} color="red" />
              <span style={{ color: 'red', fontWeight: 'bold' }}>Sair</span>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  )
}
