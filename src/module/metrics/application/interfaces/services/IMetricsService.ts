import { IGetMetrics } from '@/module/metrics/application/interfaces/IGetMetrics';
import { IGetRolesMetrics } from '@/module/metrics/application/interfaces/IGetRolesMetrics';

export interface IMetricsService {
  getBooksMetrics: () => Promise<IGetMetrics[]>;
  getAuthorsMetrics: () => Promise<IGetMetrics[]>;
  getGenreMetrics: () => Promise<IGetMetrics[]>;
  getGenresMetrics: () => Promise<IGetRolesMetrics>;
}
