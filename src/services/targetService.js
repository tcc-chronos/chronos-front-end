export async function fetchTargets(filePath = "train.csv") {
  try {
    const response = await fetch(`http://127.0.0.1:8000/targets?file_path=${filePath}`);

    if (!response.ok) {
      throw new Error(`Erro ao buscar targets: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.targets)) {
      return data.targets;
    } else {
      throw new Error("Resposta inválida do servidor");
    }
  } catch (error) {
    console.error("Erro ao obter targets:", error);
    return [];
  }
}