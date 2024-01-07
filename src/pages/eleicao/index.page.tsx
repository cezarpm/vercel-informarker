import Dialog from '@/components/Dialog'
import {
  BoxCandidates,
  BoxOptionName,
  BoxOptions,
  CanditateName,
  CanditatePosition,
  Checkbox,
  ConfirmationModal,
  Container,
  NulableButton,
  WelcomeModal,
  WhiteButton,
  OutlinedButton,
} from './styled'
import { Avatar, Typography } from '@mui/material'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'



export default function Votacao() {
  const [userAlreadyVoted, setUserAlreadyVoted] = useState(false)
  const [open, setOpen] = useState(true)
  const [showVotation, setShowVotation] = useState(false)
  const [showVoteReceipt, setShowVoteReceipt] = useState(false)

  const [selected, setSelected] = useState('' as any)

  const [votation, setVotation] = useState(null)

  const handleClick = (item: string) => {
    setShowVotation(true)
    setSelected(item)
  }

  const genareteVoteReceipt = async () => {
    if (userAlreadyVoted) {
      alert('Você já votou nessa eleição')
      setShowVotation(false)
      return
    }

    setShowVoteReceipt(true)
    setShowVotation(false)


    await api.post('/votos/cadastro', { nome_chapa: selected })
  }

  const expandCandidates = (index: number) => {

    const expanded = votation.chapas.chapas.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          expandend: !item.expandend,
        }
      }

      return item
    })

    setVotation({
      ...votation,
      chapas: {
        chapas: expanded,
      },
    })

  }

  const revertVote = () => {
    setShowVotation(false)
    setSelected('')
  }

  const reset = () => {
    setShowVoteReceipt(false)
    setShowVotation(false)
    setOpen(true)
    setSelected('')
  }

  const getVotation = async () => {
    const { data } = await api.get('/eleicao/read')

    const { data: userVoted } = await api.get('/votos/')


    if (userVoted.length > 0) {
      setUserAlreadyVoted(true)
    }

    setVotation(data)
  }

  useEffect(() => {
    getVotation()
  }, [])

  if (showVoteReceipt) {
    return (
      <div
        style={{
          width: 800,
          margin: '80px auto',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          Comprovante de votação
        </h1>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Nome: Roberto da Silva
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          CPF: 857.260.010-87
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Eleição: Eleição 1
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Data: {new Date().toLocaleDateString()}
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Chapa Votada: {selected}
        </Typography>

        <Typography id="modal-modal-title" variant="h6" component="h2">
          Autentication: 0x0000000
        </Typography>

        <div
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          <div style={{ width: '50%' }}>
            <OutlinedButton onClick={reset}>
              <p>Voltar</p>
            </OutlinedButton>
          </div>

          <div style={{ width: '50%' }}>
            <Button title="Imprimir / Salvar" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container>
      <h1>Votação</h1>

      <Dialog open={open} onClose={() => setOpen(false)} setOpen={setOpen}>
        <WelcomeModal>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Bem-Vindo as Eleições da SAERJ
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Perído de Votação
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Início : {new Date(votation?.data_votacao_inicio).toLocaleDateString()}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Encerramento: {new Date(votation?.data_votacao_inicio).toLocaleDateString()}
          </Typography>

          {userAlreadyVoted ? (
            <Typography style={{ marginTop: 10 }} variant="h6" component="h5">
              Você já votou nessa eleição
            </Typography>
          ) : (
            <button
              style={{
                backgroundColor: 'rgb(82, 128, 53)',
                border: 0,
                width: 110,
                height: 40,
                borderRadius: 5,
                marginRight: 10,
                marginTop: 10,
                color: '#fff',
              }}
              onClick={() => setOpen(false)}
            >
              Ir para votação
            </button>
          )}
        </WelcomeModal>
      </Dialog>

      <Dialog
        closeOnBackdropClick={false}
        open={showVotation}
        onClose={() => setShowVotation(false)}
        setOpen={setShowVotation}
      >
        <ConfirmationModal>
          <Typography variant="h6" component="h2">
            Confirmar o envio do voto?
          </Typography>

          <Typography variant="h6" component="h5">
            Após a confirmação, não será possível alterar o voto.
          </Typography>

          <button
            style={{
              backgroundColor: 'rgb(82, 128, 53)',
              border: 0,
              width: 100,
              height: 30,
              borderRadius: 5,
              marginRight: 10,
              marginTop: 10,
            }}
            onClick={genareteVoteReceipt}
          >
            CONFIRMA
          </button>

          <button
            onClick={revertVote}
            style={{
              backgroundColor: '#ED7D31',
              border: 0,
              width: 100,
              height: 30,
              borderRadius: 5,
              marginTop: 10,
            }}
          >
            CORRIGE
          </button>
        </ConfirmationModal>
      </Dialog>

      <Container>
        {votation && votation.chapas.chapas.map((item, index) => (
          <>
            <BoxOptions key={index}>
              <Checkbox
                onClick={() => handleClick(item.name)}
                type="radio"
                name="voto"
                value="1"
                checked={selected === item.name}
              />

              <div style={{ flex: 1 }}>
                <BoxOptionName onClick={() => expandCandidates(index)}>
                  <p>{item.name}</p>

                  <Typography
                    onClick={() => expandCandidates(index)}
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    +
                  </Typography>
                </BoxOptionName>

                {item.expandend && (
                  <div>
                    {item.integrantes.map((canditate, index) => (
                      <BoxCandidates key={index}>
                        <Avatar alt="Remy Sharp" src={canditate.image} />

                        <CanditateName>{canditate.name}</CanditateName>
                        <CanditatePosition>
                          {canditate.position}
                        </CanditatePosition>
                      </BoxCandidates>
                    ))}
                  </div>
                )}
              </div>
            </BoxOptions>
          </>
        ))}

        <BoxOptions>
          <Checkbox
            onClick={() => handleClick('BRANCO')}
            checked={selected === 'BRANCO'}
            type="radio"
          />

          <WhiteButton>
            <p>BRANCO</p>
          </WhiteButton>
        </BoxOptions>

        <BoxOptions>
          <Checkbox
            onClick={() => handleClick('NULO')}
            type="radio"
            name="voto"
            checked={selected === 'NULO'}
          />

          <NulableButton>
            <p>NULO</p>
          </NulableButton>
        </BoxOptions>
      </Container>
    </Container>
  )
}



