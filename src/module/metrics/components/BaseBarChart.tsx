import React from "react";
import styled from "styled-components";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const ChartContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

interface BarKey {
  dataKey: string;
  fill: string;
}

interface MetricsChartProps {
  title: string;
  data: unknown[];
  xAxisKey: string;
  barKeys: BarKey[];
}

export const BaseBarChart: React.FC<MetricsChartProps> = ({
  title,
  data,
  xAxisKey,
  barKeys
}) => {
  return (
    <ChartContainer>
      <Title>{title}</Title>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}
                  margin={{ top: 5, right: 10, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
          />
          <YAxis label={{ value: 'Number of Books', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {barKeys.map((barKey) => (
            <Bar
              key={barKey.dataKey}
              dataKey={barKey.dataKey}
              name="Books"
              fill={barKey.fill}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
