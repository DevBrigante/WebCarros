import { Container } from "../../components/container"
import LogoImg from '../../assets/logo.svg'
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from '../../services/firebaseConnection'
import { useEffect } from "react"
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export const Login = () => {

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth)
    }
    handleLogout();
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user

      toast.success("Logado com sucesso", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
      console.log("Usuário logado com sucesso", user)
      navigate("/dashboard", { replace: true })

    } catch (error) {
      console.log("Erro ao logar usuário", error)
      toast.error("Erro ao logar usuário", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
    }
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
        <Link to="/" className="mb-6 max-w-sm w-full">
          <img src={LogoImg} alt="Logo do site"
            className="w-full" />
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl w-full rounded-lg p-4">
          <div className="mb-3">
            <Input type="email"
              placeholder="Digite o seu email..."
              name="email"
              error={errors.email?.message}
              register={register} />
          </div>
          <div className="mb-3">
            <Input type="password"
              placeholder="Digite sua senha..."
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>
          <button type="submit" className="cursor-pointer bg-zinc-900 w-full rounded-md text-white h-10 font-medium">Acessar</button>
        </form>
        <Link to="/register" className="font-medium">
          Ainda não possui uma conta? Cadastre-se
        </Link>
      </div>

    </Container>
  )
}
