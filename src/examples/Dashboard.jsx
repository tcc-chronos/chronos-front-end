import Sidebar from '../components/Sidebar/Sidebar';
import Chart from '../components/Chart';
import Report from '../components/Report';
import { useState } from 'react';
import {
  trainForecastModel,
  getPredictedForecastData,
} from '../services/forecastService';

const Dashboard = () => {
  const [trainReport, setTrainReport] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado único e centralizado para TODOS os hiperparâmetros do sistema
  const [hyperparameters, setHyperparameters] = useState({
    rnn_type: 'gru',
    column_data: '',
    epochs: 1,
    n_steps_ahead: 1,

    // DataConfig
    window_size: 60,
    learning_rate: 0.001,
    dropout_rate: 0.2,
    early_stopping_patience: 5,

    // RNNConfig - inicialmente vazio, mas pode evoluir para armazenar camadas
    rnn_units: [128],
    dense_units: [64],

    // Extras (defaults)
    dense_activation: 'relu',
    bidirecional: false,
    batch_size: 16,
  });

  // Atualiza um campo do estado hyperparameters
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setHyperparameters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Atualiza camadas RNN
  const setRnnUnits = unitsArray => {
    setHyperparameters(prev => ({
      ...prev,
      rnn_units: unitsArray,
    }));
  };

  // Atualiza camadas Dense
  const setDenseUnits = unitsArray => {
    setHyperparameters(prev => ({
      ...prev,
      dense_units: unitsArray,
    }));
  };

  // Função para treinar e prever usando os hiperparâmetros atuais
  const handleTrainAndPredict = async () => {
    setLoading(true);
    try {
      // Converter epochs e n_steps_ahead para número, caso estejam vindo como string
      const sendParams = {
        ...hyperparameters,
        epochs: Number(hyperparameters.epochs),
        n_steps_ahead: Number(hyperparameters.n_steps_ahead),
        window_size: Number(hyperparameters.window_size),
        learning_rate: Number(hyperparameters.learning_rate),
        dropout_rate: Number(hyperparameters.dropout_rate),
        early_stopping_patience: Number(
          hyperparameters.early_stopping_patience
        ),
        bidirecional: Boolean(hyperparameters.bidirecional),
        batch_size: Number(hyperparameters.batch_size),
      };

      const trainResponse = await trainForecastModel(sendParams);
      setTrainReport(trainResponse);

      const predictionResponse = await getPredictedForecastData({
        rnn_type: sendParams.rnn_type,
        n_steps_ahead: sendParams.n_steps_ahead,
      });

      const dadosReais = predictionResponse?.real_values || [];
      const previsoes = predictionResponse?.forecast_values || [];

      const combinedData = previsoes.map(
        ([dataHoraPrevista, valorPrevisto]) => {
          const dadoReal = dadosReais.find(
            ([dataHora]) => dataHora === dataHoraPrevista
          );
          return {
            dataHora: dataHoraPrevista,
            real: dadoReal ? dadoReal[1] : null,
            previsao: valorPrevisto,
          };
        }
      );

      setChartData(combinedData);
    } catch {
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex w-full h-[calc(100vh-70px)]'>
      <Sidebar
        loading={loading}
        hyperparameters={hyperparameters}
        handleChange={handleChange}
        setRnnUnits={setRnnUnits}
        setDenseUnits={setDenseUnits}
        onTrainAndPredict={handleTrainAndPredict}
      />
      <div className='flex flex-col w-full'>
        <Chart
          columnData={hyperparameters.column_data}
          chartData={chartData}
          loading={loading}
          onTrainAndPredict={handleTrainAndPredict}
        />
        <Report trainResponse={trainReport} />
      </div>
    </div>
  );
};

export default Dashboard;
