import { Container } from "../../../components/container"
import { DashboardHeader } from "../../../components/panelHeader"
import { FiUpload, FiTrash } from "react-icons/fi"
import { useForm } from "react-hook-form"
import { Input } from "../../../components/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangeEvent, useState, useContext } from "react"
import { AuthContext } from "../../../contexts/authContext"
import { v4 as uuidV4 } from 'uuid' // Podemos usar para gerar uid aleatório
import { storage, db } from '../../../services/firebaseConnection'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { addDoc, collection } from "firebase/firestore"
import toast from "react-hot-toast"

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O ano do carro é obrigatório"),
    km: z.string().nonempty("O km do carro é obrigatório"),
    price: z.string().nonempty("O valor do carro é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatória"),
    whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{10,12})$/.test(value), {
        message: "Número de telefone inválido"
    }),
    description: z.string().nonempty("A descrição é obrigatória")

})

type FormData = z.infer<typeof schema>

interface ImageItensProps {
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export const New = () => {
    const { user } = useContext(AuthContext);
    const [images, setImages] = useState<ImageItensProps[]>([])
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    const onSubmit = (data: FormData) => {
        if (images.length == 0) {
            toast.error("Envie pelo menos 1 imagem!", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })
            return
        }


        const carListImages = images.map((car) => {
            return {
                uid: car.uid,
                name: car.name,
                url: car.url
            }
        })
        addDoc(collection(db, "cars"), {
            name: data.name.toLocaleUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages
        })
            .then(() => {
                reset();
                setImages([])
                toast.success("Carro cadastrado com sucesso!", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff'
                    }
                })
            })
            .catch((error) => {
                console.log("Erro ao cadastrar no banco", error)
            })

    }

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image);
            } else {
                alert("Envie um arquivo jpeg ou png!")
                return;
            }
        }
    }

    const handleUpload = async (image: File) => {
        if (!user?.uid) {
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();
        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`) // Criando uma pasta com o uid do usuário e nome da imagem que está dentro da minha const v4. 
        // Agora eu tenho a referência de onde está minha imagem.

        try {
            const snapshot = await uploadBytes(uploadRef, image);
            const downloadUrl = await getDownloadURL(snapshot.ref)
            const imageItem = {
                name: uidImage,
                uid: currentUid,
                previewUrl: URL.createObjectURL(image),
                url: downloadUrl
            };
            setImages((images) => [...images, imageItem])
            toast.success("Imagem cadastrada com sucesso!", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff'
                }
            })

        } catch (error) {
            console.error("Erro ao fazer upload da imagem", error)
        }

    }

    const handleDeleteImage = async (item: ImageItensProps) => {
        const imagePath = `images/${item.uid}/${item.name}`
        const imageRef = ref(storage, imagePath);

        try {
            await deleteObject(imageRef)
            setImages(images.filter((car) => car.url !== item.url))
        } catch (error) {
            console.error("Erro em excluir", error)
        }

    }

    return (
        <Container>
            <DashboardHeader />
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="cursor-pointer border-2 w-48 rounded-lg flex items-center justify-center borde-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input type="file" accept="image/*" className="opacity-0 cursor-pointer"
                            onChange={handleFile} />
                    </div>
                </button>

                {images.map((item) => (
                    <div key={item.name} className="w-full h-32 flex items-center justify-center rel">
                        <button className="absolute cursor-pointer" onClick={() => handleDeleteImage(item)}>
                            <FiTrash size={28} color="#FFF" />
                        </button>
                        <img src={item.previewUrl} className="rounded-lg w-full h-32 object-cover" alt="Foto do carro" />
                    </div>
                ))}
            </div>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0" />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: Flex Plus MANUAL..." />
                    </div>
                    <div className=" flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano</p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2016/2017" />
                        </div>
                        <div className="w-full">
                            <p className="mb-2 font-medium">Km rodados</p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 23.900" />
                        </div>
                    </div>
                    <div className=" flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone/Whatsapp</p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: 1197609251" />
                        </div>
                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: São Paulo" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 62.000" />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea className="border-2 w-full rounded-md h-24 px-2"
                            {...register("description")} name="description" id="description"
                            placeholder="Digite a descrição completa sobre o carro" />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>
                    <button type="submit" className="rounded-md bg-zinc-900 text-white w-full h-10 font-medium cursor-pointer">Cadastrar</button>
                </form>
            </div>
        </Container>
    )
}


