
# 🚗 WebCarros

**WebCarros** é uma plataforma web moderna desenvolvida com **React + TypeScript**, que permite aos usuários cadastrar, visualizar e gerenciar carros de forma prática e intuitiva. O projeto foi estilizado com **TailwindCSS** e conta com autenticação e banco de dados usando **Firebase**.

## ✨ Funcionalidades

- Cadastro de usuários com **email e senha**
- Login com autenticação Firebase
- Dashboard com listagem de carros cadastrados
- Cadastro de novo carro com upload de imagens
- Detalhamento completo do carro
- Exclusão de carros
- Validações de formulário com **Zod + React Hook Form**
- Contexto global de autenticação com React Context API
- Feedbacks visuais com **toast notifications**

---

## 🚀 Tecnologias e Ferramentas

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Firebase Auth](https://firebase.google.com/products/auth)
- [Firebase Firestore](https://firebase.google.com/products/firestore)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://github.com/colinhacks/zod)
- [Vite](https://vitejs.dev/)
- [React Router DOM](https://reactrouter.com/en/main)

---

## ⚙️ Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/webcarros.git

# Acesse a pasta
cd webcarros

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🔐 Configuração do Firebase

1. Crie um projeto no Firebase.
2. Habilite **Authentication** com método Email/Senha.
3. Crie um banco de dados **Firestore** com coleção chamada `cars`.
4. Adicione um arquivo `.env` com as chaves do seu Firebase:

```env
VITE_API_KEY=SUACHAVE
VITE_AUTH_DOMAIN=SEUDOMINIO
VITE_PROJECT_ID=SEUID
VITE_STORAGE_BUCKET=SEUBUCKET
VITE_MESSAGING_SENDER_ID=SEUID
VITE_APP_ID=SEUAPPID
```

---

## 🧪 Exemplos de Código

**Input com validação e integração com React Hook Form:**

```tsx
<input
  type={type}
  placeholder={placeholder}
  {...register(name, rules)}
  id={name}
  className="w-full border-2 rounded-md"
/>
{error && <p className="text-red-500">{error}</p>}
```

**Login com Firebase:**

```tsx
const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
```

**Cadastro com Firebase + updateProfile:**

```tsx
const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
await updateProfile(userCredential.user, { displayName: data.name });
```

---

## 💡 Aprendizados e Destaques

- Implementação de autenticação segura com **Firebase**
- Criação de formulário robusto com **validações em tempo real**
- Manipulação de **contexto global** com React para estado do usuário
- Upload e listagem dinâmica de imagens
- Separação limpa de responsabilidades entre **componentes**, **páginas** e **serviços**

---


## 📝 Licença

Este projeto está sob a licença MIT.
