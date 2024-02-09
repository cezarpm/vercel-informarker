import { TextInput } from "@/components/TextInput";

import { Container, Description, Title } from './styled'
import { Button } from "@/components/Button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const schemaChapaForm = z.object({
    email: z.string().email({ message: 'Email inválido' }),
    senha: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
})

export default function Auth({ data }: any) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schemaChapaForm),
    })

    const onSubmit = async (data: any) => {
        console.log(data)

        sessionStorage.setItem('token', '123')

        router.push('/')
        window.location.reload()
    }

    return (
        <Container>
            <div>
                <Title>Entre na sua conta</Title>
                <Description>Entre com seu email e senha</Description>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    title="Email"
                    {...register('email')}
                    error={errors.email?.message}
                    helperText={errors.email?.message}
                />


                <TextInput
                    title="Senha"
                    type="password"
                    {...register('senha')}
                    error={errors.senha?.message}
                    helperText={errors.senha?.message}
                />


                <Button
                    type="submit"
                    title={'Entrar'}
                />
            </form>
        </Container>
    )
}
