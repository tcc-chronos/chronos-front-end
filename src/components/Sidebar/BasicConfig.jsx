import { useHyperparametersForm } from "../../hooks/useHyperparametersForm";
import InputNumber from "../Form/InputNumber";
import SelectInput from "../Form/SelectInput";
import { useEffect, useState } from "react";
import { fetchTargets } from "../../services/targetService";

const BasicConfig = () => {

  const { hyperparameters, handleChange } = useHyperparametersForm();
  const rnnOptions = [
    { value: "LSTM", label: "LSTM" },
    { value: "GRU", label: "GRU" },
  ];

  const [targets, setTargets] = useState([]);

  useEffect(() => {
    async function loadTargets() {
      const result = await fetchTargets();
      setTargets(result);
    }

    loadTargets();
  }, []);

  return (
    <div>
      <h1 className="font-bold mb-4">Configuração Básica</h1>
      <form>
        <SelectInput
          id="rnn_type"
          label="Modelo:"
          value={hyperparameters.rnn_type}
          onChange={handleChange}
          options={rnnOptions}
          required
        />
        <SelectInput
          id="column_data"
          label="column_data:"
          value={hyperparameters.column_data}
          onChange={handleChange}
          options={targets}
          required
        />
        <InputNumber
          id="epochs"
          label="Épocas:"
          value={hyperparameters.epochs}
          onChange={handleChange}
          placeholder="0"
          required
        />
        <InputNumber
          id="n_steps_ahead"
          label="n_steps_ahead:"
          value={hyperparameters.n_steps_ahead}
          onChange={handleChange}
          placeholder="0"
          required
        />
      </form>
    </div>
  );
};

export default BasicConfig;
