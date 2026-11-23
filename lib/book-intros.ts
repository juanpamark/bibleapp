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
      'La tradición temprana atribuye este Evangelio a Mateo (Leví), el recaudador de impuestos llamado por Jesús en Galilea. La mayoría de los estudiosos lo sitúa entre los años 60 y 80 d. C., en un entorno de comunidades judeocristianas de habla griega, probablemente en Antioquía de Siria o en Judea.',
    audienceAndOccasion:
      'Fue escrito principalmente para lectores judíos que habían creído en Jesús o conocían de cerca las Escrituras de Israel. Mateo responde a una pregunta decisiva tras el rechazo de las autoridades en Jerusalén: cómo se relaciona Jesús con la Ley de Moisés, las promesas hechas a Abraham y a David, y la inclusión de todas las naciones.',
    centralTheme:
      'Jesús es el Mesías prometido y el Rey legítimo cuyo Reino irrumpe con misericordia, justicia interior y alcance universal. Al abrir con la genealogía davídica y cerrar con la Gran Comisión, Mateo presenta a Cristo como el «Dios con nosotros» (Emanuel) que lleva a plenitud la historia de Israel.',
    readingKeys: [
      'Cinco grandes discursos: observa cómo Mateo agrupa las enseñanzas de Jesús en cinco bloques principales (como el Sermón del Monte en los capítulos 5–7), evocando los cinco libros de Moisés.',
      'Citas de cumplimiento: presta atención a la fórmula «para que se cumpliera lo que el Señor había dicho por medio del profeta», usada para mostrar la continuidad entre el Antiguo Testamento y Jesús.',
      'La comunidad del Reino: nota cómo la justicia que pide Jesús supera la apariencia externa y coloca el amor al prójimo, la humildad y el perdón en el centro.',
    ],
  },
  MRK: {
    book: 'MRK',
    fullTitle: 'Evangelio según Marcos',
    categoryLabel: 'Evangelios · 16 capítulos',
    authorAndDate:
      'Según testimonios del siglo II (como Papías de Hierápolis), el autor es Juan Marcos, compañero cercano de Pedro y colaborador de Pablo y Bernabé. Es considerado el Evangelio más antiguo, redactado probablemente en Roma hacia mediados o finales de los años 60 d. C.',
    audienceAndOccasion:
      'Fue dirigido a creyentes gentiles en Roma —por eso explica costumbres judías y traduce expresiones arameas— que atravesaban momentos de presión e incertidumbre bajo el imperio de Nerón. Marcos busca sostener su fe recordándoles que seguir al Mesías implica compartir su camino de servicio y cruz.',
    centralTheme:
      'Jesús es el Hijo de Dios poderoso cuya verdadera realeza no se manifiesta en el poder político, sino como el Siervo sufriente que entrega su vida en rescate por muchos.',
    readingKeys: [
      'Ritmo rápido y directo: la palabra «enseguida» aparece de forma constante en todo el relato, transmitiendo la urgencia y el dinamismo del ministerio de Jesús.',
      'El «secreto mesiánico»: fíjate en cómo Jesús pide silencio tras muchos milagros hasta que la cruz revele con claridad qué clase de Mesías es realmente.',
      'Dos preguntas y una confesión: el relato gira en torno a dos preguntas decisivas («¿Quién es, pues, este?» en 4:41 y «Y ustedes, ¿quién dicen que soy yo?» en 8:29) y culmina al pie de la cruz cuando un centurión romano reconoce su identidad.',
    ],
  },
  LUK: {
    book: 'LUK',
    fullTitle: 'Evangelio según Lucas',
    categoryLabel: 'Evangelios · 24 capítulos',
    authorAndDate:
      'Fue escrito por Lucas, médico gentil y compañero de viaje del apóstol Pablo, quien también redactó el libro de Hechos como segunda parte de una misma obra histórica. Probablemente se compuso entre los años 60 y 80 d. C.',
    audienceAndOccasion:
      'Está dedicado a Teófilo —un creyente o simpatizante de posición social acomodada— y, por medio de él, a lectores de cultura grecorromana. Lucas investigó con rigor a testigos oculares para ofrecer un relato ordenado que confirmara la solidez histórica del mensaje cristiano.',
    centralTheme:
      'La salvación de Dios alcanza con compasión a toda la humanidad, prestando especial atención a los pobres, las mujeres, los extranjeros y quienes eran excluidos social o religiosamente.',
    readingKeys: [
      'El viaje a Jerusalén: gran parte del centro del libro (capítulos 9–19) transcurre en camino hacia Jerusalén, donde aparecen parábolas exclusivas de Lucas como el Buen Samaritano y el Hijo Pródigo.',
      'Oración y Espíritu Santo: Lucas destaca a Jesús orando antes de cada momento decisivo y subraya la acción constante del Espíritu a lo largo de la historia.',
      'Gozo y mesas compartidas: observa cuántas enseñanzas fundamentales de Jesús ocurren alrededor de una mesa junto a pecadores, invitados inesperados y discípulos.',
    ],
  },
  JHN: {
    book: 'JHN',
    fullTitle: 'Evangelio según Juan',
    categoryLabel: 'Evangelios · 21 capítulos',
    authorAndDate:
      'La tradición lo atribuye al apóstol Juan, hijo de Zebedeo («el discípulo a quien Jesús amaba»), testigo ocular de la vida de Jesús en Galilea y Jerusalén. Fue compuesto hacia finales del siglo I (entre los años 85 y 95 d. C.), muy probablemente en Éfeso.',
    audienceAndOccasion:
      'Fue escrito para fortalecer la fe de comunidades cristianas de segunda generación —judías y gentiles— que enfrentaban la expulsión de las sinagogas y las primeras dudas sobre la identidad real de Cristo. Juan declara su propósito abiertamente en 20:31: «para que crean que Jesús es el Cristo, el Hijo de Dios, y para que creyendo tengan vida en su nombre».',
    centralTheme:
      'Jesús es la Palabra eterna de Dios hecha carne, quien revela al Padre mediante siete señales milagrosas y siete declaraciones «Yo soy», entregando su vida para dar vida eterna.',
    readingKeys: [
      'Dos grandes partes: los capítulos 1–12 presentan las señales públicas de Jesús ante el mundo; los capítulos 13–21 se concentran en la intimidad con sus discípulos, la cruz y la resurrección.',
      'Lenguaje simbólico: elementos cotidianos como agua, luz, pan, pastor, vid y noche guardan un sentido espiritual profundo más allá de lo material.',
      'La «hora» de Jesús: observa cómo todo el Evangelio avanza hacia el momento en que la cruz y la gloria se unen en un mismo acontecimiento.',
    ],
  },
  ACT: {
    book: 'ACT',
    fullTitle: 'Hechos de los Apóstoles',
    categoryLabel: 'Historia · 28 capítulos',
    authorAndDate:
      'Es la segunda parte de la obra histórica de Lucas y retoma el relato justo donde termina su Evangelio. Fue redactado probablemente entre los años 62 y 85 d. C., e incluye secciones narradas en primera persona del plural («nosotros») que reflejan su presencia como testigo directo junto a Pablo.',
    audienceAndOccasion:
      'Dedicado nuevamente a Teófilo y a las iglesias del mundo mediterráneo, busca mostrar que el movimiento nacido en Jerusalén no era una secta subversiva contra Roma, sino la expansión legítima de las promesas de Dios hasta el corazón del Imperio.',
    centralTheme:
      'Guiados y fortalecidos por el Espíritu Santo, los testigos de Jesús llevan el evangelio en círculos concéntricos desde Jerusalén, pasando por Judea y Samaria, hasta Roma y las naciones.',
    readingKeys: [
      'El mapa del libro (1:8): divide naturalmente la lectura en Jerusalén (capítulos 1–7), Judea y Samaria (capítulos 8–12) y el mundo gentil hasta Roma (capítulos 13–28).',
      'Discursos apostólicos: casi un tercio del texto recoge predicaciones clave de Pedro, Esteban y Pablo que resumen el núcleo de la fe temprana.',
      'Puente hacia las cartas: leer Hechos aclara en qué ciudad, circunstancias y momento nació cada iglesia a la que luego escribió Pablo.',
    ],
  },
  ROM: {
    book: 'ROM',
    fullTitle: 'Carta a los Romanos',
    categoryLabel: 'Cartas Paulinas · 16 capítulos',
    authorAndDate:
      'Fue escrita por el apóstol Pablo (dictada a su secretario Tercio, 16:22) desde Corinto hacia el invierno del año 57 d. C., al finalizar su tercer viaje misionero y antes de subir a Jerusalén con la colecta solidaria para los creyentes de aquella ciudad.',
    audienceAndOccasion:
      'Se dirige a una comunidad diversa en Roma que Pablo aún no había visitado, integrada por creyentes judíos —que regresaban tras el edicto de expulsión del emperador Claudio del año 49 d. C.— y creyentes gentiles que habían sostenido las congregaciones locales. Pablo busca unirlos en el evangelio y presentar con claridad su mensaje antes de usar Roma como base misionera hacia España.',
    centralTheme:
      'El evangelio es poder de Dios para salvación: en Cristo, Dios revela su justicia declarando justos por la fe —no por méritos ni identidad étnica— tanto a judíos como a gentiles, transformándolos por el Espíritu.',
    readingKeys: [
      'Estructura clara: necesidad universal (capítulos 1–3), justificación por la fe (capítulos 3–5), vida nueva en el Espíritu (capítulos 6–8), fidelidad de Dios con Israel (capítulos 9–11) y ética práctica de amor y unidad (capítulos 12–16).',
      'Diálogo continuo: Pablo anticipa preguntas y objeciones reales de un interlocutor imaginario para responderlas paso a paso.',
      'El capítulo 8 como cumbre: reúne la libertad de la condenación, la adopción como hijos y la certeza del amor inseparable de Dios.',
    ],
  },
  '1CO': {
    book: '1CO',
    fullTitle: 'Primera Carta a los Corintios',
    categoryLabel: 'Cartas Paulinas · 16 capítulos',
    authorAndDate:
      'Fue escrita por el apóstol Pablo desde Éfeso alrededor de los años 53–55 d. C., pocos años después de haber fundado la iglesia en Corinto (Hechos 18).',
    audienceAndOccasion:
      'Corinto era una metrópoli portuaria próspera, competitiva y marcada por el pluralismo moral y la retórica grecorromana. Pablo responde tanto a informes preocupantes sobre divisiones internas y pleitos como a una carta de la propia iglesia con dudas sobre el matrimonio, los alimentos sacrificados a ídolos y los dones espirituales.',
    centralTheme:
      'La sabiduría aparentemente débil de la cruz y el amor abnegado deben gobernar la unidad, la santidad cotidiana y el orden de la comunidad cristiana.',
    readingKeys: [
      'Problemas reales, respuestas cristocéntricas: ante cada conflicto práctico, Pablo vuelve al significado de la cruz y de la resurrección.',
      'El capítulo 13 en contexto: el célebre himno al amor está ubicado intencionalmente en medio del debate sobre los dones para recordar que, sin amor, el talento espiritual divide.',
      'Resurrección corporal (capítulo 15): pieza fundamental sobre el triunfo final de Cristo sobre la muerte y la esperanza futura del creyente.',
    ],
  },
  '2CO': {
    book: '2CO',
    fullTitle: 'Segunda Carta a los Corintios',
    categoryLabel: 'Cartas Paulinas · 13 capítulos',
    authorAndDate:
      'Fue escrita por Pablo desde Macedonia hacia los años 55–56 d. C., después de recibir de Tito buenas noticias sobre la reconciliación parcial con la iglesia de Corinto.',
    audienceAndOccasion:
      'Tras una visita dolorosa y tensiones provocadas por predicadores rivales que presumían de elocuencia, visiones y estatus superior, Pablo abre su corazón con transparencia para defender su ministerio apostólico y animar a completar la colecta solidaria para los creyentes necesitados de Jerusalén.',
    centralTheme:
      'El verdadero poder de Dios no se exhibe en la arrogancia ni en el éxito mundano, sino que se perfecciona precisamente en la debilidad, el sufrimiento fiel y el servicio reconciliador.',
    readingKeys: [
      'La carta más personal de Pablo: muestra con franqueza sus angustias, lágrimas, consuelo y afecto pastoral.',
      'Ministerio del Nuevo Pacto (capítulos 3–5): explica la gloria transformadora del Espíritu y el llamado a ser embajadores de reconciliación.',
      'Generosidad cristiana (capítulos 8–9): ofrece un modelo práctico de ayuda mutua entre iglesias, motivado por la gracia y sin imposición.',
    ],
  },
  GAL: {
    book: 'GAL',
    fullTitle: 'Carta a los Gálatas',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Fue escrita por el apóstol Pablo, quien incluso redacta el cierre de su propio puño y letra (6:11). Su fecha depende de los destinatarios exactos: hacia los años 48–49 d. C. si se dirigió a las iglesias del sur de Galacia (visitadas en Hechos 13–14), o hacia los años 53–55 d. C. si se escribió para comunidades del norte de la región.',
    audienceAndOccasion:
      'Pablo envía esta carta con urgencia a las iglesias de Galacia (en Asia Menor), formadas en su mayoría por creyentes gentiles. Un grupo de maestros recién llegados los estaba convenciendo de que la fe en Jesús no bastaba y que, para pertenecer plenamente al pueblo de Dios, debían circuncidarse y someterse a las normas rituales de la Ley de Moisés.',
    centralTheme:
      'El ser humano es declarado justo delante de Dios exclusivamente por la fe en Jesucristo, no por las obras de la Ley; esa gracia inaugura una libertad genuina guiada por el Espíritu Santo que se expresa en el amor.',
    readingKeys: [
      'Tono apasionado y urgente (1:6): nota cómo Pablo omite su habitual acción de gracias inicial y expresa de inmediato su asombro ante la gravedad del desvío doctrinal.',
      'Una sola familia sin barreras (3:28): en Cristo se derriban las distinciones religiosas, sociales y culturales que dividían a las personas ante Dios.',
      'Libertad no es libertinaje (capítulos 5–6): ser libre de la Ley no significa vivir para el egoísmo, sino caminar guiados por el Espíritu y producir su fruto en el servicio mutuo.',
    ],
  },
  EPH: {
    book: 'EPH',
    fullTitle: 'Carta a los Efesios',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Fue escrita por Pablo durante su encarcelamiento (probablemente en Roma hacia los años 60–62 d. C.), en la misma etapa que Colosenses y Filemón, y enviada por medio de su colaborador Tíquico.',
    audienceAndOccasion:
      'Está dirigida a Éfeso y posiblemente concebida como carta circular para varias iglesias de Asia Menor. Más que responder a una herejía específica, invita a creyentes de origen gentil a contemplar la grandeza de su nueva identidad en Cristo y a preservar la unidad con sus hermanos judíos.',
    centralTheme:
      'El plan eterno de Dios es reunir todas las cosas bajo Cristo como cabeza, formando una sola humanidad reconciliada —su iglesia— llamada a vivir de manera digna de esa vocación.',
    readingKeys: [
      'Dos mitades equilibradas: los capítulos 1–3 describen lo que Dios hizo en Cristo (nuestra identidad); los capítulos 4–6 muestran cómo caminar en consecuencia (nuestra práctica).',
      'Palabras clave recurrentes: términos como «en Cristo», «gracia», «unidad» y «misterio» actúan como hilos conductores que conectan toda la carta.',
      'Del cielo al hogar: la carta aterriza las verdades más elevadas en el lenguaje diario, el matrimonio, la familia, el trabajo y la firmeza espiritual.',
    ],
  },
  PHP: {
    book: 'PHP',
    fullTitle: 'Carta a los Filipenses',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'Fue escrita por el apóstol Pablo (junto a Timoteo) desde prisión —muy probablemente en Roma alrededor de los años 61–62 d. C.— mientras aguardaba la resolución de su proceso ante el tribunal imperial.',
    audienceAndOccasion:
      'Está dirigida a la iglesia de Filipos, la primera comunidad que Pablo fundó en Europa (Hechos 16), con la que mantenía un vínculo de amistad excepcional. La congregación había enviado a Epafrodito con una ofrenda económica, y Pablo agradece el gesto mientras los anima frente a la oposición externa y ciertas tensiones internas.',
    centralTheme:
      'El gozo profundo e inquebrantable nace de centrar la vida en Cristo, imitando su humildad abnegada y descansando en la paz de Dios por encima de las circunstancias.',
    readingKeys: [
      'El himno de 2:5-11: uno de los textos cristológicos más antiguos de la iglesia, presentado como modelo de humildad práctica en la comunidad.',
      'Gozo desde la cárcel: a pesar de estar encadenado, los términos «gozo» y «alegrarse» atraviesan los cuatro capítulos de principio a fin.',
      'Cambiar el afán por oración (4:6-7): la paz de Dios actúa como una guardia protectora sobre la mente y el corazón.',
    ],
  },
  COL: {
    book: 'COL',
    fullTitle: 'Carta a los Colosenses',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'Fue escrita por Pablo desde prisión hacia los años 60–62 d. C. a una iglesia que no había fundado personalmente, sino que había nacido gracias al testimonio de su colaborador Epafras.',
    audienceAndOccasion:
      'En Colosas comenzaba a infiltrarse una mezcla de especulación filosófica, prácticas ascéticas estrictas, observancia de calendarios y veneración de poderes angélicos que sugería que Cristo no bastaba para alcanzar la plenitud espiritual.',
    centralTheme:
      'Cristo es suficiente y supremo sobre toda la creación y sobre todo poder invisible; en él habita toda la plenitud de Dios, y unidos a él los creyentes ya están completos.',
    readingKeys: [
      'El himno de la supremacía de Cristo (1:15-20): presenta a Jesús como imagen del Dios invisible, creador, sustentador y reconciliador del universo.',
      'Contra la espiritualidad de reglas vacías (capítulo 2): muestra por qué Cristo desarmó en la cruz toda sombra ritual y exigencia legalista.',
      'Vida resucitada aquí y ahora (capítulos 3–4): «buscar las cosas de arriba» se traduce en compasión, perdón, relaciones sanas y gratitud cotidiana.',
    ],
  },
  '1TH': {
    book: '1TH',
    fullTitle: 'Primera Carta a los Tesalonicenses',
    categoryLabel: 'Cartas Paulinas · 5 capítulos',
    authorAndDate:
      'Fue escrita por Pablo, Silvano y Timoteo desde Corinto alrededor de los años 50–51 d. C.; es probablemente el escrito más antiguo que se conserva del apóstol Pablo.',
    audienceAndOccasion:
      'Pablo había tenido que salir apresuradamente de Tesalónica tras apenas unas semanas de ministerio debido a la hostilidad local (Hechos 17). Preocupado por aquella joven iglesia, envió a Timoteo para comprobar cómo estaban y, al recibir buenas noticias sobre su firmeza, les escribe para consolarlos y aclarar qué sucede con los creyentes que fallecen antes del regreso de Jesús.',
    centralTheme:
      'La esperanza firme en el regreso de Cristo fortalece a la comunidad en medio de la aflicción y la impulsa a vivir en pureza, amor fraternal y trabajo responsable.',
    readingKeys: [
      'Afecto maternal y paternal (capítulo 2): observa el cuidado cercano, honesto y desinteresado con que Pablo describe su labor pastoral.',
      'Consuelo ante la muerte (4:13-18): la esperanza cristiana no niega el duelo, pero transforma la tristeza en certeza de resurrección y reencuentro.',
      'Fe, amor y esperanza (1:3; 5:8): esta tríada enmarca toda la carta y resume el carácter de una comunidad que espera al Señor.',
    ],
  },
  '2TH': {
    book: '2TH',
    fullTitle: 'Segunda Carta a los Tesalonicenses',
    categoryLabel: 'Cartas Paulinas · 3 capítulos',
    authorAndDate:
      'Fue escrita poco tiempo después de la primera carta, alrededor de los años 51–52 d. C., mientras Pablo seguía en Corinto.',
    audienceAndOccasion:
      'La persecución en Tesalónica se había intensificado y circulaba la idea errónea —incluso atribuida a supuestas cartas apostólicas— de que el «Día del Señor» ya había llegado. Algunos creyentes, convencidos de que el fin era inminente, habían dejado de trabajar y vivían a costa de los demás.',
    centralTheme:
      'Perseverar con sobriedad frente al engaño y la prueba, manteniendo firme la esperanza en la justicia venidera de Cristo sin descuidar el deber diario.',
    readingKeys: [
      'Equilibrio frente al sensacionalismo (capítulo 2): Pablo frena las especulaciones alarmistas señalando acontecimientos previos al regreso del Señor.',
      'Oración y fidelidad de Dios (3:1-5): pide que el mensaje avance sin obstáculos y recuerda que el Señor es fiel para fortalecer y proteger a los suyos.',
      'Ética del trabajo cotidiano (3:6-13): esperar al Señor implica hacer el bien con responsabilidad, constancia y sin ociosidad.',
    ],
  },
  '1TI': {
    book: '1TI',
    fullTitle: 'Primera Carta a Timoteo',
    categoryLabel: 'Cartas Paulinas · 6 capítulos',
    authorAndDate:
      'Forma parte de las llamadas «cartas pastorales», escritas por Pablo hacia mediados de los años 60 d. C., entre su primer encarcelamiento en Roma y su proceso final.',
    audienceAndOccasion:
      'Está dirigida a su colaborador más joven, Timoteo, a quien Pablo dejó encargado de supervisar las iglesias de Éfeso frente a líderes que desviaban la atención hacia mitos, genealogías estériles y disputas vanas.',
    centralTheme:
      'Ofrece instrucciones claras para cuidar la sana enseñanza, la vida de oración, la integridad del liderazgo y el orden cálido en la «casa de Dios».',
    readingKeys: [
      'La doctrina se mide por el amor (1:5): el propósito de la sana enseñanza es producir amor de corazón limpio, buena conciencia y fe sincera.',
      'Carácter antes que carisma (capítulo 3): los requisitos para ancianos y diáconos se centran en la madurez moral, el cuidado familiar y la hospitalidad.',
      'Piedad frente a la codicia (capítulo 6): presenta una advertencia lúcida sobre el peligro del amor al dinero y el valor de la verdadera riqueza y el contentamiento.',
    ],
  },
  '2TI': {
    book: '2TI',
    fullTitle: 'Segunda Carta a Timoteo',
    categoryLabel: 'Cartas Paulinas · 4 capítulos',
    authorAndDate:
      'Es la última carta conocida de Pablo, escrita desde una celda fría en Roma hacia los años 66–67 d. C., cuando muchos antiguos compañeros lo habían abandonado y sentía próxima su ejecución.',
    audienceAndOccasion:
      'Constituye el testamento espiritual más íntimo de Pablo, dirigido a Timoteo para animarlo a no avergonzarse del evangelio ni de un apóstol encadenado, a soportar las dificultades con valor y a viajar pronto a verlo antes del invierno.',
    centralTheme:
      'Mantener encendido el don recibido y transmitir fielmente la Palabra inspirada a nuevas generaciones, sabiendo que el mensaje de Dios nunca está encadenado.',
    readingKeys: [
      'Cadena de transmisión fiel (2:2): Pablo encarga a Timoteo confiar la enseñanza recibida a personas fieles que sean capaces de instruir a otros.',
      'Valor de toda la Escritura (3:14-17): recoge el pasaje clásico sobre la inspiración divina y la utilidad práctica de las Escrituras para enseñar y formar.',
      'Despedida serena (4:6-8): culmina con una confesión de paz y fidelidad: «He peleado la buena batalla, he acabado la carrera, he guardado la fe».',
    ],
  },
  TIT: {
    book: 'TIT',
    fullTitle: 'Carta a Tito',
    categoryLabel: 'Cartas Paulinas · 3 capítulos',
    authorAndDate:
      'Fue escrita por Pablo hacia mediados de los años 60 d. C. a Tito, colaborador gentil de confianza que ya había trabajado con éxito en Corinto.',
    audienceAndOccasion:
      'Tito había quedado en la isla de Creta —cuya cultura tenía fama en la antigüedad de conflictiva y engañosa— con la tarea de organizar las congregaciones recién formadas y nombrar líderes locales íntegros.',
    centralTheme:
      'La gracia salvadora de Dios educa al creyente para rechazar la impiedad y adornar la verdad del evangelio con buenas obras en medio de la sociedad.',
    readingKeys: [
      'Doctrina y carácter inseparables (capítulo 2): la fe verdadera siempre produce cambios observables en las familias, las relaciones y la vida comunitaria.',
      'La misericordia como raíz (3:4-7): Dios nos salvó no por obras justas que hubiéramos hecho, sino por su misericordia y la renovación del Espíritu.',
      'Rechazar discusiones estériles (3:9): exhorta a evitar controversias necias y divisiones para concentrarse en lo que edifica y beneficia a todos.',
    ],
  },
  PHM: {
    book: 'PHM',
    fullTitle: 'Carta a Filemón',
    categoryLabel: 'Cartas Paulinas · 1 capítulo',
    authorAndDate:
      'Es una carta breve y profundamente personal escrita por Pablo (junto con Timoteo) desde prisión hacia los años 60–62 d. C., enviada al mismo tiempo que la carta a los Colosenses.',
    audienceAndOccasion:
      'Está dirigida a Filemón, un creyente acomodado de Colosas en cuya casa se reunía la iglesia. Su esclavo fugitivo, Onésimo, había conocido a Pablo en prisión y se había convertido a Cristo; ahora Pablo lo envía de regreso intercediendo por él.',
    centralTheme:
      'El evangelio transforma desde adentro las estructuras sociales humanas: quien huyó como esclavo regresa para ser recibido como hermano amado en igualdad espiritual.',
    readingKeys: [
      'Juego de palabras con el nombre (v. 11): «Onésimo» significa «útil»; antes resultó inútil para Filemón, pero ahora en Cristo es verdaderamente útil para ambos.',
      'Tacto y generosidad apostólica (vv. 8–19): Pablo no impone su autoridad, sino que ruega por amor y se ofrece a pagar cualquier deuda («cárgalo a mi cuenta»).',
      'Dignidad humana transformada: ofrece un ejemplo temprano de cómo la fe en Cristo redefine el valor de cada persona sin recurrir a la violencia.',
    ],
  },
  HEB: {
    book: 'HEB',
    fullTitle: 'Carta a los Hebreos',
    categoryLabel: 'Cartas Universales · 13 capítulos',
    authorAndDate:
      'Fue escrita por un autor anónimo de extraordinaria cultura bíblica y de un griego elegante (en la antigüedad se propusieron nombres como Pablo, Bernabé, Apolos o Lucas). Se compuso probablemente antes del año 70 d. C., mientras el culto del templo de Jerusalén aún seguía en pie.',
    audienceAndOccasion:
      'Está dirigida a creyentes de trasfondo judío que, desgastados por el paso del tiempo, el rechazo social y la pérdida de bienes, sentían la tentación de volver a las prácticas visibles del judaísmo tradicional.',
    centralTheme:
      'Jesucristo es infinitamente superior a los ángeles, a Moisés, al sacerdocio levítico y a los sacrificios antiguos: su sacrificio único abrió un camino nuevo y vivo directamente ante Dios.',
    readingKeys: [
      'Palabra clave «mejor»: se repite a lo largo del libro para destacar un mejor pacto, mejores promesas y un mejor sacrificio en Cristo.',
      'Alternancia entre doctrina y advertencia: incluye cinco llamados serios a no retroceder, intercalados entre profundos pasajes sobre la obra de Cristo.',
      'La galería de la fe (capítulos 11–12): repasa el testimonio de los creyentes del Antiguo Testamento y culmina invitando a fijar la mirada en Jesús, autor y consumador de la fe (12:1-2).',
    ],
  },
  JAS: {
    book: 'JAS',
    fullTitle: 'Carta de Santiago',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'La tradición la atribuye a Santiago (Jacobo), hermano del Señor y líder respetado de la iglesia de Jerusalén. Es uno de los escritos más tempranos del Nuevo Testamento, probablemente redactado entre los años 45 y 60 d. C.',
    audienceAndOccasion:
      'Se dirige a «las doce tribus que están en la dispersión», creyentes judeocristianos esparcidos fuera de Judea que sufrían pobreza, presiones económicas de terratenientes y conflictos comunitarios.',
    centralTheme:
      'La sabiduría genuina y la fe verdadera nunca quedan en mera declaración verbal: se demuestran con integridad en las pruebas, justicia hacia el vulnerable, dominio del hablar y obras de amor.',
    readingKeys: [
      'Eco del Sermón del Monte: contiene más de veinte paralelos directos con las enseñanzas de Jesús en Mateo 5–7.',
      'Sabiduría práctica en estilo proverbial: emplea imágenes vívidas —como el espejo, el timón, el fuego, el manantial y el labrador paciente— para aterrizar la fe en la vida diaria.',
      'Fe y obras (2:14-26): no contradice a Pablo sobre cómo somos justificados ante Dios, sino que refuta una fe meramente intelectual que no socorre al necesitado.',
    ],
  },
  '1PE': {
    book: '1PE',
    fullTitle: 'Primera Carta de Pedro',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'Fue escrita por el apóstol Pedro con la colaboración de Silvano desde «Babilonia» (nombre simbólico de Roma) hacia los años 62–64 d. C.',
    audienceAndOccasion:
      'Es una carta circular enviada a iglesias en su mayoría gentiles dispersas por cinco provincias de Asia Menor (hoy Turquía), que comenzaban a experimentar calumnias, marginación y hostilidad cotidiana por no participar en las costumbres paganas.',
    centralTheme:
      'Sostenidos por una esperanza viva en la resurrección de Cristo, los creyentes viven en el mundo como peregrinos cuya conducta honorable y paciencia en el sufrimiento reflejan la santidad de Dios.',
    readingKeys: [
      'Identidad del pueblo de Dios (2:9-10): Pedro aplica a la iglesia los títulos del Sinaí («linaje escogido, real sacerdocio, nación santa»).',
      'Sufrimiento con propósito: distingue claramente entre sufrir por hacer el mal y sufrir injustamente siguiendo las huellas de Cristo.',
      'Ancla de esperanza: la gracia futura y la herencia incorruptible iluminan y dan sentido a las pruebas breves del presente.',
    ],
  },
  '2PE': {
    book: '2PE',
    fullTitle: 'Segunda Carta de Pedro',
    categoryLabel: 'Cartas Universales · 3 capítulos',
    authorAndDate:
      'Fue escrita como despedida final de Pedro sabiendo que su partida estaba cerca (1:14), hacia mediados o finales de los años 60 d. C.',
    audienceAndOccasion:
      'Está dirigida a las mismas comunidades de la primera carta ante el surgimiento de maestros falsos que justificaban la inmoralidad y se burlaban de la promesa del regreso de Cristo por su aparente tardanza.',
    centralTheme:
      'Crecer activamente en la gracia y el conocimiento de Jesucristo apoyados en la palabra profética segura, sin dejarse arrastrar por el error ni olvidar la paciencia de Dios.',
    readingKeys: [
      'Escala de virtudes (1:5-7): invita a sumar a la fe virtud, conocimiento, dominio propio, perseverancia, piedad, afecto fraternal y amor.',
      'Testigo ocular de la Transfiguración (1:16-18): apela a la majestad real de Cristo contemplada en el monte santo para confirmar que el mensaje no son fábulas.',
      'La paciencia de Dios (3:9): aclara que Dios no retarda su promesa por olvido o debilidad, sino dando tiempo para el arrepentimiento.',
    ],
  },
  '1JN': {
    book: '1JN',
    fullTitle: 'Primera Carta de Juan',
    categoryLabel: 'Cartas Universales · 5 capítulos',
    authorAndDate:
      'Fue escrita por el autor del cuarto Evangelio (el apóstol Juan) en Asia Menor hacia finales del siglo I, entre los años 85 y 95 d. C.',
    audienceAndOccasion:
      'Un grupo había abandonado la comunidad (2:19) negando que Jesús fuera verdaderamente el Cristo venido en carne real y tratando la ética moral con indiferencia. Juan escribe como un padre espiritual para devolver seguridad y gozo a quienes permanecieron fieles.',
    centralTheme:
      'Dios es luz y Dios es amor: la comunión real con él se verifica mediante tres pruebas inseparables: confesar al Hijo encarnado, obedecer sus mandamientos y amar visiblemente a los hermanos.',
    readingKeys: [
      'Estilo en espiral: en lugar de avanzar linealmente como Pablo, Juan vuelve reiteradamente sobre la luz, la vida, la verdad y el amor, profundizando en cada giro.',
      'Certeza serena: expresiones como «sabemos» y «hemos conocido» brindan estabilidad y seguridad frente a la confusión doctrinal.',
      'Amor comprobable (3:18): resume la ética cristiana con claridad directa: «no amemos de palabra ni de lengua, sino de hecho y en verdad».',
    ],
  },
  '2JN': {
    book: '2JN',
    fullTitle: 'Segunda Carta de Juan',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Fue escrita por «el anciano» (el apóstol Juan en su vejez) hacia los años 85–95 d. C., en el mismo contexto doctrinal que 1 Juan.',
    audienceAndOccasion:
      'Está dirigida a «la señora elegida y a sus hijos», expresión que muy probablemente designa con afecto a una iglesia local y a sus miembros. Advierte sobre predicadores itinerantes que negaban la encarnación real de Jesucristo y buscaban hospedaje y respaldo en las congregaciones.',
    centralTheme:
      'El amor cristiano genuino siempre camina unido a la verdad: acoger con discernimiento sin hacerse cómplice de enseñanzas que niegan a Cristo.',
    readingKeys: [
      'La carta más breve del Nuevo Testamento (13 versículos): sigue fielmente el formato epistolar de una sola hoja de papiro antigua.',
      'El mandamiento antiguo y nuevo (vv. 5–6): recuerda que el amor no es un mero sentimiento, sino caminar fielmente conforme a los mandamientos de Dios.',
      'Equilibrio entre verdad y amor (vv. 7–11): evita tanto la verdad fría sin amor como una tolerancia ingenua que destruya el fundamento cristológico.',
    ],
  },
  '3JN': {
    book: '3JN',
    fullTitle: 'Tercera Carta de Juan',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Fue escrita también por «el anciano» (el apóstol Juan) hacia finales del siglo I (años 85–95 d. C.) para atender un conflicto concreto en una comunidad local.',
    audienceAndOccasion:
      'Es una carta personal dirigida a un líder fiel llamado Gayo, elogiado por su hospitalidad hacia los misioneros itinerantes, en contraste con Diótrefes, quien buscaba preeminencia personal, rechazaba la autoridad apostólica y expulsaba a quienes recibían a los hermanos.',
    centralTheme:
      'Apoyar generosamente a quienes sirven a la verdad e imitar lo bueno frente al orgullo autoritario dentro de la iglesia.',
    readingKeys: [
      'Tres retratos humanos contrastados: la generosidad hospitalaria de Gayo, la ambición autoritaria de Diótrefes y el buen testimonio de Demetrio.',
      'Cooperadores con la verdad (v. 8): muestra cómo la hospitalidad cotidiana participa directamente de la misión del evangelio.',
      'Retrato vivo de la iglesia temprana: en apenas 15 versículos, deja ver con realismo cómo resolvían tensiones de liderazgo las comunidades del siglo I.',
    ],
  },
  JUD: {
    book: 'JUD',
    fullTitle: 'Carta de Judas',
    categoryLabel: 'Cartas Universales · 1 capítulo',
    authorAndDate:
      'Fue escrita por Judas, «siervo de Jesucristo y hermano de Santiago» (y por tanto medio hermano del Señor), probablemente entre los años 60 y 80 d. C.',
    audienceAndOccasion:
      'Judas planeaba escribir una carta serena sobre la salvación común, pero cambió de planes con urgencia al enterarse de que personas inescrupulosas se habían infiltrado convirtiendo la gracia de Dios en excusa para el libertinaje y despreciando el señorío de Cristo.',
    centralTheme:
      'Contender con firmeza por la fe apostólica entregada una vez por todas, edificándose en el amor de Dios y rescatando con misericordia a quienes dudan.',
    readingKeys: [
      'Tríadas memorables: Judas agrupa advertencias y ejemplos históricos del Antiguo Testamento de tres en tres para facilitar su recuerdo.',
      'Misericordia con discernimiento (vv. 22–23): enseña a tratar con compasión a quienes titubean, manteniendo cautela frente al contagio del pecado.',
      'La doxología final (vv. 24–25): cierra con una de las bendiciones más solemnes de la Biblia sobre el Dios poderoso para guardarnos sin caída.',
    ],
  },
  REV: {
    book: 'REV',
    fullTitle: 'Apocalipsis',
    categoryLabel: 'Profecía y Apocalíptica · 22 capítulos',
    authorAndDate:
      'Fue escrito por Juan mientras se encontraba desterrado en la isla de Patmos a causa de su testimonio (1:9), muy probablemente durante el reinado del emperador Domiciano hacia el año 95 d. C.',
    audienceAndOccasion:
      'Se envió como profecía y carta circular a siete iglesias concretas de Asia Menor (Éfeso, Esmirna, Pérgamo, Tiatira, Sardis, Filadelfia y Laodicea) que enfrentaban presión económica, culto imperial obligatorio, persecución y la tentación de acomodarse al entorno.',
    centralTheme:
      'Detrás del telón de los imperios humanos y las crisis de la historia, Dios reina en el trono y el Cordero inmolado ya ha vencido; su pueblo perseverante heredará cielos nuevos y tierra nueva.',
    readingKeys: [
      'Género simbólico: números (7, 12, 144.000), bestias, trompetas y colores funcionan como imágenes teológicas inspiradas en Daniel, Ezequiel e Isaías, no como códigos literales modernos.',
      'Las siete cartas (capítulos 2–3): revelan que la amenaza más peligrosa no siempre es la persecución externa, sino la tibieza interior.',
      'Adoración constante: cada escena de juicio está precedida por cantos celestiales que recuerdan quién gobierna realmente la historia.',
    ],
  },
};

export function getBookIntro(code: string): BookIntro | undefined {
  return NT_BOOK_INTROS[code.toUpperCase()];
}
