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
import {  useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'

export default function Votacao({data,alreadyVoted}) {
  

  const [userAlreadyVoted, setUserAlreadyVoted] = useState(alreadyVoted)
  const [open, setOpen] = useState(true)
  const [showVotation, setShowVotation] = useState(false)
  const [showVoteReceipt, setShowVoteReceipt] = useState(false)

  const [selected, setSelected] = useState('' as any)
  const [votation, setVotation] = useState(data)

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
    setUserAlreadyVoted(true)

    await api.post('/votos/cadastro', { nome_chapa: selected, votacao_id: votation.id, usuario_id: 1 })
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

  useEffect(() => {
    if (userAlreadyVoted) {
      setShowVoteReceipt(true)
    }
  }, [userAlreadyVoted])

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
          Eleição: {votation?.matricula_saerj}
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Chapa Votada: {selected || userAlreadyVoted.nome_chapa}
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

      <h1 style={{textAlign:'center'}}>Votação {votation?.matricula_saerj}</h1>


      <Dialog open={open} onClose={() => setOpen(false)} setOpen={setOpen}>
        <WelcomeModal>
         
          {votation ? (
            <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Bem-Vindo as Eleições {votation?.matricula_saerj}
            </Typography>

            <Typography id="modal-modal-title" variant="h6" component="h2">
              Perído de Votação
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Início : {new Date(votation?.data_votacao_inicio).toLocaleDateString()}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Encerramento: {new Date(votation?.data_votacao_fim).toLocaleDateString()}
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
            </div>
          ):
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Bem-Vindo as Eleições da SAERJ
            </Typography>

            <Typography id="modal-modal-title" variant="h6" component="h2">
              Ainda não existe nenhuma eleição ativa
            </Typography>


          </div>
          }
        
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
        {votation && votation.chapas?.chapas?.map((item, index) => (
          <>
          <div key={index}>
            <BoxOptions >
              <Checkbox
                onClick={() => handleClick(item.nome_chapa)}
                type="radio"
                name="voto"
                value="1"
                checked={selected === item.nome_chapa}
              />

              <div style={{ flex: 1 }}>
                <BoxOptionName onClick={() => expandCandidates(index)}>
                  <p>{item.nome_chapa}</p>

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
                    {item.membros_chapa.map((canditate, index) => (
                      <BoxCandidates key={index}>
                        <Avatar alt="Remy Sharp" src={canditate.image} />

                        <CanditateName>{canditate.nome}</CanditateName>
                        <CanditatePosition>
                          {canditate.cargo}
                        </CanditatePosition>
                      </BoxCandidates>
                    ))}
                  </div>
                )}
              </div>
            </BoxOptions>
          </div>
          </>
        ))}

        {votation && (
        <>
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
        </>
        )}
      </Container>

      {!votation && ( 
      <Typography style={{textAlign:'center'}} variant="h6" component="h2">
        Ainda não existe nenhuma eleição ativa para votação, volte mais tarde.
      </Typography>
      )}
    </Container>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const data = await prisma.votacao.findFirst({
      where: {
        status: 'ATIVO'
      },
    })

    if(!data) return {props:{data:null}}

    const alreadyVoted = await prisma.voto.findFirst({
      where: {
        usuario_id: 1,
        votacao_id: data?.id,
      },
    })

    console.log(alreadyVoted,'alreadyVoted');
    


    console.log(data.chapas.chapas[0].membros_chapa,'data');
    
    return {
      props: {
        data,
        alreadyVoted
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
