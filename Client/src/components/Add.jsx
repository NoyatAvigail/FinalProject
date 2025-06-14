import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CurrentUser } from "./App";
import { CodesContext } from './Models';
import { userService } from "../services/usersServices";

function Add({ setIsChange = () => { }, inputs, defaultValue, name = "Add", type }) {
    const { currentUser } = useContext(CurrentUser);
    const [isScreen, setIsScreen] = useState(0);
    const { codes, loading } = useContext(CodesContext);
    const userTypeObj = codes?.UserTypes?.find(type => type.id == currentUser?.type)?.description;
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            ...defaultValue,
            userId: currentUser.id
        },
    });

    const addFunc = async (body) => {
        reset();
        setIsScreen(0);
        try {
            await userService.create(
                currentUser.autoId,
                userTypeObj,
                type,
                body,
                (result) => {
                    console.log("add successful:", result);
                    setIsChange(1);
                    reset();
                },
                (error) => {
                    console.log("add was unsuccessful", error);
                }
            );
        } catch (error) {
            console.log("Unexpected error:", error);
        }
    };

    const formatDateToISO = (inputDate) => {
        if (!inputDate) return null;
        const parts = inputDate.split("-");
        if (parts.length !== 3) return inputDate;
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    const handleCancel = () => {
        reset();
        setIsScreen(0);
    };

    return (
        <>
            {isScreen === 0 && (
                <button className="addBtn" onClick={() => setIsScreen(1)}>{name}</button>
            )}
            {isScreen === 1 && (
                <form onSubmit={handleSubmit(addFunc)}>
                    {inputs.map((input, index) => {
                        const inputName = typeof input === "string" ? input : input.name;
                        const inputType = typeof input === "string" ? "text" : input.type || "text";
                        const options = typeof input === "object" && input.options;

                        return (
                            <div key={index}>
                                {inputType === "select" ? (
                                    <select {...register(inputName, { required: true })}>
                                        <option value="">choose {inputName}</option>
                                        {options?.map((option, i) => (
                                            <option key={i} value={option.value ?? option}>
                                                {option.label ?? option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={inputType}
                                        {...register(inputName, { required: true })}
                                        placeholder={`Enter ${inputName}`}
                                    />
                                )}
                                {errors[inputName] && <span>{inputName} is required</span>}
                            </div>
                        );
                    })}
                    <button className="add" type="submit">OK</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </>
    );
}

export default Add;