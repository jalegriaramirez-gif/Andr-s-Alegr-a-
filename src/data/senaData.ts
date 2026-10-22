export interface Question {
  id: string;
  category: 'identidad' | 'derechos' | 'deberes' | 'faltas' | 'etapas';
  question: string;
  context?: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  legalArticle: string;
}

export interface DilemmaCase {
  id: string;
  title: string;
  situation: string;
  protagonist: string;
  program: string;
  options: {
    text: string;
    isCorrect: boolean;
    consequence: string;
    articleReference: string;
  }[];
}

export interface FastSortingCard {
  id: string;
  text: string;
  category: 'derecho' | 'deber' | 'prohibicion';
  explanation: string;
}

export interface FaultSortingCard {
  id: string;
  text: string;
  severity: 'leve' | 'grave' | 'gravisima';
  explanation: string;
}

export interface InductionPhase {
  id: number;
  title: string;
  tagline: string;
  duration: string;
  objective: string;
  actions: string[];
  tools: string[];
  kpi: string;
}

export interface StationData {
  id: string;
  number: number;
  title: string;
  badge: string;
  iconName: string;
  summary: string;
  legalBase: string;
  keyPoints: {
    heading: string;
    text: string;
    icon?: string;
  }[];
  challengeQuiz: Question[];
}

export const SENA_LOGO_SVG = "data:image/svg+xml,%3c?xml%20version=%271.0%27%20encoding=%27utf-8%27?%3e%3c!--%20Generator:%20Adobe%20Illustrator%2026.0.1,%20SVG%20Export%20Plug-In%20.%20SVG%20Version:%206.00%20Build%200)%20--%3e%3csvg%20version=%271.1%27%20id=%27Capa_1%27%20xmlns=%27http://www.w3.org/2000/svg%27%20xmlns:xlink=%27http://www.w3.org/1999/xlink%27%20x=%270px%27%20y=%270px%27%20viewBox=%270%200%201000%201000%27%20style=%27enable-background:new%200%200%201000%201000;%27%20xml:space=%27preserve%27%3e%3cstyle%20type=%27text/css%27%3e%20.st0{fill:%2339a900;}%20%3c/style%3e%3cpath%20id=%27path47-5%27%20class=%27st0%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3cg%20id=%27_x23_000000ff-2%27%20transform=%27matrix(0.31570611,0,0,0.23560774,-391.49698,-10.601126)%27%3e%3c/g%3e%3c/svg%3e";

export const SENA_IDENTITY = {
  acronym: "SENA",
  fullName: "Servicio Nacional de Aprendizaje",
  motto: "Conocimiento y emprendimiento para todos los colombianos",
  regulation: "Acuerdo 0009 de 2024",
  regulationSubtitle: "Por el cual se adopta el Reglamento del Aprendiz SENA y se derogan disposiciones anteriores (Acuerdo 007 de 2012, 002 de 2014, 006 de 2023)",
  mission: "El SENA está encargado de cumplir la función que le corresponde al Estado de invertir en el desarrollo social y técnico de los trabajadores colombianos, ofreciendo y ejecutando la formación profesional integral, para la incorporación y el desarrollo de las personas en actividades productivas.",
  vision: "En el 2026, el SENA se consolidará como una entidad referente de formación técnica y tecnológica con pertinencia, inclusión social, transformación digital y transición energética justa en Colombia.",
  values: [
    { name: "Honestidad", desc: "Actuar siempre con fundamento en la verdad y la justicia institucional." },
    { name: "Respeto", desc: "Reconocer, valorar y tratar de manera digna a todas las personas sin distinción." },
    { name: "Compromiso", desc: "Ser consciente de la responsabilidad que implica formarse para el país." },
    { name: "Diligencia", desc: "Cumplir con los deberes y actividades formativas a tiempo y con excelencia." },
    { name: "Justicia", desc: "Garantizar la equidad y el cumplimiento de las normas en todo momento." },
    { name: "Solidaridad", desc: "Colaborar desinteresadamente con compañeros, instructores y la comunidad." },
    { name: "Lealtad", desc: "Obrar con rectitud y orgullo hacia el SENA y la sociedad colombiana." }
  ],
  symbols: [
    {
      title: "El Escudo",
      meaning: "Compuesto por tres sectores: el piñón representa la industria, el caduceo el comercio y servicios, y el café la agricultura. Simboliza los sectores económicos de la patria."
    },
    {
      title: "La Bandera",
      meaning: "Fondo blanco que simboliza la paz, tranquilidad y transparencia; lleva en su centro el escudo del SENA que refleja la formación para el trabajo productivo."
    },
    {
      title: "El Logosímbolo",
      meaning: "Representa a una persona caminando hacia el futuro, con los brazos abiertos en señal de crecimiento y desarrollo constante en el sendero del conocimiento."
    },
    {
      title: "El Himno del SENA",
      meaning: "Canto que exalta el amor a la patria, el estudio y el trabajo como los pilares que transforman el destino de los colombianos."
    }
  ]
};

