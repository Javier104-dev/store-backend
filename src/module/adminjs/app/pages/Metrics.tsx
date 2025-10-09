import styled from "styled-components";
import GlobalStyles from "../GlobalStyles";
import React from "react";

import { MetricsGrid } from "@module/metrics/components/MetricsGrid";
import MetricsSkeleton from "@module/metrics/components/MetricsSkeleton";

import useMetricsData from "@module/metrics/hooks/use-metrics-data";
import BooksPerGenreChart from "@module/metrics/components/BooksPerGenreChart";
import BooksPerAuthorChart from "@module/metrics/components/BooksPerAuthorChart";

const Container = styled.div`
  width: 100%;
  max-height: calc(100vh - 64px);
  height: 100%;
  display: flex;
  position: relative;
  overflow-y: auto;
`;

const ViewFull = styled.div`
  width: 100%;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  padding: 1rem;

  > *:last-child {
    grid-column: 1 / -1;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);

    > *:last-child {
      grid-column: 1 / -1;
    }
  }
`;

const Metrics: React.FC = () => {
  const { AdminJS } = window;

  if (!AdminJS) {
    return null;
  }

  const {
    isLoading,
    booksMetrics,
    authorsMetrics,
    genreMetrics
  } = useMetricsData();

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  const allMetrics = [...booksMetrics, ...authorsMetrics, ...genreMetrics];

  return (
    <Container>
      <GlobalStyles />
      <ViewFull>
        <MetricsGrid metrics={allMetrics} />
        <GridLayout>
          <BooksPerGenreChart />
          <BooksPerAuthorChart />
        </GridLayout>
      </ViewFull>
    </Container>
  );
};

export default Metrics;
