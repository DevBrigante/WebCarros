import { Container } from "../../components/container"
import LogoImg from '../../assets/logo.svg'
import { Link, useNavigate } from "react-router-dom"
import { Input } from "../../components/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { auth } from "../../services/firebaseConnection"
import { createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { useEffect, useContext } from "react"
import { AuthContext } from "../../contexts/authContext"
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").nonempty("O campo senha é obrigatório")
})
  .strict(); // Garante que apenas os campos definidos sejama aceitos

type FormData = z.infer<typeof schema>

export const Register = () => {

  const { handleInfoUser } = useContext(AuthContext)

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
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user

      await updateProfile(user, { displayName: data.name });

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: user.uid
      })

      toast.success("Bem vindo ao WebCarros", {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff'
        }
      })
      navigate("/dashboard", { replace: true })

    } catch (error) {
      console.log("Erro ao cadastrar o usuário:", error)
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
            <Input type="text"
              placeholder="Digite o seu nome completo..."
              name="name"
              error={errors.name?.message}
              register={register} />
          </div>
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
          <button type="submit" className="cursor-pointer bg-zinc-900 w-full rounded-md text-white h-10 font-medium">Cadastrar</button>
        </form>
        <Link to="/login" className="font-medium">
          Já possui uma conta? Faça um login
        </Link>
      </div>

    </Container>
  )
}
