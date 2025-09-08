import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-300 mb-6">
          Página não encontrada
        </h2>
      </div>
    </div>
  );
};

export default NotFoundPage;
