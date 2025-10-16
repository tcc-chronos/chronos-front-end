# 🎯 Como Visualizar os Componentes do Dashboard

Este guia explica como visualizar os novos componentes criados para o Dashboard.

## 📋 Componentes Criados

1. **LineChart** - Gráfico de linha para visualizar previsões vs valores reais
2. **TrainingMetricsReport** - Relatório de métricas de treinamento (MAE, RMSE, etc.)

## 🚀 Visualização Rápida com Dados Mockados

Para visualizar os componentes imediatamente com dados de exemplo:

### Passo 1: Editar DashboardPage.tsx

Abra o arquivo: `src/components/pages/DashboardPage/DashboardPage.tsx`

### Passo 2: Descomentar Imports de Mock

Localize e **descomente** estas linhas (por volta da linha 10):

```tsx
// Mock data - Descomente as linhas abaixo para visualizar os componentes com dados de exemplo
import {
  mockChartData,
  mockTrainingMetrics,
} from '../../../mocks/dashboardMockData';
```

### Passo 3: Usar Dados Mockados

Localize estas linhas (por volta da linha 24):

```tsx
const [chartData] = useState<ChartDataPoint[]>([]);
const [trainingMetrics] = useState<TrainingMetrics | null>(null);
```

E **substitua por**:

```tsx
const [chartData] = useState<ChartDataPoint[]>(mockChartData);
const [trainingMetrics] = useState<TrainingMetrics | null>(mockTrainingMetrics);
```

### Passo 4: Executar Aplicação

```bash
npm run dev
```

Acesse `http://localhost:5173` e navegue até a página Dashboard.

## 📊 Dados de Exemplo

Os dados mockados incluem:

### Chart Data (mockChartData)

- 11 pontos de dados
- Período: 15/01/2024, 08:00 - 18:00
- Valores reais disponíveis até 15h
- Previsões futuras de 16h a 18h
- Range de temperatura: 23.5°C - 29.5°C

### Training Metrics (mockTrainingMetrics)

- **Status**: Sucesso ✅
- **Tempo de treinamento**: 127.5 segundos
- **Data do treinamento**: 15/01/2024 às 07:30
- **MAE**: 0.342
- **RMSE**: 0.518

### Dados de Falha (mockFailedTrainingMetrics)

Para testar o estado de falha, substitua `mockTrainingMetrics` por `mockFailedTrainingMetrics`:

```tsx
const [trainingMetrics] = useState<TrainingMetrics | null>(
  mockFailedTrainingMetrics
);
```

## 🔄 Integração com API Real

Quando a API estiver pronta, siga este padrão:

```tsx
import { useEffect, useState } from 'react';
import { predictionService } from '../../../services/predictionService';

const DashboardPage: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [trainingMetrics, setTrainingMetrics] =
    useState<TrainingMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  const handlePrediction = async (modelId: string, trainingId: string) => {
    setIsLoading(true);
    try {
      // Buscar previsões
      const predictionResponse = await predictionService.getPredictions({
        modelId,
        trainingId,
      });

      setChartData(predictionResponse.data);
      setSelectedColumn(predictionResponse.columnName);

      // Buscar métricas do treinamento
      const metricsResponse =
        await predictionService.getTrainingMetrics(trainingId);

      setTrainingMetrics(metricsResponse);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      // Adicionar tratamento de erro (toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  // Passar handlePrediction para DashboardSidebarContent
  // para ser chamado quando o usuário selecionar um modelo

  return (
    <div className='space-y-6'>
      <LineChart
        data={chartData}
        columnName={selectedColumn}
        loading={isLoading}
        className='min-h-[500px]'
      />
      <TrainingMetricsReport metrics={trainingMetrics} />
    </div>
  );
};
```

## 🧪 Testar Estados Diferentes

### Estado Vazio (Padrão)

```tsx
const [chartData] = useState<ChartDataPoint[]>([]);
const [trainingMetrics] = useState<TrainingMetrics | null>(null);
```

### Estado de Loading

```tsx
const [isLoading] = useState(true);
```

### Estado com Dados

```tsx
const [chartData] = useState<ChartDataPoint[]>(mockChartData);
const [trainingMetrics] = useState<TrainingMetrics | null>(mockTrainingMetrics);
```

## 📱 Responsividade

Os componentes são totalmente responsivos:

- **Desktop**: Layout completo com todos os cards lado a lado
- **Tablet**: Cards empilhados verticalmente
- **Mobile**: Layout otimizado para telas pequenas

Teste redimensionando a janela do navegador!

## 🎨 Customização

### LineChart

```tsx
<LineChart
  data={chartData}
  columnName='Temperatura (°C)'
  loading={false}
  className='min-h-[500px] bg-gray-50' // Adicione classes customizadas
/>
```

### TrainingMetricsReport

```tsx
<TrainingMetricsReport
  metrics={trainingMetrics}
  className='my-8 px-4' // Adicione classes customizadas
/>
```

## 🐛 Troubleshooting

### Gráfico não aparece

- Verifique se `recharts` está instalado: `npm list recharts`
- Confirme que os dados seguem a interface `ChartDataPoint`

### Relatório não aparece

- Verifique se `trainingMetrics` não é `null`
- Confirme que os dados seguem a interface `TrainingMetrics`

### Erros de TypeScript

- Execute: `npm install`
- Reinicie o servidor: `npm run dev`

## 📚 Documentação Adicional

- [README dos Componentes](./README.md)
- [Instruções do Projeto](../../../.github/copilot-instructions.md)
- [Documentação Recharts](https://recharts.org/)

---

**Nota**: Lembre-se de remover os dados mockados após implementar a integração com a API real!
