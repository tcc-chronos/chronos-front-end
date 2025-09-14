# NumberInputField Component

## Descrição

O `NumberInputField` é um componente de input para números que segue a arquitetura atômica do projeto Chronos. Ele combina vários átomos para criar uma experiência completa de entrada de dados numéricos com validações, formatação e feedback visual.

## Características

- ✅ **Entrada de números decimais** com suporte ao ponto (.) como separador
- ✅ **Validação de valor mínimo e máximo** configurável
- ✅ **Formatação automática** no blur para exibição limpa
- ✅ **Label com indicador de obrigatório** (\*)
- ✅ **Ícone de informação com tooltip** no hover
- ✅ **Mensagem de erro** com ícone visual
- ✅ **Mensagem de ajuda** quando não há erro
- ✅ **Acessibilidade completa** com ARIA attributes
- ✅ **Suporte a números negativos** (configurável)
- ✅ **Diferentes tamanhos** (sm, md, lg)
- ✅ **Estilização consistente** com o design system

## Componentes Utilizados

### Átomos

- `NumberInput`: Input básico para números
- `Icon`: Ícones do sistema (info, error)
- `Tooltip`: Tooltip informativo

### Moléculas

- `NumberInputField`: Composição final com label, input e mensagens

## API Props

```typescript
interface NumberInputFieldProps {
  // Básicas
  label: string; // Texto da label
  id: string; // ID único do campo

  // Valor e mudança
  value?: number | string; // Valor atual
  onChange?: (value: number | undefined) => void; // Callback de mudança

  // Validação
  min?: number; // Valor mínimo
  max?: number; // Valor máximo
  required?: boolean; // Campo obrigatório
  error?: string; // Mensagem de erro

  // Formatação
  decimalPlaces?: number; // Casas decimais (padrão: 2)
  allowNegative?: boolean; // Permite negativos (padrão: true)

  // UI/UX
  placeholder?: string; // Placeholder do input
  hint?: string; // Mensagem de ajuda
  infoTooltip?: string; // Tooltip do ícone de info
  size?: 'sm' | 'md' | 'lg'; // Tamanho do input
  disabled?: boolean; // Input desabilitado

  // Estilo
  className?: string; // Classes CSS adicionais
  labelClassName?: string; // Classes CSS da label
}
```

## Exemplos de Uso

### Uso Básico

```tsx
import { NumberInputField } from '@/components/molecules';

function App() {
  const [price, setPrice] = useState<number | undefined>(100.5);

  return (
    <NumberInputField
      id='price'
      label='Preço'
      value={price}
      onChange={setPrice}
      placeholder='0,00'
    />
  );
}
```

### Uso Completo com Validações

```tsx
import { NumberInputField } from '@/components/molecules';
import { useState } from 'react';

function ProductForm() {
  const [price, setPrice] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();

  const handlePriceChange = (value: number | undefined) => {
    setPrice(value);

    // Validação customizada
    if (value === undefined) {
      setError('Preço é obrigatório');
    } else if (value < 0) {
      setError('Preço deve ser positivo');
    } else if (value > 10000) {
      setError('Preço não pode exceder R$ 10.000');
    } else {
      setError(undefined);
    }
  };

  return (
    <NumberInputField
      id='product-price'
      label='Preço do Produto'
      value={price}
      onChange={handlePriceChange}
      min={0}
      max={10000}
      decimalPlaces={2}
      placeholder='0,00'
      error={error}
      infoTooltip='Digite o preço do produto em reais. Deve ser um valor entre R$ 0 e R$ 10.000.'
      required
      hint='Valor em reais (R$)'
    />
  );
}
```

### Entrada de Quantidade (Sem Decimais)

```tsx
<NumberInputField
  id='quantity'
  label='Quantidade'
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={999}
  decimalPlaces={0}
  allowNegative={false}
  placeholder='1'
  infoTooltip='Número de itens a serem adicionados'
  required
/>
```

### Percentual com Validação

```tsx
<NumberInputField
  id='discount'
  label='Desconto (%)'
  value={discount}
  onChange={setDiscount}
  min={0}
  max={100}
  decimalPlaces={1}
  placeholder='0,0'
  infoTooltip='Percentual de desconto aplicado (0-100%)'
/>
```

## Comportamentos

### Entrada de Dados

- Aceita apenas caracteres numéricos, ponto (.) e hífen (-)
- Permite entrada incompleta temporária (ex: "12.", "-", "0.")
- Formata automaticamente no blur para exibição limpa
- Valida em tempo real conforme digitação

### Validações

- **Formato**: Verifica se é um número válido
- **Range**: Respeita valores min/max definidos
- **Negativo**: Bloqueia se `allowNegative` for false
- **Casas decimais**: Formata conforme `decimalPlaces`

### Acessibilidade

- Labels associadas corretamente (`htmlFor`)
- ARIA attributes (`aria-invalid`, `aria-describedby`)
- Roles semânticos (`role="alert"` para erros)
- Suporte a leitores de tela
- Navegação por teclado

### Estados Visuais

- **Normal**: Borda cinza, fundo branco
- **Focus**: Borda azul com ring de foco
- **Error**: Borda vermelha, fundo vermelho claro
- **Disabled**: Fundo cinza, texto cinza, cursor bloqueado

## Customização

### Classes CSS Customizadas

```tsx
<NumberInputField
  id='custom'
  label='Campo Customizado'
  className='my-custom-input'
  labelClassName='text-blue-600 font-bold'
  // ... outras props
/>
```

### Tamanhos

```tsx
// Pequeno
<NumberInputField size="sm" {...props} />

// Médio (padrão)
<NumberInputField size="md" {...props} />

// Grande
<NumberInputField size="lg" {...props} />
```

## Integração com Formulários

### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name='price'
        control={control}
        rules={{ required: 'Preço é obrigatório', min: 0 }}
        render={({ field, fieldState }) => (
          <NumberInputField
            id='price'
            label='Preço'
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />
    </form>
  );
}
```

### Formik

```tsx
import { Formik, Field } from 'formik';

function MyForm() {
  return (
    <Formik initialValues={{ price: '' }} onSubmit={onSubmit}>
      {({ setFieldValue, values, errors }) => (
        <Field name='price'>
          {() => (
            <NumberInputField
              id='price'
              label='Preço'
              value={values.price}
              onChange={value => setFieldValue('price', value)}
              error={errors.price}
            />
          )}
        </Field>
      )}
    </Formik>
  );
}
```

## Testes

O componente inclui testes abrangentes que cobrem:

- Renderização básica
- Entrada de dados numéricos
- Validações de min/max
- Formatação de decimais
- Estados de erro
- Tooltips informativos
- Acessibilidade

```bash
npm test NumberInput
```

## Design System

O componente segue as cores e estilos definidos no design system:

- **Cores primárias**: `brand-primary-*`
- **Cores funcionais**: `functional-heavy-*`, `functional-soft-*`
- **Cores de feedback**: `feedback-danger-*`, `feedback-success-*`
- **Tipografia**: Classes de tamanho e peso consistentes
- **Espaçamento**: Sistema de spacing baseado em Tailwind

## Compatibilidade

- ✅ React 19+
- ✅ TypeScript 5+
- ✅ Tailwind CSS 4+
- ✅ Navegadores modernos
- ✅ Dispositivos móveis (inputMode="decimal")
- ✅ Leitores de tela
