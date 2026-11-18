import * as fs from 'fs';
import * as path from 'path';

interface TranslatedRecord {
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string;
}

export const galatiansChapters1And2: TranslatedRecord[] = [
  // ==========================================
  // CAPÍTULO 1 (Versículos 1 al 24)
  // ==========================================
  {
    book: "GAL",
    chapter: 1,
    verse: 1,
    greek_text: "Παῦλος ἀπόστολος, οὐκ ἀπ’ ἀνθρώπων οὐδὲ δι’ ἀνθρώπου ἀλλὰ διὰ Ἰησοῦ Χριστοῦ καὶ θεοῦ πατρὸς τοῦ ἐγείραντος αὐτὸν ἐκ νεκρῶν,",
    translation: "Pablo, apóstol —no de parte de hombres ni por mediación de hombre alguno, sino por medio de Jesucristo y de Dios Padre que lo resucitó de entre los muertos—,",
    translation_notes: "Pablo inicia con una defensa inmediata y tajante de su autoridad apostólica (ἀπόστολος, apóstolos, enviado plenipotenciario). Emplea con precisión técnica dos preposiciones distintas: ἀπό (apó, que denota la fuente u origen último de su comisión, negando que provenga de una institución humana en plural, ἀπ’ ἀνθρώπων) y διά (diá, que señala el canal o agente mediador, negando cualquier designación humana individual, οὐδὲ δι’ ἀνθρώπου). El contraste con ἀλλὰ διὰ Ἰησοῦ Χριστοῦ coloca a Jesucristo en el mismo plano de autoridad que Dios Padre. El participio aoristo activo τοῦ ἐγείραντος (del que lo resucitó) fundamenta el apostolado paulino en la realidad cósmica de la resurrección, no en la tradición histórica prepascual."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 2,
    greek_text: "καὶ οἱ σὺν ἐμοὶ πάντες ἀδελφοί, ταῖς ἐκκλησίαις τῆς Γαλατίας·",
    translation: "y todos los hermanos que están conmigo, a las iglesias de Galacia:",
    translation_notes: "La mención colectiva 'todos los hermanos que están conmigo' (οἱ σὺν ἐμοὶ πάντες ἀδελφοί) busca demostrar respaldo corporativo ante los gálatas. El plural 'a las iglesias' (ταῖς ἐκκλησίαις) evidencia que se trata de una epístola circular dirigida a una región completa (sea el norte étnico céltico o las provincias del sur: Antioquía de Pisidia, Iconio, Listra y Derbe). Es notable la ausencia total del habitual exordio de agradecimiento o elogio (prooemium/eucharistō) que Pablo suele incluir en sus cartas, lo cual manifiesta una severa indignación retórica y urgencia teológica."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 3,
    greek_text: "χάρις ὑμῖν καὶ εἰρήνη ἀπὸ θεοῦ πατρὸς καὶ κυρίου ἡμῶν Ἰησοῦ Χριστοῦ,",
    translation: "Gracia a ustedes y paz de parte de Dios Padre y de nuestro Señor Jesucristo,",
    translation_notes: "Pablo combina y cristianiza las fórmulas de salutación grecorromana y semítica: transforma el secular 'chairein' (saludos) en 'charis' (χάρις, el favor inmerecido y poder redentor de Dios, concepto neurálgico de la epístola) y añade 'eirēnē' (εἰρήνη, traducción al koiné del hebreo shalom: bienestar y reconciliación integral pactual). Ambas bendiciones fluyen de una fuente indivisible: 'Dios Padre y nuestro Señor Jesucristo'."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 4,
    greek_text: "τοῦ δόντος ἑαυτὸν ὑπὲρ τῶν ἁμαρτιῶν ἡμῶν ὅπως ἐξέληται ἡμᾶς ἐκ τοῦ αἰῶνος τοῦ ἐνεστῶτος πονηροῦ κατὰ τὸ θέλημα τοῦ θεοῦ καὶ πατρὸς ἡμῶν,",
    translation: "quien se dio a sí mismo por nuestros pecados para librarnos de la presente era malvada, conforme a la voluntad de nuestro Dios y Padre,",
    translation_notes: "El participio aoristo activo τοῦ δόντος ἑαυτόν (quien se entregó a sí mismo) recalca la voluntariedad del sacrificio vicario en sustitución ('hyper', a favor de). El propósito se articula con ὅπως (hopōs) y el aoristo subjuntivo medio ἐξέληται (exēlētai, del verbo exaireō: rescatar, arrancar violentamente de un peligro o cautiverio). Pablo enmarca la redención no como un mero perdón forense individual, sino como una liberación escatológica de 'la presente era malvada' (τοῦ αἰῶνος τοῦ ἐνεστῶτος πονηροῦ), marcando la división apocalíptica del judaísmo del Segundo Templo entre la era presente (olam hazeh) y la era venidera (olam haba)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 5,
    greek_text: "ᾧ ἡ δόξα εἰς τοὺς αἰῶνας τῶν αἰώνων· ἀμήν.",
    translation: "a quien sea la gloria por los siglos de los siglos. Amén.",
    translation_notes: "Doxología conclusiva con el hebraísmo idiomático superlativo εἰς τοὺς αἰῶνας τῶν αἰώνων (lit. 'hacia las edades de las edades', por toda la eternidad). Culmina con la aclamación litúrgica 'Amén' (ἀμήν, firmeza, certeza y confirmación cúltica comunitaria)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 6,
    greek_text: "Θαυμάζω ὅτι οὕτως ταχέως μετατίθεσθε ἀπὸ τοῦ καλέσαντος ὑμᾶς ἐν χάριτι Χριστοῦ εἰς ἕτερον εὐαγγέλιον,",
    translation: "Me asombra que tan pronto se estén apartando de aquel que los llamó en la gracia de Cristo, para seguir un evangelio diferente,",
    translation_notes: "Pablo rompe la convención epistolar con el verbo de censura 'thaumazō' (θαυμάζω, me maravillo/estoy perplejo), fórmula retórica helenística de reprimenda judicial. El verbo μετατίθεσθε (metatithesthe) en presente indicativo medio es crítico: indica una apostasía o deserción militar que está ocurriendo en tiempo real ('se están transfiriendo / desertando'). El llamado ocurrió 'en la gracia' (ἐν χάριτι), y el giro es hacia 'un evangelio cualitativamente diferente' (εἰς ἕτερον εὐαγγέλιον, donde héteros denota distinción esencial de naturaleza, anticipando el versículo 7)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 7,
    greek_text: "ὃ οὐκ ἔστιν ἄλλο· εἰ μή τινές εἰσιν οἱ ταράσσοντες ὑμᾶς καὶ θέλοντες μεταστρέψαι τὸ εὐαγγέλιον τοῦ Χριστοῦ.",
    translation: "el cual no es otro evangelio, sino que hay algunos que los están perturbando a ustedes y quieren pervertir el evangelio de Cristo.",
    translation_notes: "Juego dialéctico sutil entre ἕτερον (héteron, v. 6: de otra especie) y ἄλλο (állo: otro de la misma clase): aclara que ese mensaje rival no es una alternativa válida, pues no existe más que un solo evangelio. Los adversarios son descritos con el participio presente οἱ ταράσσοντες (los que perturban, desestabilizan política y espiritualmente la comunidad) y θέλοντες μεταστρέψαι (quieren trastornar/invertir diametralmente, del verbo metastrefō, subvertir en su opuesto)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 8,
    greek_text: "ἀλλὰ καὶ ἐὰν ἡμεῖς ἢ ἄγγελος ἐξ οὐρανοῦ εὐαγγελίζηται ὑμῖν παρ’ ὃ εὐηγγελισάμεθα ὑμῖν, ἀνάθεμα ἔστω.",
    translation: "Pero aun si nosotros mismos o un ángel del cielo les anunciara un evangelio contrario al que les anunciamos, ¡sea anatema!",
    translation_notes: "Condicional de tercera clase (ἐὰν con subjuntivo) que plantea una hipótesis retórica máxima. La preposición παρά (pará) con acusativo tiene valor contrastivo ('contrario a', 'más allá de'). El término ἀνάθεμα (anáthema) es la equivalencia griega del hebreo ḥērem (séfer ḥērem): algo irrevocablemente entregado a la maldición y destrucción bajo el juicio divino, excluido por completo de la esfera de la alianza divina."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 9,
    greek_text: "ὡς προειρήκαμεν, καὶ ἄρτι πάλιν λέγω, εἴ τις ὑμᾶς εὐαγγελίζεται παρ’ ὃ παρελάβετε, ἀνάθεμα ἔστω.",
    translation: "Como ya lo hemos dicho antes, también ahora lo repito: si alguien les está anunciando un evangelio contrario al que recibieron, ¡sea anatema!",
    translation_notes: "Reiteración enfática bajo una condición de primera clase (εἰ con indicativo presente εὐαγγελίζεται), que asume la acción de los falsos maestros como un hecho real y presente en Galacia. El verbo παρελάβετε (parelabete, aoristo activo de paralambanō) es la terminología técnica semítica (qibbel) de la recepción formal de una tradición apostólica inalterable."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 10,
    greek_text: "Ἄρτι γὰρ ἀνθρώπους πείθω ἢ τὸν θεόν; ἢ ζητῶ ἀνθρώποις ἀρέσκειν; εἰ ἔτι ἀνθρώποις ἤρεσκον, Χριστοῦ δοῦλος οὐκ ἂν ἤμην.",
    translation: "¿Busco ahora convencer a los hombres, o a Dios? ¿O procuro agradar a los hombres? Si todavía estuviera tratando de agradar a los hombres, no sería siervo de Cristo.",
    translation_notes: "La partícula explicativa γάρ (gar) conecta este versículo con el anatema anterior: la severidad de su tono demuestra que no busca adulación pública. El verbo πείθω (peithō) en este contexto significa granjearse el favor o conciliarse a alguien. Concluye con una condición irreal del presente (εἰ con imperfecto ἤρεσκον y apódosis con ἄν y ἤμην): el término δοῦλος (doulos, esclavo) denota pertenencia exclusiva a un Señor soberano, incompatible con someter el mensaje a las expectativas de la clientela social."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 11,
    greek_text: "Γνωρίζω γὰρ ὑμῖν, ἀδελφοί, τὸ εὐαγγέλιον τὸ εὐαγγελισθὲν ὑπ’ ἐμοῦ ὅτι οὐκ ἔστιν κατὰ ἄνθρωπον·",
    translation: "Porque les hago saber, hermanos, que el evangelio que fue proclamado por mí no es de origen humano;",
    translation_notes: "Fórmula de revelación formal γνωρίζω ὑμῖν (hago saber a ustedes). La expresión οὐκ ἔστιν κατὰ ἄνθρωπον (no es según el hombre) utiliza la preposición κατά con acusativo para negar que el mensaje se rija por categorías, invención, intereses o patrones humanos culturales."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 12,
    greek_text: "οὐδὲ γὰρ ἐγὼ παρὰ ἀνθρώπου παρέλαβον αὐτό, οὔτε ἐδιδάχθην, ἀλλὰ δι’ ἀποκαλύψεως Ἰησοῦ Χριστοῦ.",
    translation: "pues yo ni lo recibí ni me fue enseñado por hombre alguno, sino por medio de una revelación de Jesucristo.",
    translation_notes: "El doble conector negativo οὐδὲ... οὔτε refuerza la absoluta independencia de su instrucción: no hubo transmisión rabínica tradicional (παρέλαβον, recibir tradición formal) ni catequesis pedagógica (ἐδιδάχθην, aoristo pasivo de didaskō). Su origen fue δι’ ἀποκαλύψεως Ἰησοῦ Χριστοῦ (mediante revelación de Jesucristo); el genitivo puede interpretarse como subjetivo (Jesucristo es el autor de la revelación en el camino a Damasco) u objetivo (Jesucristo es el contenido supremo revelado)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 13,
    greek_text: "Ἠκούσατε γὰρ τὴν ἐμὴν ἀναστροφήν ποτε ἐν τῷ Ἰουδαϊσμῷ, ὅτι καθ’ ὑπερβολὴν ἐδίωκον τὴν ἐκκλησίαν τοῦ θεοῦ καὶ ἐπόρθουν αὐτήν,",
    translation: "Porque ustedes han oído acerca de mi conducta en otro tiempo en el judaísmo, de cómo perseguía con furor desmedido a la iglesia de Dios y la asolaba;",
    translation_notes: "La palabra ἀναστροφή (anastrofē) designa el estilo de vida o conducta ética observable. 'Ἰουδαϊσμός' (Ioudaïsmós, judaísmo) aparece aquí por primera vez en el corpus paulino (procedente de 2 Macabeos 2:21; 8:1), no como denominación étnica neutral, sino como el celo partidista por el cumplimiento riguroso de la ley mosaica frente a la helenización. La locución adverbial καθ’ ὑπερβολήν expresa un grado extremo o desmedido. Los imperfectos ἐδίωκον (perseguía) y ἐπόρθουν (devastaba/asolaba, término militar usado para el saqueo de ciudades) denotan acciones continuadas y sistemáticas en el pasado."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 14,
    greek_text: "καὶ προέκοπτον ἐν τῷ Ἰουδαϊσμῷ ὑπὲρ πολλοὺς συνηλικιώτας ἐν τῷ γένει μου, περισσοτέρως ζηλωτὴς ὑπάρχων τῶν πατρικῶν μου παραδόσεων.",
    translation: "y aventajaba en el judaísmo a muchos de mis contemporáneos en mi nación, siendo mucho más celoso de las tradiciones de mis antepasados.",
    translation_notes: "El verbo προέκοπτον (proekopton, avanzaba, progresaba cortando camino hacia adelante) refleja una carrera rabínica de rápido ascenso frente a sus pares generacionales (συνηλικιώτας). El término ζηλωτής (zēlotēs, celoso) alude a la tradición piadosa veterotestamentaria de Fineas y Elías, un celo ardiente que justificaba la violencia defensiva por la pureza de la Torá y las 'tradiciones ancestrales' (πατρικῶν παραδόσεων, la Halajá oral transmitida por los fariseos)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 15,
    greek_text: "ὅτε δὲ εὐδόκησεν ὁ ἀφορίσας με ἐκ κοιλίας μητρός μου καὶ καλέσας διὰ τῆς χάριτος αὐτοῦ",
    translation: "Pero cuando agradó a Dios, quien me apartó desde el vientre de mi madre y me llamó mediante su gracia,",
    translation_notes: "La conjunción adversativa ὅτε δέ marca el punto de inflexión soberano de la historia de Pablo. El verbo εὐδόκησεν (agradó / tuvo a bien) expresa la determinación libre de la voluntad divina. Las frases 'me apartó desde el vientre de mi madre' (ὁ ἀφορίσας με ἐκ κοιλίας μητρός μου) y 'me llamó mediante su gracia' (καλέσας διὰ τῆς χάριτος αὐτοῦ) adoptan el lenguaje vocacional profético de Jeremías 1:5 y del Siervo de YHWH en Isaías 49:1-5, demostrando que su apostolado precedió a cualquier mérito derivado de su celo legal."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 16,
    greek_text: "ἀποκαλύψαι τὸν υἱὸν αὐτοῦ ἐν ἐμοὶ ἵνα εὐαγγελίζωμαι αὐτὸν ἐν τοῖς ἔθνεσιν, εὐθέως οὐ προσανεθέμην σαρκὶ καὶ αἵματι,",
    translation: "revelar a su Hijo en mí para que yo lo proclamara entre los gentiles, al instante no consulté con carne y sangre,",
    translation_notes: "El infinitivo ἀποκαλύψαι (apokalýpsai) revela el propósito divino: manifestar al Hijo 'en mí' (ἐν ἐμοί), lo que comprende tanto una iluminación interior y pneumática como una revelación que se encarna y transparenta en su propia vida. El fin es misionero: proclamarlo entre las naciones gentiles (ἐν τοῖς ἔθνεσιν). La respuesta fue inmediata (εὐθέως, eutheōs): οὐ προσανεθέμην (no acudí en consulta para buscar aprobación humana). La expresión 'carne y sangre' (σαρκὶ καὶ αἵματι) es un modismo hebraico (basar vadam) que subraya la debilidad, finitud y limitación moral del ser humano."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 17,
    greek_text: "οὐδὲ ἀνῆλθον εἰς Ἱεροσόλυμα πρὸς τοὺς πρὸ ἐμοῦ ἀποστόλους, ἀλλὰ ἀπῆλθον εἰς Ἀραβίαν, καὶ πάλιν ὑπέστρεψα εἰς Δαμασκόν.",
    translation: "ni subí a Jerusalén a los que eran apóstoles antes que yo, sino que fui a Arabia y volví de nuevo a Damasco.",
    translation_notes: "El viaje topográfico 'subir a Jerusalén' (ἀνῆλθον, anēlthon) se niega categóricamente para desmentir que Pablo hubiese recibido autorización jerárquica de los apóstoles originales. 'Arabia' hace referencia al reino nabateo al este del Jordán (gobernado por Aretas IV), un periodo de reflexión teológica y primera misión antes de regresar a Damasco."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 18,
    greek_text: "Ἔπειτα μετὰ ἔτη τρία ἀνῆλθον εἰς Ἱεροσόλυμα ἱστορῆσαι Κηφᾶν, καὶ ἐπέμεινα πρὸς αὐτὸν ἡμέρας δεκαπέντε·",
    translation: "Luego, después de tres años, subí a Jerusalén para conocer a Cefas, y permanecí con él quince días;",
    translation_notes: "El adverbio ἔπειτα (luego/después) marca la cronología: pasaron tres años enteros antes de su primer contacto con los líderes de Jerusalén. El infinitivo ἱστορῆσαι (historēsai, del verbo historeō) es de alta precisión técnica: denota visitar a una persona relevante con el fin de conocerla e inquirir información histórica (en calidad de testigo presencial de la vida y ministerio de Jesús), excluyendo toda connotación de rendición de cuentas o sumisión jurídica. Usa el nombre arameo original Κηφᾶς (Cefas, Roca). La corta duración de 'quince días' recalca que no hubo tiempo para un adoctrinamiento formativo extenso."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 19,
    greek_text: "ἕτερον δὲ τῶν ἀποστόλων οὐκ εἶδον, εἰ μὴ Ἰάκωβον τὸν ἀδελφὸν τοῦ κυρίου.",
    translation: "pero no vi a ningún otro de los apóstoles, sino únicamente a Jacobo, el hermano del Señor.",
    translation_notes: "La cláusula restrictiva εἰ μή (sino / a no ser) presenta a Jacobo (Santiago), 'el hermano del Señor' (figura de máximo peso en la comunidad de Jerusalén), a quien Pablo clasifica bajo el título amplio de apóstol en este contexto, insistiendo en la naturaleza mínima y no deliberativa de sus contactos iniciales."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 20,
    greek_text: "ἃ δὲ γράφω ὑμῖν, ἰδοὺ ἐνώπιον τοῦ θεοῦ ὅτι οὐ ψεύδομαι.",
    translation: "Y en esto que les escribo a ustedes, miren, delante de Dios testifico que no miento.",
    translation_notes: "Fórmula juramentada solemne con apelación a la presencia y omnisciencia divina (ἐνώπιον τοῦ θεοῦ, ante los ojos de Dios). La severidad de la fórmula subraya que los opositores judaizantes en Galacia habían difundido acusaciones directas de falsedad sobre el origen de su ministerio."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 21,
    greek_text: "ἔπειτα ἦλθον εἰς τὰ κλίματα τῆς Συρίας καὶ τῆς Κιλικίας.",
    translation: "Después fui a las regiones de Siria y de Cilicia;",
    translation_notes: "La palabra κλίματα (klímata) designa zonas geográficas o provincias romanas. Siria (con centro en Antioquía) y Cilicia (con centro en Tarso, su ciudad natal) representaban territorios gentiles alejados de la esfera de supervisión directa de las autoridades judeocristianas de Jerusalén."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 22,
    greek_text: "ἤμην δὲ ἀγνοούμενος τῷ προσώπῳ ταῖς ἐκκλησίαις τῆς Ἰουδαίας ταῖς ἐν Χριστῷ,",
    translation: "y personalmente no era conocido por las iglesias de Judea que están en Cristo;",
    translation_notes: "La construcción con el participio perifrástico imperfecto ἤμην ἀγνοούμενος con dativo de referencia τῷ προσώπῳ significa 'era desconocido en persona / de rostro'. La especificación teológica 'las iglesias de Judea que están en Cristo' (ταῖς ἐν Χριστῷ) las distingue de las sinagogas no cristianas de la provincia de Judea."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 23,
    greek_text: "μόνον δὲ ἀκούοντες ἦσαν ὅτι Ὁ διώκων ἡμᾶς ποτε νῦν εὐαγγελίζεται τὴν πίστιν ἥν ποτε ἐπόρθει,",
    translation: "únicamente oían decir: «El que en otro tiempo nos perseguía, ahora proclama como buena noticia la fe que en otro tiempo asolaba».",
    translation_notes: "La perífrasis ἀκούοντες ἦσαν (estaban oyendo continuamente) denota reportes reiterados que llegaban a las asambleas de Judea. 'La fe' (τὴν πίστιν) se emplea aquí en su sentido fides quae creditur: el contenido objetivo del evangelio de la gracia que antes intentaba erradicar violentamente (ἐπόρθει, imperfecto de acción continuada)."
  },
  {
    book: "GAL",
    chapter: 1,
    verse: 24,
    greek_text: "καὶ ἐδόξαζον ἐν ἐμοὶ τὸν θεόν.",
    translation: "Y glorificaban a Dios por causa de mí.",
    translation_notes: "El imperfecto ἐδόξαζον (edoxazon, estaban glorificando / continuaban dando gloria) resalta la actitud laudatoria continuada de las iglesias de Judea. La preposición ἐν con pronombre personal (ἐν ἐμοί) tiene sentido causal e instrumental: reconocían la soberana obra transformadora de la gracia de Dios en la persona de Pablo, en agudo contraste con la hostilidad de los judaizantes en Galacia."
  },

  // ==========================================
  // CAPÍTULO 2 (Versículos 1 al 21)
  // ==========================================
  {
    book: "GAL",
    chapter: 2,
    verse: 1,
    greek_text: "Ἔπειτα διὰ δεκατεσσάρων ἐτῶν πάλιν ἀνέβην εἰς Ἱεροσόλυμα μετὰ Βαρναβᾶ συμπαραλαβὼν καὶ Τίτον·",
    translation: "Luego, después de catorce años, subí de nuevo a Jerusalén con Bernabé, llevando también conmigo a Tito.",
    translation_notes: "La frase preposicional διὰ δεκατεσσάρων ἐτῶν (después del intervalo de catorce años) computa probablemente el tiempo transcurrido desde su conversión o desde su primera visita. Bernabé (levita chipriota respetado en Jerusalén) actúa como co-misionero, mientras que Tito, un creyente de origen enteramente gentil sin circuncidar, es llevado estratégicamente como caso testigo viviente de la legitimidad de la misión a las naciones."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 2,
    greek_text: "ἀνέβην δὲ κατὰ ἀποκάλυψιν· καὶ ἀνεθέμην αὐτοῖς τὸ εὐαγγέλιον ὃ κηρύσσω ἐν τοῖς ἔθνεσιν, κατ’ ἰδίαν δὲ τοῖς δοκοῦσιν, μή πως εἰς κενὸν τρέχω ἢ ἔδραμον.",
    translation: "Y subí conforme a una revelación; y les expuse el evangelio que proclamo entre los gentiles, pero en privado a los de mayor reputación, no fuera que de algún modo estuviera corriendo o hubiera corrido en vano.",
    translation_notes: "Pablo aclara que su viaje no fue por citación judicial de Jerusalén, sino κατὰ ἀποκάλυψιν (guiado por iniciativa y revelación divina). El verbo ἀνεθέμην (aoristo medio de anatithēmi) significa exponer o poner a consideración de colegas en igualdad, no pedir autorización. 'Los de reputación' (τοῖς δοκοῦσιν, los tenidos en alta estima) es una fórmula idiomática del griego helenístico para referirse a figuras dirigentes. La metáfora atlética 'correr en vano' (εἰς κενὸν τρέχω ἢ ἔδραμον) no refleja dudas teológicas personales sobre su mensaje, sino la preocupación pastoral y práctica de que una ruptura cismática provocada por los legalistas anulara la comunión y el fruto de su labor misionera."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 3,
    greek_text: "ἀλλ’ οὐδὲ Τίτος ὁ σὺν ἐμοί, Ἕλλην ὤν, ἠναγκάσθη περιτμηθῆναι·",
    translation: "Sin embargo, ni siquiera Tito, que estaba conmigo, siendo griego, fue obligado a circuncidarse;",
    translation_notes: "El hecho histórico decisivo: Tito, gentil incircunciso (Ἕλλην ὤν), no fue forzado (ἠναγκάσθη, aoristo pasivo de anankazō) a someterse a la circuncisión (περιτμηθῆναι) por los líderes apostólicos de Jerusalén. Este precedente invalida retrospectivamente la exigencia de los judaizantes en Galacia, quienes sostenían que los apóstoles pilares exigían la circuncisión como requisito de salvación para los gentiles."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 4,
    greek_text: "διὰ δὲ τοὺς παρεισάκτους ψευδαδέλφους, οἵτινες παρεισῆλθον κατασκοπῆσαι τὴν ἐλευθερίαν ἡμῶν ἣν ἔχομεν ἐν Χριστῷ Ἰησοῦ, ἵνα ἡμᾶς καταδουλώσουσιν—",
    translation: "y esto a causa de los falsos hermanos introducidos a escondidas, que se habían infiltrado para espiar la libertad que tenemos en Cristo Jesús, con el fin de esclavizarnos;",
    translation_notes: "Pablo emplea un vocabulario contundente de espionaje militar: παρείσακτοι (pareísaktoi, infiltrados clandestinamente de contrabando) y παρεισῆλθον (se deslizaron furtivamente como espías). Su misión era 'espiar' (κατασκοπῆσαι) la libertad cristiana (ἐλευθερία) frente al yugo ritual de la ley mosaica, con el objetivo explícito de 'esclavizarnos por completo' (ἵνα ἡμᾶς καταδουλώσουσιν, verbo compuesto intensivo que denota servidumbre forzosa bajo las ordenanzas legales)."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 5,
    greek_text: "οἷς οὐδὲ πρὸς ὥραν εἴξαμεν τῇ ὑποταγῇ, ἵνα ἡ ἀλήθεια τοῦ εὐαγγελίου διαμείνῃ πρὸς ὑμᾶς.",
    translation: "a los cuales ni por un momento cedimos en sumisión, para que la verdad del evangelio permaneciera firme con ustedes.",
    translation_notes: "La expresión idiomática οὐδὲ πρὸς ὥραν (ni por una hora / ni por un instante) enfatiza una resistencia inflexible ante las presiones legalistas. El rechazo a ceder en sumisión (τῇ ὑποταγῇ) tuvo un propósito de alcance universal: asegurar que 'la verdad del evangelio' (ἡ ἀλήθεια τοῦ εὐαγγελίου, la suficiencia plena de la obra de Cristo sin adición ritual) continuara intacta (διαμείνῃ, aoristo subjuntivo de permanencia continuada) para las comunidades gentiles."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 6,
    greek_text: "ἀπὸ δὲ τῶν δοκούντων εἶναί τι— ὁποῖοί ποτε ἦσαν οὐδέν μοι διαφέρει· πρόσωπον θεὸς ἀνθρώπου οὐ λαμβάνει— ἐμοὶ γὰρ οἱ δοκοῦντες οὐδὲν προσανέθεντο,",
    translation: "Y en cuanto a aquellos que tenían reputación de ser algo —lo que hayan sido en otro tiempo nada me importa; Dios no hace acepción de personas—, a mí, pues, los de reputación nada nuevo me añadieron.",
    translation_notes: "La sintaxis presenta un notable anacoluto (ruptura violenta de la estructura gramatical) provocada por el fervor retórico de Pablo al referirse a los dirigentes de Jerusalén (τῶν δοκούντων εἶναί τι). Inserta un paréntesis teológico: 'Dios no mira la apariencia externa del hombre' (πρόσωπον θεὸς ἀνθρώπου οὐ λαμβάνει, calco semítico del hebreo nasa panim, hacer favoritismo por títulos humanos o proximidad física previa a Jesús terrenal). Concluye afirmando que los líderes 'nada me impusieron ni añadieron' (οὐδὲν προσανέθεντο) a su predicación del evangelio."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 7,
    greek_text: "ἀλλὰ τοὐναντίον ἰδόντες ὅτι πεπίστευμαι τὸ εὐαγγέλιον τῆς ἀκροβυστίας καθὼς Πέτρος τῆς περιτομῆς,",
    translation: "Al contrario, al ver que me había sido encomendado el evangelio para los incircuncisos, tal como a Pedro el de los circuncidados",
    translation_notes: "El adverbio τοὐναντίον (al contrario) marca la aceptación positiva de su labor. El verbo πεπίστευμαι (perfecto pasivo de pisteuō, 'he sido confiado con / se me ha confiado') denota una mayordomía divina permanente. Se establecen dos esferas geográfico-culturales complementarias pero distintas: el evangelio de la incircuncisión (τῆς ἀκροβυστίας, gentiles) y el de la circuncisión (τῆς περιτομῆς, judíos); no son dos evangelios teológicamente distintos, sino el mismo evangelio proclamado a dos destinatarios culturales diversos."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 8,
    greek_text: "ὁ γὰρ ἐνεργήσας Πέτρῳ εἰς ἀποστολὴν τῆς περιτομῆς ἐνήργησεν καὶ ἐμοὶ εἰς τὰ ἔθνη,",
    translation: "(porque el que actuó eficazmente en Pedro para el apostolado de los circuncidados, actuó también en mí para con los gentiles),",
    translation_notes: "El verbo ἐνεργέω (energēō, operar con poder eficaz y sobrenatural) señala que Dios mismo fue la fuente dinámica que respaldó tanto el apostolado petrino entre los judíos como el ministerio paulino entre las naciones gentiles (εἰς τὰ ἔθνη), garantizando la paridad carismática y la autoridad mutua de ambos llamados."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 9,
    greek_text: "καὶ γνόντες τὴν χάριν τὴν δοθεῖσάν μοι, Ἰάκωβος καὶ Κηφᾶς καὶ Ἰωάννης, οἱ δοκοῦντες στῦλοι εἶναι, δεξιὰς ἔδωκαν ἐμοὶ καὶ Βαρναβᾷ κοινωνίας, ἵνα ἡμεῖς εἰς τὰ ἔθνη, αὐτοὶ δὲ εἰς τὴν περιτομήν·",
    translation: "y al reconocer la gracia que me había sido dada, Jacobo, Cefas y Juan, que eran considerados columnas, nos dieron a mí y a Bernabé la diestra de comunión, para que nosotros fuéramos a los gentiles y ellos a los circuncidados;",
    translation_notes: "Los tres pilares de Jerusalén son enumerados comenzando por Jacobo (Santiago, hermano de Jesús y líder principal de la iglesia local), seguido de Cefas (Pedro) y Juan. La metáfora de 'columnas' (στῦλοι, stýloi) alude al templo escatológico de la comunidad mesiánica. El gesto de 'dar la diestra de comunión' (δεξιὰς ἔδωκαν... κοινωνίας) era en la antigüedad helenística y semítica un pacto solemne de asociación fraterna entre iguales, reconociendo oficialmente la gracia (χάρις) concedida a Pablo y validando la división de campos misioneros sin subordinación jerárquica."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 10,
    greek_text: "μόνον τῶν πτωχῶν ἵνα μνημονεύωμεν, ὃ καὶ ἐσπούδασα αὐτὸ τοῦτο ποιῆσαι.",
    translation: "solamente nos pidieron que nos acordáramos de los pobres, lo cual procuré con diligencia hacer precisamente.",
    translation_notes: "El único acuerdo suplementario fue la solidaridad material con 'los pobres' (τῶν πτωχῶν), refiriéndose concretamente a los creyentes necesitados de la comunidad de Judea mediante la colecta ecuménica de las iglesias gentiles. El verbo ἐσπούδασα (aoristo activo de spoudazō: poner empeño diligente y celoso) demuestra el compromiso activo de Pablo por mantener los lazos de fraternidad material entre comunidades judías y gentiles."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 11,
    greek_text: "Ὅτε δὲ ἦλθεν Κηφᾶς εἰς Ἀντιόχειαν, κατὰ πρόσωπον αὐτῷ ἀντέστην, ὅτι κατεγνωσμένος ἦν·",
    translation: "Pero cuando Cefas vino a Antioquía, me opuse a él cara a cara, porque se había hecho digno de condenación.",
    translation_notes: "El famoso incidente de Antioquía: la confrontación pública entre los dos máximos apóstoles. La expresión κατὰ πρόσωπον αὐτῷ ἀντέστην ('me opuse a él frente a frente / cara a cara') es lenguaje judicial de contrademanda directa. La cláusula causal ὅτι κατεγνωσμένος ἦν emplea el participio perfecto pasivo de kataginōskō ('estaba auto-condenado' o 'era claramente reprensible'), indicando que la propia conducta contradictoria de Pedro lo juzgaba culpable."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 12,
    greek_text: "πρὸ τοῦ γὰρ ἐλθεῖν τινας ἀπὸ Ἰακώβου μετὰ τῶν ἐθνῶν συνήσθιεν· ὅτε δὲ ἦλθον, ὑπέστελλεν καὶ ἀφώριζεν ἑαυτόν, φοβούμενος τοὺς ἐκ περιτομῆς.",
    translation: "Porque antes de que vinieran algunos de parte de Jacobo, él comía con los gentiles; pero cuando llegaron, comenzó a retraerse y a apartarse a sí mismo, por temor a los de la circuncisión.",
    translation_notes: "Pedro practicaba inicialmente la comensalidad plena con creyentes gentiles (συνήσθιεν, imperfecto continuativo: 'comía habitualmente con ellos', ignorando las leyes dietéticas de separación rabínica). Con la llegada de emisarios estrictos vinculados al círculo de Jacobo en Jerusalén, se describe su claudicación mediante dos imperfectos de acción progresiva y paulatina: ὑπέστελλεν (retirarse tácticamente como tropas en repliegue) y ἀφώριζεν ἑαυτόν (segregarse a sí mismo, estableciendo barreras de pureza ritual). El motivo explícito fue el miedo social: φοβούμενος τοὺς ἐκ περιτομῆς (temiendo la desaprobación del partido de la circuncisión)."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 13,
    greek_text: "καὶ συνυπεκρίθησαν αὐτῷ καὶ οἱ λοιποὶ Ἰουδαῖοι, ὥστε καὶ Βαρναβᾶς συναπήχθη αὐτῶν τῇ ὑποκρίσει.",
    translation: "Y los demás judíos se unieron a él en su simulación, de tal manera que aun Bernabé fue arrastrado por la hipocresía de ellos.",
    translation_notes: "El impacto contagioso de la conducta de Pedro: συνυπεκρίθησαν (aoristo de synypokrinomai, unirse en el fingimiento o en el papel actoral). El término ὑπόκρισις (hypókrisis) en griego clásico y koiné alude al papel de un actor que usa máscara en el teatro, disimulando sus convicciones reales por conveniencia circunstancial. El dolor de Pablo alcanza su clímax al constatar que incluso su fiel compañero Bernabé 'fue arrastrado' (συναπήχθη, aoristo pasivo de synapagō: ser llevado en la misma corriente) por esa incoherencia práctica."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 14,
    greek_text: "ἀλλ’ ὅτε εἶδον ὅτι οὐκ ὀρθοποδοῦσιν πρὸς τὴν ἀλήθειαν τοῦ εὐαγγελίου, εἶπον τῷ Κηφᾷ ἔμπροσθεν πάντων· Εἰ σὺ Ἰουδαῖος ὑπάρχων ἐθνικῶς καὶ οὐκ Ἰουδαϊκῶς ζῇς, πῶς τὰ ἔθνη ἀναγκάζεις Ἰουδαΐζειν;",
    translation: "Pero cuando vi que no andaban rectamente conforme a la verdad del evangelio, le dije a Cefas delante de todos: «Si tú, siendo judío, vives como los gentiles y no como los judíos, ¿por qué obligas a los gentiles a judaizar?».",
    translation_notes: "El verbo ὀρθοποδέω (orthopodeō) es un término excepcional en el Nuevo Testamento que combina 'orthos' (recto) y 'pous' (pie): caminar en línea recta, actuar con integridad ética e ideológica alineada 'con la verdad del evangelio'. La reprensión fue pública (ἔμπροσθεν πάντων) porque el pecado de desunión había sido público. La contradicción de Pedro era flagrante: habiendo abandonado personalmente las restricciones dietéticas judías (ἐθνικῶς ζῇς), su aislamiento forzaba tácitamente a los gentiles a 'judaizar' (Ἰουδαΐζειν, adoptar el estilo de vida de la Torá ritual) si querían mantener comunión de mesa con los judeocristianos."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 15,
    greek_text: "Ἡμεῖς φύσει Ἰουδαῖοι καὶ οὐκ ἐξ ἐθνῶν ἁμαρτωλοί,",
    translation: "Nosotros somos judíos de nacimiento y no pecadores salidos de entre los gentiles;",
    translation_notes: "Pablo inicia aquí su discurso fundacional sobre la justificación, partiendo del terreno común con Pedro. 'Judíos por naturaleza/nacimiento' (φύσει Ἰουδαῖοι) define el estatus de pertenencia heredada al pueblo del pacto de Israel, en contraste con los gentiles calificados estereotípicamente como 'pecadores' (ἁμαρτωλοί) en el lenguaje rabínico debido a su ignorancia de la Torá y su idolatría."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 16,
    greek_text: "εἰδότες δὲ ὅτι οὐ δικαιοῦται ἄνθρωπος ἐξ ἔργων νόμου ἐὰν μὴ διὰ πίστεως Ἰησοῦ Χριστοῦ, καὶ ἡμεῖς εἰς Χριστὸν Ἰησοῦν ἐπιστεύσαμεν, ἵνα δικαιωθῶμεν ἐκ πίστεως Χριστοῦ καὶ οὐκ ἐξ ἔργων νόμου, ὅτι ἐξ ἔργων νόμου οὐ δικαιωθήσεται πᾶσα σάρξ.",
    translation: "sabiendo, sin embargo, que el hombre no es justificado por las obras de la ley, sino mediante la fe en Jesucristo, también nosotros hemos creído en Cristo Jesús, para ser justificados por la fe en Cristo y no por las obras de la ley; puesto que por las obras de la ley nadie será justificado.",
    translation_notes: "El versículo teológico cumbre de la carta, donde confluyen los conceptos cardinales de Pablo. 1) 'Justificar' (δικαιόω, dikaioō): término forense que significa ser declarado justo, vindicado o absuelto en el tribunal de Dios y reconocido como miembro fiel de su pacto. 2) 'Obras de la ley' (ἐξ ἔργων νόμου, ex ergōn nomou): se corresponde con el término hebreo técnico hallado en los rollos de Qumrán (4QMMT, miqtsat ma'ase ha-torah), designando los preceptos de la Torá mosaica que funcionaban como marcadores identitarios de separación comunitaria judía (especialmente circuncisión, kashrut y observancia de fiestas/sábados). 3) 'Fe en/de Jesucristo' (διὰ πίστεως Ἰησοῦ Χριστοῦ): la construcción en genitivo admite tanto la lectura tradicional objetiva ('fe dirigida a Jesucristo') como la lectura de la Nueva Perspectiva ('la fidelidad sacrificial desplegada por Jesucristo'). 4) Concluye citando con solemnidad el Salmo 143:2 con la fórmula universal semítica 'toda carne' (πᾶσα σάρξ): ante el tribunal de Dios, ninguna criatura humana puede alcanzar la justicia relacional mediante el cumplimiento del código de la ley."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 17,
    greek_text: "εἰ δὲ ζητοῦντες δικαιωθῆναι ἐν Χριστῷ εὑρέθημεν καὶ αὐτοὶ ἁμαρτωλοί, ἆρα Χριστὸς ἁμαρτίας διάκονος; μὴ γένοιτο·",
    translation: "Y si, buscando ser justificados en Cristo, también nosotros mismos fuimos hallados pecadores, ¿es acaso Cristo servidor del pecado? ¡De ninguna manera!",
    translation_notes: "Pablo refuta una objeción recurrente de los adversarios: si los judíos creyentes abandonan la estricta observancia de la ley para sentarse a la mesa con gentiles y son considerados 'pecadores' por los legalistas, ¿acaso Cristo fomenta el pecado? La respuesta es la enérgica negación idiomática μὴ γένοιτο (mē génoito, optativo de repulsión moral: '¡lejos esté!', '¡de ningún modo!'). Cristo no es ministro (διάκονος) del pecado al eliminar las barreras de pureza ceremonial."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 18,
    greek_text: "εἰ γὰρ ἃ κατέλυσα ταῦτα πάλιν οἰκοδομῶ, παραβάτην ἐμαυτὸν συνιστάνω.",
    translation: "Porque si las cosas que destruí, estas mismas vuelvo a edificar, a mí mismo me constituyo transgresor.",
    translation_notes: "Argumento ad hominem demoledor dirigido a la conducta de Pedro en Antioquía: la verdadera transgresión (παραβάτης) no consiste en haber derribado las barreras legales divisorias entre judíos y gentiles, sino en volver a levantarlas (οἰκοδομῶ, edificar de nuevo lo que se demolió), violando la ley de la fe y el propósito cumplido de Cristo."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 19,
    greek_text: "ἐγὼ γὰρ διὰ νόμου νόμῳ ἀπέθανον ἵνα θεῷ ζήσω· Χριστῷ συνεσταύρωμαι·",
    translation: "Porque yo, mediante la ley, morí a la ley a fin de vivir para Dios. Con Cristo he sido crucificado;",
    translation_notes: "Paradoja de profunda densidad teológica: 'mediante la ley morí a la ley' (διὰ νόμου νόμῳ ἀπέθανον). La propia ley, al pronunciar su sentencia de muerte sobre el transgresor y encontrar su clímax en la crucifixión del Mesías (cf. Gálatas 3:13), agota su jurisdicción y finiquita su dominio sobre el creyente. La finalidad es positiva y vital: 'a fin de vivir para Dios' (ἵνα θεῷ ζήσω). Se añade la impactante declaración con el verbo en perfecto pasivo συνεσταύρωμαι (synestaúrōmai): la crucifixión con Cristo es un hecho histórico definitivo cuyos efectos permanecen ontológicamente activos en el presente del creyente."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 20,
    greek_text: "ζῶ δὲ οὐκέτι ἐγώ, ζῇ δὲ ἐν ἐμοὶ Χριστός· ὃ δὲ νῦν ζῶ ἐν σαρκί, ἐν πίστει ζῶ τῇ τοῦ υἱοῦ τοῦ θεοῦ τοῦ ἀγαπήσαντός με καὶ παραδόντος ἑαυτὸν ὑπὲρ ἐμοῦ.",
    translation: "y ya no vivo yo, sino que Cristo vive en mí; y la vida que ahora vivo en la carne, la vivo en la fe del Hijo de Dios, quien me amó y se entregó a sí mismo por mí.",
    translation_notes: "Cúspide de la teología mística y existencial paulina: desplazamiento radical del ego autónomo ('ya no vivo yo', ζῶ δὲ οὐκέτι ἐγώ), sustituido por la presencia viva e interior del Resucitado ('Cristo vive en mí', ζῇ δὲ ἐν ἐμοὶ Χριστός). La existencia histórica en el cuerpo presente ('en la carne', ἐν σαρκί, como realidad terrenal y caduca) se desenvuelve ahora 'en la fe del Hijo de Dios' (ἐν πίστει τῇ τοῦ υἱοῦ τοῦ θεοῦ). Los participios aoristos τοῦ ἀγαπήσαντός με (quien me amó) y παραδόντος ἑαυτόν (se entregó a sí mismo a favor de mí) anclan esta fe en el acto histórico consumado de amor sacrificial vicario."
  },
  {
    book: "GAL",
    chapter: 2,
    verse: 21,
    greek_text: "οὐκ ἀθετῶ τὴν χάριν τοῦ θεοῦ· εἰ γὰρ διὰ νόμου δικαιοσύνη, ἄρα Χριστὸς δωρεὰν ἀπέθανεν.",
    translation: "No desecho la gracia de Dios; porque si la justicia fuera por medio de la ley, entonces Cristo murió en vano.",
    translation_notes: "Conclusión categórica del debate: el verbo ἀθετέω (athetéō) significa repudiar, anular o declarar nulo un decreto legal o alianza; insistir en la ley como vía de salvación equivale a tratar la gracia de Dios como irrelevante. Si la justicia (δικαιοσύνη, dikaiosynē, el estatus vindicado ante Dios) se obtuviera a través del cumplimiento de la ley (διὰ νόμου), se seguiría la consecuencia lógica absurda de que la muerte redentora de Cristo fue gratuita, superflua e inútil (δωρεάν, dōreán: sin causa, sin fruto, en vano)."
  }
];

const outputPath = path.resolve(process.cwd(), 'data/GAL_translated.json');
fs.writeFileSync(outputPath, JSON.stringify(galatiansChapters1And2, null, 2), 'utf-8');
console.log(`✅ Archivo generado: ${outputPath}`);
console.log(`📊 Versículos traducidos con análisis filológico profundo: ${galatiansChapters1And2.length}`);
