function Report({ trainResponse }) {
  if (!trainResponse) return null;

  const {
    success,
    training_time,
    training_datetime,
    mean_absolute_error,
    root_mean_squared_error,
  } = trainResponse;

  const formatDatetime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', { hour12: false });
  };

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-500 m-2 mt-0 ml-8'>
        Relatório
      </h1>
      <div className='flex flex-row'>
        <div className='flex flex-col gap-2 justify-between bg-white rounded-2xl shadow-lg p-5 m-6 mt-0 w-1/2'>
          <p className='font-bold text-lg text-gray-600'>
            Status:{' '}
            <span className='font-normal text-gray-600'>
              {success ? 'Sucesso' : 'Falha'}
            </span>
          </p>
          <p className='font-bold text-lg text-gray-600'>
            Último treinamento:{' '}
            <span className='font-normal text-gray-600'>
              {formatDatetime(training_datetime)}
            </span>
          </p>
          <p className='font-bold text-lg text-gray-600'>
            Tempo de treinamento:{' '}
            <span className='font-normal text-gray-600'>
              {training_time.toFixed(1)} segundos
            </span>
          </p>
        </div>

        <div className='flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-4 m-6 mt-0 w-1/4'>
          <p className='text-center font-bold text-3xl m-2 text-gray-600'>
            MAE
          </p>
          <p className='text-primary font-bold text-center text-6xl m-1 text-gray-600'>
            {mean_absolute_error.toFixed(3)}
          </p>
        </div>
        <div className='flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-4 m-6 mt-0 w-1/4'>
          <p className='text-center font-bold text-3xl m-2 text-gray-600'>
            RMSE
          </p>
          <p className='text-primary font-bold text-center text-6xl m-1 text-gray-600'>
            {root_mean_squared_error.toFixed(3)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Report;
