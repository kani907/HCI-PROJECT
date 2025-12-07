export interface Movie {
  id: string;
  title: string;
  description: string;
  year: number;
}

export const movies: Movie[] = [
  {
    id: "inception",
    title: "Inception",
    description: "A thief who steals corporate secrets through dreams.",
    year: 2010
  },
  {
    id: "interstellar",
    title: "Interstellar",
    description: "A team travels through a wormhole to save humanity.",
    year: 2014
  },
  {
    id: "inside-out",
    title: "Inside Out",
    description: "The emotions of a young girl navigate a difficult move.",
    year: 2015
  },
  {
    id: "iron-man",
    title: "Iron Man",
    description: "A genius billionaire builds a high-tech armored suit.",
    year: 2008
  },
  {
    id: "i-am-legend",
    title: "I Am Legend",
    description: "A survivor fights for life in a post-apocalyptic world.",
    year: 2007
  }
];
