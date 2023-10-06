interface Link {
  host: string;
  link: string;
  title: string;
  description: string;
}

interface LinkSection {
  name: string;
  children: Link[];
}

export type Links = LinkSection[];
