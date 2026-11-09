// @ts-nocheck
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { saveFile } from './native';
import { AuroraBackground, VoiceWave, useSpotlight } from './fx';
import {
  Activity,
  Mic,
  MicOff,
  Brain,
  PenTool,
  FileText,
  BarChart2,
  Clock,
  PlusCircle,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Sliders,
  Award,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw,
  Eye,
  Compass,
  Layers,
  Lock,
  Unlock,
  HelpCircle,
  Check,
  Trash2,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X,
  Sparkles,
  CheckSquare,
  ArrowRight,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';

// ============================================================================
// BASE DE DATOS CIENTÍFICA Y TÉCNICA (INGENIERÍA MECÁNICA)
// ============================================================================

const LEVEL_INFO = {
  1: {
    id: 1,
    short: 'NV.1 Base',
    name: 'Nivel 1: Descompresión Base',
    desc: 'Erradicación de hipertonía cervical y escapular. Fonación suave, pausas amplias y macro-trazos sin presión axial.',
    bpm: 45,
    chunkWords: 4,
    targetDb: [58, 64]
  },
  2: {
    id: 2,
    short: 'NV.2 Intermedio',
    name: 'Nivel 2: Control y Sincronía',
    desc: 'Estabilización acústica en 60-65 dB, freno obligatorio de 2.0s ante preguntas, letra ISO 3098 y espejo bimanual.',
    bpm: 60,
    chunkWords: 5,
    targetDb: [60, 65]
  },
  3: {
    id: 3,
    short: 'NV.3 Avanzado',
    name: 'Nivel 3: Bajo Presión Académica',
    desc: 'Defensa oral ante objeciones, prohibición de sustituir términos técnicos y rotulación técnica con mano izquierda.',
    bpm: 76,
    chunkWords: 6,
    targetDb: [60, 66]
  },
  4: {
    id: 4,
    short: 'NV.4 Overclock',
    name: 'Nivel 4: Maestría / Overclock',
    desc: 'Explicación de sistemas acoplados, interrogatorio de jurado con anclaje de calma y asimetría funcional DCL bimanual.',
    bpm: 92,
    chunkWords: 7,
    targetDb: [61, 66]
  }
};

const PEDAGOGICAL_STEPS = [
  { id: 1, key: 'prep', label: '1. Preparación', desc: 'Ajuste ergonómico y puesta a cero.' },
  { id: 2, key: 'inst', label: '2. Instrucciones', desc: 'Protocolo biomecánico y criterio de éxito.' },
  { id: 3, key: 'exec', label: '3. Ejecución', desc: 'Entrenamiento instrumental activo.' },
  { id: 4, key: 'res', label: '4. Resultado', desc: 'Verificación de métricas de la ronda.' },
  { id: 5, key: 'refl', label: '5. Reflexión', desc: 'Autoevaluación propioceptiva y ajuste.' }
];

const ENGINEERING_QUESTIONS = {
  1: [
    {
      cat: 'Termodinámica',
      q: '¿Cuál es la diferencia física entre calor sensible y calor latente durante un proceso de cambio de fase a presión constante?',
      hint: 'Conecta la energía cinética molecular media con los enlaces intermoleculares.'
    },
    {
      cat: 'Estática',
      q: '¿Qué condiciones vectoriales debe cumplir un cuerpo rígido en el plano para encontrarse en equilibrio estático completo?',
      hint: 'Formula sumatoria de fuerzas (traslación) y sumatoria de momentos respecto a un punto (rotación).'
    },
    {
      cat: 'Ciencia de Materiales',
      q: '¿Qué representa físicamente el módulo de elasticidad de Young (E) dentro del diagrama esfuerzo-deformación de un acero?',
      hint: 'Relación lineal de Hooke y rigidez del enlace atómico.'
    },
    {
      cat: 'Mecánica de Fluidos',
      q: '¿Por qué la presión hidrostática en un fluido incompresible en reposo depende de la profundidad vertical y no de la geometría del recipiente?',
      hint: 'Analiza el gradiente vertical de presión dp/dz = -ρg.'
    }
  ],
  2: [
    {
      cat: 'Termodinámica Aplicada',
      q: '¿Por qué una central termoeléctrica real operando en ciclo Rankine no puede alcanzar la eficiencia térmica de un ciclo de Carnot entre las mismas temperaturas?',
      hint: 'Menciona bombeo bifásico, sobrecalentamiento e irreversibilidades internas por fricción.'
    },
    {
      cat: 'Diseño de Máquinas',
      q: '¿Cómo afecta un cambio brusco de diámetro en un eje de transmisión a la distribución de esfuerzos y cómo se mitiga en el diseño?',
      hint: 'Concentración geométrica de esfuerzos (Kt) y aumento del radio de acuerdo o entalla.'
    },
    {
      cat: 'Mecánica de Fluidos',
      q: 'Explica físicamente la transición de flujo laminar a turbulento en una tubería circular utilizando el número de Reynolds.',
      hint: 'Cociente entre fuerzas inerciales y fuerzas viscosas amortiguadoras.'
    },
    {
      cat: 'Máquinas Eléctricas',
      q: 'En un motor de inducción trifásico de jaula de ardilla, ¿por qué la velocidad mecánica del rotor nunca puede igualar la velocidad síncrona del campo estatórico?',
      hint: 'Sin velocidad relativa (deslizamiento s > 0) no hay variación de flujo ni corriente inducida ni par electromagnético.'
    }
  ],
  3: [
    {
      cat: 'Resistencia de Materiales',
      q: 'Si una columna esbelta articulada falla por pandeo elástico de Euler antes de alcanzar la fluencia, ¿por qué cambiar a un acero de alta resistencia no soluciona el problema?',
      hint: 'La carga crítica de Euler depende del módulo de rigidez E y del momento de inercia I, que no cambian significativamente entre aceros al carbono y aleados.'
    },
    {
      cat: 'Turbomáquinas',
      q: '¿Qué fenómeno termodinámico y fluido-dinámico provoca la cavitación en el rodete de una bomba centrífuga y dónde ocurre el daño mecánico?',
      hint: 'Caída de presión estática bajo la presión de vapor en el ojo del impulsor e implosión de burbujas en la zona de alta presión.'
    },
    {
      cat: 'Vibraciones Mecánicas',
      q: 'Un sistema rotativo entra en resonancia durante su régimen nominal. ¿Qué parámetro estructural modificarías si no puedes alterar la masa ni la velocidad de giro?',
      hint: 'Modificar la rigidez equivalente k de los apoyos para desplazar ωn = √(k/m) o incorporar amortiguamiento viscoso/elastomérico.'
    },
    {
      cat: 'Transferencia de Calor',
      q: 'Justifica en qué condición física añadir recubrimiento aislante a una tubería cilíndrica delgada incrementa la disipación de calor en lugar de reducirla.',
      hint: 'Concepto de radio crítico de aislamiento r_cr = k_aislante / h_convección.'
    }
  ],
  4: [
    {
      cat: 'Defensa de Proyecto (Overclock)',
      q: 'OBJECIÓN DE JURADO: Tu factor de seguridad estático (Von Mises) es 2.4, pero el eje gira a 3600 RPM con flexión completamente invertida y ambiente a 160 °C. Defiende si el diseño es seguro o fallará.',
      hint: 'Distingue fluencia estática vs. daño acumulado por fatiga (Goodman/Marin: factores de superficie ka, tamaño kb, temperatura kd).'
    },
    {
      cat: 'Sistemas Electromecánicos Acoplados',
      q: 'Describe la cadena de eventos electromagnéticos, térmicos y mecánicos cuando un motor de inducción sufre un bloqueo o sobrecarga brusca en el eje.',
      hint: 'Aumento del deslizamiento s -> caída de impedancia rotórica -> pico de corriente I2 -> pérdidas Joule I²R -> degradación del aislamiento.'
    },
    {
      cat: 'Mecánica del Continuo',
      q: 'En un estado plano de esfuerzos combinados (flexión + torsión), explica cómo interpretar físicamente el Círculo de Mohr para elegir el criterio de falla apropiado.',
      hint: 'Identificación de esfuerzos principales σ1, σ2 y cortante máximo τmax frente a materiales dúctiles (Tresca/Von Mises) o frágiles (Rankine).'
    },
    {
      cat: 'Análisis de Falla Estructural',
      q: 'Un recipiente cilíndrico a presión de pared delgada presenta una microgrieta axial. Demuestra verbalmente por qué el esfuerzo circunferencial gobierna el modo de rotura.',
      hint: 'El esfuerzo circunferencial (hoop stress σ_θ = Pr/t) es exactamente el doble que el esfuerzo longitudinal (σ_z = Pr/2t) y actúa perpendicular a la grieta axial.'
    }
  ]
};

const TECHNICAL_READING_PASSAGES = {
  1: {
    title: 'Nivel 1 · Ataque Glótico Suave y Vocales de Arranque',
    instruction: 'Inhala sin elevar las clavículas. Suelta un hilo de aire pasivo (/h/) antes de cada palabra inicial. Haz clic en cualquier palabra si deseas marcarla como practicada.',
    text: 'El equilibrio estático exige que la resultante de todas las fuerzas externas sea nula. Al analizar un elemento estructural, aislamos el cuerpo libre y representamos cada reacción en los apoyos sin rigidez en el cuello.'
  },
  2: {
    title: 'Nivel 2 · Oclusivas Sordas (/p/, /t/, /k/) y Pausas de Unidad',
    instruction: 'Respeta cada barra (|) con 1.0 segundo de silencio real cerrando suavemente los labios. Usa contacto blando de lengua y labios en las consonantes oclusivas.',
    text: 'En el análisis de tuberías en serie y en paralelo, | la pérdida de carga primaria se calcula | mediante la ecuación de Darcy-Weisbach. | Cuando el número de Reynolds supera | el umbral crítico de transición, | el factor de fricción depende | tanto de la rugosidad relativa | como del régimen turbulento.'
  },
  3: {
    title: 'Nivel 3 · Alta Densidad Léxica (Prohibido Sustituir Palabras)',
    instruction: 'Texto con alta carga de vibrantes (/r/) y grupos consonánticos. Si percibes un bloqueo inminente, congela el movimiento 2.0 segundos, relaja el esternocleidomastoideo y continúa.',
    text: 'La anisotropía cristalográfica y la estequiometría de la aleación determinan el comportamiento reológico bajo fluencia térmica. Cuando el gradiente de temperatura induce esfuerzos residuales en la microestructura martensítica, la tenacidad a la fractura disminuye.'
  },
  4: {
    title: 'Nivel 4 · Exposición Magistral con Inflexión Cricotiroidea',
    instruction: 'Mantén la aguja acústica entre 61 y 66 dB. Aplica un cambio deliberado de entonación (tono e inflexión) sobre los términos técnicos clave sin empujar con el abdomen.',
    text: 'Al evaluar el pandeo elástico de Euler en columnas esbeltas, la carga crítica axial es directamente proporcional al módulo de elasticidad longitudinal y al segundo momento de área, pero inversamente proporcional al cuadrado de la longitud efectiva de pandeo.'
  }
};

const INITIAL_AVOIDED_WORDS = [
  { id: 'w1', word: 'Termodinámica', phonetic: 'Ter · mo · di · ná · mi · ca', uses: 3, target: 10, conquered: false },
  { id: 'w2', word: 'Estequiometría', phonetic: 'Es · te · quio · me · trí · a', uses: 1, target: 10, conquered: false },
  { id: 'w3', word: 'Turbomáquinas', phonetic: 'Tur · bo · má · qui · nas', uses: 2, target: 10, conquered: false },
  { id: 'w4', word: 'Viscosidad cinemática', phonetic: 'Vis · co · si · dad ci · ne · má · ti · ca', uses: 4, target: 10, conquered: false },
  { id: 'w5', word: 'Anisotropía', phonetic: 'A · ni · so · tro · pí · a', uses: 0, target: 10, conquered: false },
  { id: 'w6', word: 'Pandeo de Euler', phonetic: 'Pan · de · o de Eu · ler', uses: 5, target: 10, conquered: false },
  { id: 'w7', word: 'Histéresis magnética', phonetic: 'His · té · re · sis mag · né · ti · ca', uses: 2, target: 10, conquered: false },
  { id: 'w8', word: 'Círculo de Mohr', phonetic: 'Cír · cu · lo de Mohr', uses: 6, target: 10, conquered: false }
];

const DEFAULT_LOGS = [
  {
    id: 'log-s0',
    date: 'S0 · Línea Base',
    duration: 45,
    level: 1,
    neckTension: 8,
    vocalFatigue: 7,
    pauseCompliance: 25,
    shoulderPain: 7,
    paperRelief: 2,
    writingSpeedPPM: 16,
    leftHandPrecision: 1,
    wordsConquered: 0,
    notes: 'Diagnóstico inicial: bloqueos tónicos silenciosos con rigidez cervical, picos de intensidad >70 dB post-bloqueo y exceso de presión axial al escribir con dolor en hombro derecho.'
  },
  {
    id: 'log-s1',
    date: 'Sem 1 · Sesión 1',
    duration: 90,
    level: 1,
    neckTension: 6,
    vocalFatigue: 5,
    pauseCompliance: 50,
    shoulderPain: 5,
    paperRelief: 1,
    writingSpeedPPM: 18,
    leftHandPrecision: 2,
    wordsConquered: 1,
    notes: 'El calentamiento TVSO de 5 min redujo notablemente la fatiga laríngea. Uso de bolígrafo de gel bajó el relieve en papel a grado 1.'
  },
  {
    id: 'log-s2',
    date: 'Sem 1 · Sesión 2',
    duration: 120,
    level: 2,
    neckTension: 4,
    vocalFatigue: 3,
    pauseCompliance: 75,
    shoulderPain: 3,
    paperRelief: 0,
    writingSpeedPPM: 21,
    leftHandPrecision: 3,
    wordsConquered: 2,
    notes: 'Primera prueba superando la Hoja Fantasma con relieve 0. El freno visual de 2.0s evitó repetir muletillas al inicio de la respuesta.'
  }
];

// ============================================================================
// GENERADOR DE BLOQUES DE SESIÓN (15 A 240 MIN CON DESCARGA NEUROMOTORA)
// ============================================================================

function buildSessionBlocks(totalMinutes, level) {
  const blocks = [];
  let remaining = totalMinutes;
  let seq = 1;

  const coreTemplates = [
    {
      mod: 'Estación I · Voz (TVSO)',
      stationId: 'station1',
      title: 'Descompresión Laríngea y Calibración Acústica',
      baseMin: Math.min(15, Math.max(3, Math.round(totalMinutes * 0.12))),
      criterion: 'Cuello blando (<= 3/10) y emisión estable en 60-65 dB.',
      description:
        level >= 3
          ? 'Sirenas vocales en tracto semiocluido + lectura técnica sin picos explosivos post-pausa.'
          : 'Fonación en tubo / vibración labial 4 min + inicio fonatorio suspirado (/h/).'
    },
    {
      mod: 'Estación I · Fluidez',
      stationId: 'station1',
      title: 'Modificación de Bloqueos y Des-evitación Léxica',
      baseMin: Math.min(25, Math.max(4, Math.round(totalMinutes * 0.22))),
      criterion: 'Cero gestos de cuello; congelación calmada de 2.0s ante trabas.',
      description:
        level >= 3
          ? 'Lectura de alta densidad oclusiva y uso obligatorio de términos técnicos sin sustituir.'
          : 'Contacto articulatorio blando y práctica de cancelación con pausa liberadora de 2.0s.'
    },
    {
      mod: 'Estación II · Oratoria',
      stationId: 'station2',
      title: 'Freno de 2.0s, Matriz PREP y Fraseo por Unidades',
      baseMin: Math.min(25, Math.max(4, Math.round(totalMinutes * 0.20))),
      criterion: 'Respetar 2.0s de silencio antes de responder; cero repetición de impulso.',
      description: `Defensa de preguntas imprevistas de ingeniería en ráfagas de ${LEVEL_INFO[level].chunkWords} palabras.`
    },
    {
      mod: 'Estación III · Caligrafía ISO',
      stationId: 'station3',
      title: 'Rotulación ISO 3098 (10:7) y Prueba de Hoja Fantasma',
      baseMin: Math.min(20, Math.max(4, Math.round(totalMinutes * 0.16))),
      criterion: 'Reverso del papel 100% liso (< 1.5 N) y hombro derecho desencogido.',
      description: `Escritura técnica rítmica a ${LEVEL_INFO[level].bpm} BPM con deslizamiento cubital del antebrazo.`
    },
    {
      mod: 'Estación III · Bimanual',
      stationId: 'station3',
      title: 'Entrenamiento de Mano Izquierda y Sincronía Callosa',
      baseMin: Math.min(18, Math.max(3, Math.round(totalMinutes * 0.14))),
      criterion: 'REGLA NEUROLÓGICA: Silencio vocal total y máximo 20 min continuos.',
      description:
        level === 1
          ? 'Modo 1: Macro-trazos ortogonales y sinusoidales desde el antebrazo izquierdo.'
          : level === 2
          ? 'Modo 2: Simetría bimanual en espejo para sincronización interhemisférica.'
          : 'Modo 3: Trazado de ejes coordenados con mano izquierda y acotación de vectores con derecha.'
    },
    {
      mod: 'Estación IV · Toulmin',
      stationId: 'station4',
      title: 'Arquitectura Argumentativa y Podado Sintáctico',
      baseMin: Math.min(20, Math.max(3, Math.round(totalMinutes * 0.16))),
      criterion: 'Oraciones <= 25 palabras con encadenamiento Dado → Nuevo.',
      description: 'Redacción de párrafo técnico (Afirmación, Dato, Garantía física y Reserva).'
    }
  ];

  for (const tpl of coreTemplates) {
    if (remaining <= 0) break;
    const d = Math.min(remaining, tpl.baseMin);
    blocks.push({
      id: `blk-${seq++}`,
      ...tpl,
      duration: d,
      completed: false,
      type: 'core'
    });
    remaining -= d;
  }

  let extraCycle = 1;
  while (remaining > 0) {
    if (extraCycle % 3 === 1 && remaining >= 5) {
      const restDur = Math.min(remaining, 10);
      blocks.push({
        id: `blk-${seq++}`,
        mod: 'Pausa Neuromotora',
        stationId: 'overview',
        title: `Descarga Escapular, Hidratación y Reset Sináptico #${Math.ceil(extraCycle / 3)}`,
        duration: restDur,
        criterion: 'Prevención de fatiga en sesiones > 90-120 min.',
        description: 'Soltar trapecios, hidratar mucosa laríngea y descansar la vista lejos de la pantalla.',
        completed: false,
        type: 'unload'
      });
      remaining -= restDur;
    } else if (extraCycle % 3 === 2) {
      const oralDur = Math.min(remaining, 20);
      blocks.push({
        id: `blk-${seq++}`,
        mod: `Bloque Extendido · Oral`,
        stationId: 'station2',
        title: `Simulacro de Sustentación Técnica Bajo Presión (${LEVEL_INFO[level].short})`,
        duration: oralDur,
        criterion: 'Estabilidad 60-65 dB + Pausa de 2.0s ante contrapreguntas.',
        description: 'Ronda intensiva de exposición de mecanismos y resolución de objeciones con matriz PREP.',
        completed: false,
        type: 'extension'
      });
      remaining -= oralDur;
    } else {
      const motorDur = Math.min(remaining, 18);
      blocks.push({
        id: `blk-${seq++}`,
        mod: `Bloque Extendido · Motor`,
        stationId: 'station3',
        title: `Precisión Grafo-Motora y Diagramas Bimanuales (${LEVEL_INFO[level].short})`,
        duration: motorDur,
        criterion: 'Silencio vocal estricto + Cero relieve en el reverso.',
        description: 'Práctica avanzada de esquemas cinemáticos y síntesis argumentativa Toulmin.',
        completed: false,
        type: 'extension'
      });
      remaining -= motorDur;
    }
    extraCycle++;
  }

  return blocks;
}

// ============================================================================
// APLICACIÓN PRINCIPAL REDISEÑADA
// ============================================================================

export default function App() {
  useSpotlight();
  // 1. TEMA VISUAL (Dark #0C1420 por defecto / Light #F5F7FA)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('lab_ui_theme_v2') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lab_ui_theme_v2', theme);
    } catch {}
  }, [theme]);

  // 2. ARQUITECTURA DE NAVEGACIÓN (4 ZONAS)
  const [activeNav, setActiveNav] = useState('overview'); // 'overview' | 'station1' | 'station2' | 'station3' | 'station4' | 'telemetry'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contextDrawerOpen, setContextDrawerOpen] = useState(false);

  // Modo de visualización dentro de cada estación: 'guided' (Paso a Paso 1-5) | 'all' (Vista Completa)
  const [stationViewMode, setStationViewMode] = useState('guided');
  const [stationStep, setStationStep] = useState({
    station1: 3,
    station2: 3,
    station3: 3,
    station4: 3
  });

  // 3. ESTADO GLOBAL DE SESIÓN Y TEMPORIZADOR SINCRONIZADO (persiste al cambiar de pestaña)
  const [globalLevel, setGlobalLevel] = useState(2);
  const [configuredMinutes, setConfiguredMinutes] = useState(90);
  const [sessionBlocks, setSessionBlocks] = useState(() => buildSessionBlocks(90, 2));
  const [activeBlockIdx, setActiveBlockIdx] = useState(0);
  const [blockSecondsLeft, setBlockSecondsLeft] = useState(() => 11 * 60);
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [isSessionRunning, setIsSessionRunning] = useState(false);
  const [expandedStationCard, setExpandedStationCard] = useState(null);

  // 4. ESTACIÓN I: HABLA, FLUIDEZ Y VOZ (MÓDULOS I & II)
  const [micActive, setMicActive] = useState(false);
  const [simulatedMic, setSimulatedMic] = useState(false);
  const [currentDb, setCurrentDb] = useState(44);
  const [dbHistory, setDbHistory] = useState(Array(32).fill(44));
  const [sovtSecondsLeft, setSovtSecondsLeft] = useState(180); // 3 min calentamiento TVSO
  const [sovtRunning, setSovtRunning] = useState(false);
  const [freezeTimer, setFreezeTimer] = useState(0); // 2.0s congelación de bloqueo
  const [freezeCompletedCount, setFreezeCompletedCount] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState({});
  const [avoidedWords, setAvoidedWords] = useState(() => {
    try {
      const saved = localStorage.getItem('lab_avoided_words_v1');
      return saved ? JSON.parse(saved) : INITIAL_AVOIDED_WORDS;
    } catch {
      return INITIAL_AVOIDED_WORDS;
    }
  });
  const [newWordText, setNewWordText] = useState('');
  const [newWordSyllables, setNewWordSyllables] = useState('');
  const [station1Reflection, setStation1Reflection] = useState({ neckCalm: 8, easyOnsetUsed: true });

  // 5. ESTACIÓN II: ORATORIA, IMPROVISACIÓN Y FRENO DE 2.0s (MÓDULO III)
  const [currentQuestion, setCurrentQuestion] = useState(ENGINEERING_QUESTIONS[2][0]);
  const [silentGateSeconds, setSilentGateSeconds] = useState(0);
  const [prepNotes, setPrepNotes] = useState({
    point: '',
    reason: '',
    example: '',
    close: ''
  });
  const [activePrepSlot, setActivePrepSlot] = useState('point');
  const [chunkPacerRunning, setChunkPacerRunning] = useState(false);
  const [chunkPhase, setChunkPhase] = useState('SPEAK'); // 'SPEAK' | 'SILENCE'
  const [questionsAnsweredCount, setQuestionsAnsweredCount] = useState(0);

  // 6. ESTACIÓN III: MOTRICIDAD FINA, ISO 3098 Y MANO IZQUIERDA (MÓDULO IV)
  const [metronomeRunning, setMetronomeRunning] = useState(false);
  const [customBpm, setCustomBpm] = useState(60);
  const [audioTickEnabled, setAudioTickEnabled] = useState(false);
  const [metronomePulse, setMetronomePulse] = useState(false);
  const [bimanualMode, setBimanualMode] = useState('mode2'); // 'mode1' | 'mode2' | 'mode3'
  const [canvasGuideType, setCanvasGuideType] = useState('iso3098'); // 'iso3098' | 'mirror' | 'dcl'
  const [leftHandGuardSeconds, setLeftHandGuardSeconds] = useState(0);
  const [leftHandGuardActive, setLeftHandGuardActive] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [ghostChecklist, setGhostChecklist] = useState({
    rollerPen: true,
    forearmSupport: true,
    droppedTrap: false,
    zeroEmbossing: false
  });

  // 7. ESTACIÓN IV: ARGUMENTACIÓN TÉCNICA TOULMIN (MÓDULO V)
  const [toulminFields, setToulminFields] = useState({
    claim:
      'El eje de transmisión de acero AISI 1045 fallará por fatiga antes de alcanzar el millón de ciclos de operación.',
    data:
      'El esfuerzo alternante calculado en el escalón del rodamiento es de 340 MPa, superando el límite de fatiga corregido de 275 MPa.',
    warrant:
      'Según el criterio de diseño de Goodman modificado, toda solicitación cíclica sobre la línea segura nuclea microgrietas progresivas.',
    rebuttal:
      'A menos que se incremente el radio de entalla de 1 mm a 3.5 mm para reducir el factor geométrico de concentración de esfuerzos.'
  });
  const [freeArgumentDraft, setFreeArgumentDraft] = useState('');
  const [savedArguments, setSavedArguments] = useState(() => {
    try {
      const saved = localStorage.getItem('lab_saved_toulmin_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 8. BITÁCORA Y TELEMETRÍA
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('lab_telemetry_logs_v1');
      return saved ? JSON.parse(saved) : DEFAULT_LOGS;
    } catch {
      return DEFAULT_LOGS;
    }
  });
  const [logForm, setLogForm] = useState({
    neckTension: 3,
    vocalFatigue: 2,
    pauseCompliance: 85,
    shoulderPain: 2,
    paperRelief: 0,
    writingSpeedPPM: 23,
    leftHandPrecision: 4,
    notes: ''
  });
  const [statusToast, setStatusToast] = useState('');

  // Referencias técnicas
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafRef = useRef(null);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  // ============================================================================
  // PERSISTENCIA Y SINCRONIZACIÓN
  // ============================================================================

  useEffect(() => {
    try {
      localStorage.setItem('lab_avoided_words_v1', JSON.stringify(avoidedWords));
    } catch {}
  }, [avoidedWords]);

  useEffect(() => {
    try {
      localStorage.setItem('lab_telemetry_logs_v1', JSON.stringify(logs));
    } catch {}
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem('lab_saved_toulmin_v2', JSON.stringify(savedArguments));
    } catch {}
  }, [savedArguments]);

  const notify = (msg) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(''), 3800);
  };

  // Actualizar parámetros al cambiar el nivel de dificultad
  const handleLevelChange = (newLvl) => {
    setGlobalLevel(newLvl);
    setCustomBpm(LEVEL_INFO[newLvl].bpm);
    const qBank = ENGINEERING_QUESTIONS[newLvl] || ENGINEERING_QUESTIONS[2];
    setCurrentQuestion(qBank[0]);
    const rebuilt = buildSessionBlocks(configuredMinutes, newLvl);
    setSessionBlocks(rebuilt);
    if (!isSessionRunning && rebuilt[activeBlockIdx]) {
      setBlockSecondsLeft(rebuilt[activeBlockIdx].duration * 60);
    }
  };

  // Configurar duración total de la sesión (15 a 240 min)
  const handleConfigureSessionMinutes = (mins) => {
    const clamped = Math.min(240, Math.max(15, mins));
    setIsSessionRunning(false);
    setConfiguredMinutes(clamped);
    const generated = buildSessionBlocks(clamped, globalLevel);
    setSessionBlocks(generated);
    setActiveBlockIdx(0);
    if (generated.length > 0) {
      setBlockSecondsLeft(generated[0].duration * 60);
    }
  };

  // Inyección rápida de bloques adicionales (+15m Oral / +15m Motor)
  const handleInjectBlock = (kind) => {
    const added = 15;
    const nextTotal = Math.min(240, configuredMinutes + added);
    setConfiguredMinutes(nextTotal);
    const newBlock =
      kind === 'oral'
        ? {
            id: `blk-inj-${Date.now()}`,
            mod: `Reto Extra · Oral (${LEVEL_INFO[globalLevel].short})`,
            stationId: 'station2',
            title: 'Defensa Oral Imprevista + Control Subglótico 60-65 dB',
            duration: 15,
            criterion: 'Pausa obligatoria de 2.0s + Cero tensión cervical.',
            description: 'Bloque adicional inyectado en vivo para profundizar oratoria técnica bajo presión.',
            completed: false,
            type: 'extension'
          }
        : {
            id: `blk-inj-${Date.now()}`,
            mod: `Reto Extra · Motor (${LEVEL_INFO[globalLevel].short})`,
            stationId: 'station3',
            title: 'Trazado ISO 3098 Bimanual + Síntesis Toulmin',
            duration: 15,
            criterion: 'Silencio vocal estricto + Reverso de hoja liso.',
            description: 'Bloque adicional inyectado en vivo para precisión grafo-motora y argumentación.',
            completed: false,
            type: 'extension'
          };
    setSessionBlocks((prev) => [...prev, newBlock]);
    notify(`Añadido bloque de +15 min (${kind === 'oral' ? 'Oral' : 'Motor/Escrito'}) a la ruta actual.`);
  };

  // Temporizador Global de la Sesión (no se reinicia al navegar entre estaciones)
  useEffect(() => {
    if (!isSessionRunning) return;
    const timer = setInterval(() => {
      setTotalElapsedSeconds((prev) => prev + 1);
      setBlockSecondsLeft((prev) => {
        if (prev <= 1) {
          // Marca bloque actual como completado y pasa al siguiente si existe
          setSessionBlocks((blocks) =>
            blocks.map((b, idx) => (idx === activeBlockIdx ? { ...b, completed: true } : b))
          );
          if (activeBlockIdx + 1 < sessionBlocks.length) {
            const nextIdx = activeBlockIdx + 1;
            setActiveBlockIdx(nextIdx);
            return sessionBlocks[nextIdx].duration * 60;
          } else {
            setIsSessionRunning(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionRunning, activeBlockIdx, sessionBlocks]);

  // Temporizador Calentamiento TVSO (Estación I)
  useEffect(() => {
    if (!sovtRunning) return;
    const t = setInterval(() => {
      setSovtSecondsLeft((prev) => {
        if (prev <= 1) {
          setSovtRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [sovtRunning]);

  // Temporizador de Congelación del Bloqueo 2.0s (Estación I)
  useEffect(() => {
    if (freezeTimer <= 0) return;
    const t = setTimeout(() => {
      const next = Math.max(0, +(freezeTimer - 0.1).toFixed(1));
      setFreezeTimer(next);
      if (next === 0) {
        setFreezeCompletedCount((c) => c + 1);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [freezeTimer]);

  // Freno de Pausa Silenciosa Obligatoria de 2.0s (Estación II)
  useEffect(() => {
    if (silentGateSeconds <= 0) return;
    const t = setTimeout(() => {
      setSilentGateSeconds((prev) => Math.max(0, +(prev - 0.1).toFixed(1)));
    }, 100);
    return () => clearTimeout(t);
  }, [silentGateSeconds]);

  // Marcapasos de Unidades de Pensamiento (Estación II)
  useEffect(() => {
    if (!chunkPacerRunning) return;
    const speakMs = LEVEL_INFO[globalLevel].chunkWords * 620;
    const silenceMs = 1300;
    const t = setTimeout(
      () => {
        setChunkPhase((p) => (p === 'SPEAK' ? 'SILENCE' : 'SPEAK'));
      },
      chunkPhase === 'SPEAK' ? speakMs : silenceMs
    );
    return () => clearTimeout(t);
  }, [chunkPacerRunning, chunkPhase, globalLevel]);

  // Metrónomo Visual y Sonoro Suave (Estación III)
  useEffect(() => {
    if (!metronomeRunning) return;
    const intervalMs = Math.round((60 / customBpm) * 1000);
    const interval = setInterval(() => {
      setMetronomePulse((p) => !p);
      if (audioTickEnabled) {
        try {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, ctx.currentTime);
          gain.gain.setValueAtTime(0.03, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
          setTimeout(() => ctx.close().catch(() => {}), 80);
        } catch {}
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [metronomeRunning, customBpm, audioTickEnabled]);

  // Guardia de Seguridad Neurológica de Mano Izquierda (máx 20 min = 1200s)
  useEffect(() => {
    if (!leftHandGuardActive) return;
    const interval = setInterval(() => {
      setLeftHandGuardSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [leftHandGuardActive]);

  // ============================================================================
  // MONITOR ACÚSTICO WEB AUDIO API + MODO SIMULADO DE RESPALDO
  // ============================================================================

  const startAcousticMonitor = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;
      setMicActive(true);
      setSimulatedMic(false);

      const buffer = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(buffer);
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
          const v = (buffer[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buffer.length);
        const db = Math.min(86, Math.max(38, Math.round(40 + rms * 145)));
        setCurrentDb(db);
        setDbHistory((prev) => [...prev.slice(1), db]);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setSimulatedMic(true);
      setMicActive(true);
      notify('Modo de simulación acústica activo (permiso de micrófono no disponible en el contenedor).');
    }
  };

  const stopAcousticMonitor = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
    }
    setMicActive(false);
    setSimulatedMic(false);
  };

  useEffect(() => {
    if (!micActive || !simulatedMic) return;
    const t = setInterval(() => {
      setCurrentDb((prev) => {
        const delta = Math.round((Math.random() - 0.48) * 3.5);
        const next = Math.min(72, Math.max(56, prev + delta));
        setDbHistory((h) => [...h.slice(1), next]);
        return next;
      });
    }, 200);
    return () => clearInterval(t);
  }, [micActive, simulatedMic]);

  // ============================================================================
  // LIENZO INTERACTIVO HTML5 (MOUSE + TOUCH ADAPTATIVO)
  // ============================================================================

  const clearDrawingCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
  };

  const getPointerCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleCanvasStart = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    if (!leftHandGuardActive) setLeftHandGuardActive(true);
    const { x, y } = getPointerCoords(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleCanvasMove = (e) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getPointerCoords(e, canvas);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = theme === 'dark' ? '#2EE6C5' : '#0A8F7C';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleCanvasEnd = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      setStrokeCount((c) => c + 1);
    }
  };

  // ============================================================================
  // AUDITORÍA SINTÁCTICA Y ARGUMENTACIÓN TOULMIN (ESTACIÓN IV)
  // ============================================================================

  const assembledArgument = useMemo(() => {
    if (freeArgumentDraft.trim().length > 0) return freeArgumentDraft.trim();
    return `${toulminFields.claim.trim()} ${toulminFields.data.trim()} ${toulminFields.warrant.trim()} ${toulminFields.rebuttal.trim()}`;
  }, [toulminFields, freeArgumentDraft]);

  const syntacticAudit = useMemo(() => {
    const sentences = assembledArgument
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    return sentences.map((text, idx) => {
      const words = text.split(/\s+/).filter(Boolean);
      const count = words.length;
      const hasConnector = /(según|debido|por lo tanto|a menos que|cuando|dado que|porque|sin embargo|además|superando)/i.test(
        text
      );
      let state = 'optimal'; // <= 25 palabras
      if (count > 30) state = 'alert';
      else if (count > 25) state = 'warning';
      return {
        idx: idx + 1,
        text,
        count,
        hasConnector,
        state
      };
    });
  }, [assembledArgument]);

  // ============================================================================
  // ACCIONES DE USUARIO Y EXPORTACIÓN DE DATOS
  // ============================================================================

  const triggerUnexpectedQuestion = () => {
    const bank = ENGINEERING_QUESTIONS[globalLevel] || ENGINEERING_QUESTIONS[2];
    const others = bank.filter((item) => item.q !== currentQuestion.q);
    const picked = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : bank[0];
    setCurrentQuestion(picked);
    setSilentGateSeconds(2.0); // Activa bloqueo visual de 2.0 segundos
    setActivePrepSlot('point');
  };

  const handleSaveToulminArgument = () => {
    const entry = {
      id: `arg-${Date.now()}`,
      date: new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
      level: globalLevel,
      text: assembledArgument,
      sentenceCount: syntacticAudit.length,
      maxWords: Math.max(...syntacticAudit.map((s) => s.count), 0)
    };
    setSavedArguments((prev) => [entry, ...prev]);
    notify('Argumento técnico guardado en tu repositorio.');
  };

  const handleSaveTelemetryLog = (e) => {
    e.preventDefault();
    const conqueredWordsCount = avoidedWords.filter((w) => w.conquered).length;
    const newEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }),
      duration: configuredMinutes,
      level: globalLevel,
      ...logForm,
      wordsConquered: conqueredWordsCount
    };
    setLogs((prev) => [...prev, newEntry]);
    setLogForm((prev) => ({ ...prev, notes: '' }));
    notify('Sesión registrada correctamente en la Bitácora.');
  };

  const handleExportJSON = () => {
    const data = {
      version: '3.0-EdTech-Pro',
      exportedAt: new Date().toISOString(),
      logs,
      avoidedWords,
      savedArguments
    };
    saveFile(`lab_entrenamiento_ingenieria_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(data, null, 2), 'application/json').catch(() => notify('No se pudo exportar el archivo.'));
  };

  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Duracion_Min',
      'Nivel',
      'Tension_Cuello_1_10',
      'Fatiga_Vocal_1_10',
      'Cumplimiento_Pausa2s_Pct',
      'Dolor_Hombro_1_10',
      'Relieve_Papel_0_2',
      'Velocidad_PPM',
      'Precision_Izquierda_1_5',
      'Palabras_Dominadas',
      'Notas'
    ];
    const rows = logs.map((l) => [
      `"${l.date}"`,
      l.duration,
      l.level,
      l.neckTension,
      l.vocalFatigue,
      l.pauseCompliance,
      l.shoulderPain,
      l.paperRelief,
      l.writingSpeedPPM || 20,
      l.leftHandPrecision,
      l.wordsConquered || 0,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    saveFile(`bitacora_comunicacion_destreza_${new Date().toISOString().slice(0, 10)}.csv`, csvContent, 'text/csv;charset=utf-8;').catch(() => notify('No se pudo exportar el archivo.'));
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (Array.isArray(parsed.logs)) setLogs(parsed.logs);
        if (Array.isArray(parsed.avoidedWords)) setAvoidedWords(parsed.avoidedWords);
        if (Array.isArray(parsed.savedArguments)) setSavedArguments(parsed.savedArguments);
        notify('Respaldo JSON restaurado con éxito.');
      } catch {
        notify('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Utilidades de formato
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentBlock = sessionBlocks[activeBlockIdx] || sessionBlocks[0];
  const totalConfiguredMinutes = sessionBlocks.reduce((acc, b) => acc + b.duration, 0);
  const completedBlocksCount = sessionBlocks.filter((b) => b.completed).length;
  const sessionProgressPct = Math.round((completedBlocksCount / Math.max(1, sessionBlocks.length)) * 100);

  // Definición de navegación principal
  const NAV_ITEMS = [
    {
      id: 'overview',
      shortLabel: 'Inicio',
      label: 'Panel y Ruta de Sesión',
      sub: 'Arquitectura y progreso',
      icon: Compass
    },
    {
      id: 'station1',
      shortLabel: 'Voz/Habla',
      label: 'Estación I · Fluidez y Voz',
      sub: 'TVSO, Inicio suave y dB',
      icon: Mic
    },
    {
      id: 'station2',
      shortLabel: 'Oratoria',
      label: 'Estación II · Improvisación',
      sub: 'Freno 2.0s, PREP y Fraseo',
      icon: Brain
    },
    {
      id: 'station3',
      shortLabel: 'Motricidad',
      label: 'Estación III · ISO y Bimanual',
      sub: 'Hoja fantasma y Mano Izq.',
      icon: PenTool
    },
    {
      id: 'station4',
      shortLabel: 'Escritura',
      label: 'Estación IV · Argumentación',
      sub: 'Modelo Toulmin y Sintaxis',
      icon: FileText
    },
    {
      id: 'telemetry',
      shortLabel: 'Bitácora',
      label: 'Bitácora y Telemetría',
      sub: 'Curvas y exportación',
      icon: BarChart2
    }
  ];

  const activeNavMeta = NAV_ITEMS.find((item) => item.id === activeNav) || NAV_ITEMS[0];

  // ============================================================================
  // SISTEMA DE DESIGN TOKENS (CSS CUSTOM PROPERTIES PARA DARK & LIGHT MODE)
  // ============================================================================
  const themeTokensStyle =
    theme === 'dark'
      ? {
          '--bg-primary': '#07090F',
          '--surface-primary': 'rgba(18, 22, 36, 0.66)',
          '--surface-elevated': 'rgba(32, 38, 60, 0.62)',
          '--border-color': 'rgba(150, 160, 255, 0.16)',
          '--text-primary': '#EEF0FA',
          '--text-secondary': '#9CA3C4',
          '--accent-primary': '#9B87FF',
          '--accent-soft': 'rgba(155, 135, 255, 0.16)',
          '--accent-contrast': '#0A0718',
          '--accent-2': '#2EE6C5',
          '--accent-3': '#FFB86B',
          '--glow': 'rgba(124, 92, 255, 0.35)'
        }
      : {
          '--bg-primary': '#F4F1EA',
          '--surface-primary': 'rgba(255, 255, 255, 0.72)',
          '--surface-elevated': 'rgba(238, 233, 245, 0.78)',
          '--border-color': 'rgba(70, 50, 140, 0.16)',
          '--text-primary': '#1A1630',
          '--text-secondary': '#555271',
          '--accent-primary': '#5B3FE0',
          '--accent-soft': 'rgba(91, 63, 224, 0.10)',
          '--accent-contrast': '#FFFFFF',
          '--accent-2': '#0A8F7C',
          '--accent-3': '#D9731A',
          '--glow': 'rgba(91, 63, 224, 0.22)'
        };

  // Subcomponente reutilizable para la Barra del Flujo Pedagógico (1 a 5)
  const renderPedagogicalStepper = (stationKey) => {
    const activeStepNum = stationStep[stationKey] || 3;
    return (
      <div
        className="rounded-xl p-3.5 mb-6 border transition-colors"
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-xs font-semibold">Secuencia Pedagógica de la Estación</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setStationViewMode('guided')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: stationViewMode === 'guided' ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                color: stationViewMode === 'guided' ? 'var(--accent-contrast)' : 'var(--text-secondary)'
              }}
            >
              Flujo Guiado Paso a Paso
            </button>
            <button
              onClick={() => setStationViewMode('all')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: stationViewMode === 'all' ? 'var(--accent-primary)' : 'var(--surface-elevated)',
                color: stationViewMode === 'all' ? 'var(--accent-contrast)' : 'var(--text-secondary)'
              }}
            >
              Vista Completa de Instrumentos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PEDAGOGICAL_STEPS.map((st) => {
            const isCurrent = activeStepNum === st.id && stationViewMode === 'guided';
            const isPast = st.id < activeStepNum;
            return (
              <button
                key={st.id}
                onClick={() => {
                  setStationViewMode('guided');
                  setStationStep((prev) => ({ ...prev, [stationKey]: st.id }));
                }}
                className="text-left p-2.5 rounded-lg border transition-all flex flex-col justify-between min-h-[60px]"
                style={{
                  backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                  borderColor: isCurrent ? 'var(--accent-primary)' : 'var(--border-color)'
                }}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isCurrent ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                  >
                    {st.label}
                  </span>
                  {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
                <span className="text-[11px] leading-tight mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {st.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        ...themeTokensStyle,
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
      data-theme={theme}
      className="lab-root relative min-h-screen w-full flex flex-col lg:flex-row font-sans antialiased selection:bg-violet-500/30"
    >
      <AuroraBackground theme={theme} />
      {/* =====================================================================
          ZONA A (ESCRITORIO >= 1024px): NAVEGACIÓN LATERAL COLAPSABLE
         ===================================================================== */}
      <aside
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-color)'
        }}
        className={`hidden lg:flex flex-col shrink-0 border-r transition-all duration-200 select-none sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[268px]'
        }`}
      >
        {/* Identidad del Laboratorio */}
        <div
          className="h-16 px-4 flex items-center justify-between border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-sm"
              style={{
                backgroundColor: 'var(--accent-soft)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--accent-primary)'
              }}
            >
              LC
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="text-sm font-semibold tracking-tight truncate">Lab Comunicación</div>
                <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                  Ingeniería Mecánica · Voz y Pulso
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-2 rounded-lg hover:opacity-80 transition"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={sidebarCollapsed ? 'Expandir navegación lateral' : 'Contraer navegación lateral'}
            title={sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Lista de Estaciones y Secciones */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto" aria-label="Navegación principal del laboratorio">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                title={sidebarCollapsed ? `${item.label} — ${item.sub}` : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative ${
                  sidebarCollapsed ? 'justify-center' : ''
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)'
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r"
                    style={{ backgroundColor: 'var(--accent-primary)' }}
                  />
                )}
                <Icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{item.label}</div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      {item.sub}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Resumen Compacto de Progreso en el Pie de la Barra Lateral */}
        <div className="p-3 border-t space-y-2.5" style={{ borderColor: 'var(--border-color)' }}>
          {!sidebarCollapsed ? (
            <div
              className="p-3 rounded-xl border space-y-2"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Progreso de Ruta</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  {completedBlocksCount}/{sessionBlocks.length} bloques
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${sessionProgressPct}%`,
                    backgroundColor: 'var(--accent-primary)'
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                <span>Meta: {totalConfiguredMinutes}m</span>
                <span>Activo: {formatTime(totalElapsedSeconds)}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-1">
              <span className="text-[11px] font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                {sessionProgressPct}%
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* =====================================================================
          CONTENEDOR DERECHO (CABECERA CONTEXTUAL + LIENZO CENTRAL)
         ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {/* ZONA B: CABECERA PRINCIPAL CONTEXTUAL */}
        <header
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-color)'
          }}
          className="sticky top-0 z-20 border-b px-4 sm:px-6 py-3"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Título de la sección actual */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                  {activeNavMeta.label}
                </h1>
                <span
                  className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-md font-medium"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {LEVEL_INFO[globalLevel].short}
                </span>
              </div>
              <p className="text-xs truncate hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                Bloque en curso: {currentBlock?.title} ({currentBlock?.duration} min)
              </p>
            </div>

            {/* Controles Contextuales de Cabecera */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Selector de Nivel (NV.1 a NV.4) */}
              <div
                className="flex items-center rounded-lg p-0.5 border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
                role="group"
                aria-label="Selector de nivel de dificultad"
              >
                {[1, 2, 3, 4].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all min-h-[34px]"
                    style={{
                      backgroundColor: globalLevel === lvl ? 'var(--accent-primary)' : 'transparent',
                      color: globalLevel === lvl ? 'var(--accent-contrast)' : 'var(--text-secondary)'
                    }}
                    title={LEVEL_INFO[lvl].name}
                  >
                    NV.{lvl}
                  </button>
                ))}
              </div>

              {/* Widget Compacto del Temporizador Global Sincronizado */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <Clock className="w-4 h-4 shrink-0" style={{ color: 'var(--accent-primary)' }} />
                <div className="font-mono text-xs flex items-center gap-1.5">
                  <span className="font-semibold text-sm">{formatTime(blockSecondsLeft)}</span>
                  <span className="hidden md:inline" style={{ color: 'var(--text-secondary)' }}>
                    / {totalConfiguredMinutes}m
                  </span>
                </div>
                <button
                  onClick={() => setIsSessionRunning((r) => !r)}
                  className="p-1.5 rounded-md transition"
                  style={{
                    backgroundColor: isSessionRunning ? 'rgba(245, 158, 11, 0.18)' : 'var(--accent-soft)',
                    color: isSessionRunning ? '#F59E0B' : 'var(--accent-primary)'
                  }}
                  aria-label={isSessionRunning ? 'Pausar temporizador de sesión' : 'Iniciar temporizador de sesión'}
                  title={isSessionRunning ? 'Pausar bloque' : 'Continuar bloque'}
                >
                  {isSessionRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setBlockSecondsLeft((currentBlock?.duration || 15) * 60)}
                  className="p-1.5 rounded-md hover:opacity-80 transition"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Reiniciar tiempo del bloque actual"
                  title="Reiniciar bloque actual"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Botones rápidos de inyección (+15m) en escritorio */}
              <div className="hidden xl:flex items-center gap-1.5">
                <button
                  onClick={() => handleInjectBlock('oral')}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  title="Añadir 15 minutos de reto oral a la sesión actual"
                >
                  <PlusCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span>+15m Oral</span>
                </button>
                <button
                  onClick={() => handleInjectBlock('motor')}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  title="Añadir 15 minutos de reto motor/escrito a la sesión actual"
                >
                  <PlusCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span>+15m Motor</span>
                </button>
              </div>

              {/* Botón de Panel Contextual (Guía Clínica / Normas ISO) */}
              <button
                onClick={() => setContextDrawerOpen((o) => !o)}
                className="px-3 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition"
                style={{
                  backgroundColor: contextDrawerOpen ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                  borderColor: contextDrawerOpen ? 'var(--accent-primary)' : 'var(--border-color)',
                  color: contextDrawerOpen ? 'var(--accent-primary)' : 'var(--text-primary)'
                }}
                aria-label="Abrir guía clínica y normas técnicas"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Guía Clínica e ISO</span>
              </button>

              {/* Conmutador de Tema Claro / Oscuro */}
              <button
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                className="p-2 rounded-lg border transition"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                title={theme === 'dark' ? 'Modo Claro (#F5F7FA)' : 'Modo Oscuro (#0C1420)'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* Notificación discreta si existe */}
        {statusToast && (
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-3">
            <div
              className="px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-between"
              style={{
                backgroundColor: 'var(--accent-soft)',
                borderColor: 'var(--accent-primary)',
                color: 'var(--text-primary)'
              }}
              role="status"
            >
              <span>{statusToast}</span>
              <button onClick={() => setStatusToast('')} className="text-xs underline ml-4">
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            ZONA C: CONTENIDO CENTRAL DEL LABORATORIO
           =================================================================== */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
         <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeNav}
            className="space-y-6 page-stagger"
            initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
          {/* -----------------------------------------------------------------
              VISTA 0: PANEL DE CONTROL, CONFIGURADOR DE SESIÓN Y RUTA
             ----------------------------------------------------------------- */}
          {activeNav === 'overview' && (
            <div className="space-y-6">
              {/* Tarjeta Hero: Resumen de la Sesión Actual y Acción Principal */}
              <section
                className="hero-card relative overflow-hidden rounded-3xl p-5 sm:p-8 border shadow-sm"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <VoiceWave className="absolute inset-x-0 bottom-0 h-28 w-full opacity-70 pointer-events-none" />
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-primary)' }}>
                      <Activity className="w-3.5 h-3.5" />
                      <span>{LEVEL_INFO[globalLevel].name}</span>
                    </div>
                    <h2 className="text-gradient text-2xl sm:text-4xl font-extrabold tracking-tight leading-[1.05]">
                      Entrenamiento Integrado de Habla, Voz, Oratoria y Precisión Manual
                    </h2>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {LEVEL_INFO[globalLevel].desc}
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setIsSessionRunning(true);
                          if (currentBlock?.stationId && currentBlock.stationId !== 'overview') {
                            setActiveNav(currentBlock.stationId);
                          } else {
                            setActiveNav('station1');
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition shadow-sm hover:opacity-95 min-h-[44px]"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>
                          {totalElapsedSeconds > 0 ? 'Continuar Bloque Activo' : 'Iniciar Sesión de Entrenamiento'}
                        </span>
                      </button>

                      <button
                        onClick={() => handleInjectBlock('oral')}
                        className="px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition min-h-[44px]"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <PlusCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                        <span>+15 min Reto Oral</span>
                      </button>

                      <button
                        onClick={() => handleInjectBlock('motor')}
                        className="px-3.5 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition min-h-[44px]"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <PlusCircle className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                        <span>+15 min Reto Bimanual</span>
                      </button>
                    </div>
                  </div>

                  {/* Resumen de Tiempos de la Sesión (Sin duplicar controles confusos) */}
                  <div
                    className="lg:col-span-5 rounded-xl p-4 border grid grid-cols-2 gap-3"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Duración Configurada
                      </div>
                      <div className="text-xl font-mono font-bold mt-0.5">
                        {totalConfiguredMinutes} min
                      </div>
                      <div className="text-[11px] font-mono" style={{ color: 'var(--accent-primary)' }}>
                        {(totalConfiguredMinutes / 60).toFixed(1)} horas ({sessionBlocks.length} bloques)
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Tiempo Restante Bloque
                      </div>
                      <div className="text-xl font-mono font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>
                        {formatTime(blockSecondsLeft)}
                      </div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--text-secondary)' }}>
                        Act: {currentBlock?.mod}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Tiempo Realizado Hoy
                      </div>
                      <div className="text-lg font-mono font-semibold mt-0.5">
                        {formatTime(totalElapsedSeconds)}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        Sincronizado en vivo
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--surface-primary)' }}>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Palabras Conquistadas
                      </div>
                      <div className="text-lg font-mono font-semibold mt-0.5 text-emerald-500">
                        {avoidedWords.filter((w) => w.conquered).length} / {avoidedWords.length}
                      </div>
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        Cero sustitución léxica
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Distribución de 2 Columnas: Configurador de Duración + Ruta de Entrenamiento */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Configurador de Sesión (15m a 240m) */}
                <div
                  className="lg:col-span-5 rounded-2xl p-5 border space-y-5 self-start"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div>
                    <h3 className="text-base font-semibold">Configuración de Duración de Sesión</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Adapta el laboratorio a tu carga universitaria hoy o extiende más allá de las 2 horas con bloques automáticos de descarga neuromotora.
                    </p>
                  </div>

                  {/* Presets de 15, 30, 45, 90, 120 y 180 min */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { m: 15, label: '15 min', sub: 'Mínimo viable' },
                      { m: 30, label: '30 min', sub: 'Mantenimiento' },
                      { m: 45, label: '45 min', sub: 'Estándar' },
                      { m: 90, label: '90 min', sub: 'Foco profundo' },
                      { m: 120, label: '120 min', sub: 'Sesión 2h' },
                      { m: 180, label: '180 min', sub: 'Extendido 3h' }
                    ].map((preset) => {
                      const active = configuredMinutes === preset.m;
                      return (
                        <button
                          key={preset.m}
                          onClick={() => handleConfigureSessionMinutes(preset.m)}
                          className="p-2.5 rounded-xl border text-left transition-all min-h-[56px]"
                          style={{
                            backgroundColor: active ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                            borderColor: active ? 'var(--accent-primary)' : 'var(--border-color)'
                          }}
                        >
                          <div
                            className="text-sm font-mono font-bold"
                            style={{ color: active ? 'var(--accent-primary)' : 'var(--text-primary)' }}
                          >
                            {preset.label}
                          </div>
                          <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            {preset.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Control continuo hasta 240 min */}
                  <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-secondary)' }}>Ajuste fino (hasta 240 min / 4h):</span>
                      <span className="font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                        {configuredMinutes} min
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="240"
                      step="15"
                      value={configuredMinutes}
                      onChange={(e) => handleConfigureSessionMinutes(Number(e.target.value))}
                      className="w-full cursor-pointer accent-teal-500"
                      aria-label="Duración personalizada en minutos"
                    />
                    <div className="flex justify-between text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                      <span>15m</span>
                      <span>60m</span>
                      <span>120m</span>
                      <span>180m</span>
                      <span>240m</span>
                    </div>
                  </div>

                  {/* Aviso de Protección Neuromotora */}
                  <div
                    className="p-3.5 rounded-xl border space-y-1.5"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Guardia de Fatiga Sináptica y Muscular</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {configuredMinutes > 120
                        ? 'Modo Extendido (>2h) activo: Se han intercalado bloques de Descarga Escapular/Laríngea y cada bloque de mano izquierda se limita a <= 18 min en silencio vocal.'
                        : 'Todas las sesiones intercalan habla, oratoria, motricidad y escritura para no saturar un mismo grupo muscular.'}
                    </p>
                  </div>
                </div>

                {/* Ruta de Entrenamiento Secuencial */}
                <div
                  className="lg:col-span-7 rounded-2xl p-5 border space-y-4"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold">Ruta de Entrenamiento de la Sesión</h3>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Selecciona cualquier etapa para abrir su estación o marcarla como completada.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--surface-elevated)' }}>
                      {completedBlocksCount} de {sessionBlocks.length} completados
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {sessionBlocks.map((blk, idx) => {
                      const isCurrent = idx === activeBlockIdx;
                      return (
                        <div
                          key={blk.id}
                          className="p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          style={{
                            backgroundColor: isCurrent ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                            borderColor: isCurrent ? 'var(--accent-primary)' : 'var(--border-color)'
                          }}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <button
                              onClick={() =>
                                setSessionBlocks((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, completed: !item.completed } : item))
                                )
                              }
                              className="mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition"
                              style={{
                                backgroundColor: blk.completed ? '#10B981' : 'transparent',
                                borderColor: blk.completed ? '#10B981' : 'var(--border-color)',
                                color: '#FFFFFF'
                              }}
                              aria-label={`Marcar ${blk.title} como completado`}
                            >
                              {blk.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </button>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--accent-primary)' }}>
                                  {blk.mod}
                                </span>
                                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                                  • {blk.duration} min
                                </span>
                              </div>
                              <h4 className={`text-sm font-semibold ${blk.completed ? 'line-through opacity-60' : ''}`}>
                                {blk.title}
                              </h4>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                {blk.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => {
                                setActiveBlockIdx(idx);
                                setBlockSecondsLeft(blk.duration * 60);
                                setIsSessionRunning(true);
                                if (blk.stationId !== 'overview') setActiveNav(blk.stationId);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition min-h-[36px]"
                              style={{
                                backgroundColor: 'var(--accent-primary)',
                                color: 'var(--accent-contrast)'
                              }}
                            >
                              <span>Practicar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Acceso a las 4 Estaciones Especializadas con Detalles Expandibles */}
              <section className="space-y-3">
                <h3 className="text-base font-semibold">Estaciones Especializadas del Laboratorio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'station1',
                      module: 'Módulos I y II',
                      title: 'Estación I · Fluidez del Habla y Biomecánica Vocal',
                      duration: '25 - 40 min',
                      summary:
                        'Monitor acústico en tiempo real (60-65 dB), calentamiento de tracto vocal semiocluido (TVSO), congelación de bloqueos de 2.0s y registro de no-evitación léxica.',
                      details:
                        'Fundamento clínico: Desacopla la rigidez del músculo esternocleidomastoideo y evita el golpe glótico tras una pausa mediante inicio fonatorio suave (/h/).'
                    },
                    {
                      id: 'station2',
                      module: 'Módulo III',
                      title: 'Estación II · Pensamiento Verbal e Improvisación en Ingeniería',
                      duration: '20 - 30 min',
                      summary:
                        'Generador de preguntas imprevistas de defensa técnica con freno visual obligatorio de 2.0 segundos, matriz estructural PREP y marcapasos de fraseo.',
                      details:
                        'Fundamento cognitivo: Sincroniza la velocidad de formulación conceptual con la programación motora articulatoria, sustituyendo muletillas de repetición por silencio deliberado.'
                    },
                    {
                      id: 'station3',
                      module: 'Módulo IV',
                      title: 'Estación III · Caligrafía ISO 3098 y Bimanualidad Segura',
                      duration: '25 - 35 min',
                      summary:
                        'Auditoría de presión axial (Hoja Fantasma), metrónomo cinemático con proporciones ISO 3098 (10:7) y lienzo interactivo para mano izquierda con guardia de 20 minutos.',
                      details:
                        'Fundamento biomecánico: Elimina la co-contracción del trapecio/hombro derecho reduciendo la fuerza normal a < 1.5 N y entrena el cuerpo calloso sin interferir con el habla.'
                    },
                    {
                      id: 'station4',
                      module: 'Módulo V',
                      title: 'Estación IV · Argumentación Técnica y Sintaxis Científica',
                      duration: '15 - 25 min',
                      summary:
                        'Constructor estructurado de 4 etapas de Toulmin (Afirmación, Evidencia, Garantía física y Reserva) con auditor sintáctico de longitud oracional (<= 25 palabras).',
                      details:
                        'Fundamento académico: Conecta datos experimentales o cálculos con leyes termodinámicas/mecánicas manteniendo cohesión Dado → Nuevo.'
                    }
                  ].map((st) => {
                    const isExpanded = expandedStationCard === st.id;
                    return (
                      <div
                        key={st.id}
                        className="rounded-2xl p-5 border flex flex-col justify-between transition-all"
                        style={{
                          backgroundColor: 'var(--surface-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                            <span>{st.module}</span>
                            <span>{st.duration}</span>
                          </div>
                          <h4 className="text-base font-semibold">{st.title}</h4>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {st.summary}
                          </p>
                          {isExpanded && (
                            <div
                              className="p-3 rounded-xl text-xs mt-2 border"
                              style={{
                                backgroundColor: 'var(--surface-elevated)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {st.details}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                          <button
                            onClick={() => setExpandedStationCard(isExpanded ? null : st.id)}
                            className="text-xs font-medium flex items-center gap-1"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span>{isExpanded ? 'Ocultar fundamento' : 'Ver fundamento clínico'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => setActiveNav(st.id)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                            style={{
                              backgroundColor: 'var(--accent-primary)',
                              color: 'var(--accent-contrast)'
                            }}
                          >
                            <span>Entrar a la Estación</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* -----------------------------------------------------------------
              ESTACIÓN I: FLUIDEZ DEL HABLA Y BIOMECÁNICA VOCAL (MÓDULOS I y II)
             ----------------------------------------------------------------- */}
          {activeNav === 'station1' && (
            <div className="space-y-6">
              {renderPedagogicalStepper('station1')}

              {/* PASO 1 & 2: PREPARACIÓN E INSTRUCCIONES */}
              {(stationViewMode === 'all' || stationStep.station1 === 1 || stationStep.station1 === 2) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Preparación: Calentamiento TVSO */}
                  <div
                    className="rounded-2xl p-5 border space-y-4"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                          1. PREPARACIÓN AERODINÁMICA
                        </span>
                        <h3 className="text-base font-semibold mt-0.5">
                          Descompresión Laríngea con Tracto Vocal Semiocluido (TVSO)
                        </h3>
                      </div>
                      <span className="text-lg font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                        {formatTime(sovtSecondsLeft)}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Antes de leer o exponer, realiza 3 minutos de vibración labial suave (<code>/bvvvvv/</code>) o fonación en un pitillo. La presión intraoral positiva separa ligeramente los pliegues vocales y desactiva la hipertonía de los músculos extrínsecos del cuello.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => setSovtRunning((r) => !r)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 min-h-[40px]"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        {sovtRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{sovtRunning ? 'Pausar Calentamiento TVSO' : 'Iniciar 3 min TVSO'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSovtRunning(false);
                          setSovtSecondsLeft(180);
                        }}
                        className="px-3 py-2 rounded-xl border text-xs font-medium min-h-[40px]"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        Reiniciar 3:00
                      </button>
                      {stationViewMode === 'guided' && (
                        <button
                          onClick={() => setStationStep((s) => ({ ...s, station1: 3 }))}
                          className="ml-auto text-xs font-semibold flex items-center gap-1"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <span>Ir a Ejecución Activa</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Instrucciones: Inicio Suave y Modificación de Bloqueos */}
                  <div
                    className="rounded-2xl p-5 border space-y-3"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      2. PROTOCOLO CLÍNICO (VAN RIPER & EASY ONSET)
                    </span>
                    <h3 className="text-base font-semibold">
                      Cómo Iniciar sin Cierre Glótico y Cómo Desactivar un Bloqueo
                    </h3>
                    <ul className="space-y-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Inicio Fonatorio Suave:</strong> Tras cada pausa, exhala una fracción de segundo de aire pasivo inaudible (<code>/h/</code>) antes de encender la vibración de la primera vocal.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>
                          <strong>Congelación y Cancelación (2.0s):</strong> Si ocurre un bloqueo silencioso, no empujes ni cabecees. Pulsa el botón de congelación de 2.0s, baja la tensión del cuello y suelta el sonido suavemente.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* PASO 3: EJECUCIÓN INSTRUMENTAL ACTIVA */}
              {(stationViewMode === 'all' || stationStep.station1 === 3) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Columna Izquierda (7 cols): Monitor dB + Congelador de Bloqueos + Lectura */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Monitor Acústico de Intensidad y Presión Subglótica */}
                    <div
                      className="rounded-2xl p-5 border space-y-4"
                      style={{
                        backgroundColor: 'var(--surface-primary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                            BIOFEEDBACK ACÚSTICO EN TIEMPO REAL
                          </span>
                          <h3 className="text-base font-semibold">
                            Control de Volumen y Estabilidad Subglótica (Meta: 60–65 dB)
                          </h3>
                        </div>

                        {!micActive ? (
                          <button
                            onClick={startAcousticMonitor}
                            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 min-h-[42px]"
                            style={{
                              backgroundColor: 'var(--accent-primary)',
                              color: 'var(--accent-contrast)'
                            }}
                          >
                            <Mic className="w-4 h-4" />
                            <span>Activar Monitor de dB</span>
                          </button>
                        ) : (
                          <button
                            onClick={stopAcousticMonitor}
                            className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border min-h-[42px]"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                              borderColor: '#EF4444',
                              color: '#EF4444'
                            }}
                          >
                            <MicOff className="w-4 h-4" />
                            <span>Detener {simulatedMic ? '(Simulado)' : '(Micrófono)'}</span>
                          </button>
                        )}
                      </div>

                      <div
                        className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <div>
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Intensidad Vocal
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span
                              className={`text-3xl font-mono font-bold ${
                                currentDb > 69
                                  ? 'text-amber-500'
                                  : currentDb >= 58 && currentDb <= 66
                                  ? 'text-emerald-500'
                                  : ''
                              }`}
                            >
                              {currentDb}
                            </span>
                            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                              dB SPL
                            </span>
                          </div>
                          <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {currentDb > 69
                              ? 'Aviso: Exceso de presión. Abre espacio entre muelas.'
                              : 'Rango proyectado cómodo sin empuje cervical.'}
                          </div>
                        </div>

                        <div className="sm:col-span-2 space-y-2">
                          <div
                            className="h-20 rounded-lg p-2 flex items-end gap-1 border overflow-hidden"
                            style={{
                              backgroundColor: 'var(--bg-primary)',
                              borderColor: 'var(--border-color)'
                            }}
                          >
                            {dbHistory.map((val, idx) => {
                              const pct = Math.min(100, Math.max(12, ((val - 36) / 50) * 100));
                              const inTarget = val >= 58 && val <= 66;
                              const isSpike = val > 69;
                              return (
                                <div
                                  key={idx}
                                  style={{
                                    height: `${pct}%`,
                                    backgroundColor: isSpike
                                      ? '#F59E0B'
                                      : inTarget
                                      ? '#10B981'
                                      : 'var(--accent-primary)'
                                  }}
                                  className="flex-1 rounded-t transition-all duration-150"
                                />
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                            <span>Silencio (~40 dB)</span>
                            <span className="text-emerald-500 font-semibold">Zona Óptima: 60–65 dB</span>
                            <span>Pico (&gt;70 dB)</span>
                          </div>
                        </div>
                      </div>

                      {/* Entrenador de Congelación del Bloqueo y Cancelación (2.0s) */}
                      <div
                        className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold">
                             Anclaje de Calma: Congelación / Cancelación de Bloqueo (2.0 s)
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Si notas cierre glótico o tensión en el cuello, pulsa el botón y suelta los hombros durante 2.0 segundos antes de continuar.
                          </p>
                        </div>
                        <button
                          onClick={() => setFreezeTimer(2.0)}
                          className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold shrink-0 transition min-h-[44px]"
                          style={{
                            backgroundColor: freezeTimer > 0 ? '#F59E0B' : 'var(--accent-primary)',
                            color: freezeTimer > 0 ? '#0C1420' : 'var(--accent-contrast)'
                          }}
                        >
                          {freezeTimer > 0
                            ? `Liberando cuello... ${freezeTimer.toFixed(1)}s`
                            : `Pausa de Liberación 2.0s (${freezeCompletedCount})`}
                        </button>
                      </div>
                    </div>

                    {/* Lectura de Ingeniería Adaptada al Nivel con Palabras Interactivas */}
                    <div
                      className="rounded-2xl p-5 border space-y-3"
                      style={{
                        backgroundColor: 'var(--surface-primary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold">
                          {TECHNICAL_READING_PASSAGES[globalLevel].title}
                        </h3>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                          Haz clic en una palabra para marcar anclaje suave
                        </span>
                      </div>

                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {TECHNICAL_READING_PASSAGES[globalLevel].instruction}
                      </p>

                      <div
                        className="p-4 rounded-xl border leading-relaxed text-base"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        {TECHNICAL_READING_PASSAGES[globalLevel].text.split(' ').map((word, i) => {
                          const key = `${globalLevel}-${i}`;
                          const isMarked = !!highlightedWords[key];
                          return (
                            <span
                              key={key}
                              onClick={() =>
                                setHighlightedWords((prev) => ({ ...prev, [key]: !prev[key] }))
                              }
                              className="inline-block mr-1.5 mb-1 px-1.5 py-0.5 rounded cursor-pointer transition"
                              style={{
                                backgroundColor: isMarked ? 'var(--accent-soft)' : 'transparent',
                                color: isMarked ? 'var(--accent-primary)' : 'var(--text-primary)',
                                borderBottom: isMarked ? '2px solid var(--accent-primary)' : 'none'
                              }}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha (5 cols): Registro Anti-Evitación de Palabras Técnicas */}
                  <div
                    className="lg:col-span-5 rounded-2xl p-5 border space-y-4 self-start"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div>
                      <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                        DES-EVITACIÓN LÉXICA ACTIVA
                      </span>
                      <h3 className="text-base font-semibold mt-0.5">
                        Palabras Técnicas Prohibidas de Sustituir
                      </h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Evitar o cambiar una palabra técnica por un sinónimo refuerza el temor anticipatorio. Pronúncialas aplicando inicio suave y registra cada uso real.
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newWordText.trim()) return;
                        setAvoidedWords((prev) => [
                          {
                            id: `w-${Date.now()}`,
                            word: newWordText.trim(),
                            phonetic: newWordSyllables.trim() || newWordText.trim(),
                            uses: 0,
                            target: 10,
                            conquered: false
                          },
                          ...prev
                        ]);
                        setNewWordText('');
                        setNewWordSyllables('');
                      }}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Término técnico..."
                        value={newWordText}
                        onChange={(e) => setNewWordText(e.target.value)}
                        className="sm:col-span-2 px-3 py-2 rounded-lg border text-xs outline-none"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Silabeo suave (opcional)"
                        value={newWordSyllables}
                        onChange={(e) => setNewWordSyllables(e.target.value)}
                        className="sm:col-span-2 px-3 py-2 rounded-lg border text-xs outline-none"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-lg text-xs font-semibold min-h-[38px]"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        + Añadir
                      </button>
                    </form>

                    <div className="space-y-2.5">
                      {avoidedWords.map((item) => {
                        const pct = Math.min(100, Math.round((item.uses / item.target) * 100));
                        return (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl border space-y-2"
                            style={{
                              backgroundColor: 'var(--surface-elevated)',
                              borderColor: item.conquered ? '#10B981' : 'var(--border-color)'
                            }}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">{item.word}</span>
                                  {item.conquered && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">
                                      Integrada
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                                  /h/ + {item.phonetic}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                                  {item.uses}/{item.target}
                                </span>
                                <button
                                  onClick={() =>
                                    setAvoidedWords((prev) =>
                                      prev.map((w) =>
                                        w.id === item.id
                                          ? { ...w, uses: w.uses + 1, conquered: w.uses + 1 >= w.target }
                                          : w
                                      )
                                    )
                                  }
                                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold"
                                  style={{
                                    backgroundColor: 'var(--accent-soft)',
                                    color: 'var(--accent-primary)'
                                  }}
                                >
                                  +1 Uso
                                </button>
                                <button
                                  onClick={() =>
                                    setAvoidedWords((prev) => prev.filter((w) => w.id !== item.id))
                                  }
                                  className="p-1.5 rounded hover:opacity-80"
                                  style={{ color: 'var(--text-secondary)' }}
                                  aria-label={`Eliminar palabra ${item.word}`}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: item.conquered ? '#10B981' : 'var(--accent-primary)'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4 & 5: RESULTADO Y REFLEXIÓN PROPIOCEPTIVA */}
              {(stationViewMode === 'all' || stationStep.station1 === 4 || stationStep.station1 === 5) && (
                <div
                  className="rounded-2xl p-5 border grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div>
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      4 & 5. RESULTADO Y REFLEXIÓN
                    </span>
                    <h4 className="text-sm font-semibold mt-0.5">Balance de Comodidad Laríngea y Cervical</h4>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Pausas de liberación de 2.0s realizadas hoy: <strong>{freezeCompletedCount}</strong>.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Comodidad en cuello al terminar (1-10):</span>
                      <strong className="font-mono">{station1Reflection.neckCalm}/10</strong>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={station1Reflection.neckCalm}
                      onChange={(e) =>
                        setStation1Reflection((p) => ({ ...p, neckCalm: Number(e.target.value) }))
                      }
                      className="w-full accent-teal-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveNav('station2')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                      style={{
                        backgroundColor: 'var(--accent-primary)',
                        color: 'var(--accent-contrast)'
                      }}
                    >
                      <span>Continuar a Estación II (Oratoria)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              ESTACIÓN II: ORATORIA TÉCNICA E IMPROVISACIÓN (MÓDULO III)
             ----------------------------------------------------------------- */}
          {activeNav === 'station2' && (
            <div className="space-y-6">
              {renderPedagogicalStepper('station2')}

              {/* PASO 1 & 2: PREPARACIÓN E INSTRUCCIONES */}
              {(stationViewMode === 'all' || stationStep.station2 === 1 || stationStep.station2 === 2) && (
                <div
                  className="rounded-2xl p-5 border grid grid-cols-1 md:grid-cols-2 gap-6"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="space-y-2">
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      1. PREPARACIÓN COGNITIVO-MOTORA
                    </span>
                    <h3 className="text-base font-semibold">
                      Sincronización entre Velocidad de Ideas y Ejecución del Habla
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      En defensa de proyectos de ingeniería, el bloqueo suele dispararse cuando intentas responder en el mismo milisegundo en que termina la pregunta. El Freno de 2.0 Segundos separa la recuperación conceptual de la planificación motora.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      2. PROTOCOLO DE RESPUESTA (SILENCIO 2.0s → PREP)
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Al lanzar una pregunta imprevista, la matriz se bloqueará durante <strong>2.0 segundos</strong>. Usa ese lapso para soltar los hombros y exhalar suave. Sustituye cualquier repetición de palabra puente (<em>"el... el..."</em>) por silencio puro.
                    </p>
                  </div>
                </div>
              )}

              {/* PASO 3: EJECUCIÓN (SIMULADOR DE JURADO + MARCAPASOS DE UNIDADES) */}
              {(stationViewMode === 'all' || stationStep.station2 === 3) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Simulador de Preguntas Imprevistas con Compuerta de 2.0s */}
                  <div
                    className="lg:col-span-7 rounded-2xl p-5 border space-y-5"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                          DEFENSA ORAL DE INGENIERÍA • {LEVEL_INFO[globalLevel].short}
                        </span>
                        <h3 className="text-base font-semibold">
                          Generador de Preguntas Imprevistas con Freno de 2.0s
                        </h3>
                      </div>

                      <button
                        onClick={triggerUnexpectedQuestion}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm min-h-[44px]"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        <Zap className="w-4 h-4" />
                        <span>Lanzar Pregunta Imprevista</span>
                      </button>
                    </div>

                    {/* Tarjeta de la Pregunta Activa */}
                    <div
                      className="p-5 rounded-xl border space-y-3"
                      style={{
                        backgroundColor: 'var(--surface-elevated)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span style={{ color: 'var(--accent-primary)' }}>Área: {currentQuestion.cat}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Respondidas hoy: {questionsAnsweredCount}
                        </span>
                      </div>

                      <p className="text-base sm:text-lg font-semibold leading-snug">
                        “{currentQuestion.q}”
                      </p>

                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <strong>Pista física:</strong> {currentQuestion.hint}
                      </p>
                    </div>

                    {/* Compuerta Visual de 2.0 Segundos de Silencio Obligatorio */}
                    {silentGateSeconds > 0 ? (
                      <div
                        className="p-4 rounded-xl border flex items-center justify-between"
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.14)',
                          borderColor: '#F59E0B'
                        }}
                        role="alert"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-mono font-bold text-amber-500">
                            COMPUERTA DE PAUSA DELIBERADA ACTIVA — NO INICIES LA FONACIÓN AÚN
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-primary)' }}>
                            Deja caer los hombros, toma aire silencioso y prepara tu primera frase corta.
                          </p>
                        </div>
                        <div className="text-2xl font-mono font-bold text-amber-500 shrink-0 ml-4">
                          {silentGateSeconds.toFixed(1)}s
                        </div>
                      </div>
                    ) : (
                      <div
                        className="px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs"
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.10)',
                          borderColor: '#10B981'
                        }}
                      >
                        <span className="font-medium text-emerald-500">
                          ✓ Compuerta abierta: Inicia con ataque vocal suave (/h/) siguiendo la estructura PREP
                        </span>
                        <button
                          onClick={() => setSilentGateSeconds(2.0)}
                          className="font-mono underline ml-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Repetir 2.0s
                        </button>
                      </div>
                    )}

                    {/* Matriz Interactiva PREP */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          key: 'point',
                          title: 'P · Punto Central',
                          prompt: '“El principio gobernante aquí es...”',
                          placeholder: 'Escribe 3-5 palabras clave de tu tesis...'
                        },
                        {
                          key: 'reason',
                          title: 'R · Razón Física / Ley',
                          prompt: '“Esto ocurre físicamente porque...”',
                          placeholder: 'Ecuación o ley física que lo sustenta...'
                        },
                        {
                          key: 'example',
                          title: 'E · Ejemplo en el Sistema',
                          prompt: '“En la práctica, cuando el componente...”',
                          placeholder: 'Aplicación concreta en la máquina...'
                        },
                        {
                          key: 'close',
                          title: 'P · Punto de Cierre',
                          prompt: '“Por consiguiente, el criterio de diseño es...”',
                          placeholder: 'Conclusión breve sin acelerar el final...'
                        }
                      ].map((slot) => {
                        const isFocused = activePrepSlot === slot.key;
                        return (
                          <div
                            key={slot.key}
                            onClick={() => setActivePrepSlot(slot.key)}
                            className="p-3.5 rounded-xl border transition cursor-pointer space-y-1.5"
                            style={{
                              backgroundColor: isFocused ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                              borderColor: isFocused ? 'var(--accent-primary)' : 'var(--border-color)'
                            }}
                          >
                            <div className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                              {slot.title}
                            </div>
                            <div className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                              {slot.prompt}
                            </div>
                            <input
                              type="text"
                              placeholder={slot.placeholder}
                              value={prepNotes[slot.key]}
                              onChange={(e) =>
                                setPrepNotes((prev) => ({ ...prev, [slot.key]: e.target.value }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border text-xs outline-none mt-1"
                              style={{
                                backgroundColor: 'var(--bg-primary)',
                                borderColor: 'var(--border-color)',
                                color: 'var(--text-primary)'
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setQuestionsAnsweredCount((c) => c + 1);
                          setPrepNotes({ point: '', reason: '', example: '', close: '' });
                          notify('Respuesta PREP registrada. Lanza otra pregunta cuando estés listo.');
                        }}
                        className="px-4 py-2 rounded-xl border text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        ✓ Marcar Pregunta como Defendida
                      </button>
                    </div>
                  </div>

                  {/* Marcapasos de Unidades de Pensamiento (Chunking) */}
                  <div
                    className="lg:col-span-5 rounded-2xl p-5 border space-y-5 self-start"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div>
                      <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                        REGULADOR DE FLUJO DISCURSIVO
                      </span>
                      <h3 className="text-base font-semibold mt-0.5">
                        Marcapasos de Unidades de Pensamiento ({LEVEL_INFO[globalLevel].chunkWords} palabras)
                      </h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Entrena la emisión de bloques cortos de {LEVEL_INFO[globalLevel].chunkWords} palabras seguidos de 1.3 segundos de pausa silenciosa para eliminar las repeticiones de arranque.
                      </p>
                    </div>

                    <div
                      className="p-6 rounded-xl border flex flex-col items-center text-center space-y-4"
                      style={{
                        backgroundColor: 'var(--surface-elevated)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div
                        className="w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300"
                        style={{
                          borderColor: !chunkPacerRunning
                            ? 'var(--border-color)'
                            : chunkPhase === 'SPEAK'
                            ? '#10B981'
                            : '#F59E0B',
                          backgroundColor: !chunkPacerRunning
                            ? 'var(--bg-primary)'
                            : chunkPhase === 'SPEAK'
                            ? 'rgba(16, 185, 129, 0.12)'
                            : 'rgba(245, 158, 11, 0.12)'
                        }}
                      >
                        <span className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-secondary)' }}>
                          {!chunkPacerRunning
                            ? 'PAUSADO'
                            : chunkPhase === 'SPEAK'
                            ? 'EMITE UNIDAD'
                            : 'SILENCIO PURO'}
                        </span>
                        <span className="text-base font-mono font-bold mt-1">
                          {!chunkPacerRunning
                            ? `${LEVEL_INFO[globalLevel].chunkWords} palabras`
                            : chunkPhase === 'SPEAK'
                            ? `${LEVEL_INFO[globalLevel].chunkWords} palabras`
                            : 'Suelta 1.3s'}
                        </span>
                      </div>

                      <button
                        onClick={() => setChunkPacerRunning((r) => !r)}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold transition min-h-[42px]"
                        style={{
                          backgroundColor: chunkPacerRunning ? 'var(--surface-primary)' : 'var(--accent-primary)',
                          color: chunkPacerRunning ? 'var(--text-primary)' : 'var(--accent-contrast)',
                          border: chunkPacerRunning ? '1px solid var(--border-color)' : 'none'
                        }}
                      >
                        {chunkPacerRunning ? 'Detener Marcapasos Visual' : 'Iniciar Marcapasos de Fraseo'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4 & 5: RESULTADO Y REFLEXIÓN */}
              {(stationViewMode === 'all' || stationStep.station2 === 4 || stationStep.station2 === 5) && (
                <div
                  className="rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div>
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      4 & 5. SÍNTESIS DE ORATORIA
                    </span>
                    <h4 className="text-sm font-semibold">
                      Preguntas defendidas con protocolo de pausa de 2.0s: {questionsAnsweredCount}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveNav('station3')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)'
                    }}
                  >
                    <span>Continuar a Estación III (Motricidad e ISO 3098)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              ESTACIÓN III: MOTRICIDAD FINA, ISO 3098 Y BIMANUALIDAD (MÓDULO IV)
             ----------------------------------------------------------------- */}
          {activeNav === 'station3' && (
            <div className="space-y-6">
              {renderPedagogicalStepper('station3')}

              {/* Guardia Neurológica de Mano Izquierda Siempre Visible en esta Estación */}
              <div
                className="rounded-2xl p-4 border flex flex-wrap items-center justify-between gap-4"
                style={{
                  backgroundColor: 'var(--surface-primary)',
                  borderColor: leftHandGuardSeconds > 1200 ? '#EF4444' : 'var(--border-color)'
                }}
              >
                <div className="flex items-start gap-3">
                  <ShieldAlert
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: leftHandGuardSeconds > 1200 ? '#EF4444' : 'var(--accent-primary)' }}
                  />
                  <div>
                    <h3 className="text-xs font-mono font-bold">
                      GUARDIA NEUROMOTORA BIMANUAL (PROTOCOLO DA VINCI SEGURO)
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      Practica con tu mano izquierda en <strong>silencio vocal total</strong> (nunca hables al mismo tiempo) y no excedas <strong>20:00 minutos</strong> por bloque para evitar interferencia en el área motora suplementaria (SMA).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent-primary)' }}>
                    {formatTime(leftHandGuardSeconds)} / 20:00
                  </span>
                  <button
                    onClick={() => setLeftHandGuardActive((a) => !a)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    {leftHandGuardActive ? 'Pausar Guardia' : 'Iniciar Guardia'}
                  </button>
                  <button
                    onClick={() => {
                      setLeftHandGuardActive(false);
                      setLeftHandGuardSeconds(0);
                    }}
                    className="text-xs underline"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* PASO 1 & 2: ERGONOMÍA, PRUEBA DE HOJA FANTASMA Y NORMA ISO 3098 */}
              {(stationViewMode === 'all' || stationStep.station3 === 1 || stationStep.station3 === 2) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Prueba de la Hoja Fantasma */}
                  <div
                    className="rounded-2xl p-5 border space-y-3"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      1. DESCOMPRESIÓN ESCAPULAR (MANO DERECHA)
                    </span>
                    <h3 className="text-base font-semibold">
                      Protocolo de Cero Presión Axial (“Prueba de la Hoja Fantasma”)
                    </h3>
                    <div className="space-y-2 pt-1">
                      {[
                        {
                          k: 'rollerPen',
                          text: 'Bolígrafo de gel o tinta líquida (0.5 o 0.7 mm) inclinado a 45°; evita bolígrafos de pasta dura.'
                        },
                        {
                          k: 'forearmSupport',
                          text: '70% del antebrazo apoyado sobre la mesa; la mano se desliza sobre el meñique.'
                        },
                        {
                          k: 'droppedTrap',
                          text: 'Hombro derecho desencogido y suelto (sin bloquear la muñeca al trazar).'
                        },
                        {
                          k: 'zeroEmbossing',
                          text: 'Reverso del papel completamente liso al pasar la yema de los dedos (< 1.5 N).'
                        }
                      ].map((chk) => (
                        <label
                          key={chk.k}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs"
                          style={{
                            backgroundColor: 'var(--surface-elevated)',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={ghostChecklist[chk.k]}
                            onChange={(e) =>
                              setGhostChecklist((prev) => ({ ...prev, [chk.k]: e.target.checked }))
                            }
                            className="mt-0.5 accent-teal-500"
                          />
                          <span>{chk.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Especificación Geométrica ISO 3098 Tipo B */}
                  <div
                    className="rounded-2xl p-5 border space-y-3"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      2. ESTÁNDAR DE ROTULACIÓN TÉCNICA ISO 3098-1 (TIPO B · 10:7)
                    </span>
                    <h3 className="text-base font-semibold">
                      Proporciones Geométricas para Legibilidad sin Pérdida de Velocidad
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Mayúsculas (h)</div>
                        <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>10/10 h</div>
                      </div>
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Minúsculas (c1)</div>
                        <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>7/10 h</div>
                      </div>
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Espacio letra (a)</div>
                        <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>2/10 h</div>
                      </div>
                      <div className="p-2.5 rounded-xl border" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Espesor trazo (d)</div>
                        <div className="text-sm font-bold mt-0.5" style={{ color: 'var(--accent-primary)' }}>1/10 h</div>
                      </div>
                    </div>
                    <div
                      className="p-3 rounded-xl border font-mono text-xs space-y-1"
                      style={{
                        backgroundColor: 'var(--surface-elevated)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <div className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        MUESTRA DE TRAZO SIMPLE DIRECTO (RECTO O 75°):
                      </div>
                      <div className="text-sm font-bold tracking-wider">
                        A B C D E F G H I J K L M N • 0 1 2 3 4 5 6 7 8 9
                      </div>
                      <div style={{ color: 'var(--accent-primary)' }}>
                        ∑ M_A = 0 | σ_max = M·c / I | Re = ρ·v·D / μ
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: EJECUCIÓN (METRÓNOMO + LIENZO INTERACTIVO HTML5) */}
              {(stationViewMode === 'all' || stationStep.station3 === 3) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Panel del Metrónomo y Selector de Modo Bimanual (4 cols) */}
                  <div
                    className="lg:col-span-4 rounded-2xl p-5 border space-y-5 self-start"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                          CADENCIA CINEMÁTICA
                        </span>
                        <h3 className="text-base font-semibold">Metrónomo de Escritura</h3>
                      </div>
                      <div
                        className="w-7 h-7 rounded-full border-2 transition-transform duration-100"
                        style={{
                          backgroundColor: metronomeRunning && metronomePulse ? 'var(--accent-primary)' : 'transparent',
                          borderColor: 'var(--accent-primary)',
                          transform: metronomeRunning && metronomePulse ? 'scale(1.18)' : 'scale(1)'
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span style={{ color: 'var(--text-secondary)' }}>Cadencia actual:</span>
                        <span className="font-bold" style={{ color: 'var(--accent-primary)' }}>
                          {customBpm} BPM
                        </span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="115"
                        value={customBpm}
                        onChange={(e) => setCustomBpm(Number(e.target.value))}
                        className="w-full accent-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMetronomeRunning((r) => !r)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold min-h-[42px]"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        {metronomeRunning ? 'Pausar Metrónomo' : 'Iniciar Pulso Visual'}
                      </button>
                      <button
                        onClick={() => setAudioTickEnabled((a) => !a)}
                        className="px-3 py-2.5 rounded-xl border text-xs font-mono min-h-[42px]"
                        style={{
                          backgroundColor: audioTickEnabled ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                          borderColor: audioTickEnabled ? 'var(--accent-primary)' : 'var(--border-color)'
                        }}
                        title="Activar/desactivar clic auditivo suave"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                      <div className="text-xs font-semibold">Modos de Plantilla en el Lienzo:</div>
                      {[
                        {
                          id: 'iso3098',
                          title: 'Modo 1 · Pauta ISO 3098 (10:7) y Macro-Trazos',
                          sub: 'Líneas guía h=10 y c1=7 con inclinación técnica.'
                        },
                        {
                          id: 'mirror',
                          title: 'Modo 2 · Simetría en Espejo (Cuerpo Calloso)',
                          sub: 'Trazado simultáneo bimanual desde el eje central.'
                        },
                        {
                          id: 'dcl',
                          title: 'Modo 3 · Asimetría DCL (Ejes Izq. + Vectores Der.)',
                          sub: 'Mano izquierda traza viga/ejes; derecha acota fuerzas.'
                        }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setCanvasGuideType(m.id);
                            clearDrawingCanvas();
                          }}
                          className="w-full p-3 rounded-xl border text-left transition"
                          style={{
                            backgroundColor: canvasGuideType === m.id ? 'var(--accent-soft)' : 'var(--surface-elevated)',
                            borderColor: canvasGuideType === m.id ? 'var(--accent-primary)' : 'var(--border-color)'
                          }}
                        >
                          <div className="text-xs font-semibold">{m.title}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                            {m.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lienzo Interactivo HTML5 con Pauta Vectorial (8 cols) */}
                  <div
                    className="lg:col-span-8 rounded-2xl p-5 border space-y-4"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                          MESA DE TRAZADO DIGITAL Y GUÍA PARA PAPEL MILIMETRADO
                        </span>
                        <h3 className="text-base font-semibold">
                          Lienzo de Precisión Grafo-Motora ({strokeCount} trazos en esta ronda)
                        </h3>
                      </div>
                      <button
                        onClick={clearDrawingCanvas}
                        className="px-3.5 py-2 rounded-xl border text-xs font-medium min-h-[38px]"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        Limpiar Lienzo
                      </button>
                    </div>

                    <div
                      className="relative w-full h-[320px] rounded-xl border overflow-hidden select-none touch-none"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      {/* Guías Vectoriales SVG de Fondo */}
                      <svg
                        viewBox="0 0 720 320"
                        className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
                      >
                        <defs>
                          <pattern id="isoGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path
                              d="M 24 0 L 0 0 0 24"
                              fill="none"
                              stroke={theme === 'dark' ? '#304055' : '#CBD5E1'}
                              strokeWidth="1"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#isoGrid)" />

                        {canvasGuideType === 'iso3098' && (
                          <g>
                            {/* Renglón ISO 3098: Base (y=216), Minúscula 7/10 (y=132), Mayúscula 10/10 (y=96) */}
                            <line x1="24" y1="96" x2="696" y2="96" stroke="#2EE6C5" strokeWidth="1.5" strokeDasharray="6 4" />
                            <line x1="24" y1="132" x2="696" y2="132" stroke="#9B87FF" strokeWidth="1.5" strokeDasharray="4 4" />
                            <line x1="24" y1="216" x2="696" y2="216" stroke="#2EE6C5" strokeWidth="2" />
                            <text x="32" y="88" fill="#2EE6C5" fontSize="11" fontFamily="monospace">
                              Línea 10/10 h (Mayúsculas y números)
                            </text>
                            <text x="32" y="125" fill="#9B87FF" fontSize="11" fontFamily="monospace">
                              Línea 7/10 h (Altura cuerpo minúsculas c1)
                            </text>
                            <text
                              x="40"
                              y="214"
                              fill="none"
                              stroke={theme === 'dark' ? '#2EE6C5' : '#0A8F7C'}
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              fontSize="96"
                              fontFamily="monospace"
                            >
                              A b Δ 2 5 σ
                            </text>
                          </g>
                        )}

                        {canvasGuideType === 'mirror' && (
                          <g fill="none">
                            <line x1="360" y1="10" x2="360" y2="310" stroke="#F59E0B" strokeWidth="2" strokeDasharray="6 4" />
                            <circle cx="210" cy="160" r="78" stroke="#9B87FF" strokeWidth="2" strokeDasharray="5 5" />
                            <circle cx="510" cy="160" r="78" stroke="#10B981" strokeWidth="2" strokeDasharray="5 5" />
                            <path d="M 330 60 L 130 250 L 330 250 Z" stroke="#9B87FF" strokeWidth="1.5" strokeDasharray="4 4" />
                            <path d="M 390 60 L 590 250 L 390 250 Z" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 4" />
                          </g>
                        )}

                        {canvasGuideType === 'dcl' && (
                          <g fill="none">
                            <line x1="96" y1="240" x2="624" y2="240" stroke="#9B87FF" strokeWidth="2" strokeDasharray="5 5" />
                            <line x1="96" y1="264" x2="96" y2="48" stroke="#9B87FF" strokeWidth="2" strokeDasharray="5 5" />
                            <rect x="96" y="138" width="384" height="42" stroke="#9B87FF" strokeWidth="2.5" strokeDasharray="6 4" />
                            <line x1="480" y1="60" x2="480" y2="134" stroke="#10B981" strokeWidth="3" />
                            <polygon points="480,138 473,122 487,122" fill="#10B981" />
                            <text x="110" y="126" fill="#9B87FF" fontSize="13" fontFamily="monospace">
                              MANO IZQ: Ejes (X,Y) y contorno de viga
                            </text>
                            <text x="495" y="96" fill="#10B981" fontSize="13" fontFamily="monospace">
                              MANO DER: Vector F y cotas
                            </text>
                          </g>
                        )}
                      </svg>

                      <canvas
                        ref={canvasRef}
                        width={720}
                        height={320}
                        onMouseDown={handleCanvasStart}
                        onMouseMove={handleCanvasMove}
                        onMouseUp={handleCanvasEnd}
                        onMouseLeave={handleCanvasEnd}
                        onTouchStart={handleCanvasStart}
                        onTouchMove={handleCanvasMove}
                        onTouchEnd={handleCanvasEnd}
                        className="relative z-10 w-full h-full cursor-crosshair"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4 & 5: RESULTADO Y REFLEXIÓN */}
              {(stationViewMode === 'all' || stationStep.station3 === 4 || stationStep.station3 === 5) && (
                <div
                  className="rounded-2xl p-5 border flex flex-wrap items-center justify-between gap-4"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div>
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      4 & 5. VERIFICACIÓN BIOMECÁNICA MANUAL
                    </span>
                    <h4 className="text-sm font-semibold">
                      Criterios Hoja Fantasma cumplidos: {Object.values(ghostChecklist).filter(Boolean).length}/4
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveNav('station4')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)'
                    }}
                  >
                    <span>Continuar a Estación IV (Argumentación Toulmin)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              ESTACIÓN IV: ARGUMENTACIÓN TÉCNICA TOULMIN (MÓDULO V)
             ----------------------------------------------------------------- */}
          {activeNav === 'station4' && (
            <div className="space-y-6">
              {renderPedagogicalStepper('station4')}

              {/* PASO 1 & 2: PREPARACIÓN E INSTRUCCIONES */}
              {(stationViewMode === 'all' || stationStep.station4 === 1 || stationStep.station4 === 2) && (
                <div
                  className="rounded-2xl p-5 border grid grid-cols-1 md:grid-cols-2 gap-6"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      1. ESTRUCTURA LÓGICA ANTES DE REDACTAR
                    </span>
                    <h3 className="text-base font-semibold">Modelo de Toulmin Aplicado a Ingeniería</h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Todo párrafo de discusión de resultados o justificación de diseño debe encadenar: <strong>1) Afirmación</strong>, <strong>2) Evidencia cuantitativa</strong>, <strong>3) Garantía física/matemática</strong> y <strong>4) Reserva o mitigación</strong>.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      2. REGLA DE LAS 25 PALABRAS Y ESLABÓN DADO → NUEVO
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Mantén cada oración por debajo de 25-30 palabras, sitúa el sujeto cerca del verbo principal e inicia cada nueva oración retomando el concepto con el que cerró la anterior.
                    </p>
                  </div>
                </div>
              )}

              {/* PASO 3 & 4: CONSTRUCTOR TOULMIN + AUDITOR SINTÁCTICO EN VIVO */}
              {(stationViewMode === 'all' ||
                stationStep.station4 === 3 ||
                stationStep.station4 === 4 ||
                stationStep.station4 === 5) && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Constructor de 4 Renglones Toulmin (6 cols) */}
                  <div
                    className="lg:col-span-6 rounded-2xl p-5 border space-y-4"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">Constructor de Matriz Argumentativa</h3>
                      <button
                        onClick={handleSaveToulminArgument}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        Guardar Argumento
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          key: 'claim',
                          label: '1. Afirmación Técnica (Claim)',
                          sub: 'Tesis diagnóstica o decisión de diseño'
                        },
                        {
                          key: 'data',
                          label: '2. Evidencia Cuantitativa (Data)',
                          sub: 'Valor medido, simulado o calculado con unidades'
                        },
                        {
                          key: 'warrant',
                          label: '3. Garantía Física / Norma (Warrant)',
                          sub: 'Principio físico o criterio de falla que conecta el dato con la tesis'
                        },
                        {
                          key: 'rebuttal',
                          label: '4. Reserva y Rediseño (Rebuttal)',
                          sub: 'Condición de frontera o corrección geométrica/operativa'
                        }
                      ].map((f) => (
                        <div key={f.key} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <label className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                              {f.label}
                            </label>
                            <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
                              {toulminFields[f.key].split(/\s+/).filter(Boolean).length} palabras
                            </span>
                          </div>
                          <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                            {f.sub}
                          </p>
                          <textarea
                            rows={2}
                            value={toulminFields[f.key]}
                            onChange={(e) =>
                              setToulminFields((prev) => ({ ...prev, [f.key]: e.target.value }))
                            }
                            className="w-full p-2.5 rounded-xl border text-xs outline-none leading-relaxed"
                            style={{
                              backgroundColor: 'var(--surface-elevated)',
                              borderColor: 'var(--border-color)',
                              color: 'var(--text-primary)'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Auditor Sintáctico en Tiempo Real (6 cols) */}
                  <div
                    className="lg:col-span-6 rounded-2xl p-5 border space-y-4"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div>
                      <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                        AUDITORÍA SINTÁCTICA AUTOMÁTICA
                      </span>
                      <h3 className="text-base font-semibold mt-0.5">
                        Verificador de Claridad, Longitud y Cohesión
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Borrador libre opcional (vacío = analiza la matriz Toulmin):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Pega aquí cualquier párrafo de un informe técnico para auditarlo..."
                        value={freeArgumentDraft}
                        onChange={(e) => setFreeArgumentDraft(e.target.value)}
                        className="w-full p-2.5 rounded-xl border text-xs outline-none"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>

                    <div className="space-y-2.5">
                      {syntacticAudit.map((s) => (
                        <div
                          key={s.idx}
                          className="p-3.5 rounded-xl border space-y-1.5 text-xs leading-relaxed"
                          style={{
                            backgroundColor: 'var(--surface-elevated)',
                            borderColor:
                              s.state === 'alert'
                                ? '#EF4444'
                                : s.state === 'warning'
                                ? '#F59E0B'
                                : 'var(--border-color)'
                          }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                            <span className="font-semibold">Oración #{s.idx}</span>
                            <div className="flex items-center gap-2">
                              {s.hasConnector && (
                                <span className="text-emerald-500">✓ Conector lógico</span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded font-bold ${
                                  s.state === 'alert'
                                    ? 'bg-red-500/20 text-red-400'
                                    : s.state === 'warning'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}
                              >
                                {s.count} palabras{' '}
                                {s.state === 'optimal'
                                  ? '(<=25 Óptima)'
                                  : s.state === 'warning'
                                  ? '(26-30 Límite)'
                                  : '(>30 Podar oración)'}
                              </span>
                            </div>
                          </div>
                          <p>{s.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setActiveNav('telemetry')}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--accent-contrast)'
                        }}
                      >
                        <span>Finalizar y Registrar Sesión en Bitácora</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              VISTA VI: BITÁCORA, TELEMETRÍA Y CURVAS DE PROGRESO
             ----------------------------------------------------------------- */}
          {activeNav === 'telemetry' && (
            <div className="space-y-6">
              {/* Tarjetas de KPIs de Evolución */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: 'Tensión Cervical Actual',
                    val: `${logs[logs.length - 1]?.neckTension ?? 4}/10`,
                    sub: `Línea base inicial: ${logs[0]?.neckTension ?? 8}/10`,
                    good: true
                  },
                  {
                    label: 'Cumplimiento Pausa 2.0s',
                    val: `${logs[logs.length - 1]?.pauseCompliance ?? 80}%`,
                    sub: 'Freno antes de responder',
                    good: true
                  },
                  {
                    label: 'Relieve Hoja Fantasma',
                    val: `Grado ${logs[logs.length - 1]?.paperRelief ?? 0}`,
                    sub: 'Meta: Grado 0 (< 1.5 N)',
                    good: true
                  },
                  {
                    label: 'Palabras Des-evitadas',
                    val: `${avoidedWords.filter((w) => w.conquered).length}/${avoidedWords.length}`,
                    sub: 'Términos técnicos integrados',
                    good: true
                  }
                ].map((kpi, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {kpi.label}
                    </div>
                    <div className="text-2xl font-mono font-bold mt-1" style={{ color: 'var(--accent-primary)' }}>
                      {kpi.val}
                    </div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {kpi.sub}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Formulario de Registro de Sesión (5 cols) */}
                <form
                  onSubmit={handleSaveTelemetryLog}
                  className="lg:col-span-5 rounded-2xl p-5 border space-y-4 self-start"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div>
                    <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                      REGISTRO MULTIDIMENSIONAL
                    </span>
                    <h3 className="text-base font-semibold mt-0.5">Guardar Evaluación de la Sesión</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Mide comodidad biomecánica, control de pausa y precisión manual (no reducimos tu progreso a contar bloqueos).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      {
                        key: 'neckTension',
                        label: 'Tensión Cuello (1-10)',
                        min: 1,
                        max: 10,
                        step: 1,
                        suffix: '/10'
                      },
                      {
                        key: 'vocalFatigue',
                        label: 'Fatiga Vocal (1-10)',
                        min: 1,
                        max: 10,
                        step: 1,
                        suffix: '/10'
                      },
                      {
                        key: 'pauseCompliance',
                        label: 'Pausas 2.0s Aplicadas',
                        min: 0,
                        max: 100,
                        step: 5,
                        suffix: '%'
                      },
                      {
                        key: 'shoulderPain',
                        label: 'Dolor Hombro Der. (1-10)',
                        min: 1,
                        max: 10,
                        step: 1,
                        suffix: '/10'
                      },
                      {
                        key: 'paperRelief',
                        label: 'Relieve Hoja (0=Liso, 2=Alto)',
                        min: 0,
                        max: 2,
                        step: 1,
                        suffix: ''
                      },
                      {
                        key: 'leftHandPrecision',
                        label: 'Destreza Mano Izq. (1-5)',
                        min: 1,
                        max: 5,
                        step: 1,
                        suffix: '/5'
                      }
                    ].map((ctl) => (
                      <div
                        key={ctl.key}
                        className="p-3 rounded-xl border space-y-1.5"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <div className="flex justify-between font-mono">
                          <span>{ctl.label}:</span>
                          <strong style={{ color: 'var(--accent-primary)' }}>
                            {logForm[ctl.key]}
                            {ctl.suffix}
                          </strong>
                        </div>
                        <input
                          type="range"
                          min={ctl.min}
                          max={ctl.max}
                          step={ctl.step}
                          value={logForm[ctl.key]}
                          onChange={(e) =>
                            setLogForm((prev) => ({ ...prev, [ctl.key]: Number(e.target.value) }))
                          }
                          className="w-full accent-teal-500"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Observaciones clave (ej. Menos tensión en oclusivas, mejor ritmo ISO 3098)..."
                    value={logForm.notes}
                    onChange={(e) => setLogForm((prev) => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl text-xs font-semibold min-h-[44px]"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)'
                    }}
                  >
                    Registrar Sesión en el Historial
                  </button>
                </form>

                {/* Gráfica SVG de Evolución y Tabla Exportable (7 cols) */}
                <div
                  className="lg:col-span-7 rounded-2xl p-5 border space-y-5"
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                        CURVAS DE DESCOMPRESIÓN Y CONTROL
                      </span>
                      <h3 className="text-base font-semibold">
                        Evolución Histórica (Tensión Cervical vs. Dolor de Hombro)
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleExportJSON}
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={handleExportCSV}
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CSV</span>
                      </button>
                      <label
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                        style={{
                          backgroundColor: 'var(--surface-elevated)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Importar</span>
                        <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Gráfico Vectorial de Tendencia */}
                  <div
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-color)'
                    }}
                  >
                    <svg viewBox="0 0 560 150" className="w-full h-36 overflow-visible">
                      {[2, 5, 8].map((lvl) => {
                        const y = 130 - (lvl / 10) * 110;
                        return (
                          <g key={lvl}>
                            <line
                              x1="30"
                              y1={y}
                              x2="540"
                              y2={y}
                              stroke="var(--border-color)"
                              strokeDasharray="3 3"
                              strokeWidth="1"
                            />
                            <text x="4" y={y + 4} fill="var(--text-secondary)" fontSize="10" fontFamily="monospace">
                              {lvl}/10
                            </text>
                          </g>
                        );
                      })}

                      {logs.length > 1 && (
                        <>
                          {/* Polilínea Tensión de Cuello (Acento) */}
                          <polyline
                            fill="none"
                            stroke="var(--accent-primary)"
                            strokeWidth="2.5"
                            points={logs
                              .map((l, i) => {
                                const x = 45 + (i / (logs.length - 1)) * 480;
                                const y = 130 - (l.neckTension / 10) * 110;
                                return `${x},${y}`;
                              })
                              .join(' ')}
                          />
                          {/* Polilínea Dolor de Hombro (Ámbar) */}
                          <polyline
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            points={logs
                              .map((l, i) => {
                                const x = 45 + (i / (logs.length - 1)) * 480;
                                const y = 130 - (l.shoulderPain / 10) * 110;
                                return `${x},${y}`;
                              })
                              .join(' ')}
                          />
                        </>
                      )}

                      {logs.map((l, i) => {
                        const x = logs.length === 1 ? 280 : 45 + (i / (logs.length - 1)) * 480;
                        const yNeck = 130 - (l.neckTension / 10) * 110;
                        const yShoulder = 130 - (l.shoulderPain / 10) * 110;
                        return (
                          <g key={l.id}>
                            <circle cx={x} cy={yNeck} r="4" fill="var(--accent-primary)" />
                            <circle cx={x} cy={yShoulder} r="3.5" fill="#F59E0B" />
                            <text
                              x={x}
                              y="146"
                              textAnchor="middle"
                              fill="var(--text-secondary)"
                              fontSize="9"
                              fontFamily="monospace"
                            >
                              {l.date.slice(0, 8)}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                    <div className="flex items-center justify-center gap-6 text-xs mt-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded" style={{ backgroundColor: 'var(--accent-primary)' }} />
                        <span>Tensión Cervical (meta &le; 3/10)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded bg-amber-500" />
                        <span>Dolor Hombro Derecho (meta &le; 2/10)</span>
                      </span>
                    </div>
                  </div>

                  {/* Tabla Histórica Responsiva */}
                  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-color)' }}>
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr
                          className="border-b"
                          style={{
                            backgroundColor: 'var(--surface-elevated)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          <th className="p-2.5">Sesión</th>
                          <th className="p-2.5">Min/Nv</th>
                          <th className="p-2.5">Cuello</th>
                          <th className="p-2.5">Voz</th>
                          <th className="p-2.5">Pausa 2s</th>
                          <th className="p-2.5">Hombro</th>
                          <th className="p-2.5">Relieve</th>
                          <th className="p-2.5">Izq.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        {logs.map((row) => (
                          <tr key={row.id}>
                            <td className="p-2.5 font-semibold">{row.date}</td>
                            <td className="p-2.5">
                              {row.duration}m / N{row.level}
                            </td>
                            <td className="p-2.5">{row.neckTension}/10</td>
                            <td className="p-2.5">{row.vocalFatigue}/10</td>
                            <td className="p-2.5 text-emerald-500">{row.pauseCompliance}%</td>
                            <td className="p-2.5">{row.shoulderPain}/10</td>
                            <td className="p-2.5">G.{row.paperRelief}</td>
                            <td className="p-2.5">{row.leftHandPrecision}/5</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          </motion.div>
         </AnimatePresence>
        </main>
      </div>

      {/* =====================================================================
          ZONA D: PANEL CONTEXTUAL LATERAL BAJO DEMANDA (SLIDE-OVER DRAWER)
         ===================================================================== */}
      {contextDrawerOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/50 backdrop-blur-xs">
          <div
            className="w-full max-w-md h-full p-6 overflow-y-auto border-l space-y-6"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            role="dialog"
            aria-label="Guía clínica y referencias técnicas"
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
              <div>
                <span className="text-xs font-mono" style={{ color: 'var(--accent-primary)' }}>
                  REFERENCIA RÁPIDA DEL LABORATORIO
                </span>
                <h2 className="text-base font-bold">Protocolos Clínicos y Normas Técnicas</h2>
              </div>
              <button
                onClick={() => setContextDrawerOpen(false)}
                className="p-2 rounded-lg border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-color)'
                }}
                aria-label="Cerrar panel contextual"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  1. Fonoaudiología y Voz (Van Riper / Titze SOVT)
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Los bloqueos tónicos silenciosos ocurren por cierre laríngeo prematuro. Nunca empujes el aire con el cuello tenso: aplica <strong>Congelación de 2.0s</strong>, deja caer los hombros e inicia con un suspiro pasivo (<code>/h/</code>) manteniendo entre 60 y 65 dB.
                </p>
              </div>

              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  2. Norma ISO 3098-1 (Rotulado Técnico Tipo B · 10:7)
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Altura de mayúsculas y números: <code>10/10 h</code>. Altura de minúsculas (sin vástago): <code>7/10 h</code>. Separación entre caracteres: <code>2/10 h</code>. Espesor de trazo: <code>1/10 h</code>. Usa trazos simples rectos o a 75° sin presión vertical (&lt; 1.5 N).
                </p>
              </div>

              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  3. Seguridad Interhemisférica (Swinnen, 2002)
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  El área motora suplementaria (SMA) coordina tanto las secuencias bimanuales asimétricas como el inicio motor del habla. Entrena tu mano izquierda siempre en silencio vocal y por bloques menores a 20 minutos.
                </p>
              </div>

              <div
                className="p-4 rounded-xl border space-y-1.5"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-color)' }}
              >
                <div className="font-semibold" style={{ color: 'var(--accent-primary)' }}>
                  4. Cuándo consultar a un especialista clínico
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Acude a un fonoaudiólogo especializado en fluidez para calibrar salidas en vivo (*pull-outs*), a un ORL si presentas disfonía por más de 15 días, o a un médico/terapeuta ocupacional si notas dolor irradiado o temblor en reposo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ZONA A (MÓVIL Y TABLET < 1024px): BARRA DE NAVEGACIÓN INFERIOR TÁCTIL
         ===================================================================== */}
      <nav
        style={{
          backgroundColor: 'var(--surface-primary)',
          borderColor: 'var(--border-color)'
        }}
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t px-2 py-1.5 grid grid-cols-6 gap-1"
        aria-label="Navegación inferior móvil"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition min-h-[48px]"
              style={{
                backgroundColor: isActive ? 'var(--accent-soft)' : 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[10px] font-medium mt-1 truncate max-w-full">
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}