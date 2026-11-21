import { getDevotionalDateStr } from './storage';

export const HOME_MEDIA = {
  dailyVerseClouds:
    'https://res.cloudinary.com/xdjdubsz/image/upload/v1795225321/hero_versiculo_nubes_1795224776464.jpg',
  prayerCard:
    'https://res.cloudinary.com/xdjdubsz/image/upload/v1795225324/card_oracion_1x1_1795224770952.jpg',
  contextCard:
    'https://res.cloudinary.com/xdjdubsz/image/upload/v1795225291/card_contexto_1x1_1795224809275.jpg',
  translationCard:
    'https://res.cloudinary.com/xdjdubsz/image/upload/v1795225422/0d620a1c-3a14-4422-a042-000283e1efc9.webp',
} as const;

export interface PrayerVerseRef {
  book: string;
  chapter: number;
  verse: number;
}

export interface PrayerGuideStep {
  label: string;
  guidance: string;
}

export interface PrayerTheme {
  id: string;
  title: string;
  shortTitle: string;
  shortIntro: string;
  closingCall: string;
  durationMinutes: number;
  guideSteps: PrayerGuideStep[];
  prompts: string[];
  verses: PrayerVerseRef[];
}

const CLOSING_CALLS = [
  'Busca un lugar tranquilo, respira hondo y aquieta tu corazón delante de Dios.',
  'Toma una pausa del ruido, acomódate en silencio y abre tu corazón ante el Padre.',
  'Encuentra un espacio sereno; Dios te espera con atención y cercanía.',
  'Detén por unos minutos tus afanes y dispón tu corazón para conversar con Dios.',
  'Siéntate en calma, suelta tus cargas y dedica estos minutos a estar a solas con Él.',
];

