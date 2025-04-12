import { RegisterOptions, UseFormRegister } from "react-hook-form";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface InputProps {
    name: string;
    type: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}

export const Input = ({ name, placeholder, type, register, rules, error }: InputProps) => {
    return (
        <div>
            <input type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}
                className="w-full border-2 rounded-md h-11 px-2" />
            {error && <p className="my-2 text-red-500 text-center">{error}</p>}
        </div>
    )
}




