import { Container } from "../../components/container"
import { useState, useEffect } from "react"
import {
  collection,
  query,
  getDocs,
  orderBy,
  where

} from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { Link } from "react-router-dom"


interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: string | number;
  city: string;
  km: string;
  images: carImagesProps[]
}


interface carImagesProps {
  name: string;
  uid: string;
  url: string;
}

export const Home = () => {

  const [cars, setCars] = useState<CarsProps[]>([])
  const [loadImages, setLoadImages] = useState<string[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    loadCars();
  }, [])

  const loadCars = () => {
    const carRefs = collection(db, "cars")
    const queryRefs = query(carRefs, orderBy("created", "desc"))

    getDocs(queryRefs)
      .then((snapshot) => {
        const listCars = [] as CarsProps[];

        snapshot.forEach((doc) => {
          listCars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            price: doc.data().price,
            images: doc.data().images,
            uid: doc.data().uid
          })
        })

        setCars(listCars)

      })

  }

  const handleImageLoad = (id: string) => {
    setLoadImages((prevLoadImages => [...prevLoadImages, id]))
  }


  const handleSearchCar = async () => {
    if (!input) {
      loadCars()
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(collection(db, "cars"),
      where("name", ">=", input.toLocaleUpperCase()),
      where("name", "<=", input.toLocaleUpperCase() + "\uf8ff")
    )

    const querySnapshot = await getDocs(q)
    const listCars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
      listCars.push({
        id: doc.id,
        name: doc.data().name,
        year: doc.data().year,
        km: doc.data().km,
        city: doc.data().city,
        price: doc.data().price,
        images: doc.data().images,
        uid: doc.data().uid
      })
    })

    setCars(listCars);
    setInput("")
  }



  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input placeholder="Digite o nome do carro"
          className="w-full border-2 rounded-lg h-9 px-3 outline-none" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg cursor-pointer" onClick={handleSearchCar}>
          Buscar</button>
      </section>
      <h1 className="font-bold text-center mt-6 text-2xl mb-4">Carros novos e usados em todo o Brasil</h1>
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/car/${car.id}`}>
            <section className="w-full bg-white rounded-lg">
              <div className="w-full h-72 rounded-lg bg-slate-200"
                style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
              ></div>
              <img src={car.images[0].url}
                alt={car.images[0].name}
                onLoad={() => handleImageLoad(car.id)}
                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all duration-300"
                style={{ display: loadImages.includes(car.id) ? "block" : "none" }} />
              <p className="font-bold mt-1 mb-2 px-2">{car.name.toLocaleUpperCase()}</p>
              <div className="flex flex-col px-2">
                <span className="text-zinc-700 mb-6">{car.year} | {car.km} km</span>
                <strong className="text-black font-medium text-xl">R${car.price}</strong>
              </div>
              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2">
                <span className="text-zinc-700">{car.city.toLocaleUpperCase()}</span>
              </div>
            </section>
          </Link>
        ))}
      </main>
    </Container>
  )
}