export const STATIONS_DATA: StationData[] = [
  {
    id: "station-1",
    number: 1,
    title: "Identidad & ADN SENA",
    badge: "Insignia Orgullo SENA",
    iconName: "ShieldCheck",
    summary: "Descubre la historia, misión, valores institucionales y símbolos patrios y corporativos que hacen del SENA el lugar más querido por los colombianos.",
    legalBase: "Acuerdo 0009 de 2024 - Capítulo I: Principios y Valores Institucionales",
    keyPoints: [
      {
        heading: "Formación Profesional Integral (FPI)",
        text: "Es un proceso educativo teórico-práctico de carácter integral, orientado al desarrollo de conocimientos técnicos, tecnológicos y de actitudes y valores para el desarrollo humano y la convivencia social."
      },
      {
        heading: "El Aprendiz como Protagonista",
        text: "Toda persona matriculada en programas de formación titulada o complementaria del SENA adquiere el estatus de Aprendiz, asumiendo un compromiso formativo activo con su comunidad."
      },
      {
        heading: "Código de Integridad SENA",
        text: "Directriz ética basada en 7 valores irrenunciables: Honestidad, Respeto, Compromiso, Diligencia, Justicia, Solidaridad y Lealtad."
      },
      {
        heading: "Símbolos Institucionales",
        text: "Escudo con los 3 sectores de la economía nacional (industria, agro y comercio), Bandera blanca de paz y el Logosímbolo del ser humano caminando al porvenir."
      }
    ],
    challengeQuiz: [
      {
        id: "q1_1",
        category: "identidad",
        question: "¿Qué representa el Logosímbolo característico del SENA?",
        options: [
          "Una herramienta mecánica de precisión industrial.",
          "Un camino hacia el futuro con una persona en desarrollo y superación permanente.",
          "Un árbol que simboliza la riqueza natural de Colombia.",
          "Una computadora conectada a la red nacional."
        ],
        correctAnswer: 1,
        explanation: "El logosímbolo del SENA representa a una persona que camina hacia el futuro, en actitud de avance, superación personal y transformación de su entorno productivo.",
        legalArticle: "Identidad Institucional SENA"
      },
      {
        id: "q1_2",
        category: "identidad",
        question: "Bajo el Acuerdo 0009 de 2024, ¿cuál es el eje central de la Formación Profesional Integral (FPI)?",
        options: [
          "Exclusivamente memorizar conceptos teóricos y normas legales.",
          "El desarrollo equilibrado de conocimientos técnicos, habilidades prácticas y valores humanos.",
          "Aprobar exámenes teóricos sin realizar prácticas reales.",
          "Obtener un empleo rápido sin importar la ética profesional."
        ],
        correctAnswer: 1,
        explanation: "La Formación Profesional Integral integra la dimensión técnica (el saber hacer) con la dimensión humana y ética (el ser y convivir) para el desarrollo socioeconómico de Colombia.",
        legalArticle: "Acuerdo 0009 de 2024, Cap. I"
      }
    ]
  },
  {
    id: "station-2",
    number: 2,
    title: "Derechos del Aprendiz",
    badge: "Insignia Defensor de Derechos",
    iconName: "Award",
    summary: "Conoce los derechos fundamentales que te asisten desde el primer día: formación de calidad, debido proceso, bienestar integral y participación democrática.",
    legalBase: "Acuerdo 0009 de 2024 - Capítulo II: Derechos del Aprendiz",
    keyPoints: [
      {
        heading: "Formación de Calidad y Acceso a Recursos",
        text: "Derecho a recibir formación profesional integral actualizada, con instructores calificados, aulas, talleres, laboratorios, bibliotecas y herramientas tecnológicas suficientes."
      },
      {
        heading: "Trato Digno y No Discriminación",
        text: "Ser tratado con respeto, igualdad y dignidad, sin importar su origen étnico, género, orientación sexual, credo religioso o condición socioeconómica."
      },
      {
        heading: "Debido Proceso y Defensa",
        text: "Derecho a ser escuchado, presentar descargos, aportar pruebas y recurrir las decisiones disciplinarias o académicas ante el Comité de Evaluación y Seguimiento."
      },
      {
        heading: "Elementos de Protección Personal (EPP)",
        text: "Recibir oportunamente la dotación y EPP necesarios para el desarrollo seguro de las prácticas en talleres, granjas o laboratorios según los riesgos de la formación."
      },
      {
        heading: "Participación y Democracia",
        text: "Elegir y ser elegido democráticamente como Vocero de Ficha o Representante de Aprendices del Centro de Formación ante los órganos directivos."
      },
      {
        heading: "Beneficios de Bienestar al Aprendiz",
        text: "Acceder a programas deportivos, culturales, monitorías, apoyos de sostenimiento, orientación psicosocial y servicios de salud/primeros auxilios."
      }
    ],
    challengeQuiz: [
      {
        id: "q2_1",
        category: "derechos",
        question: "Si un aprendiz es citado al Comité de Evaluación y Seguimiento por una presunta falta, ¿cuál es su derecho fundamental garantizado por el reglamento?",
        options: [
          "Ser expulsado inmediatamente sin derecho a réplica.",
          "El debido proceso: conocer el informe, ser escuchado, presentar descargos y aportar pruebas.",
          "Pagar una multa económica para archivar el caso.",
          "Delegar a una persona externa sin necesidad de asistir."
        ],
        correctAnswer: 1,
        explanation: "El Acuerdo 0009 de 2024 consagra el principio del Debido Proceso (Art. 29 de la Constitución Política de Colombia), asegurando que el aprendiz conozca las causas, sea escuchado y aporte sus pruebas antes de cualquier recomendación.",
        legalArticle: "Acuerdo 0009 de 2024, Cap. II (Derechos) y Cap. VII (Debido Proceso)"
      },
      {
        id: "q2_2",
        category: "derechos",
        question: "En talleres técnicos de alto riesgo (como soldadura, electricidad o agroindustria), ¿qué derecho asiste al aprendiz respecto a su seguridad?",
        options: [
          "Comprar obligatoriamente los elementos en tiendas externas sugeridas.",
          "Recibir oportunamente los Elementos de Protección Personal (EPP) y la inducción de seguridad y salud en el trabajo (SST).",
          "Ingresar al taller sin protección si el aprendiz asume la responsabilidad escrita.",
          "Trabajar únicamente de manera virtual sin realizar las prácticas."
        ],
        correctAnswer: 1,
        explanation: "Es derecho expreso del aprendiz contar oportunamente con los elementos de protección personal (EPP) y la inducción en seguridad industrial requerida para salvaguardar su integridad.",
        legalArticle: "Acuerdo 0009 de 2024, Derechos del Aprendiz"
      }
    ]
  },
  {
    id: "station-3",
    number: 3,
    title: "Deberes y Responsabilidades",
    badge: "Insignia Guardián de la Ética",
    iconName: "CheckCircle",
    summary: "La formación es un compromiso mutuo. Conoce tus deberes como aprendiz: carné visible, asistencia puntual, uso ético de tecnología y cuidado de bienes públicos.",
    legalBase: "Acuerdo 0009 de 2024 - Capítulo III: Deberes del Aprendiz",
    keyPoints: [
      {
        heading: "Porte Visible del Carné Institucional",
        text: "Portar en lugar visible el carné que te acredita como aprendiz SENA al ingresar y permanecer en las instalaciones o plataformas oficiales."
      },
      {
        heading: "Asistencia y Puntualidad",
        text: "Asistir con puntualidad a todas las sesiones presenciales o virtuales programadas y justificar oportunamente (máximo 3 días hábiles) cualquier inasistencia por fuerza mayor comprobable."
      },
      {
        heading: "Propiedad Intelectual y Honestidad Académica",
        text: "Elaborar con autoría propia las evidencias de aprendizaje, citar adecuadamente las fuentes consultadas y no incurrir jamás en plagio o suplantación."
      },
      {
        heading: "Cuidado de Infraestructura y Herramientas",
        text: "Hacer uso responsable, cuidar y devolver oportunamente los equipos, herramientas, software y materiales puestos a tu disposición por la entidad."
      },
      {
        heading: "Presentación Personal y Convivencia",
        text: "Mantener una presentación personal adecuada según el área técnica (uniforme o indumentaria requerida) y actuar con respeto y cordialidad hacia toda la comunidad SENA."
      },
      {
        heading: "Acta de Compromiso y Novedades",
        text: "Suscribir el Acta de Compromiso al matricularse e informar oportunamente a la coordinación académica novedades como cambios de datos, aplazamientos o consecución de práctica."
      }
    ],
    challengeQuiz: [
      {
        id: "q3_1",
        category: "deberes",
        question: "¿Cuál es el plazo estipulado por el reglamento para justificar una inasistencia a actividades de formación?",
        options: [
          "Hasta 15 días calendario posteriores al hecho.",
          "Dentro de los 3 días hábiles siguientes al hecho fortuito o fuerza mayor.",
          "Al finalizar el trimestre durante el cierre de notas.",
          "No es necesario justificar si el aprendiz avisa por WhatsApp a un compañero."
        ],
        correctAnswer: 1,
        explanation: "El aprendiz debe presentar la justificación médica o de fuerza mayor formalmente a su instructor dentro de los 3 días hábiles siguientes a la inasistencia.",
        legalArticle: "Acuerdo 0009 de 2024, Deberes y Control de Asistencia"
      },
      {
        id: "q3_2",
        category: "deberes",
        question: "¿Qué deber asume el aprendiz respecto al carné institucional durante su permanencia en el Centro de Formación?",
        options: [
          "Guardarlo en la billetera y mostrarlo únicamente si hay una requisa policial.",
          "Portarlo en un lugar visible en todo momento y no prestarlo a terceros bajo ninguna circunstancia.",
          "Prestarlo a compañeros de otras fichas si lo olvidaron.",
          "Es optativo y solo obligatorio durante las ceremonias de grado."
        ],
        correctAnswer: 1,
        explanation: "El carné es personal e intransferible; portarlo visiblemente es un deber fundamental de seguridad y sentido de pertenencia institucional.",
        legalArticle: "Acuerdo 0009 de 2024, Deberes del Aprendiz"
      }
    ]
  },
  {
    id: "station-4",
    number: 4,
    title: "Convivencia, Faltas y Comité",
    badge: "Insignia Juez de Convivencia",
    iconName: "AlertTriangle",
    summary: "Comprende la diferencia entre faltas académicas y disciplinarias, su clasificación (leves, graves, gravísimas), el plan de mejoramiento y el rol pedagógico del Comité.",
    legalBase: "Acuerdo 0009 de 2024 - Capítulos IV, V y VI: Faltas, Medidas Formativas y Sanciones",
    keyPoints: [
      {
        heading: "Tipos de Faltas",
        text: "Académicas (relacionadas con el incumplimiento o fraude en evidencias de aprendizaje) y Disciplinarias (conductas que vulneran la convivencia, seguridad, respeto o bienes institucionales)."
      },
      {
        heading: "Criterios de Calificación",
        text: "Se evalúa la gravedad: Falta Leve, Falta Grave y Falta Gravísima; considerando si hubo dolo, reincidencia, daño material o afectación a la integridad física/emocional."
      },
      {
        heading: "Prohibiciones Expresas",
        text: "Plagiar trabajos, portar armas, comercializar o consumir alcohol o sustancias psicoactivas en el centro, suplantar identidad en plataformas y cometer acoso o agresiones físicas o verbales."
      },
      {
        heading: "Medidas Formativas (Enfoque Pedagógico)",
        text: "El SENA prioriza la formación sobre el castigo: Llamado de atención verbal reflexivo, llamado de atención por escrito y suscripción de Plan de Mejoramiento Formativo con seguimiento."
      },
      {
        heading: "Sanciones Formativas",
        text: "En casos graves tras el debido proceso en Comité: Condicionamiento de matrícula o Cancelación definitiva de matrícula (con sanción de 6 meses a 3 años para volverse a inscribir)."
      },
      {
        heading: "Comité de Evaluación y Seguimiento",
        text: "Órgano consultivo colegiado integrado por Subdirector (o su delegado), Coordinador Académico, Instructores de la ficha, Bienestar, Vocero de Aprendices y el Aprendiz implicado."
      }
    ],
    challengeQuiz: [
      {
        id: "q4_1",
        category: "faltas",
        question: "Un aprendiz copia textualmente un informe técnico de internet y lo presenta como propio sin citar la fuente. ¿Qué tipo de falta constituye según el Acuerdo 0009 de 2024?",
        options: [
          "No constituye falta si el aprendiz agradece en redes sociales.",
          "Constituye una falta académica y disciplinaria grave por plagio y violación a derechos de autor.",
          "Es solo una sugerencia de estilo sin consecuencias reglamentarias.",
          "Es un derecho a la libre consulta de fuentes públicas."
        ],
        correctAnswer: 1,
        explanation: "El plagio atenta contra la honestidad académica, los derechos de autor y está expresamente catalogado como falta que amerita plan de mejoramiento o investigación en Comité de Evaluación.",
        legalArticle: "Acuerdo 0009 de 2024, Prohibiciones y Faltas Académicas"
      },
      {
        id: "q4_2",
        category: "faltas",
        question: "¿Cuál es el propósito primordial del 'Plan de Mejoramiento' en el modelo pedagógico del SENA?",
        options: [
          "Expulsar disimuladamente al aprendiz sin dejar registro.",
          "Ofrecer una medida formativa pedagógica para que el aprendiz subsane debilidades y alcance el resultado de aprendizaje previsto.",
          "Cobrar una compensación económica al centro de formación.",
          "Asignar labores de aseo en los talleres durante los fines de semana."
        ],
        correctAnswer: 1,
        explanation: "El Plan de Mejoramiento es una medida formativa acordada entre instructor y aprendiz con actividades específicas y fecha límite para lograr el resultado pendiente.",
        legalArticle: "Acuerdo 0009 de 2024, Medidas Formativas"
      }
    ]
  },
  {
    id: "station-5",
    number: 5,
    title: "Etapa Productiva & Novedades",
    badge: "Insignia Maestro de la Ruta",
    iconName: "Briefcase",
    summary: "Domina las 6 alternativas oficiales de etapa productiva, cómo se legalizan, qué es el contrato de aprendizaje y cómo gestionar novedades (aplazamiento, traslado, deserción).",
    legalBase: "Acuerdo 0009 de 2024 - Capítulo VIII y IX: Etapa Productiva y Trámites del Aprendiz",
    keyPoints: [
      {
        heading: "Alternativas de Etapa Productiva",
        text: "1) Contrato de Aprendizaje (Ley 789 de 2002); 2) Vínculo Laboral o Contractual; 3) Proyecto Productivo; 4) Pasantía (Pyme, ONG o entidad estatal); 5) Monitoría en el SENA; 6) Apoyo a Unidad Familiar."
      },
      {
        heading: "Bitácoras y Acompañamiento",
        text: "Registro quincenal de bitácoras de actividades en la plataforma institucional y concertación con el instructor de seguimiento asignado por el Centro."
      },
      {
        heading: "Aplazamiento de Matrícula",
        text: "Solicitud motivada para suspender temporalmente la formación hasta por un tiempo máximo determinado reglamentariamente (hasta por 6 meses prorrogables por fuerza mayor comprobada)."
      },
      {
        heading: "Traslado de Centro o Ficha",
        text: "Petición del aprendiz para continuar su programa en otro Centro de Formación o jornada, sujeto a disponibilidad de cupo y justificación válida."
      },
      {
        heading: "Deserción del Aprendiz",
        text: "Se configura si el aprendiz no asiste por 3 días consecutivos sin justificación válida, si no se presenta a etapa productiva en los plazos fijados o si transcurren dos años sin legalizar la etapa práctica."
      }
    ],
    challengeQuiz: [
      {
        id: "q5_1",
        category: "etapas",
        question: "¿Cuál de las siguientes NO es una alternativa válida para realizar la Etapa Productiva en el SENA?",
        options: [
          "Contrato de aprendizaje patrocinado por una empresa.",
          "Proyecto productivo avalado por el Fondo Emprender o el Centro de Formación.",
          "Trabajar de manera informal sin convenio, bitácoras ni aval institucional.",
          "Pasantía en una entidad pública, ONG o pyme con plan de trabajo aprobado."
        ],
        correctAnswer: 2,
        explanation: "Toda etapa productiva debe estar formalmente concertada, avalada por el Centro de Formación y documentada con bitácoras e instructor de seguimiento para ser válida para la certificación.",
        legalArticle: "Acuerdo 0009 de 2024, Alternativas de Etapa Productiva"
      },
      {
        id: "q5_2",
        category: "etapas",
        question: "¿Cuándo se declara formalmente la deserción por inasistencia durante la etapa lectiva presencial?",
        options: [
          "Cuando falta una hora a clase por tráfico.",
          "Cuando acumula 3 días consecutivos de inasistencia no justificada a las actividades de formación.",
          "Únicamente al término de 6 meses de inactividad.",
          "Cuando el aprendiz solicita voluntariamente un certificado de notas."
        ],
        correctAnswer: 1,
        explanation: "Si el aprendiz no asiste durante 3 días consecutivos sin justificación comprobada, el instructor reportará la novedad para iniciar el proceso reglamentario de deserción.",
        legalArticle: "Acuerdo 0009 de 2024, Causales de Deserción"
      }
    ]
  }
];

