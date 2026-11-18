export interface BookIntro {
  book: string;
  fullTitle: string;
  categoryLabel: string;
  authorAndDate: string;
  audienceAndOccasion: string;
  centralTheme: string;
  readingKeys: string[];
}

export const NT_BOOK_INTROS: Record<string, BookIntro> = {
  MAT: {
    book: 'MAT',
    fullTitle: 'Evangelio según Mateo',
    categoryLabel: 'Evangelios · 28 capítulos',
    authorAndDate:
      'La tradición temprana atribuye este evangelio a Mateo (Leví), el recaudador de impuestos llamado por Jesús en Galilea. La mayoría de los estudiosos lo sitúan entre los años 60 y 80 d. C., en un entorno de comunidades judeocristianas de habla griega, probablemente en Antioquía de Siria o Judea.',
    audienceAndOccasion:
      'Escrito principalmente para lectores judíos que habían creído en Jesús o conocían de cerca las Escrituras de Israel. Mateo responde a una pregunta urgente tras el rechazo de las autoridades en Jerusalén: ¿cómo se relaciona Jesús con la Ley de Moisés, las promesas hechas a Abraham y David, y la inclusión de las naciones?',
    centralTheme:
      'Jesús es el Mesías prometido y el Rey legítimo cuyo Reino irrumpe con misericordia, justicia interior y alcance universal. Al abrir con la genealogía davídica y cerrar con la Gran Comisión, Mateo presenta a Cristo como el «Dios con nosotros» (Emanuel) que cumple la historia de Israel.',
    readingKeys: [
      'Cinco grandes discursos: observa cómo Mateo agrupa las enseñanzas de Jesús en cinco bloques principales (como el Sermón del Monte en caps. 5–7), reflejando los cinco libros de Moisés.',
      'Citas de cumplimiento: presta atención a la fórmula «para que se cumpliese lo dicho por el profeta», usada para mostrar la continuidad entre el Antiguo Testamento y Jesús.',
      'La comunidad del Reino: nota cómo la justicia que pide Jesús supera la apariencia externa y pone el amor al prójimo y el perdón en el centro.',
    ],
  },
  MRK: {
    book: 'MRK',
    fullTitle: 'Evangelio según Marcos',
    categoryLabel: 'Evangelios · 16 capítulos',
    authorAndDate:
      'Según testimonios del siglo II (como Papías de Hierápolis), el autor es Juan Marcos, compañero cercano de Pedro y colaborador de Pablo y Bernabé. Es considerado el evangelio más antiguo, redactado probablemente en Roma hacia mediados o fines de la década del 60 d. C.',
    audienceAndOccasion:
      'Dirigido a creyentes gentiles en Roma —por eso explica costumbres judías y traduce expresiones arameas— que atravesaban momentos de presión e incertidumbre bajo el imperio de Nerón. Marcos busca sostener su fe recordándoles que seguir al Mesías implica compartir su camino de servicio y cruz.',
    centralTheme:
      'Jesús es el Hijo de Dios poderoso cuya verdadera realeza se revela plenamente no en el espectáculo político, sino como el Siervo sufriente que entrega su vida en rescate por muchos.',
    readingKeys: [
      'Ritmo rápido y directo: la palabra «en seguida» aparece de forma constante, transmitiendo la urgencia del ministerio de Jesús.',
      'El «secreto mesiánico»: fíjate en cómo Jesús pide silencio tras los milagros hasta que la cruz revele qué clase de Mesías es realmente.',
      'La confesión del centurión: el relato gira en torno a dos preguntas clave («¿Quién es este?») y culmina al pie de la cruz cuando un soldado romano reconoce su identidad.',
    ],
  },
  LUK: {
    book: 'LUK',
    fullTitle: 'Evangelio según Lucas',
    categoryLabel: 'Evangelios · 24 capítulos',
    authorAndDate:
      'Escrito por Lucas, médico gentil y compañero de viaje del apóstol Pablo, quien también redactó el libro de los Hechos como segunda parte de una misma obra histórica. Probablemente fue compuesto entre los años 60 y 80 d. C.',
    audienceAndOccasion:
      'Dedicado a Teófilo —un creyente o simpatizante de posición social acomodada— y, a través de él, a lectores de cultura grecorromana. Lucas investigó con rigor a testigos oculares para ofrecer un relato ordenado que confirmara la solidez histórica del mensaje cristiano.',
    centralTheme:
      'La salvación de Dios llega con compasión a toda la humanidad, prestando especial atención a los pobres, las mujeres, los extranjeros y quienes eran excluidos social o religiosamente.',
    readingKeys: [
      'El viaje a Jerusalén: gran parte del centro del libro (caps. 9–19) transcurre en camino hacia Jerusalén, donde aparecen parábolas únicas como el Buen Samaritano y el Hijo Pródigo.',
      'Oración y Espíritu Santo: Lucas destaca a Jesús orando antes de cada momento decisivo y muestra la acción constante del Espíritu.',
      'Gozo y mesas compartidas: observa cuántas enseñanzas fundamentales ocurren alrededor de una mesa junto a pecadores y discípulos.',
    ],
  },
  JHN: {
    book: 'JHN',
    fullTitle: 'Evangelio según Juan',
    categoryLabel: 'Evangelios · 21 capítulos',
    authorAndDate:
      'Tradicionalmente atribuido al apóstol Juan, hijo de Zebedeo («el discípulo a quien Jesús amaba»), testigo ocular cercano de los hechos en Galilea y Jerusalén. Compuesto hacia finales del siglo I (aprox. 85–95 d. C.), muy probablemente en Éfeso.',
    audienceAndOccasion:
      'Escrito para fortalecer la fe de comunidades cristianas de segunda generación —judías y gentiles— que enfrentaban la expulsión de las sinagogas y las primeras dudas sobre la identidad real de Cristo. Juan declara su objetivo abiertamente en 20:31: «para que crean que Jesús es el Cristo, el Hijo de Dios, y creyendo tengan vida».',
    centralTheme:
      'Jesús es la Palabra eterna de Dios hecha carne, quien revela al Padre mediante siete señales milagrosas y siete declaraciones «Yo soy», entregando su vida para dar vida eterna.',
    readingKeys: [
      'Dos grandes partes: los capítulos 1–12 muestran las señales públicas de Jesús ante el mundo; los capítulos 13–21 se concentran en la intimidad con sus discípulos, la cruz y la resurrección.',
      'Lenguaje simbólico: agua, luz, pan, pastor, vid y noche tienen un doble sentido espiritual más allá de lo material.',
      'La «hora» de Jesús: observa cómo todo el evangelio avanza hacia el momento en que la cruz y la gloria se unen en un mismo acontecimiento.',
    ],
  },
  ACT: {
    book: 'ACT',
    fullTitle: 'Hechos de los Apóstoles',
    categoryLabel: 'Historia · 28 capítulos',
    authorAndDate:
      'Segunda parte de la obra escrita por Lucas, continuando justo donde termina su Evangelio. Escrita probablemente entre el 62 y el 85 d. C., con secciones redactadas en primera persona del plural («nosotros») que reflejan su presencia como testigo directo junto a Pablo.',
    audienceAndOccasion:
      'Dedicada nuevamente a Teófilo y a las iglesias del mundo mediterráneo para mostrar cómo el movimiento nacido en Jerusalén no era una secta subversiva contra Roma, sino la expansión legítima de las promesas de Dios hasta el corazón del Imperio.',
    centralTheme:
      'Guiados y fortalecidos por el Espíritu Santo, los testigos de Jesús llevan el evangelio en círculos concéntricos desde Jerusalén, pasando por Judea y Samaria, hasta Roma y las naciones.',
    readingKeys: [
      'El mapa del libro (1:8): divide naturalmente la lectura en Jerusalén (caps. 1–7), Judea y Samaria (caps. 8–12) y el mundo gentil hasta Roma (caps. 13–28).',
      'Discursos apostólicos: casi un tercio del texto contiene predicaciones clave de Pedro, Esteban y Pablo que resumen el núcleo de la fe temprana.',
      'Puente hacia las cartas: leer Hechos aclara en qué ciudad y momento nació cada iglesia a la que luego escribió Pablo.',
    ],
  },
  ROM: {
    book: 'ROM',
    fullTitle: 'Carta a los Romanos',
    categoryLabel: 'Cartas Paulinas · 16 capítulos',
    authorAndDate:
      'Escrita por el apóstol Pablo (dictada a su secretario Tercio, 16:22) desde Corinto hacia el invierno del año 57 d. C., al finalizar su tercer viaje misionero y antes de subir a Jerusalén con la colecta.',
    audienceAndOccasion:
      'Dirigida a una comunidad diversa en Roma que Pablo aún no había visitado, integrada por creyentes judíos que regresaban tras el edicto del emperador Claudio y creyentes gentiles que habían sostenido las congregaciones locales. Pablo busca unirlos en el evangelio y presentar su mensaje antes de usar Roma como base hacia España.',
    centralTheme:
      'El evangelio es poder de Dios para salvación: en Cristo, Dios revela su justicia declarando justos por la fe —no por méritos ni identidad étnica— tanto a judíos como a gentiles, transformándolos por el Espíritu.',
    readingKeys: [
      'Estructura clara: necesidad universal (1–3), justificación por la fe (3–5), vida nueva en el Espíritu (6–8), fidelidad de Dios con Israel (9–11) y ética práctica de amor y unidad (12–16).',
      'Diálogo continuo: Pablo anticipa preguntas y objeciones reales de un lector imaginario para responderlas paso a paso.',
      'El capítulo 8 como cumbre: reúne la libertad de la condenación, la adopción como hijos y la certeza del amor inseparable de Dios.',
    ],
  },
  '1CO': {
    book: '1CO',
    fullTitle: 'Primera Carta a los Corintios',
    categoryLabel: 'Cartas Paulinas · 16 capítulos',
    authorAndDate:
      'Escrita por el apóstol Pablo desde Éfeso alrededor de los años 53–55 d. C., unos años después de haber fundado la iglesia en Corinto (Hechos 18).',
    audienceAndOccasion:
      'Corinto era una metrópoli portuaria próspera, competitiva y marcada por el pluralismo moral y la retórica grecorromana. Pablo responde tanto a informes preocupantes sobre divisiones internas y pleitos como a una carta de la propia iglesia con dudas sobre matrimonio, alimentos sacrificados a ídolos y dones espirituales.',
    centralTheme:
      'La sabiduría aparentemente débil de la cruz y el amor abnegado deben gobernar la unidad, la santidad cotidiana y el orden de la comunidad cristiana.',
    readingKeys: [
      'Problemas reales, respuestas cristocéntricas: ante cada conflicto práctico, Pablo vuelve al significado de la cruz y de la resurrección.',
      'El capítulo 13 en contexto: el famoso himno al amor está ubicado intencionalmente en medio del debate sobre los dones para recordar que sin amor el talento espiritual divide.',
      'Resurrección corporal (cap. 15): pieza fundamental sobre el triunfo final de Cristo sobre la muerte.',
    ],
  },
  '2CO': {
    book: '2CO',
    fullTitle: 'Segunda Carta a los Corintios',
    categoryLabel: 'Cartas Paulinas · 13 capítulos',
    authorAndDate:
      'Escrita por Pablo desde Macedonia hacia los años 55–56 d. C., tras recibir de Tito buenas noticias sobre la reconciliación parcial con la iglesia de Corinto.',
    audienceAndOccasion:
      'Tras una visita dolorosa y tensiones provocadas por predicadores rivales que presumían de elocuencia, visiones y estatus superior, Pablo abre su corazón con transparencia para defender su ministerio apostólico y animar a completar la colecta solidaria para los creyentes pobres de Jerusalén.',
    centralTheme:
      'El poder verdadero de Dios no se exhibe en la arrogancia ni el éxito mundano, sino que se perfecciona precisamente en la debilidad, el sufrimiento fiel y el servicio reconciliador.',
    readingKeys: [
      'La carta más personal de Pablo: refleja con honestidad sus angustias, lágrimas, consuelo y afecto pastoral.',
      'Ministerio del Nuevo Pacto (caps. 3–5): explica la gloria transformadora del Espíritu y el mensaje de la reconciliación.',
      'Generosidad cristiana (caps. 8–9): modelo práctico de ayuda mutua entre iglesias sin imposición.',
    ],
  },
  GAL: {
    book: 'GAL',
    fullTitle: 'Carta a los Gálatas',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Escrita por el apóstol Pablo (con una posdata de su propio puño, 6:11) hacia los años 48–55 d. C., dependiendo de si se dirige a las iglesias del sur de Galacia (visitadas en Hechos 13–14) o del norte.',
    audienceAndOccasion:
      'Enviada con urgencia a comunidades mayormente gentiles que estaban siendo persuadidas por maestros recién llegados de que, para pertenecer plenamente al pueblo de Dios, debían circuncidarse y observar las normas rituales de la ley mosaica.',
    centralTheme:
      'El ser humano es aceptado ante Dios exclusivamente por la fe en Jesucristo, no por obras de la ley; esa gracia inaugura una verdadera libertad guiada por el Espíritu Santo y expresada en amor.',
    readingKeys: [
      'Tono apasionado y urgente: nota cómo Pablo omite su habitual acción de gracias inicial por la gravedad del desvío doctrinal.',
      'Libertad no es libertinaje: en los caps. 5–6 aclara que ser libre de la ley no significa vivir para el egoísmo, sino producir el fruto del Espíritu.',
      'Sin distinciones excluyentes (3:28): en Cristo se derriban las barreras religiosas, sociales y culturales.',
    ],
  },
  EPH: {
    book: 'EPH',
    fullTitle: 'Carta a los Efesios',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Escrita por Pablo durante su prisión (probablemente en Roma hacia el año 60–62 d. C.), junto con Colosenses y Filemón, y enviada por medio de Tíquico.',
    audienceAndOccasion:
      'Dirigida a Éfeso y posiblemente pensada como carta circular para varias iglesias de Asia Menor. No responde a una herejía específica, sino que invita a creyentes de origen gentil a contemplar la grandeza de su nueva identidad y mantener la paz con sus hermanos judíos.',
    centralTheme:
      'El plan eterno de Dios es reunir todas las cosas bajo Cristo como cabeza, formando una sola humanidad reconciliada —su iglesia— que viva de manera digna de esa vocación.',
    readingKeys: [
      'Dos mitades equilibradas: los caps. 1–3 describen lo que Dios hizo en Cristo (nuestra posición); los caps. 4–6 muestran cómo caminar en consecuencia (nuestra práctica).',
      'Palabras clave: «en Cristo», «gracia», «unidad» y «misterio».',
      'Del cielo al hogar: la carta aterriza las verdades más elevadas en el lenguaje diario, el matrimonio, la familia, el trabajo y la firmeza espiritual.',
    ],
  },
  PHP: {
    book: 'PHP',
    fullTitle: 'Carta a los Filipenses',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'Escrita por el apóstol Pablo (junto a Timoteo) desde la cárcel —muy probablemente en Roma alrededor del año 61–62 d. C.— cuando aguardaba la resolución de su proceso ante el tribunal imperial.',
    audienceAndOccasion:
      'Dirigida a la iglesia de Filipos, la primera comunidad que Pablo fundó en Europa (Hechos 16), con la que mantenía un vínculo de amistad excepcional. Ellos habían enviado a Epafrodito con una ofrenda económica, y Pablo agradece el gesto mientras los anima frente a la oposición externa y ciertas tensiones internas.',
    centralTheme:
      'El gozo profundo e inquebrantable nace de centrar la vida en Cristo, imitando su humildad abnegada y descansando en la paz de Dios por encima de las circunstancias.',
    readingKeys: [
      'El himno de 2:5-11: uno de los textos cristológicos más antiguos de la iglesia, modelo de humildad práctica.',
      'Gozo desde la cárcel: a pesar de estar encadenado, los términos «gozo» y «alegrarse» atraviesan los cuatro capítulos.',
      'Reemplazar el afán por oración (4:6-7): la paz de Dios actúa como guardia protectora sobre la mente y el corazón.',
    ],
  },
  COL: {
    book: 'COL',
    fullTitle: 'Carta a los Colosenses',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'Escrita por Pablo desde prisión (aprox. 60–62 d. C.) a una iglesia que no había fundado personalmente, sino que había nacido gracias al testimonio de su colaborador Epafras.',
    audienceAndOccasion:
      'En Colosas comenzaba a infiltrarse una mezcla de especulación filosófica, prácticas ascéticas estrictas, observancia de calendarios y veneración de poderes angélicos que sugería que Cristo no bastaba para alcanzar la plenitud espiritual.',
    centralTheme:
      'Cristo es suficiente y supremo sobre toda la creación y sobre todo poder invisible; en él habita toda la plenitud de Dios, y en él el creyente ya está completo.',
    readingKeys: [
      'El himno de la supremacía de Cristo (1:15-20): presenta a Jesús como imagen del Dios invisible, creador y reconciliador del universo.',
      'Contra la espiritualidad de reglas vacías (cap. 2): muestra por qué Cristo desarmó en la cruz toda sombra y exigencia legalista.',
      'Vida resucitada aquí y ahora (caps. 3–4): «buscar las cosas de arriba» se traduce en compasión, perdón y gratitud cotidiana.',
    ],
  },
  '1TH': {
    book: '1TH',
    fullTitle: 'Primera Carta a los Tesalonicenses',
    categoryLabel: 'Cartas Paulinas · 5 capítulos',
    authorAndDate:
      'Escrita por Pablo, Silvano y Timoteo desde Corinto alrededor del año 50–51 d. C.; probablemente el escrito más antiguo conservado del apóstol Pablo.',
    audienceAndOccasion:
      'Pablo había tenido que salir apresuradamente de Tesalónica tras apenas unas semanas de ministerio por hostilidad local (Hechos 17). Preocupado por aquella joven iglesia, envió a Timoteo y, al recibir buenas noticias sobre su firmeza, escribe para consolarlos y aclarar dudas sobre qué sucede con los creyentes que fallecen antes del regreso de Jesús.',
    centralTheme:
      'La esperanza firme en el regreso de Cristo fortalece a la comunidad en medio de la aflicción y la impulsa a vivir en pureza, amor fraterno y trabajo responsable.',
    readingKeys: [
      'Afecto maternal y paternal (cap. 2): observa el cuidado cercano y desinteresado con que Pablo describe su labor pastoral.',
      'Consuelo ante la muerte (4:13-18): la esperanza cristiana no niega el duelo, pero transforma la tristeza en certeza de reencuentro.',
      'Fe, amor y esperanza: la tríada que enmarca toda la carta desde los primeros versículos.',
    ],
  },
  '2TH': {
    book: '2TH',
    fullTitle: 'Segunda Carta a los Tesalonicenses',
    categoryLabel: 'Cartas Paulinas · 3 capítulos',
    authorAndDate:
      'Escrita poco tiempo después de la primera carta, alrededor del año 51–52 d. C., mientras Pablo seguía en Corinto.',
    audienceAndOccasion:
      'La persecución en Tesalónica se había intensificado y circulaba la idea errónea —incluso atribuida a supuestas cartas apostólicas— de que el «Día del Señor» ya había llegado. Algunos creyentes, creyendo inminente el fin, habían dejado de trabajar y vivían a costa de los demás.',
    centralTheme:
      'Perseverar con sobriedad frente al engaño y la prueba, manteniendo firme la esperanza en la justicia venidera de Cristo sin descuidar el deber diario.',
    readingKeys: [
      'Equilibrio frente al sensacionalismo: Pablo frena las especulaciones escatológicas describiendo señales previas (cap. 2).',
      'Oración por avance del mensaje y firmeza interior (3:1-5).',
      'Ética del trabajo cotidiano (3:6-13): esperar al Señor implica hacer el bien con responsabilidad y sin ociosidad.',
    ],
  },
  '1TI': {
    book: '1TI',
    fullTitle: 'Primera Carta a Timoteo',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Perteneciente a las cartas pastorales escritas por Pablo hacia mediados de los años 60 d. C. (entre su primer encarcelamiento en Roma y su proceso final).',
    audienceAndOccasion:
      'Dirigida a su colaborador más joven, Timoteo, a quien Pablo dejó encargado de supervisar las iglesias de Éfeso frente a líderes que desviaban la atención hacia mitos, genealogías estériles y disputas vanas.',
    centralTheme:
      'Instrucciones claras para cuidar la sana enseñanza, la vida de oración, la integridad del liderazgo y el orden cálido en la «casa de Dios».',
    readingKeys: [
      'La doctrina se mide por el amor (1:5): el propósito de la enseñanza sana es amor de corazón limpio, buena conciencia y fe sincera.',
      'Carácter antes que carisma (cap. 3): los requisitos de ancianos y diáconos se centran en madurez moral y hospitalidad.',
      'Piedad frente a codicia (cap. 6): advertencia lucidez sobre la verdadera riqueza y el contentamiento.',
    ],
  },
  '2TI': {
    book: '2TI',
    fullTitle: 'Segunda Carta a Timoteo',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'La última carta conocida de Pablo, escrita desde una celda fría en Roma hacia los años 66–67 d. C., cuando muchos antiguos compañeros lo habían abandonado y sentía próxima su ejecución.',
    audienceAndOccasion:
      'Testamento espiritual íntimo dirigido a Timoteo, instándolo a no avergonzarse del evangelio ni de un apóstol encadenado, a soportar las dificultades con valor y a viajar pronto antes del invierno.',
    centralTheme:
      'Mantener encendido el don recibido y transmitir fielmente la Palabra inspirada a nuevas generaciones, sabiendo que el mensaje de Dios nunca está encadenado.',
    readingKeys: [
      'Cadena de transmisión fiel (2:2): lo que escuchaste, confíalo a personas idóneas que enseñen a otros.',
      'Valor de toda la Escritura (3:14-17): el pasaje clásico sobre la inspiración y utilidad práctica de los textos sagrados.',
      'Despedida serena (4:6-8): «He peleado la buena batalla, he acabado la carrera, he guardado la fe».',
    ],
  },
  TIT: {
    book: 'TIT',
    fullTitle: 'Carta a Tito',
    categoryLabel: 'Cartas Paulinas · 3 capítulos',
    authorAndDate:
      'Escrita por Pablo hacia mediados de los años 60 d. C. a Tito, colaborador gentil de confianza que ya había trabajado con éxito en Corinto.',
    audienceAndOccasion:
      'Tito había quedado en la isla de Creta, cuya cultura era conocida en la antigüedad por su fama de discordia y engaño, con la tarea de organizar las congregaciones recién formadas y nombrar líderes locales íntegros.',
    centralTheme:
      'La gracia salvadora de Dios educa al creyente para rechazar la impiedad y adornar la verdad del evangelio con buenas obras en medio de la sociedad.',
    readingKeys: [
      'Doctrina y carácter inseparables: la fe verdadera siempre produce cambio observable en familias y comunidad (cap. 2).',
      'Misericordia como raíz (3:4-7): Dios nos salvó no por obras justas que hubiéramos hecho, sino por su misericordia y renovación del Espíritu.',
      'Rechazar peleas estériles: evitar controversias necias para enfocarse en lo provechoso.',
    ],
  },
  PHM: {
    book: 'PHM',
    fullTitle: 'Carta a Filemón',
    categoryLabel: 'Cartas Paulinas · 1 capítulo',
    authorAndDate:
      'Nota breve y profundamente personal escrita por Pablo (con Timoteo) desde prisión hacia el año 60–62 d. C., enviada junto con la carta a los Colosenses.',
    audienceAndOccasion:
      'Dirigida a Filemón, un creyente acomodado de Colosas en cuya casa se reunía la iglesia. Su esclavo fugitivo, Onésimo, había conocido a Pablo en prisión y se había convertido a Cristo; ahora Pablo lo envía de vuelta intercediendo por él.',
    centralTheme:
      'El evangelio transforma desde dentro las estructuras sociales humanas: quien huyó como esclavo regresa para ser recibido como hermano amado en igualdad espiritual.',
    readingKeys: [
      'Juego de palabras con el nombre: «Onésimo» significa «útil»; antes era inútil, ahora es verdaderamente útil para ambos.',
      'Tacto y generosidad apostólica: Pablo no impone su autoridad sino que ruega por amor y se ofrece a pagar cualquier deuda («cárgalo a mi cuenta»).',
      'Ejemplo temprano de cómo la fe redefine la dignidad humana sin violencia.',
    ],
  },
  HEB: {
    book: 'HEB',
    fullTitle: 'Carta a los Hebreos',
    categoryLabel: 'Cartas Universales · 13 capítulos',
    authorAndDate:
      'Escrita por un autor anónimo de extraordinaria cultura bíblica y griego elegante (en la antigüedad se propusieron Pablo, Bernabé, Apolos o Lucas). Compuesta probablemente antes del año 70 d. C., mientras el culto del templo de Jerusalén aún seguía en pie.',
    audienceAndOccasion:
      'Dirigida a creyentes de trasfondo judío que, cansados por el paso del tiempo, el rechazo social y la pérdida de bienes, sentían la tentación de volver a las prácticas visibles del judaísmo tradicional.',
    centralTheme:
      'Jesucristo es infinitamente superior a los ángeles, a Moisés, al sacerdocio levítico y a los sacrificios antiguos: su sacrificio único abrió un camino nuevo y vivo directamente ante Dios.',
    readingKeys: [
      'Palabra clave: «Mejor» (mejor pacto, mejores promesas, mejor sacrificio).',
      'Alternancia entre doctrina y advertencia: cinco llamados serios a no retroceder intercalados entre profundos pasajes sobre Cristo.',
      'La galería de la fe (cap. 11) culmina fijando la mirada en Jesús, autor y consumador de la fe (12:1-2).',
    ],
  },
  JAS: {
    book: 'JAS',
    fullTitle: 'Carta de Santiago',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'Atribuida tradicionalmente a Santiago (Jacobo), hermano del Señor y líder respetado de la iglesia de Jerusalén. Es uno de los escritos más tempranos del Nuevo Testamento, probablemente redactado entre los años 45 y 60 d. C.',
    audienceAndOccasion:
      'Dirigida a «las doce tribus que están en la dispersión», creyentes judeocristianos esparcidos fuera de Judea que sufrían pobreza, presiones económicas de terratenientes y conflictos comunitarios.',
    centralTheme:
      'La sabiduría genuina y la fe verdadera nunca quedan en mera declaración verbal: se demuestran con integridad en las pruebas, justicia hacia el vulnerable, dominio del hablar y obras de amor.',
    readingKeys: [
      'Eco del Sermón del Monte: más de veinte paralelos directos con las enseñanzas de Jesús en Mateo 5–7.',
      'Sabiduría práctica en estilo proverbial: imágenes vívidas (espejo, timón, fuego, manantial, labrador paciente).',
      'Fe y obras (2:14-26): no contradice a Pablo sobre cómo somos justificados ante Dios, sino que refuta una fe intelectual muerta que no socorre al necesitado.',
    ],
  },
  '1PE': {
    book: '1PE',
    fullTitle: 'Primera Carta de Pedro',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'Escrita por el apóstol Pedro con la colaboración de Silvano desde «Babilonia» (nombre simbólico de Roma) hacia los años 62–64 d. C.',
    audienceAndOccasion:
      'Carta circular enviada a iglesias mayormente gentiles dispersas por cinco provincias de Asia Menor (hoy Turquía) que comenzaban a experimentar calumnias, marginación y hostilidad cotidiana por no participar en las costumbres paganas.',
    centralTheme:
      'Sostenidos por una esperanza viva en la resurrección de Cristo, los creyentes viven en el mundo como peregrinos cuya conducta honorable y paciencia en el sufrimiento reflejan la santidad de Dios.',
    readingKeys: [
      'Identidad real de la iglesia (2:9-10): Pedro aplica al nuevo pueblo de Dios los títulos del Sinaí («linaje escogido, real sacerdocio, nación santa»).',
      'Sufrimiento con propósito: distingue entre sufrir por hacer el mal y sufrir injustamente siguiendo las huellas de Cristo.',
      'Ancla de esperanza: la gracia futura ilumina las pruebas breves del presente.',
    ],
  },
  '2PE': {
    book: '2PE',
    fullTitle: 'Segunda Carta de Pedro',
    categoryLabel: 'Cartas Universales · 3 capítulos',
    authorAndDate:
      'Escrita como despedida final de Pedro sabiendo que su partida estaba cerca (1:14), alrededor de mediados o fines de la década del 60 d. C.',
    audienceAndOccasion:
      'Dirigida a las mismas comunidades de la primera carta ante el surgimiento de maestros falsos que justificaban la inmoralidad y se burlaban de la promesa del regreso de Cristo por su aparente tardanza.',
    centralTheme:
      'Crecer activamente en la gracia y el conocimiento de Jesucristo apoyados en la palabra profética segura, sin dejarse arrastrar por el error ni olvidar la paciencia de Dios.',
    readingKeys: [
      'Escala de virtudes (1:5-7): a la fe añadir virtud, conocimiento, dominio propio, paciencia, piedad, afecto fraternal y amor.',
      'Testigo ocular de la Transfiguración (1:16-18): recuerda la majestad real de Cristo vista en el monte santo.',
      'La paciencia de Dios (3:9): Dios no retarda su promesa por olvido, sino dando tiempo al arrepentimiento.',
    ],
  },
  '1JN': {
    book: '1JN',
    fullTitle: 'Primera Carta de Juan',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'Escrita por el autor del cuarto evangelio (el apóstol Juan) en Asia Menor hacia finales del siglo I (aprox. 85–95 d. C.).',
    audienceAndOccasion:
      'Un grupo había abandonado la comunidad (2:19) negando que Jesús fuera verdaderamente el Cristo venido en carne real y tratando la ética moral con indiferencia. Juan escribe como un padre espiritual para devolver seguridad y gozo a quienes permanecieron fieles.',
    centralTheme:
      'Dios es luz y Dios es amor: la comunión real con él se verifica mediante tres pruebas inseparables: confesar al Hijo encarnado, obedecer sus mandamientos y amar visiblemente a los hermanos.',
    readingKeys: [
      'Estilo en espiral: en lugar de avanzar linealmente como Pablo, Juan vuelve una y otra vez sobre luz, vida, verdad y amor cada vez más hondo.',
      'Certeza serena: palabras como «sabemos» y «hemos conocido» dan seguridad frente a la confusión.',
      'Amor comprobable: «No amemos de palabra ni de lengua, sino de hecho y en verdad» (3:18).',
    ],
  },
  '2JN': {
    book: '2JN',
    fullTitle: 'Segunda Carta de Juan',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Escrita por «el anciano» (el apóstol Juan en su vejez) hacia los años 85–95 d. C., en el mismo contexto doctrinal que 1 Juan.',
    audienceAndOccasion:
      'Dirigida a «la señora elegida y a sus hijos», expresión que muy probablemente designa afectuosamente a una iglesia local y sus miembros. Advierte sobre predicadores itinerantes que negaban la encarnación real de Jesucristo y buscaban hospedaje y respaldo en las iglesias.',
    centralTheme:
      'El amor cristiano genuino siempre camina unido a la verdad: acoger con discernimiento sin hacerse cómplice de enseñanzas que niegan a Cristo.',
    readingKeys: [
      'La carta más breve del NT (13 versículos): sigue fielmente el formato epistolar de una hoja de papiro antigua.',
      'Equilibrio entre verdad y amor: ni verdad fría sin amor, ni tolerancia ingenua que destruya el fundamento cristológico.',
    ],
  },
  '3JN': {
    book: '3JN',
    fullTitle: 'Tercera Carta de Juan',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Escrita también por «el anciano» (Juan) hacia fines del siglo I (85–95 d. C.) para resolver un conflicto concreto en una comunidad local.',
    audienceAndOccasion:
      'Carta personal dirigida a un líder fiel llamado Gayo, elogiado por su hospitalidad hacia los misioneros itinerantes, en contraste con Diótrefes, quien buscaba preeminencia personal, rechazaba la autoridad apostólica y expulsaba a quienes recibían a los hermanos.',
    centralTheme:
      'Apoyar generosamente a quienes sirven a la verdad e imitar lo bueno frente al orgullo autoritario dentro de la iglesia.',
    readingKeys: [
      'Tres retratos humanos contrastados: la generosidad de Gayo, la ambición de Diótrefes y el buen testimonio de Demetrio.',
      'Cooperadores con la verdad: cómo la hospitalidad cotidiana participa directamente de la misión.',
    ],
  },
  JUD: {
    book: 'JUD',
    fullTitle: 'Carta de Judas',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Escrita por Judas, «siervo de Jesucristo y hermano de Santiago» (y por tanto medio hermano del Señor). Datada entre los años 60 y 80 d. C.',
    audienceAndOccasion:
      'Judas planeaba escribir una carta serena sobre la salvación común, pero cambió de planes con urgencia al enterarse de que personas inescrupulosas se habían infiltrado convirtiendo la gracia de Dios en excusa para el libertinaje y despreciando el señorío de Cristo.',
    centralTheme:
      'Contender con firmeza por la fe apostólica entregada una vez por todas, edificándose en el amor de Dios y rescatando con misericordia a quienes dudan.',
    readingKeys: [
      'Tríadas memorables: Judas agrupa advertencias y ejemplos históricos del AT de tres en tres.',
      'Misericordia con discernimiento (vv. 22-23): compasión con quienes titubean, cautela frente al contagio del pecado.',
      'La doxología final (vv. 24-25): una de las bendiciones más solemnes de la Biblia sobre el Dios poderoso para guardarnos sin caída.',
    ],
  },
  REV: {
    book: 'REV',
    fullTitle: 'Apocalipsis',
    categoryLabel: 'Profecía y Apocalíptica · 22 capítulos',
    authorAndDate:
      'Escrito por Juan mientras se encontraba desterrado en la isla de Patmos a causa de su testimonio (1:9), muy probablemente durante el reinado del emperador Domiciano hacia el año 95 d. C.',
    audienceAndOccasion:
      'Enviado como profecía y carta circular a siete iglesias concretas de Asia Menor (Éfeso, Esmirna, Pérgamo, Tiatira, Sardis, Filadelfia y Laodicea) que enfrentaban presión económica, culto imperial obligatorio, persecución y la tentación de acomodarse al entorno.',
    centralTheme:
      'Detrás del telón de los imperios humanos y las crisis de la historia, Dios reina en el trono y el Cordero inmolado ya ha vencido; su pueblo perseverante heredará cielos nuevos y tierra nueva.',
    readingKeys: [
      'Género simbólico: números (7, 12, 144.000), bestias, trompetas y colores funcionan como imágenes teológicas inspiradas en Daniel, Ezequiel e Isaías, no como códigos literales modernos.',
      'Las siete cartas (caps. 2–3): revelan que la amenaza más peligrosa no siempre es la persecución externa, sino la tibieza interior.',
      'Adoración constante: cada escena de juicio está precedida por cantos celestiales que recuerdan quién gobierna realmente la historia.',
    ],
  },
};

export function getBookIntro(code: string): BookIntro | undefined {
  return NT_BOOK_INTROS[code.toUpperCase()];
}