export const PRAYER_THEMES: PrayerTheme[] = [
  {
    id: 'gratitud',
    title: 'Oración, seamos agradecidos',
    shortTitle: 'Seamos agradecidos',
    shortIntro:
      'Antes de pedir, detente a reconocer la fidelidad de Dios en lo cotidiano: su provisión, su paciencia y las pequeñas bendiciones que hoy sostienen tu vida.',
    closingCall: CLOSING_CALLS[0],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Silencio y presencia',
        guidance:
          'Respira profundo un par de veces y reconoce que Dios está contigo aquí y ahora, escuchándote con agrado.',
      },
      {
        label: '2. Lee despacio la Palabra',
        guidance:
          'Recorre los 5 versículos de abajo sin prisa; subraya mentalmente una frase que despierte gratitud en ti hoy.',
      },
      {
        label: '3. Conversa con tus propias palabras',
        guidance:
          'Nombra delante de Dios hechos concretos de esta semana por los que estás agradecido, incluso en medio de retos.',
      },
      {
        label: '4. Descansa en su bondad',
        guidance:
          'Permanece los últimos instantes en calma, entregándole el resto de tu día con un corazón agradecido.',
      },
    ],
    prompts: [
      '¿Qué tres regalos concretos de hoy —grandes o pequeños— quieres agradecerle ahora mismo?',
      '¿En qué momento reciente viste el cuidado silencioso de Dios sosteniéndote?',
      '¿Cómo puedes responder hoy con gratitud incluso frente a algo que aún no entiendes?',
    ],
    verses: [
      { book: '1TH', chapter: 5, verse: 18 },
      { book: 'PHP', chapter: 4, verse: 6 },
      { book: 'COL', chapter: 3, verse: 15 },
      { book: 'COL', chapter: 4, verse: 2 },
      { book: 'EPH', chapter: 5, verse: 20 },
    ],
  },
  {
    id: 'amigo',
    title: 'Oración, oremos por un amigo',
    shortTitle: 'Oremos por un amigo',
    shortIntro:
      'Interceder por alguien cercano es una de las expresiones más sinceras del amor. Hoy trae delante de Dios el nombre, las luchas y el futuro de un amigo.',
    closingCall: CLOSING_CALLS[1],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Trae un rostro a tu mente',
        guidance:
          'Piensa en un amigo específico que necesite ánimo, claridad, consuelo o un encuentro más profundo con Jesús.',
      },
      {
        label: '2. Medita en los versículos',
        guidance:
          'Deja que estas cinco promesas del Nuevo Testamento moldeen lo que vas a pedir por su vida.',
      },
      {
        label: '3. Intercede por su necesidad',
        guidance:
          'Habla con Dios con libertad por el corazón, la familia, la salud y las decisiones de esa persona.',
      },
      {
        label: '4. Pide sensibilidad para acompañar',
        guidance:
          'Pregúntale al Señor si hoy puedes enviarle un mensaje de aliento o estar presente de forma práctica.',
      },
    ],
    prompts: [
      '¿Por qué amigo en particular sientes hoy carga o gratitud en tu corazón?',
      '¿Qué carga está llevando esa persona que puedes presentar ahora ante el Señor?',
      '¿De qué manera sencilla podrías reflejar el amor de Cristo hacia él o ella esta semana?',
    ],
    verses: [
      { book: 'JHN', chapter: 15, verse: 13 },
      { book: 'JAS', chapter: 5, verse: 16 },
      { book: 'GAL', chapter: 6, verse: 2 },
      { book: 'PHP', chapter: 1, verse: 3 },
      { book: '1TH', chapter: 5, verse: 11 },
    ],
  },
  {
    id: 'sanidad',
    title: 'Oración, sanidad del corazón',
    shortTitle: 'Sanidad del corazón',
    shortIntro:
      'Dios no espera que llegues fuerte ni sin heridas. Hoy acércate con honestidad para entregar tristezas, cansancio profundo y memorias que necesitan restauración.',
    closingCall: CLOSING_CALLS[2],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Sinceridad sin máscaras',
        guidance:
          'No ocultes cómo te sientes de verdad. Nombra delante de Dios aquello que hoy te duele o te agota.',
      },
      {
        label: '2. Recibe consuelo en la Palabra',
        guidance:
          'Lee despacio los 5 pasajes; imagina a Jesús dirigiéndote personalmente estas palabras de descanso.',
      },
      {
        label: '3. Entrega cada herida',
        guidance:
          'Conversa con el Padre sobre lo que pesa en tu alma y pídele que sane tu mente y tus afectos.',
      },
      {
        label: '4. Reposa en su paz',
        guidance:
          'Cierra estos minutos respirando con calma, confiando en que el Dios de toda consolación trabaja en ti.',
      },
    ],
    prompts: [
      '¿Qué dolor, desgaste o decepción has estado cargando en silencio últimamente?',
      '¿En qué área de tu corazón necesitas recibir hoy la paz y el abrazo de Jesús?',
      '¿Qué mentira o temor quieres soltar delante de la promesa de Dios?',
    ],
    verses: [
      { book: 'MAT', chapter: 11, verse: 28 },
      { book: '1PE', chapter: 5, verse: 7 },
      { book: 'JHN', chapter: 14, verse: 27 },
      { book: '2CO', chapter: 1, verse: 3 },
      { book: 'REV', chapter: 21, verse: 4 },
    ],
  },
  {
    id: 'martires',
    title: 'Oración, por los mártires y quienes sufren por el evangelio',
    shortTitle: 'Por los mártires y perseguidos',
    shortIntro:
      'A menudo olvidamos que hoy miles de hermanos son perseguidos, encarcelados o desplazados por seguir a Jesús. Unámonos a ellos como un solo cuerpo en Cristo.',
    closingCall: CLOSING_CALLS[3],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Recuerda a la iglesia perseguida',
        guidance:
          'Haz memoria de quienes en distintos países sufren rechazo, cárcel o violencia por confesar el nombre de Cristo.',
      },
      {
        label: '2. Medita en su fidelidad a la luz de la Escritura',
        guidance:
          'Lee estos 5 versículos pensando en los hermanos que hoy viven estas palabras de manera literal.',
      },
      {
        label: '3. Intercede por firmeza, protección y consuelo',
        guidance:
          'Pide a Dios valor para los creyentes, consuelo para las familias de los mártires y compasión para quienes los persiguen.',
      },
      {
        label: '4. Renueva tu propia fidelidad',
        guidance:
          'Agradece por la libertad que hoy tienes y pídele al Señor un corazón valiente y agradecido.',
      },
    ],
    prompts: [
      'Ora por fortaleza sobrenatural y paz para quienes hoy están presos o amenazados por su fe.',
      'Pide consuelo y provisión para las esposas, hijos y comunidades de quienes dieron su vida por el evangelio.',
      'Intercede para que el testimonio de su fidelidad toque el corazón de quienes hoy los oprimen.',
    ],
    verses: [
      { book: 'HEB', chapter: 13, verse: 3 },
      { book: 'MAT', chapter: 5, verse: 10 },
      { book: '2CO', chapter: 4, verse: 8 },
      { book: 'REV', chapter: 6, verse: 9 },
      { book: 'ACT', chapter: 5, verse: 41 },
    ],
  },
  {
    id: 'sabiduria',
    title: 'Oración, pidamos sabiduría y dirección',
    shortTitle: 'Sabiduría y dirección',
    shortIntro:
      'Cuando el camino tiene encrucijadas o decisiones importantes, Dios promete dar sabiduría generosamente y sin reproche a quien la pide con humildad.',
    closingCall: CLOSING_CALLS[4],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Reconoce tu necesidad de guía',
        guidance:
          'Pon sobre la mesa las decisiones pendientes y reconoce que la sabiduría de Dios supera cualquier cálculo humano.',
      },
      {
        label: '2. Escucha la orientación bíblica',
        guidance:
          'Lee los 5 versículos pidiéndole al Espíritu Santo luz sobre tu situación actual.',
      },
      {
        label: '3. Presenta tus decisiones concretas',
        guidance:
          'Háblale a Dios sobre tus opciones, dudas y motivaciones, pidiendo discernimiento limpio.',
      },
      {
        label: '4. Confía en el siguiente paso',
        guidance:
          'Descansa sabiendo que Dios guía con fidelidad a quienes desean hacer su voluntad.',
      },
    ],
    prompts: [
      '¿Qué decisión importante o conversación difícil necesitas entregar hoy a la dirección de Dios?',
      '¿Qué prisa o temor podría estar nublando tu discernimiento en este momento?',
      'Pide claridad para dar hoy el paso correcto con integridad y paz.',
    ],
    verses: [
      { book: 'JAS', chapter: 1, verse: 5 },
      { book: 'COL', chapter: 1, verse: 9 },
      { book: 'ROM', chapter: 12, verse: 2 },
      { book: 'EPH', chapter: 1, verse: 17 },
      { book: 'JHN', chapter: 16, verse: 13 },
    ],
  },
  {
    id: 'perdon',
    title: 'Oración, perdón y reconciliación',
    shortTitle: 'Perdón y reconciliación',
    shortIntro:
      'El rencor encierra el corazón, pero la gracia de Cristo libera. Hoy acércate para recibir perdón por tus faltas y pedir fuerzas para perdonar a otros.',
    closingCall: CLOSING_CALLS[0],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Examina tu corazón en la luz de su amor',
        guidance:
          'Permite que Dios te muestre sin condenación aquello que necesitas confesar o soltar.',
      },
      {
        label: '2. Contempla la misericordia en la Palabra',
        guidance:
          'Lee los 5 versículos recordando cuánto hemos sido perdonados en Cristo.',
      },
      {
        label: '3. Recibe y extiende perdón',
        guidance:
          'Confiesa con sencillez tus propias fallas y nombra ante Dios a quien te cuesta perdonar.',
      },
      {
        label: '4. Camina en libertad',
        guidance:
          'Agradece la limpieza que Dios regala y pídele sabiduría si conviene buscar reconciliación.',
      },
    ],
    prompts: [
      '¿Hay alguna falta o actitud reciente que necesitas confesar hoy con humildad delante de Dios?',
      '¿Qué ofensa o resentimiento necesitas entregarle al Señor para no seguir cargándolo?',
      'Pide un corazón compasivo, capaz de bendecir incluso a quien te ha herido.',
    ],
    verses: [
      { book: 'EPH', chapter: 4, verse: 32 },
      { book: 'COL', chapter: 3, verse: 13 },
      { book: 'MAT', chapter: 6, verse: 14 },
      { book: '1JN', chapter: 1, verse: 9 },
      { book: 'LUK', chapter: 6, verse: 37 },
    ],
  },
  {
    id: 'fortaleza',
    title: 'Oración, fortaleza en medio de la prueba',
    shortTitle: 'Fortaleza en la prueba',
    shortIntro:
      'La debilidad no es el final de la fe, sino el lugar donde el poder de Dios se perfecciona. Hoy renueva tus fuerzas delante del Señor.',
    closingCall: CLOSING_CALLS[1],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Admite tu fragilidad',
        guidance:
          'Suelta la presión de poder con todo solo y preséntate tal como estás delante de Dios.',
      },
      {
        label: '2. Afírmate en las promesas',
        guidance:
          'Lee los 5 versículos con calma, permitiendo que fortalezcan tu ánimo interior.',
      },
      {
        label: '3. Pide resistencia y firmeza',
        guidance:
          'Háblale a Dios sobre la prueba específica que atraviesas y pídele su gracia suficiente para hoy.',
      },
      {
        label: '4. Levanta la mirada',
        guidance:
          'Cierra agradeciendo porque Dios no te abandona en medio del proceso.',
      },
    ],
    prompts: [
      '¿Cuál es el desafío que hoy exige más de lo que sientes que tienes?',
      '¿Qué promesa de estos versículos necesitas recordar cuando vuelvas a tu rutina?',
      'Pídele al Señor perseverancia serena para un día a la vez.',
    ],
    verses: [
      { book: '2CO', chapter: 12, verse: 9 },
      { book: 'PHP', chapter: 4, verse: 13 },
      { book: 'ROM', chapter: 8, verse: 28 },
      { book: '1CO', chapter: 10, verse: 13 },
      { book: 'EPH', chapter: 6, verse: 10 },
    ],
  },
  {
    id: 'paz',
    title: 'Oración, paz frente a la ansiedad',
    shortTitle: 'Paz frente a la ansiedad',
    shortIntro:
      'Cuando la mente se acelera con escenarios futuros y preocupaciones, Jesús ofrece una paz distinta a la del mundo: una guardia firme sobre tu corazón.',
    closingCall: CLOSING_CALLS[2],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Baja el ritmo',
        guidance:
          'Deja el teléfono en silencio salvo esta guía, respira lento y entrega tu prisa al Señor.',
      },
      {
        label: '2. Lee las promesas de paz',
        guidance:
          'Permite que cada versículo acalle el ruido interno de tus pensamientos.',
      },
      {
        label: '3. Cambia preocupación por petición',
        guidance:
          'Convierte cada pensamiento ansioso en una conversación concreta con tu Padre celestial.',
      },
      {
        label: '4. Quédate en quietud',
        guidance:
          'Descansa los últimos minutos sabiendo que el mañana está en manos seguras.',
      },
    ],
    prompts: [
      '¿Qué pensamiento repetitivo ha estado robándote la calma en estos días?',
      'Nombra tus preocupaciones una por una y entrégalas conscientemente a Dios.',
      'Agradece por el cuidado que Dios ya ha mostrado en el pasado.',
    ],
    verses: [
      { book: 'PHP', chapter: 4, verse: 7 },
      { book: 'MAT', chapter: 6, verse: 34 },
      { book: 'JHN', chapter: 16, verse: 33 },
      { book: '2TH', chapter: 3, verse: 16 },
      { book: 'ROM', chapter: 15, verse: 13 },
    ],
  },
  {
    id: 'familia',
    title: 'Oración, por nuestra familia y hogar',
    shortTitle: 'Por nuestra familia y hogar',
    shortIntro:
      'El hogar es el primer lugar donde el amor de Cristo se vuelve tangible. Dedica estos minutos a bendecir a los tuyos y pedir unidad, paciencia y ternura.',
    closingCall: CLOSING_CALLS[3],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Agradece por tu hogar',
        guidance:
          'Piensa en cada integrante de tu familia —cercana o extendida— y preséntalos delante de Dios.',
      },
      {
        label: '2. Inspírate en el amor bíblico',
        guidance:
          'Lee los 5 pasajes reflexionando sobre cómo luce el amor paciente y humilde en casa.',
      },
      {
        label: '3. Ora por cada persona por nombre',
        guidance:
          'Pide protección, sabiduría, unidad y fe viva para cada miembro de tu familia.',
      },
      {
        label: '4. Pide gracia para amar mejor',
        guidance:
          'Pídele al Señor que haga de tus palabras y gestos un puente de paz en tu casa hoy.',
      },
    ],
    prompts: [
      '¿Qué miembro de tu familia necesita hoy una dosis especial de ánimo o protección?',
      '¿En qué actitud cotidiana puedes mostrar más paciencia y escucha hacia los tuyos?',
      'Bendice tu hogar pidiendo que la presencia de Cristo gobierne en cada conversación.',
    ],
    verses: [
      { book: '1CO', chapter: 13, verse: 4 },
      { book: 'COL', chapter: 3, verse: 14 },
      { book: 'EPH', chapter: 4, verse: 2 },
      { book: '1PE', chapter: 4, verse: 8 },
      { book: '1JN', chapter: 4, verse: 7 },
    ],
  },
  {
    id: 'proposito',
    title: 'Oración, renovación y propósito diario',
    shortTitle: 'Renovación y propósito',
    shortIntro:
      'Tu trabajo, tus estudios y tus tareas ordinarias tienen valor eterno cuando se viven para Dios. Hoy renueva tu visión y ofrece tus manos al Señor.',
    closingCall: CLOSING_CALLS[4],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Ofrece tu jornada',
        guidance:
          'Pon delante de Dios tu agenda, tus talentos y las personas con las que te cruzarás hoy.',
      },
      {
        label: '2. Medita en tu llamado',
        guidance:
          'Lee estos 5 versículos recordando que fuiste creado en Cristo para buenas obras.',
      },
      {
        label: '3. Pide renovación interior',
        guidance:
          'Háblale al Señor sobre la rutina o el desánimo y pídele pasión renovada y excelencia humilde.',
      },
      {
        label: '4. Camina con sentido',
        guidance:
          'Sal de este momento decidido a hacer el bien con alegría donde Dios te ha puesto.',
      },
    ],
    prompts: [
      '¿Qué responsabilidad de hoy quieres realizar conscientemente «como para el Señor»?',
      '¿Dónde necesitas recuperar el entusiasmo y no cansarte de hacer el bien?',
      'Pide ojos atentos para notar a alguien a quien puedas servir hoy.',
    ],
    verses: [
      { book: 'EPH', chapter: 2, verse: 10 },
      { book: 'COL', chapter: 3, verse: 23 },
      { book: '2CO', chapter: 5, verse: 17 },
      { book: 'GAL', chapter: 6, verse: 9 },
      { book: 'MAT', chapter: 5, verse: 16 },
    ],
  },
  {
    id: 'mision',
    title: 'Oración, amor por las naciones y el evangelio',
    shortTitle: 'Las naciones y el evangelio',
    shortIntro:
      'El corazón de Dios late por cada pueblo, ciudad y persona que aún no conoce su gracia. Hoy ampliemos nuestra mirada para orar por el avance del evangelio.',
    closingCall: CLOSING_CALLS[0],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Abre tu corazón al mundo',
        guidance:
          'Piensa en tu ciudad, tu país y lugares lejanos donde la esperanza de Jesús necesita ser escuchada.',
      },
      {
        label: '2. Escucha el llamado de la Palabra',
        guidance:
          'Recorre los 5 versículos dejando que despierten compasión y fe.',
      },
      {
        label: '3. Intercede por quienes anuncian y quienes buscan',
        guidance:
          'Ora por misioneros, pastores, personas cercanas que aún no creen y autoridades de tu nación.',
      },
      {
        label: '4. Disponibilidad personal',
        guidance:
          'Pídele al Señor valentía serena y amor genuino para dar testimonio de Él en tu entorno.',
      },
    ],
    prompts: [
      '¿Qué persona de tu entorno cercano que aún no conoce a Jesús quieres mencionar hoy ante Dios?',
      'Ora por quienes sirven llevando el evangelio en lugares difíciles y por provisión para su labor.',
      'Pide compasión genuina para reflejar a Cristo con hechos y palabras.',
    ],
    verses: [
      { book: 'MAT', chapter: 9, verse: 37 },
      { book: 'ROM', chapter: 10, verse: 14 },
      { book: 'ACT', chapter: 1, verse: 8 },
      { book: '2PE', chapter: 3, verse: 9 },
      { book: '1TI', chapter: 2, verse: 1 },
    ],
  },
  {
    id: 'intimidad',
    title: 'Oración, cercanía e intimidad con Dios',
    shortTitle: 'Cercanía con Dios',
    shortIntro:
      'Más allá de las peticiones, la oración es el regalo de estar con el Padre. Hoy busca su rostro simplemente por el gozo de conocerlo y permanecer en Él.',
    closingCall: CLOSING_CALLS[1],
    durationMinutes: 10,
    guideSteps: [
      {
        label: '1. Entra en lo secreto',
        guidance:
          'No te apresures a llenar de palabras el momento; disfruta estar delante de quien te ama primero.',
      },
      {
        label: '2. Contempla su cercanía en la Escritura',
        guidance:
          'Lee despacio los 5 pasajes sobre permanecer en Cristo y acercarnos con confianza al trono de gracia.',
      },
      {
        label: '3. Expresa tu amor y dependencia',
        guidance:
          'Dile al Padre quién es Él para ti y cuánto deseas permanecer unido a su corazón.',
      },
      {
        label: '4. Permanece en paz',
        guidance:
          'Cierra en silencio agradecido, llevando esta conciencia de su cercanía a todo tu día.',
      },
    ],
    prompts: [
      '¿Qué atributo de Dios (su fidelidad, ternura, santidad o paciencia) deseas adorar hoy?',
      '¿Qué distracción reciente te ha alejado de disfrutar tiempos pausados con Él?',
      'Agradece el privilegio de poder llamarlo «Abba, Padre» por medio de Jesús.',
    ],
    verses: [
      { book: 'JAS', chapter: 4, verse: 8 },
      { book: 'HEB', chapter: 4, verse: 16 },
      { book: 'JHN', chapter: 15, verse: 5 },
      { book: 'MAT', chapter: 6, verse: 6 },
      { book: 'ROM', chapter: 8, verse: 15 },
    ],
  },
];

export function getTodayPrayerTheme(devotionalDateStr?: string): PrayerTheme {
  const dateKey = devotionalDateStr || getDevotionalDateStr();
  const [y, m, d] = dateKey.split('-').map((n) => parseInt(n, 10));
  const daysSinceEpoch = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const idx = ((daysSinceEpoch % PRAYER_THEMES.length) + PRAYER_THEMES.length) % PRAYER_THEMES.length;
  return PRAYER_THEMES[idx];
}