export const DILEMMA_CASES: DilemmaCase[] = [
  {
    id: "caso-1",
    title: "El Compromiso de la Ficha y la Evidencia Prestada",
    protagonist: "Santiago",
    program: "Técnico en Sistemas",
    situation: "Faltan dos horas para cerrar la plataforma Zajuna/Sofía Plus. Tu amigo y compañero de ficha Mateo te suplica: 'Hermano, no alcancé a hacer el diagrama de base de datos porque estuve trabajando hasta tarde. Pásame tu archivo, solo le cambio los colores y el encabezado para que no me pongan plan de mejoramiento'. Si no entrega, reprobará la competencia. ¿Cómo debes actuar según el Reglamento del Aprendiz (Acuerdo 0009 de 2024)?",
    options: [
      {
        text: "Pasarle el archivo como muestra de solidaridad y compañerismo institucional.",
        isCorrect: false,
        consequence: "¡Incorrecto! La solidaridad institucional no ampara el fraude ni el plagio. Prestar tu evidencia para que otro la presente te convierte en coautor de una falta académica grave sujeta a Comité de Evaluación.",
        articleReference: "Acuerdo 0009 de 2024 - Prohibiciones y Faltas Académicas"
      },
      {
        text: "Explicarle que no puedes compartirle tu archivo porque ambos incurrirían en plagio, pero ofrecerte a guiarlo 30 minutos para que entienda cómo estructurar su propio trabajo y luego aconsejarle hablar honestamente con el instructor.",
        isCorrect: true,
        consequence: "¡Excelente decisión ética! Fomenta la solidaridad genuina sin violar la propiedad intelectual ni incurrir en faltas disciplinarias. Además, dialogar a tiempo con el instructor permite acordar alternativas pedagógicas legítimas.",
        articleReference: "Acuerdo 0009 de 2024 - Principios de Integridad y Honestidad Intelectual"
      },
      {
        text: "Cobrarle una suma de dinero por el archivo para cubrir el tiempo que te tomó realizar la investigación.",
        isCorrect: false,
        consequence: "¡Grave! Lucrarse o comercializar evidencias académicas o bienes formativos del SENA constituye una falta gravísima con posible cancelación de matrícula.",
        articleReference: "Acuerdo 0009 de 2024 - Prohibiciones Expresas de Fines Lucrativos"
      }
    ]
  },
  {
    id: "caso-2",
    title: "Calamidad Médica y el Trámite Correcto de Inasistencia",
    protagonist: "Valentina",
    program: "Tecnólogo en Gestión Empresarial",
    situation: "Valentina sufre un accidente de tránsito el día domingo y le otorgan 5 días de incapacidad médica de la EPS. Sus compañeros le dicen que no se preocupe, que ellos le avisan al instructor por el grupo de WhatsApp de la ficha. Al regresar el lunes siguiente, el instructor le informa que tiene reporte de deserción en curso. ¿Qué debió hacer Valentina oportunamente según el reglamento?",
    options: [
      {
        text: "Confiar plenamente en el mensaje de WhatsApp de sus compañeros, ya que los grupos informales tienen validez legal en el SENA.",
        isCorrect: false,
        consequence: "¡Falso! Las comunicaciones informales en redes sociales no constituyen soporte oficial ni detienen los términos de deserción institucional.",
        articleReference: "Acuerdo 0009 de 2024 - Procedimiento de Novedades y Justificaciones"
      },
      {
        text: "Remitir formalmente el certificado de incapacidad médica emitido por su EPS dentro de los 3 días hábiles siguientes al hecho al correo institucional del instructor o coordinación.",
        isCorrect: true,
        consequence: "¡Correcto! El reglamento exige radicar la justificación formal con soporte de EPS o fuerza mayor comprobable dentro de los 3 días hábiles siguientes, protegiendo su estado de matrícula activa.",
        articleReference: "Acuerdo 0009 de 2024 - Deberes del Aprendiz y Control de Asistencia"
      },
      {
        text: "Esperar a que termine el trimestre académico para mostrar la incapacidad médica durante la sesión de cierre y entrega de notas.",
        isCorrect: false,
        consequence: "¡Peligro! Tras 3 días continuos de inasistencia no justificada se activa automáticamente el proceso de deserción, arriesgando la cancelación de matrícula.",
        articleReference: "Acuerdo 0009 de 2024 - Trámite de Deserción"
      }
    ]
  },
  {
    id: "caso-3",
    title: "Seguridad y EPP en el Taller de Mecatrónica",
    protagonist: "Carlos",
    program: "Mantenimiento Electromecánico Industrial",
    situation: "En el taller de maquinaria pesada, el instructor asigna una práctica con torno eléctrico. Carlos olvidó sus gafas de seguridad y botas con puntera dieléctrica en casa. Un compañero le presta unos lentes de sol normales y le dice: 'Póntelas rápido, que el instructor no mira tanto'. Carlos se siente presionado por no perder la práctica. ¿Cuál es la conducta ajustada a derecho y deberes?",
    options: [
      {
        text: "Usar los lentes de sol oscuros para simular que tiene protección y avanzar en la práctica sin llamar la atención.",
        isCorrect: false,
        consequence: "¡Peligrosísimo! Viola las normas de Seguridad y Salud en el Trabajo (SST), expone su visión a esquirlas incandescentes y constituye una falta grave contra la seguridad.",
        articleReference: "Acuerdo 0009 de 2024 - Normas de Seguridad en Ambientes de Aprendizaje"
      },
      {
        text: "Informar de inmediato y con honestidad al instructor, abstenerse de operar la máquina sin los EPP reglamentarios y solicitar apoyo a almacén o reprogramar la operación bajo un plan seguro.",
        isCorrect: true,
        consequence: "¡Conducta ejemplar! Todo aprendiz tiene el deber de preservar la vida y acatar normas de SST, y el derecho a realizar prácticas con los EPP idóneos y certificados.",
        articleReference: "Acuerdo 0009 de 2024 - Deberes de Auto-cuidado y Derechos de Bioseguridad"
      },
      {
        text: "Abandonar el centro de formación saltando la reja para no ser sancionado por el instructor.",
        isCorrect: false,
        consequence: "¡Absurdo y sancionable! Evadir el centro de formación por accesos no autorizados agrava la falta disciplinaria.",
        articleReference: "Acuerdo 0009 de 2024 - Convivencia y Respeto a las Instalaciones"
      }
    ]
  }
];

