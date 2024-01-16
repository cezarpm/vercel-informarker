'use client'

import { jsPDF } from 'jspdf'

interface EtiquetaProps {
  id: number
  cod_empresa?: string
  tipo_empresa?: string
  patrocinadora?: boolean
  faculdade_anestesiologia?: boolean
  empresa_ativa?: boolean
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  cep?: string
  logradouro?: string
  numero?: number
  complemento?: string
  cidade?: string
  uf?: string
  pais?: string
  bairro?: string
  telefone_comercial?: string
  tratamento_contato_primario?: string
  nome_contato_primario?: string
  cargo_contato_primario?: string
  email_contato_primario?: string
  telefone_contato_primario?: string
  tratamento_contato_secundario?: string
  nome_contato_secundario?: string
  cargo_contato_secundario?: string
  email_contato_secundario?: string
  telefone_contato_secundario?: string
  home_page?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  observacoes?: string
}

export const EtiquetaPDFCompany = (
  etiqueta: EtiquetaProps[],
  exibirContatoPrimario: boolean,
) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  })

  console.log('etiqueta', etiqueta)

  etiqueta.map((etiqueta, index) => {
    const {
      cod_empresa,
      bairro,
      cep,
      cidade,
      complemento,
      logradouro,
      numero,
      uf,
      nome_contato_primario,
      nome_contato_secundario,
    } = etiqueta

    const contato = exibirContatoPrimario
      ? nome_contato_primario
      : nome_contato_secundario

    const startX = index % 2 === 0 ? 10 : 110
    const startY = Math.floor(index / 2) * 40 // Aumentei o espaçamento vertical para 40 unidades

    const borderWidth = 90
    const borderHeight = 30
    doc.rect(startX, 5 + startY, borderWidth, borderHeight)

    doc.setFontSize(12)
    const splitNome = doc.splitTextToSize(`${cod_empresa}`, 80)
    doc.text(splitNome, startX + 4, 12 + startY)

    doc.setFontSize(10)
    const splitEndereco = doc.splitTextToSize(
      `${logradouro} , ${numero} ${complemento}`,
      80,
    )
    doc.text(splitEndereco, startX + 4, 17 + startY)

    const splitBairro = doc.splitTextToSize(`${cep} - ${cidade} / ${uf}`, 80)
    doc.text(splitBairro, startX + 4, 22 + startY)

    const splitCidade = doc.splitTextToSize(`${contato}`, 80)
    doc.text(splitCidade, startX + 4, 27 + startY)
  })

  doc.save('etiquetas.pdf')
}
