import { Link } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConnection"



export const DashboardHeader = () => {

    const handleLogout = async () => {
        await signOut(auth)
    }

    return (
        <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium px-4 gap-4 mb-4">
            <Link to="/dashboard">
                Dashboard
            </Link>
            <Link to="/dashboard/new">
                Cadastrar novo carro
            </Link>

            <button onClick={handleLogout} className="ml-auto cursor-pointer">Sair da conta</button>
        </div>
    )
}