export const FAST_SORTING_CARDS: FastSortingCard[] = [
  {
    id: "sc-1",
    text: "Recibir formación profesional integral de calidad y con instructores idóneos.",
    category: "derecho",
    explanation: "Es el derecho fundamental prioritario de todo aprendiz en el SENA."
  },
  {
    id: "sc-2",
    text: "Portar en todo momento y en lugar visible el carné institucional dentro del Centro.",
    category: "deber",
    explanation: "Es un deber expreso para salvaguardar la seguridad y verificar la identidad comunitaria."
  },
  {
    id: "sc-3",
    text: "Comercializar o consumir bebidas alcohólicas o estupefacientes en ambientes SENA.",
    category: "prohibicion",
    explanation: "Prohibición categórica catalogada como falta gravísima disciplinaria."
  },
  {
    id: "sc-4",
    text: "Acceder oportunamente a los Elementos de Protección Personal (EPP) en talleres técnicos.",
    category: "derecho",
    explanation: "Derecho a la seguridad, salud en el trabajo y dotación adecuada para talleres de riesgo."
  },
  {
    id: "sc-5",
    text: "Justificar formalmente las inasistencias dentro de los 3 días hábiles siguientes.",
    category: "deber",
    explanation: "Deber procesal obligatorio para evitar incurrir en novedades de deserción."
  },
  {
    id: "sc-6",
    text: "Suplantar a un compañero en evaluaciones virtuales o firmas de asistencia.",
    category: "prohibicion",
    explanation: "Prohibición legal que vulnera la fe pública y amerita Comité de Evaluación y Seguimiento."
  },
  {
    id: "sc-7",
    text: "Ser escuchado y presentar pruebas en descargos ante el Comité de Seguimiento.",
    category: "derecho",
    explanation: "Derecho fundamental al debido proceso consagrado en el reglamento y la Constitución."
  },
  {
    id: "sc-8",
    text: "Cuidar los bienes, mobiliario, software, herramientas y materiales asignados en el Centro.",
    category: "deber",
    explanation: "Deber de custodia y responsabilidad sobre los recursos públicos del Estado."
  },
  {
    id: "sc-9",
    text: "Utilizar el nombre o logosímbolo del SENA para realizar actividades lucrativas privadas no autorizadas.",
    category: "prohibicion",
    explanation: "Prohibición expresa; la marca y símbolos del SENA son patrimonio estatal inalienable."
  }
];

