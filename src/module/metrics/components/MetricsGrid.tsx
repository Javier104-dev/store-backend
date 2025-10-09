import React from "react";
import { MetricCard } from "@module/metrics/components/MetricCard";
import styled from "styled-components";
import {
  IGetMetrics
} from "@/module/metrics/application/interfaces/IGetMetrics";

interface MetricsGridProps {
  metrics: IGetMetrics[];
}

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(1, 1fr);

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <GridContainer>
      <Grid>
        {metrics.map((metric, index) => (
          <MetricCard
            key={`metric-${index}`}
            title={metric.title}
            value={metric.value}
          />
        ))}
      </Grid>
    </GridContainer>
  );
};
