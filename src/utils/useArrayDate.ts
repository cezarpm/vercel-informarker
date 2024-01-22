import { formatISO, parse } from 'date-fns'

class ArrayDate {
  AnoAtualMaior() {
    const yearsCurrent = new Date().getFullYear()

    const years = Array.from({ length: 10 }, (_, index) =>
      (yearsCurrent + index).toString(),
    )
    const dataYears = years.map((year) => {
      return {
        label: year,
      }
    })
    return dataYears
  }

  AnoAtualMenor() {
    const yearsCurrent = new Date().getFullYear()

    const years = Array.from({ length: 90 }, (_, index) =>
      (yearsCurrent - index).toString(),
    )
    const dataYears = years.map((year) => {
      return {
        label: year,
      }
    })
    return dataYears
  }

  Mes() {
    const months = Array.from({ length: 12 }, (_, index) => ({
      label: (index + 1).toString(),
    }))
    const dataMonths = months.map((item) => item)
    return dataMonths
  }

  Dia() {
    const days = Array.from({ length: 31 }, (_, index) => ({
      label: (index + 1).toString(),
    }))
    const dataDays = days.map((item) => item)
    return dataDays
  }

  MontarDate(year: any, month: any, day: any) {
    if (year.toString().length < 4) {
      // Obtém o ano atual com quatro dígitos
      const currentYear = new Date().getFullYear()

      // Verifica se o ano deve ser considerado no século 21 ou século 20
      const century = currentYear - (currentYear % 100)
      year = century + parseInt(year, 10)
    }
    const date = formatISO(
      parse(`${year}-${month}-${day}`, 'yyyy-MM-dd', new Date()),
    )
    console.log(date)
    return date
  }

  DesestruturarDate(date: any) {
    const resultConvert = new Date(date)

    const dia = resultConvert.getUTCDate().toString()
    const mes = (resultConvert.getUTCMonth() + 1).toString()
    const ano = resultConvert.getUTCFullYear().toString()

    return { dia, mes, ano }
  }

  extrairComponentesData(data: any) {
    if (!data) {
      // Lidar com o caso em que 'data' é undefined
      console.error('Data é undefined')
      return {
        dia: 0,
        mes: 0,
        ano: 0,
      }
    }

    const partes = data.split('/')

    if (partes.length !== 3) {
      // Lidar com o caso em que 'data' não possui o formato esperado
      console.error('Formato de data inválido')
      return {
        dia: 0,
        mes: 0,
        ano: 0,
      }
    }

    const dia = partes[0]
    const mes = partes[1]
    let ano = partes[2]

    if (!dia || !mes || !ano) {
      // Lidar com o caso em que partes não possui os 3 elementos esperados
      console.error('Formato de data inválido')
      return {
        dia: 0,
        mes: 0,
        ano: 0,
      }
    }

    // Se o ano tiver apenas dois dígitos, adicione "19" ou "20" com base na lógica do seu sistema
    if (ano.length === 2) {
      ano = (parseInt(ano) > 21 ? '19' : '20') + ano
    }

    const diaInt = parseInt(dia)
    const mesInt = parseInt(mes)
    const anoInt = parseInt(ano)

    // Verifique se a data é válida
    if (
      isNaN(diaInt) ||
      isNaN(mesInt) ||
      isNaN(anoInt) ||
      diaInt <= 0 ||
      mesInt <= 0 ||
      anoInt <= 0
    ) {
      console.error('Data inválida')
      return {
        dia: 0,
        mes: 0,
        ano: 0,
      }
    }

    return {
      dia: diaInt,
      mes: mesInt,
      ano: anoInt,
    }
  }
}

export const useArrayDate = new ArrayDate()
