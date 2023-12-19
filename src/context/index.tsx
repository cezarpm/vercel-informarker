// contexts/SelecaoContext.tsx

import React, { createContext, useContext, ReactNode } from 'react'

type schemaContext = {
  selectedRowIds: any
  setSelection: any
  updateListAll: boolean
  setUpdateListAll: any
}

// Criando o contexto
const SelecaoContext = createContext<schemaContext | undefined>(undefined)

// Definindo o tipo para o provider
type schemaProvider = {
  children: ReactNode
}

// Criando o provider
export const SelecaoProvider: React.FC<schemaProvider> = ({ children }) => {
  const [selectedRowIds, setSelectedRowIds] = React.useState<number[]>([])
  const [updateListAll, setUpdateListAll] = React.useState<boolean>(false)
  const setSelection = (newSelection: number[]) => {
    setSelectedRowIds(newSelection)
  }

  return (
    <SelecaoContext.Provider
      value={{ selectedRowIds, setSelection, updateListAll, setUpdateListAll }}
    >
      {children}
    </SelecaoContext.Provider>
  )
}

// Criando um hook personalizado para usar o contexto
export const useId = (): schemaContext => {
  const context = useContext(SelecaoContext)

  if (!context) {
    throw new Error('useId deve ser usado dentro de um SelecaoProvider')
  }

  return context
}
