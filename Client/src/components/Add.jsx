import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { CurrentUser } from "./App";
import { useCodes } from "../components/Models";
import { createHandler } from "../services/servicesSelector";
import '../style/Add.css'

function Add({
    setIsChange = () => { },
    inputs,
    defaultValue,
    name = "Add",
    type,
    onSuccess = null
}) {
    const { currentUser } = useContext(CurrentUser);
    const [isScreen, setIsScreen] = useState(0);
    const { codes } = useCodes();
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            ...defaultValue,
        },
    });

    function formatDateForSql(input) {
        const date = new Date(input);
        if (isNaN(date)) return null;
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const addFunc = async (body) => {
        if (!body.hospitalizationEnd || body.hospitalizationEnd == "Invalid date" || body.hospitalizationEnd.trim() === "") {
            body.hospitalizationEnd = null;
        }
        if (body.hospitalizationStart)
            body.hospitalizationStart = formatDateForSql(body.hospitalizationStart);
        if (body.hospitalizationEnd)
            body.hospitalizationEnd = formatDateForSql(body.hospitalizationEnd);
        reset();
        setIsScreen(0);
        try {
            await createHandler({
                type,
                body,
                onSuccess: () => {
                    console.log("Update successful");
                    if (onSuccess) onSuccess();
                    else setIsChange(prev => (prev === 0 ? 1 : 0));
                },
                onError: (error) => {
                    console.error("Add was unsuccessful", error);
                }
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const handleCancel = () => {
        reset();
        setIsScreen(0);
    };

    return (
        <div className="add-form">
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
                                    <select
                                        {...register(inputName, { required: true })}
                                        onChange={(e) => {
                                            if (typeof input === "object" && typeof input.onChange === "function") {
                                                input.onChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">choose {inputName}</option>
                                        {options?.map((option, i) => (
                                            <option key={i} value={option.value ?? option}>
                                                {typeof option === 'object' ? option.label : option}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={inputType}
                                        {...register(inputName, inputName === "hospitalizationEnd" ? {} : { required: true })}
                                        placeholder={`Enter ${inputName}`}
                                        onChange={(e) => {
                                            if (typeof input === "object" && typeof input.onChange === "function") {
                                                input.onChange(e);
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                    <button className="add" type="submit">OK</button>
                    <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
            )}
        </div>
    );
}

export default Add;