export const FAULT_SEVERITY_CARDS: FaultSortingCard[] = [
  {
    id: "fc-1",
    text: "Llegar tarde ocasionalmente a una sesión de formación sin recurrencia.",
    severity: "leve",
    explanation: "Falta leve que se atiende mediante llamado de atención verbal reflexivo o concertación con el instructor."
  },
  {
    id: "fc-2",
    text: "Presentar evidencias de aprendizaje ajenas como propias (plagio intencional).",
    severity: "grave",
    explanation: "Falta grave académica que lesiona la integridad formativa y amerita plan de mejoramiento o comité."
  },
  {
    id: "fc-3",
    text: "Portar armas de fuego, armas blancas u objetos explosivos en cualquier instalación del SENA.",
    severity: "gravisima",
    explanation: "Falta gravísima de connotación disciplinaria y penal que conlleva cancelación inmediata de matrícula y reporte a autoridades."
  },
  {
    id: "fc-4",
    text: "Olvidar el carné institucional una vez en casa sin conducta desafiante.",
    severity: "leve",
    explanation: "Falta leve; se verifica en sistema y se hace recomendación de portarlo visiblemente."
  },
  {
    id: "fc-5",
    text: "Agredir física o verbalmente a un compañero, instructor o directivo del SENA, o cometer acoso.",
    severity: "gravisima",
    explanation: "Falta gravísima disciplinaria que atenta contra los derechos humanos y la integridad personal."
  },
  {
    id: "fc-6",
    text: "Dañar intencionalmente equipos especializados de cómputo o maquinaria de un laboratorio.",
    severity: "grave",
    explanation: "Falta grave que atenta contra el patrimonio público del SENA, requiriendo reposición y proceso disciplinario."
  }
];

