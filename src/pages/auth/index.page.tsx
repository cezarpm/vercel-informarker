import { TextInput } from "@/components/TextInput";

import { Container, Description, Title } from './styled'
import { Button } from "@/components/Button";

export default function Auth({ data }: any) {
    return (
        <Container>
            <div>
                <Title>Entre na sua conta</Title>
                <Description>Entre com seu email e senha</Description>
            </div>

            <TextInput
                title="Email"
            />


            <TextInput
                title="Senha"
            />


            <Button
                type="submit"
                title={'Entrar'}
            />


            <p> Se não tiver uma conta, <a href="/auth/cadastro"> crie uma  aqui</a></p>
        </Container>
    )
}
