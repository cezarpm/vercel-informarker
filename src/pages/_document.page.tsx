import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-br">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      ></link>
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* <footer>
          <p>
            Todos os direitos reservados <Copyright size={12} />
            2024
          </p>
        </footer> */}
      </body>
    </Html>
  )
}
