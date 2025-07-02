const keywordMap: Record<string, string> = {
  'supino': 'peito',
  'crucifixo': 'peito',
  'flexão': 'peito',
  'pullover': 'peito',
  'parelela': 'peito',
  'parelelo': 'peito',

  'remada': 'costas',
  'pulldown': 'costas',
  'barra fixa': 'costas',
  'puxada': 'costas',

  'agachamento': 'pernas',
  'leg press': 'pernas',
  'cadeira extensora': 'pernas',
  'cadeira flexora': 'pernas',
  'panturrilha': 'pernas',
  'pélvica': 'pernas',
  'pelvica': 'pernas',

  'rosca': 'bíceps',

  'tríceps': 'tríceps',
  'triceps': 'tríceps',

  'elevação lateral': 'ombro',
  'levantamento lateral': 'ombro',
  'desenvolvimento': 'ombro',
  'arnold press': 'ombro',

  'abdominal': 'abdômen',
  'prancha': 'abdômen',
  'elevação de pernas': 'abdômen',
}

export function useMuscleGroupDetector() {
  function detectarGrupoMuscular(nameExercicio: string): string {
    const name = nameExercicio.toLowerCase();

    for (const keyword in keywordMap) {
      if (name.includes(keyword)) {
        return keywordMap[keyword]
      }
    }

    return 'desconhecido'
  }

  return detectarGrupoMuscular
}
