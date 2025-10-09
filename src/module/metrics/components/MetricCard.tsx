import React from "react";
import styled from "styled-components";

interface MetricCardProps {
  title: string;
  value: number | string;
  className?: string;
}

export const MetricCardContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const MetricCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MetricCardValue = styled.p`
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a202c;
`;

export const MetricCard: React.FC<MetricCardProps> = ({
                                                        title,
                                                        value,
                                                        className = ""
                                                      }) => {
  return (
    <MetricCardContainer className={className}>
      <MetricCardTitle>{title}</MetricCardTitle>
      <MetricCardValue>{value}</MetricCardValue>
    </MetricCardContainer>
  );
};
