export interface TranslatedVerse {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  translation_notes: string;
}

export const philemonChapter1: TranslatedVerse[] = [
  {
    book: 'PHM',
    chapter: 1,
    verse: 1,
    translation: 'Pablo, prisionero de Cristo Jesús, y el hermano Timoteo, a Filemón, nuestro querido amigo y colaborador,',
    translation_notes:
      'Auto-designación retórica de Pablo: en vez de presentarse como «apóstol» (título de autoridad), se llama δέσμιος Χριστοῦ Ἰησοῦ (desmios Christou Iēsou, «prisionero de Cristo Jesús»), apelando al afecto y al sacrificio compartido. Llama a Filemón ἀγαπητός (agapētos, «amado») y συνεργός (synergos, «colaborador/compañero de trabajo» en la misión).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 2,
    translation: 'a la hermana Apia, a Arquipo nuestro compañero de milicia, y a la iglesia que se reúne en tu casa:',
    translation_notes:
      'Destinatarios comunitarios: aunque el caso de Onésimo es personal, Pablo involucra a la iglesia doméstica (τῇ κατ’ οἶκόν σου ἐκκλησίᾳ, tē kat’ oikon sou ekklēsia), probablemente en Colosas. Apia suele identificarse como esposa de Filemón y Arquipo (cf. Col 4:17) como líder local, llamado συστρατιώτης (systratiōtēs, «compañero de milicia/lucha»).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 3,
    translation: 'Gracia a ustedes y paz de parte de Dios nuestro Padre y del Señor Jesucristo.',
    translation_notes:
      'Saludo apostólico habitual: combina χάρις (charis, «gracia», favor inmerecido) y εἰρήνη (eirēnē, «paz/bienestar integral», equivalente al shālôm hebreo), atribuyendo conjuntamente la fuente divina a Dios Padre y al Señor Jesucristo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 4,
    translation: 'Doy gracias a mi Dios siempre, recordándote en mis oraciones,',
    translation_notes:
      'Acción de gracias epistolar: Εὐχαριστῶ (eucharistō, «doy gracias») en presente continuo, acompañado de πάντοτε («siempre») y μνείαν σου ποιούμενος («haciendo mención/memoria de ti»), prepara el terreno cordial antes de la petición delicada.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 5,
    translation: 'porque oigo hablar del amor y de la fe que tienes hacia el Señor Jesús y para con todos los santos,',
    translation_notes:
      'Quiasmo espiritual: la fe (πίστις, pistis) se dirige al Señor Jesús, y el amor (ἀγάπη, agapē) se expresa concretamente hacia todos los creyentes (εἰς πάντας τοὺς ἁγίους). Esta reputación será la base a la que Pablo apelará en favor de Onésimo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 6,
    translation: 'pidiendo que la participación de tu fe sea eficaz mediante el conocimiento pleno de todo lo bueno que hay en nosotros para gloria de Cristo.',
    translation_notes:
      'Koinonía activa: ἡ κοινωνία τῆς πίστεώς σου (hē koinōnia tēs pisteōs sou) denota tanto la solidaridad generosa que brota de la fe como la comunión compartida en la fe. El adjetivo ἐνεργής (energēs, «eficaz, operante, activo») apunta a que esa fe produzca acciones concretas de reconciliación en Cristo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 7,
    translation: 'Pues tuve mucha alegría y consuelo por tu amor, hermano, porque los corazones de los santos han sido reconfortados por medio de ti.',
    translation_notes:
      'El verbo ἀναπέπαυται (anapepautai, perfecto pasivo de ἀναπαύω) expresa un alivio y descanso profundo que perdura. Τὰ σπλάγχνα (ta splanchna, literalmente «las entrañas») representa en el mundo bíblico el centro de los afectos, la compasión y el corazón mismo de la persona.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 8,
    translation: 'Por eso, aunque tengo mucha libertad en Cristo para mandarte lo que conviene hacer,',
    translation_notes:
      'Contraste retórico: παρρησία (parrēsia) significa franqueza, confianza o autoridad legítima para hablar abiertamente. Τὸ ἀνῆκον (to anēkon) alude al deber moral apropiado dentro de la comunidad cristiana.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 9,
    translation: 'prefiero rogártelo por amor, siendo como soy Pablo, ya anciano, y ahora también prisionero de Cristo Jesús.',
    translation_notes:
      'Renuncia a la imposición: en lugar de ordenar (ἐπιτάσσειν, v. 8), Pablo elige παρακαλῶ (parakalō, «rogar, suplicar, animar»). El término πρεσβύτης (presbytēs) significa «anciano/persona mayor» (aunque también guarda afinidad sonora con πρεσβευτής, «embajador»).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 10,
    translation: 'Te ruego por mi hijo Onésimo, a quien engendré espiritualmente en mis prisiones;',
    translation_notes:
      'Clímax afectivo: Pablo pospone el nombre de Ὀνήσιμος (Onēsimos, cuyo significado en griego es «Útil/Provechoso») hasta el final de la frase para enfatizar primero su nuevo vínculo: «mi hijo» (τοῦ ἐμοῦ τέκνου), convertido a Cristo mientras Pablo estaba encadenado.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 11,
    translation: 'el cual en otro tiempo te fue inútil, pero ahora nos es muy útil tanto a ti como a mí.',
    translation_notes:
      'Juego de palabras con el nombre Onésimo: Pablo contrasta ἄχρηστος (achrēstos, «inútil/sin provecho») con εὔχρηστος (euchrēstos, «muy útil/provechoso»). En griego koiné existía además cierta homofonía con Χριστός (Christos), sugiriendo que ahora, en Cristo, Onésimo cumple verdaderamente su nombre.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 12,
    translation: 'Te lo envío de vuelta, y con él va mi propio corazón.',
    translation_notes:
      'Identificación total con el esclavo fugitivo: el verbo ἀνέπεμψα (anepempsa, aoristo epistolar: «te lo envío» visto desde el momento en que Filemón lee la carta) va seguido de τὰ ἐμὰ σπλάγχνα (ta ema splanchna, «mis propias entrañas/corazón»), elevando la dignidad de Onésimo al máximo grado de afecto apostólico.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 13,
    translation: 'Yo hubiera querido retenerlo conmigo para que en tu lugar me sirviera en las cadenas del evangelio,',
    translation_notes:
      'El imperfecto ἐβουλόμην (eboulomēn) expresa un deseo real pero contenido por respeto. El verbo διακονῇ (diakonē, «sirva/atienda») indica un servicio amoroso prestado en nombre de Filemón mientras Pablo sufre prisión por causa del evangelio.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 14,
    translation: 'pero nada quise hacer sin tu consentimiento, para que tu buena acción no fuera por obligación, sino voluntaria.',
    translation_notes:
      'Ética de la libertad cristiana: Pablo respeta la decisión libre de Filemón (χωρὶς τῆς σῆς γνώμης, «sin tu parecer/consentimiento»). Contrasta κατὰ ἀνάγκην (kata anankēn, «por necesidad/presión») con κατὰ ἑκούσιον (kata hekousion, «de manera espontánea y voluntaria»).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 15,
    translation: 'Porque tal vez por esta razón se separó de ti por un tiempo, para que lo recibas de nuevo para siempre,',
    translation_notes:
      'Providencia divina en pasivo teológico: ἐχωρίσθη (echōristhē, «fue separado») evita culpar con dureza la huida y sugiere que Dios obró incluso en medio de esa ruptura temporal (πρὸς ὥραν, «por un momento»). El verbo ἀπέχῃς (apechēs) pertenecía al lenguaje comercial de recibir algo por completo y en definitiva (αἰώνιον, «para siempre/eternamente»).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 16,
    translation: 'ya no como esclavo, sino mucho más que un esclavo: como un hermano querido, especialmente para mí, pero cuánto más para ti, tanto en el plano humano como en el Señor.',
    translation_notes:
      'Transformación social desde el evangelio: Pablo contrapone ὡς δοῦλον («como esclavo») a ὑπὲρ δοῦλον, ἀδελφὸν ἀγαπητόν («por encima de esclavo, hermano amado»). La dupla ἐν σαρκὶ καὶ ἐν κυρίῳ («en la carne [ámbito humano/social] y en el Señor») apunta a que la fraternidad en Cristo redefine por completo la relación laboral y personal.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 17,
    translation: 'Así que, si me tienes por compañero en la fe, recíbelo como a mí mismo.',
    translation_notes:
      'Imputación relacional: κοινωνός (koinōnos, «socio/compañero») recuerda el lenguaje comercial y de comunión espiritual. El imperativo aoristo προσλαβοῦ (proslabou, «acoge, recibe con los brazos abiertos») exige tratar a Onésimo con el mismo honor que se daría al propio Pablo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 18,
    translation: 'Y si en algo te perjudicó o te debe algo, cárgalo a mi cuenta.',
    translation_notes:
      'Vocabulario financiero y contable: ἠδίκησεν («causó daño/perjuicio») y ὀφείλει («debe») aluden probablemente a bienes o fondos que Onésimo tomó al marcharse. El imperativo ἐλλόγα (elloga, de ἐλλογέω) es un término técnico bancario: «anótalo en mi debe / cárgalo a mi cuenta».',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 19,
    translation: 'Yo, Pablo, lo escribo de mi propio puño y letra: yo lo pagaré —por no decirte que hasta tu propia vida me la debes—.',
    translation_notes:
      'Pagaré autógrafo e ironía afectuosa: la fórmula ἐγὼ Παῦλος ἔγραψα τῇ ἐμῇ χειρί, ἐγὼ ἀποτίσω («yo, Pablo, lo escribí de mi mano, yo lo reembolsaré») tiene fuerza legal de garantía escrita. Con tacto pastoral, añade προσοφείλεις («me debes además») recordando que Filemón llegó a la fe por medio del ministerio de Pablo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 20,
    translation: 'Sí, hermano, ¡reciba yo este beneficio de parte tuya en el Señor! Reconforta mi corazón en Cristo.',
    translation_notes:
      'Último juego con el nombre Onésimo: el optativo ὀναίμην (onaimēn, de ὀνίνημι, «que yo reciba provecho/gozo de ti») suena exactamente como «Onésimo». Repite ἀνάπαυσόν μου τὰ σπλάγχνα («da descanso a mis entrañas/corazón»), conectando con el elogio del v. 7.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 21,
    translation: 'Te escribo confiado en tu obediencia, sabiendo que harás aún más de lo que te pido.',
    translation_notes:
      'Confianza pastoral: πεποιθώς (pepoithōs, perfecto de πείθω) expresa convicción firme. La frase ὑπὲρ ἃ λέγω ποιήσεις («harás por encima de lo que digo») ha sido interpretada históricamente como una invitación sutil a concederle la libertad (manumisión) a Onésimo.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 22,
    translation: 'Al mismo tiempo, prepárame alojamiento, porque espero que por las oraciones de ustedes se me conceda regresar a ustedes.',
    translation_notes:
      'Esperanza de liberación y rendición de cuentas: ξενία (xenia) designa una habitación de huéspedes o acogida hospitalaria. El pasivo teológico χαρισθήσομαι (charisthēsomai, de χαρίζομαι) expresa la convicción de que Dios, respondiendo a las oraciones de la iglesia (ὑμῶν, plural), lo devolverá como un don.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 23,
    translation: 'Te saluda Epafras, mi compañero de prisión en Cristo Jesús,',
    translation_notes:
      'Epafras era originario de Colosas y fundador de las iglesias del valle del Lico (cf. Col 1:7; 4:12). Aquí aparece llamado συναιχμάλωτος (synaichmalōtos, literalmente «compañero de cautiverio/prisionero de guerra»), lo que vincula estrechamente esta carta con Colosenses.',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 24,
    translation: 'y también Marcos, Aristarco, Demas y Lucas, mis colaboradores.',
    translation_notes:
      'Lista paralela a Colosenses 4:10–14: incluye a Marcos (Juan Marcos, ya reconciliado con Pablo), Aristarco de Tesalónica, Demas (quien más tarde lo abandonaría, 2 Ti 4:10) y Lucas el médico, llamados aquí συνεργοί (synergoi, «colaboradores»).',
  },
  {
    book: 'PHM',
    chapter: 1,
    verse: 25,
    translation: 'La gracia del Señor Jesucristo sea con el espíritu de ustedes.',
    translation_notes:
      'Bendición final en plural: aunque la petición central iba dirigida a Filemón en singular, el cierre usa ὑμῶν («de ustedes»), abarcando a toda la iglesia en casa (v. 2) que fue testigo moral de esta reconciliación.',
  },
];
