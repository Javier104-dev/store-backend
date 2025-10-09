import { metricsService } from '@module/metrics/application/services/metrics.service';
import { useEffect, useState } from 'react';

import { IGetMetrics } from '@/module/metrics/application/interfaces/IGetMetrics';

const useMetricsData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [booksMetrics, setBooksMetrics] = useState<IGetMetrics[]>();
  const [authorsMetrics, setAuthorsMetrics] = useState<IGetMetrics[]>();
  const [genreMetrics, setGenreMetrics] = useState<IGetMetrics[]>();

  useEffect(() => {
    Promise.all([
      metricsService.getGenreMetrics().then(setGenreMetrics),
      metricsService.getAuthorsMetrics().then(setAuthorsMetrics),
      metricsService.getBooksMetrics().then(setBooksMetrics),
    ]).then(() => setIsLoading(false));
  }, []);

  return {
    isLoading,
    booksMetrics,
    authorsMetrics,
    genreMetrics,
  };
};

export default useMetricsData;
