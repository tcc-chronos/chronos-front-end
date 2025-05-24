import { useEffect, useState } from "react";
import { defaultHyperparameters } from "../models/hyperparameters";

export const useHyperparametersForm = () => {
  const [hyperparameters, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("hyperparameters");
    return saved ? JSON.parse(saved) : defaultHyperparameters;
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    sessionStorage.setItem("hyperparameters", JSON.stringify(hyperparameters));
  }, [hyperparameters]);

  return { hyperparameters, setFormData, handleChange };
};