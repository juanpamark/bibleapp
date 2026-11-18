export interface BookMeta {
  code: string;
  name: string;
  testament?: 'AT' | 'NT';
  genre:
    | 'Pentateuco'
    | 'Históricos'
    | 'Poéticos'
    | 'Profetas Mayores'
    | 'Profetas Menores'
    | 'Evangelios'
    | 'Historia Apostólica'
    | 'Epístolas Paulinas'
    | 'Cartas Universales'
    | 'Profecía';
  chapters: number;
  isAvailable: boolean;
  theme: string;
  description: string;
}

export const NT_BOOKS: BookMeta[] = [
  // Evangelios
  {
    code: 'MAT',
    name: 'Mateo',
    genre: 'Evangelios',
    chapters: 28,
    isAvailable: true,
    theme: 'El Rey y su Reino',
    description: 'Jesús como el cumplimiento davídico, estructurado en cinco grandes discursos doctrinales.'
  },
  {
    code: 'MRK',
    name: 'Marcos',
    genre: 'Evangelios',
    chapters: 16,
    isAvailable: true,
    theme: 'El Siervo Sufriente',
    description: 'Narrativa dinámica e inmediata del ministerio terrenal y la entrega sacrificial de Jesús.'
  },
  {
    code: 'LUK',
    name: 'Lucas',
    genre: 'Evangelios',
    chapters: 24,
    isAvailable: true,
    theme: 'El Hijo del Hombre',
    description: 'Evangelio de la compasión, la oración, el Espíritu Santo y los marginados.'
  },
  {
    code: 'JHN',
    name: 'Juan',
    genre: 'Evangelios',
    chapters: 21,
    isAvailable: true,
    theme: 'El Verbo Divino',
    description: 'Teología profunda de la encarnación y las siete señales mesiánicas reveladoras.'
  },

  // Historia
  {
    code: 'ACT',
    name: 'Hechos',
    genre: 'Historia Apostólica',
    chapters: 28,
    isAvailable: true,
    theme: 'La Misión en el Espíritu',
    description: 'La expansión del Evangelio desde Jerusalén hasta Roma impulsada por el Espíritu Santo.'
  },

  // Epístolas Paulinas
  {
    code: 'ROM',
    name: 'Romanos',
    genre: 'Epístolas Paulinas',
    chapters: 16,
    isAvailable: true,
    theme: 'La Justicia de Dios',
    description: 'Tratado teológico monumental sobre el pecado, la justificación por la fe y la santificación.'
  },
  {
    code: '1CO',
    name: '1 Corintios',
    genre: 'Epístolas Paulinas',
    chapters: 16,
    isAvailable: true,
    theme: 'Orden y Amor en la Iglesia',
    description: 'Respuestas apostólicas a divisiones, dones espirituales y la resurrección corporal.'
  },
  {
    code: '2CO',
    name: '2 Corintios',
    genre: 'Epístolas Paulinas',
    chapters: 13,
    isAvailable: true,
    theme: 'Poder en la Debilidad',
    description: 'Defensa apasionada del ministerio apostólico y el consuelo de Dios en el sufrimiento.'
  },
  {
    code: 'GAL',
    name: 'Gálatas',
    genre: 'Epístolas Paulinas',
    chapters: 6,
    isAvailable: true,
    theme: 'Libertad en Cristo',
    description: 'La justificación por la fe frente al legalismo y la vida guiada por el fruto del Espíritu.'
  },
  {
    code: 'EPH',
    name: 'Efesios',
    genre: 'Epístolas Paulinas',
    chapters: 6,
    isAvailable: true,
    theme: 'Riquezas en Cristo y la Iglesia',
    description: 'El misterio de la unidad cósmica en Cristo y la armadura espiritual para el creyente.'
  },
  {
    code: 'PHP',
    name: 'Filipenses',
    genre: 'Epístolas Paulinas',
    chapters: 4,
    isAvailable: true,
    theme: 'Gozo y Kénosis',
    description: 'El gozo inquebrantable en Cristo, el himno de la humillación divina y la paz protectora.'
  },
  {
    code: 'COL',
    name: 'Colosenses',
    genre: 'Epístolas Paulinas',
    chapters: 4,
    isAvailable: true,
    theme: 'La Supremacía de Cristo',
    description: 'Cristo como cabeza de toda la creación y la plenitud suficiente contra filosofías vanas.'
  },
  {
    code: '1TH',
    name: '1 Tesalonicenses',
    genre: 'Epístolas Paulinas',
    chapters: 5,
    isAvailable: true,
    theme: 'Esperanza de la Parusía',
    description: 'Consuelo escatológico, santificación y la venida del Señor Jesús.'
  },
  {
    code: '2TH',
    name: '2 Tesalonicenses',
    genre: 'Epístolas Paulinas',
    chapters: 3,
    isAvailable: true,
    theme: 'Perseverancia hasta el Fin',
    description: 'Aclaraciones sobre el día del Señor, el hombre de pecado y el trabajo diligente.'
  },
  {
    code: '1TI',
    name: '1 Timoteo',
    genre: 'Epístolas Paulinas',
    chapters: 6,
    isAvailable: true,
    theme: 'Piedad y Liderazgo Pastoral',
    description: 'Instrucciones a Timoteo para la administración y doctrina en la iglesia de Éfeso.'
  },
  {
    code: '2TI',
    name: '2 Timoteo',
    genre: 'Epístolas Paulinas',
    chapters: 4,
    isAvailable: true,
    theme: 'Fidelidad en el Testimonio',
    description: 'El último testamento de Pablo: predicar la palabra a tiempo y fuera de tiempo.'
  },
  {
    code: 'TIT',
    name: 'Tito',
    genre: 'Epístolas Paulinas',
    chapters: 3,
    isAvailable: true,
    theme: 'Doctrina Sana y Buenas Obras',
    description: 'Organización pastoral en Creta y la manifestación de la gracia salvadora de Dios.'
  },
  {
    code: 'PHM',
    name: 'Filemón',
    genre: 'Epístolas Paulinas',
    chapters: 1,
    isAvailable: true,
    theme: 'Reconciliación y Hermandad',
    description: 'Una súplica de amor fraterno para recibir a Onésimo como a un hermano en la fe.'
  },

  // Cartas Universales
  {
    code: 'HEB',
    name: 'Hebreos',
    genre: 'Cartas Universales',
    chapters: 13,
    isAvailable: true,
    theme: 'El Sumo Sacerdote Superior',
    description: 'La superioridad infinita del nuevo pacto, el sacerdocio de Melquisedec y la fe perseverante.'
  },
  {
    code: 'JAS',
    name: 'Santiago',
    genre: 'Cartas Universales',
    chapters: 5,
    isAvailable: true,
    theme: 'La Fe Viva y Práctica',
    description: 'Exhortaciones de sabiduría práctica: la fe que obra, el freno de la lengua y la paciencia.'
  },
  {
    code: '1PE',
    name: '1 Pedro',
    genre: 'Cartas Universales',
    chapters: 5,
    isAvailable: true,
    theme: 'Esperanza en el Sufrimiento',
    description: 'Fortaleza ante la persecución, identidad sacerdotal y esperanza viva en la resurrección.'
  },
  {
    code: '2PE',
    name: '2 Pedro',
    genre: 'Cartas Universales',
    chapters: 3,
    isAvailable: true,
    theme: 'Conocimiento contra el Engaño',
    description: 'Advertencia contra falsos maestros y certeza del cumplimiento de la promesa del Señor.'
  },
  {
    code: '1JN',
    name: '1 Juan',
    genre: 'Cartas Universales',
    chapters: 5,
    isAvailable: true,
    theme: 'Comunión en Luz y Amor',
    description: 'Certezas del conocimiento salvífico, el amor fraternal y la victoria sobre el mundo.'
  },
  {
    code: '2JN',
    name: '2 Juan',
    genre: 'Cartas Universales',
    chapters: 1,
    isAvailable: true,
    theme: 'Verdad y Amor',
    description: 'Caminar en los mandamientos de Dios y proteger la doctrina apostólica de Jesucristo.'
  },
  {
    code: '3JN',
    name: '3 Juan',
    genre: 'Cartas Universales',
    chapters: 1,
    isAvailable: true,
    theme: 'Hospitalidad y Verdad',
    description: 'Elogio a Gayo por hospedar a los obreros misioneros frente a la soberbia de Diótrefes.'
  },
  {
    code: 'JUD',
    name: 'Judas',
    genre: 'Cartas Universales',
    chapters: 1,
    isAvailable: true,
    theme: 'Luchar por la Fe',
    description: 'Llamado a contender ardientemente por la fe confiada una vez por todas a los santos.'
  },

  // Profecía
  {
    code: 'REV',
    name: 'Apocalipsis',
    genre: 'Profecía',
    chapters: 22,
    isAvailable: true,
    theme: 'La Victoria Final del Cordero',
    description: 'Revelación profética del triunfo final de Dios, el juicio de la maldad y la Nueva Jerusalén.'
  }
];

