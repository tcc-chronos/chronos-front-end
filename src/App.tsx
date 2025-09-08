import { useRoutes } from 'react-router-dom';
import RootLayout from './app/layout';
import { routes } from './app/routes';

function App() {
  const element = useRoutes(routes);

  return (
    <RootLayout>
      {element}
    </RootLayout>
  );
}

export default App;
