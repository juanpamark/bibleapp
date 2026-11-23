export interface StudyPlanItem {
  id: string;
  title: string;
  subtitle: string;
  days: number;
  route: string;
  theme: string;
}

export interface BookStudyHighlight {
  name: string;
  code: string;
  desc: string;
  chapter: number;
}

export const DEVOTIONAL_THEMES = [
  { name: 'AMOR', dot: '#B4536A' },
  { name: 'PAZ', dot: '#4D7C6F' },
  { name: 'ESPERANZA', dot: '#6D5A9E' },
  { name: 'FAMILIA', dot: '#B47B38' },
  { name: 'CARÁCTER', dot: '#3E6B89' },
  { name: 'VALENTÍA', dot: '#9A4322' },
  { name: 'ANSIEDAD', dot: '#64748B' },
  { name: 'CONSUELO', dot: '#7C6588' },
  { name: 'FE', dot: '#876222' },
];

export const STUDY_PLANS: StudyPlanItem[] = [
  {
    id: 'd-0',
    title: 'Palabra Viva en el día a día',
    subtitle: 'Un recorrido pausado por el Sermón del Monte (Mateo 5–7) con explicaciones claras del contexto histórico.',
    days: 30,
    route: '/lector/MAT/5',
    theme: 'FE',
  },
  {
    id: 'd-1',
    title: 'El Sermón del Monte: Vida en el Reino',
    subtitle: 'Las bienaventuranzas, la oración y el corazón de las enseñanzas de Jesús.',
    days: 30,
    route: '/lector/MAT/5',
    theme: 'AMOR',
  },
  {
    id: 'd-2',
    title: 'Paz y oración diaria en Filipenses',
    subtitle: 'Cómo reemplazar el afán por oración y gozo en toda circunstancia.',
    days: 14,
    route: '/lector/PHP/4',
    theme: 'PAZ',
  },
  {
    id: 'd-3',
    title: 'Una vida que da fruto en el Espíritu',
    subtitle: 'La libertad cristiana expresada en amor, paciencia y dominio propio.',
    days: 21,
    route: '/lector/GAL/5',
    theme: 'CARÁCTER',
  },
  {
    id: 'd-4',
    title: 'Firmeza y valentía en tiempos de prueba',
    subtitle: 'El coraje de la iglesia primitiva frente a la oposición en Hechos.',
    days: 15,
    route: '/lector/ACT/4',
    theme: 'VALENTÍA',
  },
];

export const BIBLICAL_THEMES: BookStudyHighlight[] = [
  {
    name: 'Evangelio de Juan',
    code: 'JHN',
    desc: 'Las siete señales y el diálogo de Jesús con cada persona.',
    chapter: 0,
  },
  {
    name: 'Carta a los Romanos',
    code: 'ROM',
    desc: 'La justicia de Dios, el perdón y la vida en el Espíritu.',
    chapter: 0,
  },
  {
    name: 'Sermón del Monte (Mateo 5–7)',
    code: 'MAT',
    desc: 'El corazón de las enseñanzas de Jesús sobre el Reino.',
    chapter: 5,
  },
  {
    name: 'Hechos de los Apóstoles',
    code: 'ACT',
    desc: 'El nacimiento de la iglesia y la obra del Espíritu Santo.',
    chapter: 0,
  },
  {
    name: 'Carta a los Gálatas',
    code: 'GAL',
    desc: 'La libertad en Cristo y el fruto del Espíritu frente al legalismo.',
    chapter: 0,
  },
  {
    name: 'Carta a los Filipenses',
    code: 'PHP',
    desc: 'Gozo, humildad y paz en medio de la adversidad.',
    chapter: 0,
  },
];