export const OT_BOOKS: BookMeta[] = [
  // Pentateuco
  { code: 'GEN', name: 'Génesis', testament: 'AT', genre: 'Pentateuco', chapters: 50, isAvailable: false, theme: 'Creación y Promesa', description: 'El origen del mundo, la humanidad y el pacto con los patriarcas.' },
  { code: 'EXO', name: 'Éxodo', testament: 'AT', genre: 'Pentateuco', chapters: 40, isAvailable: false, theme: 'Liberación y Pacto', description: 'La salida de Egipto, la Pascua y el pacto en el Sinaí.' },
  { code: 'LEV', name: 'Levítico', testament: 'AT', genre: 'Pentateuco', chapters: 27, isAvailable: false, theme: 'Santidad y Expiación', description: 'El culto, los sacrificios y la vida santa delante de Dios.' },
  { code: 'NUM', name: 'Números', testament: 'AT', genre: 'Pentateuco', chapters: 36, isAvailable: false, theme: 'Travesía por el Desierto', description: 'El peregrinar de Israel desde el Sinaí hasta los llanos de Moab.' },
  { code: 'DEU', name: 'Deuteronomio', testament: 'AT', genre: 'Pentateuco', chapters: 34, isAvailable: false, theme: 'Renovación del Pacto', description: 'Los discursos finales de Moisés llamando a amar y obedecer a Dios.' },
  // Históricos
  { code: 'JOS', name: 'Josué', testament: 'AT', genre: 'Históricos', chapters: 24, isAvailable: false, theme: 'Herencia de la Tierra', description: 'La entrada y asentamiento de Israel en la tierra prometida.' },
  { code: 'JDG', name: 'Jueces', testament: 'AT', genre: 'Históricos', chapters: 21, isAvailable: false, theme: 'Ciclos de Infidelidad y Rescate', description: 'La historia de los libertadores levantados en tiempos de crisis.' },
  { code: 'RUT', name: 'Rut', testament: 'AT', genre: 'Históricos', chapters: 4, isAvailable: false, theme: 'Lealtad y Redención', description: 'Una historia de fidelidad familiar en el linaje de David.' },
  { code: '1SA', name: '1 Samuel', testament: 'AT', genre: 'Históricos', chapters: 31, isAvailable: false, theme: 'Origen de la Monarquía', description: 'El ministerio de Samuel, el reinado de Saúl y el ascenso de David.' },
  { code: '2SA', name: '2 Samuel', testament: 'AT', genre: 'Históricos', chapters: 24, isAvailable: false, theme: 'El Reino de David', description: 'El pacto davídico, los triunfos y las crisis de la casa real.' },
  { code: '1KI', name: '1 Reyes', testament: 'AT', genre: 'Históricos', chapters: 22, isAvailable: false, theme: 'Salomón y la División', description: 'La construcción del templo, la división del reino y el profeta Elías.' },
  { code: '2KI', name: '2 Reyes', testament: 'AT', genre: 'Históricos', chapters: 25, isAvailable: false, theme: 'Profetas y Exilio', description: 'Eliseo, la caída de Samaria y el destierro de Judá a Babilonia.' },
  { code: '1CH', name: '1 Crónicas', testament: 'AT', genre: 'Históricos', chapters: 29, isAvailable: false, theme: 'Memoria del Culto y David', description: 'Genealogías y preparación espiritual del reinado y el templo.' },
  { code: '2CH', name: '2 Crónicas', testament: 'AT', genre: 'Históricos', chapters: 36, isAvailable: false, theme: 'El Templo y la Fidelidad', description: 'Historia de los reyes de Judá centrada en la adoración y el regreso.' },
  { code: 'EZR', name: 'Esdras', testament: 'AT', genre: 'Históricos', chapters: 10, isAvailable: false, theme: 'Regreso y Restauración', description: 'La reconstrucción del templo tras el exilio babilónico.' },
  { code: 'NEH', name: 'Nehemías', testament: 'AT', genre: 'Históricos', chapters: 13, isAvailable: false, theme: 'Murallas y Comunidad', description: 'La reconstrucción de Jerusalén y la renovación de la lectura bíblica.' },
  { code: 'EST', name: 'Ester', testament: 'AT', genre: 'Históricos', chapters: 10, isAvailable: false, theme: 'Providencia Oculta', description: 'La preservación del pueblo judío en la corte persa de Susa.' },
  // Poéticos
  { code: 'JOB', name: 'Job', testament: 'AT', genre: 'Poéticos', chapters: 42, isAvailable: false, theme: 'Sufrimiento y Sabiduría', description: 'Diálogo profundo sobre el dolor del justo y la soberanía divina.' },
  { code: 'PSA', name: 'Salmos', testament: 'AT', genre: 'Poéticos', chapters: 150, isAvailable: false, theme: 'Oración y Alabanza', description: 'El himnario y libro de oraciones de Israel en gozo y lamento.' },
  { code: 'PRO', name: 'Proverbios', testament: 'AT', genre: 'Poéticos', chapters: 31, isAvailable: false, theme: 'Sabiduría Cotidiana', description: 'Consejos prácticos para vivir con discernimiento y temor de Dios.' },
  { code: 'ECC', name: 'Eclesiastés', testament: 'AT', genre: 'Poéticos', chapters: 12, isAvailable: false, theme: 'Sentido bajo el Sol', description: 'Reflexión honesta sobre la fugacidad de la vida y el propósito final.' },
  { code: 'SNG', name: 'Cantares', testament: 'AT', genre: 'Poéticos', chapters: 8, isAvailable: false, theme: 'Canto del Amor', description: 'Poesía lírica celebrando el amor mutuo, la belleza y la fidelidad.' },
  // Profetas Mayores
  { code: 'ISA', name: 'Isaías', testament: 'AT', genre: 'Profetas Mayores', chapters: 66, isAvailable: false, theme: 'Santidad y Siervo Redentor', description: 'Juicio a las naciones y promesas mesiánicas de consuelo y restauración.' },
  { code: 'JER', name: 'Jeremías', testament: 'AT', genre: 'Profetas Mayores', chapters: 52, isAvailable: false, theme: 'Nuevo Pacto', description: 'Llamado al arrepentimiento ante la caída de Jerusalén y esperanza futura.' },
  { code: 'LAM', name: 'Lamentaciones', testament: 'AT', genre: 'Profetas Mayores', chapters: 5, isAvailable: false, theme: 'Duelo y Fidelidad', description: 'Elegías sobre la destrucción de Jerusalén sostenidas por la misericordia.' },
  { code: 'EZK', name: 'Ezequiel', testament: 'AT', genre: 'Profetas Mayores', chapters: 48, isAvailable: false, theme: 'Gloria y Espíritu Nuevo', description: 'Visiones del exilio, renovación del corazón y el templo futuro.' },
  { code: 'DAN', name: 'Daniel', testament: 'AT', genre: 'Profetas Mayores', chapters: 12, isAvailable: false, theme: 'Soberanía en el Exilio', description: 'Fidelidad en Babilonia y visiones del reino eterno del Hijo del Hombre.' },
  // Profetas Menores
  { code: 'HOS', name: 'Oseas', testament: 'AT', genre: 'Profetas Menores', chapters: 14, isAvailable: false, theme: 'Amor que Restaura', description: 'El amor fiel de Dios frente a la infidelidad de su pueblo.' },
  { code: 'JOL', name: 'Joel', testament: 'AT', genre: 'Profetas Menores', chapters: 3, isAvailable: false, theme: 'El Día y el Espíritu', description: 'Llamado al arrepentimiento y promesa del derramamiento del Espíritu.' },
  { code: 'AMO', name: 'Amós', testament: 'AT', genre: 'Profetas Menores', chapters: 9, isAvailable: false, theme: 'Justicia Social', description: 'Denuncia profética contra la opresión y la religión vacía.' },
  { code: 'OBA', name: 'Abdías', testament: 'AT', genre: 'Profetas Menores', chapters: 1, isAvailable: false, theme: 'Soberanía sobre las Naciones', description: 'El libro más breve del AT sobre la justicia de Dios ante la soberbia.' },
  { code: 'JON', name: 'Jonás', testament: 'AT', genre: 'Profetas Menores', chapters: 4, isAvailable: false, theme: 'Misericordia Universal', description: 'La compasión de Dios que alcanza incluso a Nínive.' },
  { code: 'MIC', name: 'Miqueas', testament: 'AT', genre: 'Profetas Menores', chapters: 7, isAvailable: false, theme: 'Justicia, Misericordia y Humildad', description: 'Anuncio del gobernante nacido en Belén y la restauración venidera.' },
  { code: 'NAM', name: 'Nahúm', testament: 'AT', genre: 'Profetas Menores', chapters: 3, isAvailable: false, theme: 'Consuelo ante el Opresor', description: 'Juicio sobre la crueldad imperial de Nínive.' },
  { code: 'HAB', name: 'Habacuc', testament: 'AT', genre: 'Profetas Menores', chapters: 3, isAvailable: false, theme: 'El Justo Vivirá por Fe', description: 'Diálogo sincero con Dios ante la injusticia histórica.' },
  { code: 'ZEP', name: 'Sofonías', testament: 'AT', genre: 'Profetas Menores', chapters: 3, isAvailable: false, theme: 'Juicio y Gozo del Remanente', description: 'El día del Señor y el cántico de alegría sobre los humildes.' },
  { code: 'HAG', name: 'Hageo', testament: 'AT', genre: 'Profetas Menores', chapters: 2, isAvailable: false, theme: 'Prioridades del Templo', description: 'Ánimo para reconstruir la casa de Dios tras el regreso.' },
  { code: 'ZEC', name: 'Zacarías', testament: 'AT', genre: 'Profetas Menores', chapters: 14, isAvailable: false, theme: 'Esperanza Mesiánica', description: 'Visiones nocturnas y profecías del Rey humilde que trae paz.' },
  { code: 'MAL', name: 'Malaquías', testament: 'AT', genre: 'Profetas Menores', chapters: 4, isAvailable: false, theme: 'Fidelidad en el Pacto', description: 'Última voz profética del AT anunciando al mensajero que prepara el camino.' },
];

export const ALL_BOOKS: BookMeta[] = [...OT_BOOKS, ...NT_BOOKS];

export const AVAILABLE_BOOKS = NT_BOOKS.filter(b => b.isAvailable);

export function getBookMeta(code: string): BookMeta | undefined {
  return ALL_BOOKS.find(b => b.code.toUpperCase() === code.toUpperCase());
}