export const FINAL_EVALUATION_QUESTIONS: Question[] = [
  {
    id: "eval-1",
    category: "identidad",
    question: "¿Cuál es el marco normativo vigente adoptado recientemente por el SENA para regular los derechos, deberes y la convivencia de los aprendices?",
    options: [
      "Acuerdo 007 de 2012 (versión inicial sin cambios).",
      "Acuerdo 0009 de 2024, que actualiza integralmente el Reglamento del Aprendiz y deroga disposiciones anteriores.",
      "Resolución 1010 de 1998 para colegios de bachillerato.",
      "Código de Comercio Nacional de 1971."
    ],
    correctAnswer: 1,
    explanation: "El Acuerdo 0009 de 2024 es el reglamento vigente oficial que unifica y actualiza los principios, derechos, deberes y procedimientos del aprendiz SENA.",
    legalArticle: "Acuerdo 0009 de 2024"
  },
  {
    id: "eval-2",
    category: "derechos",
    question: "Si un aprendiz considera que su calificación no corresponde a los criterios concertados, ¿cuál es su derecho reglamentario?",
    options: [
      "No puede reclamar porque el instructor tiene la última palabra sin revisión.",
      "Solicitar oportunamente la revisión de sus evaluaciones al instructor y, si persiste el desacuerdo, acudir con soporte al Coordinador Académico.",
      "Publicar ofensas en redes sociales para forzar el cambio de nota.",
      "Exigir la repetición inmediata del examen con un docente de otra ciudad."
    ],
    correctAnswer: 1,
    explanation: "El aprendiz tiene derecho a conocer oportunamente sus evaluaciones, solicitar retroalimentación y pedir segundo calificador o revisión motivada ante la coordinación académica.",
    legalArticle: "Acuerdo 0009 de 2024 - Derechos del Aprendiz"
  },
  {
    id: "eval-3",
    category: "deberes",
    question: "¿Qué compromiso asume formalmente el aprendiz al momento de legalizar su matrícula en el SENA?",
    options: [
      "Pagar una cuota de mantenimiento mensual obligatoria.",
      "Firmar el Acta de Compromiso del Aprendiz SENA, comprometiéndose a cumplir el reglamento, el código de integridad y las normas de convivencia.",
      "Ceder los derechos patrimoniales de todo invento futuro al Estado.",
      "Trabajar gratis los domingos para el centro de formación."
    ],
    correctAnswer: 1,
    explanation: "Al matricularse, el aprendiz suscribe el Acta de Compromiso, adquiriendo los derechos y comprometiéndose con los deberes y principios del SENA.",
    legalArticle: "Acuerdo 0009 de 2024 - Deberes Generales"
  },
  {
    id: "eval-4",
    category: "faltas",
    question: "Frente a un bajo rendimiento académico o deficiencia en evidencias, ¿cuál es la primera medida formativa pedagógica que aplica el SENA?",
    options: [
      "Expulsión inmediata del programa sin oportunidad de recuperación.",
      "Elaboración y concertación de un Plan de Mejoramiento Académico con metas y fechas claras.",
      "Imposición de una sanción económica en pesos colombianos.",
      "Retención de los documentos de identidad del aprendiz."
    ],
    correctAnswer: 1,
    explanation: "El modelo del SENA es formativo y pedagógico: el Plan de Mejoramiento busca acompañar al aprendiz para que logre la competencia antes de acudir a instancias sancionatorias.",
    legalArticle: "Acuerdo 0009 de 2024 - Medidas Formativas"
  },
  {
    id: "eval-5",
    category: "faltas",
    question: "¿Quiénes conforman el Comité de Evaluación y Seguimiento de un Centro de Formación?",
    options: [
      "Únicamente el Director General del SENA desde Bogotá.",
      "Un equipo colegiado que incluye al Subdirector (o delegado), Coordinador Académico, Instructores de la ficha, Bienestar al Aprendiz y el Vocero de los Aprendices.",
      "Exclusivamente la Policía Nacional y guardas de seguridad.",
      "Solo los compañeros de clase del aprendiz implicado."
    ],
    correctAnswer: 1,
    explanation: "El Comité es una instancia colegiada y consultiva que analiza integralmente los casos disciplinarios y académicos garantizando pluralidad y debido proceso.",
    legalArticle: "Acuerdo 0009 de 2024 - Comité de Evaluación y Seguimiento"
  },
  {
    id: "eval-6",
    category: "etapas",
    question: "¿Cuál de las siguientes es la modalidad de práctica más conocida amparada por la Ley 789 de 2002 con patrocinio empresarial?",
    options: [
      "Voluntariado no remunerado en el extranjero.",
      "Contrato de Aprendizaje, donde la empresa patrocina al aprendiz con apoyo de sostenimiento y cobertura en EPS y ARL.",
      "Trabajo por horas sin afiliación a seguridad social.",
      "Emprender un negocio sin autorización del SENA."
    ],
    correctAnswer: 1,
    explanation: "El Contrato de Aprendizaje es la figura legal emblemática que vincula formativamente a los aprendices con empresas del sector productivo.",
    legalArticle: "Ley 789 de 2002 y Acuerdo 0009 de 2024"
  },
  {
    id: "eval-7",
    category: "etapas",
    question: "Si un aprendiz necesita suspender temporalmente su formación por una razón grave debidamente documentada (como servicio militar, enfermedad grave o calamidad), ¿qué trámite debe solicitar?",
    options: [
      "Simplemente dejar de asistir sin avisar a nadie.",
      "Solicitud formal de Aplazamiento radicada a la Coordinación Académica.",
      "Solicitar el reembolso de su dinero en la tesorería del SENA.",
      "Pedir que un amigo asista a clases en su nombre."
    ],
    correctAnswer: 1,
    explanation: "El aplazamiento es la solicitud formal motivada que permite al aprendiz pausar su proceso sin perder el cupo ni caer en deserción.",
    legalArticle: "Acuerdo 0009 de 2024 - Novedades del Aprendiz"
  },
  {
    id: "eval-8",
    category: "deberes",
    question: "¿Cómo debe comportarse un aprendiz en plataformas virtuales oficiales del SENA (como Zajuna, Sofía Plus, foros y Teams)?",
    options: [
      "Puede utilizar lenguaje ofensivo y memes burlones porque es internet.",
      "Mantener las normas de etiqueta digital (netiqueta), respeto, confidencialidad y usar el correo institucional exclusivamente para fines formativos.",
      "Compartir libremente contraseñas y credenciales con cualquier usuario.",
      "Ingresar solo una vez al mes para ver si hay tareas pendientes."
    ],
    correctAnswer: 1,
    explanation: "Los ambientes virtuales de aprendizaje están regidos por el mismo reglamento ético y disciplinario que los ambientes presenciales.",
    legalArticle: "Acuerdo 0009 de 2024 - Ambientes Virtuales y TIC"
  },
  {
    id: "eval-9",
    category: "faltas",
    question: "Si el Subdirector de Centro emite una resolución sancionatoria en contra de un aprendiz, ¿qué recurso legal tiene derecho a interponer el aprendiz para que se revise la decisión?",
    options: [
      "Recurso de Reposición dentro del término legal fijado en el acto administrativo.",
      "No existe recurso alguno y debe acatar sin objetar.",
      "Una denuncia en redes sociales.",
      "Una apelación ante la Corte Suprema de Justicia inmediatamente."
    ],
    correctAnswer: 0,
    explanation: "El aprendiz tiene derecho al Recurso de Reposición en los términos señalados en la resolución de notificación, garantizando la segunda revisión en el debido proceso.",
    legalArticle: "Acuerdo 0009 de 2024 - Recursos contra Actos Administrativos"
  },
  {
    id: "eval-10",
    category: "identidad",
    question: "¿Qué valor institucional del SENA define el 'reconocimiento y valoración de las diferencias, dignidad humana y los derechos de los demás'?",
    options: [
      "Apatía.",
      "Respeto.",
      "Orgullo vano.",
      "Competitividad desleal."
    ],
    correctAnswer: 1,
    explanation: "El Respeto es un valor pilar del Código de Integridad SENA, promoviendo el reconocimiento de la diversidad y el trato cordial a cada miembro de la entidad.",
    legalArticle: "Código de Integridad SENA - Acuerdo 0009 de 2024"
  }
];

