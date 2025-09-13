const NotFound = () => {
  return (
    <div className="text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <a
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Voltar para Home
        </a>
      </div>
    </div>
  )
}

export default NotFound