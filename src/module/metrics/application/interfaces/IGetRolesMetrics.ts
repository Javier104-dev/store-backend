export interface GenreMetrics {
  name: string;
  totalMetrics: number;
  bookCount: number;
}

export interface IGetRolesMetrics {
  [key: string]: { maxMetrics: number; members: GenreMetrics[] };
}