export const INDUCTION_PLAN: InductionPhase[] = [
  {
    id: 1,
    title: "Fase 1: Diagnóstico y Bienvenida Digital (Pre-Inducción)",
    tagline: "Sensibilización temprana y apropiación del entorno institucional",
    duration: "Días 1 a 3 (Inicio de trimestre)",
    objective: "Generar sentido de pertenencia desde el primer contacto, verificar condiciones socioeconómicas e introducir las herramientas institucionales (Zajuna, Sofía Plus, carnetización).",
    actions: [
      "Bienvenida por parte de la Dirección de Centro, Coordinación Académica y equipo de Bienestar.",
      "Entrega del Carné Digital provisional y activación de credenciales del correo institucional (@sena.edu.co).",
      "Caracterización socioeconómica y caracterización del perfil del aprendiz para identificar necesidades de apoyo.",
      "Presentación de la Misión, Visión, Símbolos del SENA y Valores del Código de Integridad."
    ],
    tools: ["Portal Zajuna", "App Inducción Interactiva", "Sofía Plus", "Encuesta de Caracterización"],
    kpi: "100% de aprendices con credenciales activas y caracterización completada."
  },
  {
    id: 2,
    title: "Fase 2: Gamificación & Inmersión en el Reglamento (Acuerdo 0009 de 2024)",
    tagline: "Apropiación experiencial de Derechos, Deberes y Prohibiciones",
    duration: "Días 4 a 8",
    objective: "Transformar la lectura densa del reglamento en una experiencia activa mediante retos interactivos, simulación de dilemas reales de aula y debates guiados.",
    actions: [
      "Recorrido por las 5 Estaciones de Aprendizaje Gamificadas (ADN Sena, Derechos, Deberes, Faltas y Etapas).",
      "Resolución colaborativa de los 'Dilemas del Aprendiz' en equipos de ficha con retroalimentación del instructor.",
      "Dinámica de 'Clasificador Veloz' para diferenciar Derechos, Deberes y Prohibiciones de manera lúdica.",
      "Elección democrática y posesión de los Voceros de Ficha con acompañamiento de Bienestar."
    ],
    tools: ["Módulo de Estaciones Interactivas", "Simulador de Casos", "Trivia Relámpago", "Sesiones de Círculos de Confianza"],
    kpi: "Promedio superior a 85% de avance en las 5 estaciones del prototipo."
  },
  {
    id: 3,
    title: "Fase 3: Evaluación Formativa y Resolución de Dilemas Éticos",
    tagline: "Validación de competencias de convivencia ciudadana y académica",
    duration: "Días 9 a 12",
    objective: "Evaluar de manera continua y pedagógica la comprensión de las normas, el funcionamiento del Comité de Evaluación y el debido proceso sin un enfoque punitivo.",
    actions: [
      "Presentación de la Evaluación Gamificada de Inducción con banco dinámico de preguntas explicadas.",
      "Simulación de un caso ante el Comité de Evaluación y Seguimiento (juego de roles: instructor, aprendiz, vocero, bienestar).",
      "Talleres prácticos de Prevención del Plagio, Citación en Normas APA y Uso Ético de Inteligencia Artificial.",
      "Espacio de preguntas abiertas con los Coordinadores de Formación."
    ],
    tools: ["Evaluación Interactiva con Feedback", "Guía de Casos de Comité", "Rúbrica de Convivencia"],
    kpi: "Tasa de aprobación mínima del 80% en la evaluación final antes de certificar."
  },
  {
    id: 4,
    title: "Fase 4: Certificación, Compromiso y Transición a Etapa Lectiva",
    tagline: "Formalización del pacto formativo y entrega de credencial digital",
    duration: "Días 13 a 15",
    objective: "Sellar formalmente el compromiso del aprendiz con su programa, generar el Certificado Oficial de Inducción con código único y dar paso al plan de estudios técnico.",
    actions: [
      "Firma digital o física del Acta de Compromiso del Aprendiz SENA.",
      "Generación e impresión/descarga del Certificado de Inducción SENA con código de verificación QR.",
      "Presentación del Equipo de Instructores técnicos y transversales del programa.",
      "Concertación de la ruta de aprendizaje inicial y entrega del cronograma del trimestre."
    ],
    tools: ["Generador de Certificados Verificables", "Acta de Compromiso Digital", "Sofía Plus"],
    kpi: "100% de aprendices con Certificado de Inducción y Acta de Compromiso radicada."
  }
];

