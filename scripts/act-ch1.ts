export interface TranslatedRecord {
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string;
}

export const actsChapter1: TranslatedRecord[] = [
  {
    book: "ACT",
    chapter: 1,
    verse: 1,
    greek_text: "Τὸν μὲν πρῶτον λόγον ἐποιησάμην περὶ πάντων, ὦ Θεόφιλε, ὧν ἤρξατο ὁ Ἰησοῦς ποιεῖν τε καὶ διδάσκειν",
    translation: "En mi primer tratado, oh Teófilo, escribí acerca de todas las cosas que Jesús comenzó a hacer y a enseñar,",
    translation_notes: "Lucas inaugura la obra con un proemio literario propio de la historiografía grecorromana culta (análogo a Polibio o Josefo). La partícula men (Τὸν μὲν πρῶτον λόγον) remite al volumen precedente, el Evangelio de Lucas; el sustantivo λόγος (logos) se emplea aquí en el sentido técnico de 'tratado' o 'rollo de papiro'. El destinatario Θεόφιλος (Teófilo, 'amigo de Dios' o 'amado por Dios') es tratado con el vocativo formal ὦ; en Lc 1:3 recibió el título honorífico κράτιστε ('excelentísimo'), propio de un équite o magistrado imperial de alto rango. El uso correlativo de τε καὶ (ποιεῖν τε καὶ διδάσκειν) enfatiza que en Jesús las obras milagrosas y la enseñanza doctrinal constituyeron una unidad indisociable."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 2,
    greek_text: "ἄχρι ἧς ἡμέρας ἐντειλάμενος τοῖς ἀποστόλοις διὰ πνεύματος ἁγίου οὓς ἐξελέξατο ἀνελήμφθη·",
    translation: "hasta el día en que fue llevado arriba al cielo, después de haber dado instrucciones, por medio del Espíritu Santo, a los apóstoles que había escogido;",
    translation_notes: "La cronología del primer tratado culmina en la ascensión: el verbo ἀνελήμφθη (aoristo pasivo de analambanō) es un pasivo divino que indica la exaltación gloriosa de Jesús al trono celestial por el poder del Padre. El participio aoristo medio ἐντειλάμενος señala mandatos formales y vinculantes impartidos antes de su partida. Lucas subraya que la comisión de Jesús a sus apóstoles se realizó διὰ πνεύματος ἁγίου (por medio del Espíritu Santo), consagrando la continuidad entre el ministerio terrenal de Jesús y la misión apostólica."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 3,
    greek_text: "οἷς καὶ παρέστησεν ἑαυτὸν ζῶντα μετὰ τὸ παθεῖν αὐτὸν ἐν πολλοῖς τεκμηρίοις, δι’ ἡμερῶν τεσσεράκοντα ὀπτανόμενος αὐτοῖς καὶ λέγων τὰ περὶ τῆς βασιλείας τοῦ θεοῦ·",
    translation: "a quienes también se presentó vivo después de haber padecido, con muchas pruebas concluyentes, apareciéndoseles a lo largo de cuarenta días y hablándoles acerca del reino de Dios.",
    translation_notes: "Lucas utiliza un vocabulario de máxima precisión jurídica y probatoria: el sustantivo τεκμήριον (tekmērion) es un tecnicismo de la lógica aristotélica (Retórica 1357b) y de la medicina griega que designa una prueba demostrativa irrebatible o evidencia irrefutable (en contraste con un mero indicio, sēmeion). El participio presente ὀπτανόμενος sugiere apariciones intermitentes y pedagógicas a lo largo de cuarenta días (δι’ ἡμερῶν τεσσεράκοντα), período tipológico bíblico de preparación solemne. El eje doctrinal de sus instrucciones pospascuales fue 'el reino de Dios' (τῆς βασιλείας τοῦ θεοῦ), temática que enmarca toda la obra lucana (cf. Hch 28:31)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 4,
    greek_text: "καὶ συναλιζόμενος παρήγγειλεν αὐτοῖς ἀπὸ Ἱεροσολύμων μὴ χωρίζεσθαι, ἀλλὰ περιμένειν τὴν ἐπαγγελίαν τοῦ πατρὸς ἣν ἠκούσατέ μου·",
    translation: "Y mientras estaba comiendo con ellos, les ordenó que no se apartaran de Jerusalén, sino que esperaran la promesa del Padre, «la cual —les dijo— oyeron de mí;",
    translation_notes: "El participio deponente συναλιζόμενος (synalizomenos) proviene etimológicamente de ἅλς (hals, sal), significando compartir la mesa y la sal, o reunirse en asamblea fraterna; ratifica la corporeidad indiscutible de Jesús resucitado al comer con sus discípulos. El verbo παρήγγειλεν (mandato militar o edicto legal) prohíbe el éxodo de Jerusalén: la ciudad santa del templo y de la crucifixión debe ser necesariamente el punto de partida teológico de la redención escatológica. La 'promesa del Padre' (τὴν ἐπαγγελίαν τοῦ πατρός) alude al don prometido del Espíritu Santo (cf. Lc 24:49)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 5,
    greek_text: "ὅτι Ἰωάννης μὲν ἐβάπτισεν ὕδατι, ὑμεῖς δὲ ἐν πνεύματι βαπτισθήσεσθε ἁγίῳ οὐ μετὰ πολλὰς ταύτας ἡμέρας.",
    translation: "porque Juan ciertamente bautizó con agua, pero ustedes serán bautizados en el Espíritu Santo dentro de no muchos días».",
    translation_notes: "Contraste histórico-salvífico entre el ministerio preparatorio de Juan y el de Jesús mediante la antítesis μὲν... δέ. Frente al bautismo purificador exterior con agua (ὕδατι, dativo instrumental), Jesús profetiza una inmersión plena y transformadora ἐν πνεύματι ἁγίῳ (en el Espíritu Santo). La locución temporal οὐ μετὰ πολλὰς ταύτας ἡμέρας (literalmente: 'no después de estos muchos días', litote idiomática griega) anuncia la inminencia absoluta de Pentecostés."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 6,
    greek_text: "Οἱ μὲν οὖν συνελθόντες ἠρώτων αὐτὸν λέγοντες· Κύριε, εἰ ἐν τῷ χρόνῳ τούτῳ ἀποκαθιστάνεις τὴν βασιλείαν τῷ Ἰσραήλ;",
    translation: "Entonces los que se habían reunido le preguntaban, diciendo: «Señor, ¿es en este tiempo cuando vas a restaurar el reino para Israel?».",
    translation_notes: "La partícula conjuntiva inferencial μὲν οὖν introduce el diálogo definitivo de la asamblea apostólica con el Señor resucitado. El verbo ἀποκαθιστάνεις (presente con valor incoativo o futuro inmediato de apokathistēmi) expresa la esperanza escatológica judía tradicional: el restablecimiento de la soberanía teocrática nacional de Israel libre de la ocupación militar de Roma. Los apóstoles aún concebían el reino mesiánico en categorías sociopolíticas y geográficas davídicas."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 7,
    greek_text: "εἶπεν δὲ πρὸς αὐτούς· Οὐχ ὑμῶν ἐστιν γνῶναι χρόνους ἢ καιροὺς οὓς ὁ πατὴρ ἔθετο ἐν τῇ ἰδίᾳ ἐξουσίᾳ,",
    translation: "Él les dijo: «No les corresponde a ustedes conocer los tiempos o las ocasiones que el Padre fijó con su propia autoridad;",
    translation_notes: "Jesús corrige la curiosidad apocalíptica trazando una célebre distinción léxica entre dos conceptos temporales griegos: 1) χρόνοι (chronoi), lapsos de tiempo medibles cuantitativamente, eras o períodos cronológicos en su extensión; 2) καιροί (kairoi), momentos oportunos, coyunturas decisivas o hitos cualitativos fijados soberanamente por Dios en la historia. El sustantivo ἐξουσία (exousia) denota el derecho legal soberano, autoridad jurisdiccional que el Padre se reserva de forma exclusiva sin delegar su cómputo a las criaturas."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 8,
    greek_text: "ἀλλὰ λήμψεσθε δύναμιν ἐπελθόντος τοῦ ἁγίου πνεύματος ἐφ’ ὑμᾶς, καὶ ἔσεσθέ μου μάρτυρες ἔν τε Ἰερουσαλὴμ καὶ ἐν πάσῃ τῇ Ἰουδαίᾳ καὶ Σαμαρείᾳ καὶ ἕως ἐσχάτου τῆς γῆς.",
    translation: "pero recibirán poder cuando el Espíritu Santo haya venido sobre ustedes, y serán mis testigos tanto en Jerusalén como en toda Judea y Samaria, y hasta los confines de la tierra».",
    translation_notes: "El versículo temático y programático que estructura el mapa narrativo de todo el libro de Hechos. El término δύναμις (dynamis) designa la potencia eficaz, inherente y sobrenatural de Dios conferida mediante la teofanía del Espíritu (ἐπελθόντος, participio aoristo en genitivo absoluto). El vocablo μάρτυς (martys, 'testigo') adquiere su dimensión técnica lucana: aquellos que han visto los hechos históricos y dan testimonio fáctico y fiduciario de la resurrección, aun a costa de su propia vida corporal. La expansión geográfica concéntrica marca las fases de la narración: 1) Jerusalén (caps. 1-7); 2) Judea y Samaria (caps. 8-12); 3) Hasta los confines de la tierra (ἕως ἐσχάτου τῆς γῆς, alusión a Isaías 49:6, culminando con la llegada del evangelio al corazón del Imperio Romano en Roma, caps. 13-28)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 9,
    greek_text: "καὶ ταῦτα εἰπὼν βλεπόντων αὐτῶν ἐπήρθη, καὶ νεφέλη ὑπέλαβεν αὐτὸν ἀπὸ τῶν ὀφθαλμῶν αὐτῶν.",
    translation: "Y habiendo dicho estas cosas, mientras ellos miraban, fue elevado a lo alto, y una nube lo envolvió, ocultándolo de sus ojos.",
    translation_notes: "El relato histórico de la Ascensión física: el genitivo absoluto βλεπόντων αὐτῶν recalca el carácter presencial y empírico del evento. El verbo en pasivo divino ἐπήρθη (aoristo pasivo de epairō) subraya la acción soberana de Dios Padre que lo exalta a su trono. La 'nube' (νεφέλη) no es una simple masa de vapor meteorológica, sino la nube teofánica de la gloria divina (la Shejiná hebrea, análoga a la nube que cubría el tabernáculo en Éx 40:34 o la teofanía de Daniel 7:13). El verbo ὑπολαμβάνω denota acoger por debajo y retirar del alcance de la visión."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 10,
    greek_text: "καὶ ὡς ἀτενίζοντες ἦσαν εἰς τὸν οὐρανὸν πορευομένου αὐτοῦ, καὶ ἰδοὺ ἄνδρες δύο παρειστήκεισαν αὐτοῖς ἐν ἐσθήσεσι λευκαῖς,",
    translation: "Y mientras tenían los ojos fijos en el cielo, viendo cómo él se iba, he aquí, dos varones con vestiduras blancas se pusieron junto a ellos,",
    translation_notes: "El verbo ἀτενίζω (atenizō, mirar fijamente con asombro o atención absorta) es un vocablo característico de Lucas (usado 12 veces en Hechos y 2 en su evangelio). La construcción perifrástica de imperfecto (ἀτενίζοντες ἦσαν) capta la mirada estática y atónita de los discípulos. Los 'dos varones en vestiduras blancas' (ἐν ἐσθήσεσι λευκαῖς) representan mensajeros celestiales de Dios (cf. Lc 24:4), cumpliendo el principio probatorio judío del testimonio fidedigno de dos testigos presenciales (Dt 19:15)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 11,
    greek_text: "οἳ καὶ εἶπαν· Ἄνδρες Γαλιλαῖοι, τί ἑστήκατε βλέποντες εἰς τὸν οὐρανόν; οὗτος ὁ Ἰησοῦς ὁ ἀναλημφθεὶς ἀφ’ ὑμῶν εἰς τὸν οὐρανὸν οὕτως ἐλεύσεται ὃν τρόπον ἐθεάσασθε αὐτὸν πορευόμενον εἰς τὸν οὐρανόν.",
    translation: "los cuales también dijeron: «Varones galileos, ¿por qué están ahí de pie mirando al cielo? Este mismo Jesús, que ha sido llevado de entre ustedes hacia el cielo, vendrá de la misma manera en que lo han visto irse al cielo».",
    translation_notes: "El apelativo geográfico 'Varones galileos' (Ἄνδρες Γαλιλαῖοι) identifica el origen provincial de los discípulos antes de ser transformados en embajadores universales. El oráculo angélico fundamenta la escatología neotestamentaria de la Parusía: el regreso de Jesús será personal, corporal, visible y glorioso ('de la misma manera', οὕτως... ὃν τρόπον), en contraste con cualquier interpretación puramente alegórica de su venida."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 12,
    greek_text: "Τότε ὑπέστρεψαν εἰς Ἰερουσαλὴμ ἀπὸ ὄρους τοῦ καλουμένου Ἐλαιῶνος, ὅ ἐστιν ἐγγὺς Ἰερουσαλὴμ σαββάτου ἔχον ὁδόν.",
    translation: "Entonces regresaron a Jerusalén desde el monte llamado de los Olivos, el cual está cerca de Jerusalén, a distancia de camino de un día de reposo.",
    translation_notes: "El monte de los Olivos (Ἐλαιών, Elaion, olivar) se ubicaba al este del valle del Cedrón. Lucas añade una precisión topográfica y legal judía: σαββάτου ἔχον ὁδόν ('distancia del camino de un sábado'). Según la halajá rabínica basada en Josué 3:4 y Éxodo 16:29, el límite legal de desplazamiento en Shabat era de 2.000 codos (aproximadamente entre 900 y 1.000 metros), lo que confirma la estricta cercanía del monte a los muros de la ciudad."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 13,
    greek_text: "καὶ ὅτε εἰσῆλθον, εἰς τὸ ὑπερῷον ἀνέβησαν οὗ ἦσαν καταμένοντες, ὅ τε Πέτρος καὶ Ἰωάννης καὶ Ἰάκωβος καὶ Ἀνδρέας, Φίλιππος καὶ Θωμᾶς, Βαρθολομαῖος καὶ Μαθθαῖος, Ἰάκωβος Ἀλφαίου καὶ Σίμων ὁ ζηλωτὴς καὶ Ἰούδας Ἰακώβου.",
    translation: "Y cuando entraron, subieron al aposento alto donde se alojaban: Pedro, Juan, Jacobo y Andrés; Felipe y Tomás; Bartolomé y Mateo; Jacobo, hijo de Alfeo; Simón el Zelote, y Judas, hermano de Jacobo.",
    translation_notes: "El término ὑπερῷον (hyperōon) designa la habitación espaciosa en el piso superior de una casa residencial urbana grande, adecuada para reuniones de grupos considerables. Lucas ofrece el catálogo apostólico definitivo de los Once, alterando ligeramente el orden de Lc 6:14 para colocar a Pedro y Juan juntos en primera línea, reflejando su liderazgo conjunto en los primeros capítulos de Hechos. Simón es denominado 'el Zelote' (ὁ ζηλωτής, adaptando al griego el arameo cananita) y Judas es distinguido como 'hijo o hermano de Jacobo' para diferenciarlo del Iscariote."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 14,
    greek_text: "οὗτοι πάντες ἦσαν προσκαρτεροῦντες ὁμοθυμαδὸν τῇ προσευχῇ σὺν γυναιξὶν καὶ Μαριὰμ τῇ μητρὶ τοῦ Ἰησοῦ καὶ σὺν τοῖς ἀδελφοῖς αὐτοῦ.",
    translation: "Todos estos perseveraban unánimes en la oración, junto con las mujeres, y con María la madre de Jesús, y con sus hermanos.",
    translation_notes: "Retrato paradigmático de la iglesia orante: el participio presente προσκαρτεροῦντες denota una dedicación constante, tenaz y disciplinada. El adverbio ὁμοθυμαδόν (homothymadon, 'al unísono', con una sola mente, voluntad y afecto compartido) es un vocablo predilecto de Lucas (usado 10 veces en Hechos) que expresa la absoluta cohesión comunitaria del nuevo pacto. Lucas destaca de modo contracultural la presencia activa de 'las mujeres' (discípulas galileas que sostenían el ministerio) y menciona por última vez en el canon del Nuevo Testamento a María la madre de Jesús, ahora reunida en oración con los 'hermanos de Jesús', quienes tras la resurrección han abandonado su inicial escepticismo histórico (cf. Jn 7:5; 1 Cor 15:7)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 15,
    greek_text: "Καὶ ἐν ταῖς ἡμέραις ταύταις ἀναστὰς Πέτρος ἐν μέσῳ τῶν ἀδελφῶν εἶπεν· ἦν τε ὄχλος ὀνομάτων ἐπὶ τὸ αὐτὸ ὡς ἑκατὸν εἴκοσι·",
    translation: "En aquellos días, Pedro se puso de pie en medio de los hermanos (había allí una asamblea de unas ciento veinte personas) y dijo:",
    translation_notes: "Pedro asume la iniciativa de liderazgo pastoral de la comunidad naciente, cumpliendo el mandato de Jesús de 'confirmar a tus hermanos' (Lc 22:32). La frase técnica semítica ὄχλος ὀνομάτων (literalmente: 'multitud de nombres', traduciendo el uso hebreo de shemót para personas registradas formalmente en un censo comunitario). La cifra de 'ciento veinte' (ὡς ἑκατὸν εἴκοσι) posee hondo significado institucional judío: según la Mishná (Sanedrín 1:6), 120 varones adultos era el quórum legal mínimo exigido por la ley rabínica para que una comunidad judía pudiera establecer su propio tribunal local o Sanedrín con plena autonomía de gobierno."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 16,
    greek_text: "Ἄνδρες ἀδελφοί, ἔδει πληρωθῆναι τὴν γραφὴν ἣν προεῖπεν τὸ πνεῦμα τὸ ἅγιον διὰ στόματος Δαυὶδ περὶ Ἰούδα τοῦ γενομένου ὁδηγοῦ τοῖς συλλαβοῦσιν Ἰησοῦν,",
    translation: "«Hermanos, era necesario que se cumpliera la Escritura que el Espíritu Santo anunció de antemano por boca de David acerca de Judas, quien se convirtió en guía de los que arrestaron a Jesús;",
    translation_notes: "La fórmula de tratamiento Ἄνδρες ἀδελφοί ('Varones hermanos') es una respetuosa expresión oratoria forense de la tradición retórica judía y helenística. El verbo impersonal ἔδει (era teológicamente necesario en virtud del plan providencial de Dios) establece que la apostasía de Judas no desbarató los propósitos divinos. Pedro formula una rigurosa doctrina de la inspiración de las Escrituras: el Espíritu Santo es el autor primario supremo que habló 'por boca de David' (διὰ στόματος Δαυίδ) como instrumento humano profético. Judas es calificado históricamente de ὁδηγός (odēgos, guía o baquiano traidor) de la guardia del templo."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 17,
    greek_text: "ὅτι κατηριθμημένος ἦν ἐν ἡμῖν καὶ ἔλαχεν τὸν κλῆρον τῆς διακονίας ταύτης.",
    translation: "pues estaba contado entre nosotros y había obtenido su parte en este ministerio».",
    translation_notes: "Lucas destaca la tragedia de la defección de Judas mediante dos términos institucionales: 1) κατηριθμημένος ἦν (pluscuamperfecto pasivo: figuraba oficialmente censado y reconocido en el colegio apostólico); 2) ἔλαχεν τὸν κλῆρον (aoristo activo del verbo lagchanō: 'recibió por asignación providencial la porción o suerte'). El vocablo κλῆρος (klēros) denota la parcela asignada de responsabilidad en la διακονία (servicio ministerial) confiada por el propio Mesías."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 18,
    greek_text: "οὗτος μὲν οὖν ἐκτήσατο χωρίον ἐκ μισθοῦ τῆς ἀδικίας, καὶ πρηνὴς γενόμενος ἐλάκησεν μέσος, καὶ ἐξεχύθη πάντα τὰ σπλάγχνα αὐτοῦ·",
    translation: "(Este, pues, adquirió un campo con el salario de su iniquidad, y cayendo de cabeza, se reventó por en medio y se derramaron todas sus vísceras.",
    translation_notes: "Paréntesis explicativo del narrador Lucas para sus lectores grecorromanos, describiendo el trágico desenlace de Judas. La expresión ἐκ μισθοῦ τῆς ἀδικίας ('con la paga de la iniquidad') alude a los treinta siclos de plata. El verbo ἐλάκησεν (aoristo de lakeō: crujir con estruendo, desgarrarse con violencia) y el modismo médico πρηνὴς γενόμενος (caer de bruces hacia adelante) reflejan el interés clínico de Lucas: el cuerpo en descomposición tras el ahorcamiento (cf. Mt 27:5) cayó al romperse la soga o rama sobre las rocas afiladas del barranco de Hinom, reventándose el abdomen y derramándose sus entrañas (σπλάγχνα)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 19,
    greek_text: "καὶ γνωστὸν ἐγένετο πᾶσι τοῖς κατοικοῦσιν Ἰερουσαλήμ, ὥστε κληθῆναι τὸ χωρίον ἐκεῖνο τῇ ἰδίᾳ διαλέκτῳ αὐτῶν Ἁκελδαμάχ, τοῦτ’ ἔστιν Χωρίον Αἵματος.",
    translation: "Y esto llegó a ser conocido por todos los habitantes de Jerusalén, de modo que aquel campo fue llamado en su propia lengua Hakeldamaj, es decir, «Campo de Sangre»).",
    translation_notes: "Lucas registra la memoria toponímica de Jerusalén: la frase τῇ ἰδίᾳ διαλέκτῳ αὐτῶν alude al dialecto arameo local hablado por los judíos de la época. El nombre Ἁκελδαμάχ translitera el arameo haqēl demā (חקל דמא, 'campo de sangre'), traduciéndolo al koiné como Χωρίον Αἵματος. El vocablo χωρίον denota una finca rural o parcela de terreno rústico."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 20,
    greek_text: "γέγραπται γὰρ ἐν βίβλῳ Ψαλμῶν· Γενηθήτω ἡ ἔπαυλις αὐτοῦ ἔρημος καὶ μὴ ἔστω ὁ κατοικῶν ἐν αὐτῇ, καί· Τὴν ἐπισκοπὴν αὐτοῦ λαβέτω ἕτερος.",
    translation: "«Porque está escrito en el libro de los Salmos: «Quede desolada su morada y no haya quien habite en ella»; y: «Tome otro su cargo de supervisión».",
    translation_notes: "Pedro fundamenta la necesidad de restaurar el colegio apostólico mediante dos citas combinadas del Salterio (LXX): 1) Salmo 69:25 (modificando el plural 'sus moradas' al singular 'su morada', ἔπαυλις: finca de campo o campamento), aplicando la maldición de desolación al traidor; 2) Salmo 109:8 (cita literal LXX: Τὴν ἐπισκοπὴν αὐτοῦ λαβέτω ἕτερος). El término ἐπισκοπή (episkopē) tiene aquí un peso institucional primordial: significa el cargo de supervisión, mayordomía o liderazgo eclesial, justificando normativamente la elección de un sucesor para preservar la integridad del grupo de los Doce."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 21,
    greek_text: "δεῖ οὖν τῶν συνελθόντων ἡμῖν ἀνδρῶν ἐν παντὶ χρόνῳ ᾧ εἰσῆλθεν καὶ ἐξῆλθεν ἐφ’ ἡμᾶς ὁ κύριος Ἰησοῦς,",
    translation: "Por lo tanto, es necesario que de los hombres que nos acompañaron durante todo el tiempo en que el Señor Jesús entraba y salía entre nosotros,",
    translation_notes: "El imperativo teológico δεῖ οὖν ('es imperativo, pues') define las condiciones sine qua non para el apostolado primario: haber sido testigo ocular de todo el ministerio histórico de Jesús. El hebraísmo idiomático εἰσῆλθεν καὶ ἐξῆλθεν ('entró y salió', cf. Dt 28:6; 31:2) describe la vida pública activa, cotidiana y comunitaria de liderazgo y comunión constante."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 22,
    greek_text: "ἀρξάμενος ἀπὸ τοῦ βαπτίσματος Ἰωάννου ἕως τῆς ἡμέρας ἧς ἀνελήμφθη ἀφ’ ἡμῶν, μάρτυρα τῆς ἀναστάσεως αὐτοῦ σὺν ἡμῖν γενέσθαι ἕνα τούτων.",
    translation: "comenzando desde el bautismo de Juan hasta el día en que fue llevado arriba de entre nosotros, uno de ellos sea constituido testigo de su resurrección con nosotros».",
    translation_notes: "Límites cronológicos del ministerio mesíanico: desde el bautismo inaugural de Juan en el Jordán hasta la glorificación visible de la Ascensión. El propósito culminante de este ministerio es definido con precisión teológica: μάρτυρα τῆς ἀναστάσεως αὐτοῦ (testigo cualificado de su resurrección fáctica). El núcleo del kerigma apostólico primitivo no radicaba en una doctrina abstracta, sino en la atestación presencial de que el Crucificado vive corporalmente."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 23,
    greek_text: "Καὶ ἔστησαν δύο, Ἰωσὴφ τὸν καλούμενον Βαρσαββᾶν, ὃς ἐπεκλήθη Ἰοῦστος, καὶ Μαθθίαν.",
    translation: "Y propusieron a dos: a José, llamado Barsabás, que tenía por sobrenombre Justo, y a Matías.",
    translation_notes: "La asamblea postula formalmente a dos candidatos calificados. El primero presenta la onomástica tripartita típica de la época: su nombre hebreo Ἰωσήφ (Yosef); su patronímico arameo Βαρσαββᾶς (Barsabbās, 'hijo de Sabas' o 'hijo del sábado'); y su cognomen latino Ἰοῦστος (Iustus, 'el justo'), adoptado en el contexto cívico grecorromano. El segundo candidato es Μαθθίας (Matatías abreviado, 'regalo de Yahvé'), discípulo leal pero de perfil público discreto."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 24,
    greek_text: "καὶ προσευξάμενοι εἶπαν· Σὺ κύριε καρδιογνῶστα πάντων, ἀνάδειξον ὃν ἐξελέξω ἐκ τούτων τῶν δύο ἕνα,",
    translation: "Y orando, dijeron: «Tú, Señor, que conoces los corazones de todos, muestra claramente a cuál de estos dos has escogido,",
    translation_notes: "Oración comunitaria dirigida a Jesús como Señor soberano. El epíteto καρδιογνώστης (kardiognōstēs, 'conocedor infalible de los corazones') es un neologismo del cristianismo primitivo empleado exclusivamente por Lucas en el Nuevo Testamento (aquí y en Hch 15:8), atribuyendo a Cristo el atributo divino veterotestamentario de escudriñar los pensamientos y motivaciones más íntimas (1 Sm 16:7; Jr 17:10). El verbo en aoristo imperativo ἀνάδειξον pide que Dios señale o haga patente la elección que en sus decretos ya ha realizado (ἐξελέξω)."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 25,
    greek_text: "λαβεῖν τὸν τόπον τῆς διακονίας ταύτης καὶ ἀποστολῆς, ἀφ’ ἧς παρέβη Ἰούδας πορευθῆναι εἰς τὸν τόπον τὸν ἴδιον.",
    translation: "para que tome el lugar de este ministerio y apostolado, del cual Judas se desvió para irse a su propio lugar».",
    translation_notes: "El binomio conceptual τῆς διακονίας ταύτης καὶ ἀποστολῆς ('este servicio ministerial y apostolado') define la función como una misión de servicio y autoridad sacrificial delegada. El verbo παρέβη (aoristo activo de parabainō) significa desviarse del camino trazado, desertar o incurrir en transgresión de un mandato solemne. La antítesis sombría εἰς τὸν τόπον τὸν ἴδιον ('a su propio lugar') es un eufemismo judío tradicional para designar el destino trágico de perdición escatológica que el propio traidor labró para sí."
  },
  {
    book: "ACT",
    chapter: 1,
    verse: 26,
    greek_text: "καὶ ἔδωκαν κλήρους αὐτοῖς, καὶ ἔπεσεν ὁ κλῆρος ἐπὶ Μαθθίαν, καὶ συγκατεψηφίσθη μετὰ τῶν ἕνδεκα ἀποστόλων.",
    translation: "Y echaron suertes sobre ellos; y la suerte cayó sobre Matías, y fue contado junto con los once apóstoles.",
    translation_notes: "La práctica de echar suertes (ἔδωκαν κλήρους) constituía el procedimiento litúrgico tradicional del sacerdocio veterotestamentario para discernir la voluntad divina sin injerencia humana (Urim y Tumim, Prov 16:33). Esta es la última ocasión en que la comunidad utiliza este método, puesto que a partir del capítulo 2 el discernimiento es guiado directamente por el Espíritu Santo derramado. El verbo técnico compuesto συγκατεψηφίσθη (aoristo pasivo de synkatapsēphizō, de psēphos, guijarro o voto de sufragio cívico ateniense) indica que la asamblea ratificó unánimemente el resultado divino, incorporando a Matías formalmente para reconstituir el colegio de los Doce Apóstoles, correspondiente a las doce tribus de Israel en la economía escatológica."
  }
];
