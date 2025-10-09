import React from "react";
import {
  IGetRolesMetrics
} from "@module/metrics/application/interfaces/IGetRolesMetrics";
import { BaseBarChart } from "@module/metrics/components/BaseBarChart";

interface GenresMetricsProps {
  genresMetrics: IGetRolesMetrics;
}

const GenresMetrics: React.FC<GenresMetricsProps> = ({ genresMetrics }) => {
  const barKeys = [
    { dataKey: "bookCount", fill: "#4bbea0" },
  ];

  const createBarChart = (genre: string) => {
    const title = `${genre} Books`;
    const { members, maxMetrics } = genresMetrics[genre];

    const enrichedData = members.map(member => {
      return {
        ...member,
        totalMetrics: member.totalMetrics,
        bookCount: member.bookCount || 0,
      };
    });

    return (
      <BaseBarChart
        key={title}
        title={title}
        data={enrichedData}
        xAxisKey="name"
        barKeys={barKeys}
      />
    );
  };

  const genres = Object.keys(genresMetrics);

  return (
    <>
      {genres.map(createBarChart)}
    </>
  );
};

export default GenresMetrics;