export const REGULATION_ARTICLES_EXPLORER = [
  {
    code: "Art. 1-4",
    category: "Generalidades",
    title: "Objeto, Ámbito de Aplicación y Principios",
    content: "Aplica a todos los aprendices matriculados en programas de formación titulada y complementaria en cualquier modalidad (presencial, virtual o a distancia). Establece la Formación Profesional Integral como derecho y compromiso social."
  },
  {
    code: "Art. 5-7",
    category: "Derechos",
    title: "Derechos Fundamentales del Aprendiz",
    content: "Formación de calidad, libre expresión respetuosa, debido proceso, trato digno sin discriminación, dotación de EPP, acceso a bibliotecas, bienestar integral y participación democrática en vocerías y representación."
  },
  {
    code: "Art. 8-10",
    category: "Deberes",
    title: "Deberes del Aprendiz y Convivencia",
    content: "Porte visible del carné, asistencia y puntualidad, cuidado de equipos públicos, justificación en 3 días hábiles de inasistencias, ética en evidencias y suscripción del acta de compromiso institucional."
  },
  {
    code: "Art. 11-13",
    category: "Prohibiciones",
    title: "Prohibiciones Expresas",
    content: "Plagio de trabajos, suplantación de identidad, porte de armas u objetos peligrosos, consumo o distribución de sustancias psicoactivas o alcohol en el SENA, uso no autorizado de marcas y fines de lucro privados."
  },
  {
    code: "Art. 14-18",
    category: "Faltas",
    title: "Clasificación de Faltas (Leves, Graves y Gravísimas)",
    content: "Diferenciación entre faltas de índole académica y disciplinaria. Criterios para calificar gravedad: reiteración, premeditación, afectación colectiva y daño al patrimonio o seguridad."
  },
  {
    code: "Art. 19-23",
    category: "Medidas",
    title: "Medidas Formativas y Sanciones",
    content: "Enfoque pedagógico: Llamado de atención verbal y escrito, Plan de Mejoramiento Formativo. Sanciones tras debido proceso: Condicionamiento de matrícula y Cancelación definitiva de matrícula."
  },
  {
    code: "Art. 24-30",
    category: "Comité",
    title: "Comité de Evaluación y Debido Proceso",
    content: "Instancia colegiada para investigar novedades. Fases: queja o informe, citación oportuna, audiencia de descargos, valoración probatoria, recomendación al Subdirector y recurso de reposición."
  },
  {
    code: "Art. 31-38",
    category: "Etapas",
    title: "Etapa Productiva y Novedades del Aprendiz",
    content: "Modalidades de práctica: Contrato de aprendizaje, proyecto productivo, pasantía, monitoría, vínculo laboral. Trámites de aplazamiento (hasta por 6 meses), traslados y configuración de la deserción por 3 días de inasistencia injustificada."
  }
];
