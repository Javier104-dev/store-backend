import React from "react";
import { BaseBarChart } from "@module/metrics/components/BaseBarChart";
import { fetchBooks, fetchGenres, calculateBooksPerGenre } from "@module/metrics/application/services/metrics.utils";
import { useEffect, useState } from "react";

interface ChartData {
  name: string;
  bookCount: number;
  totalMetrics: number;
}

const BooksPerGenreChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await fetchBooks();
        const genres = await fetchGenres();
        const booksPerGenre = calculateBooksPerGenre(genres, books);
        setData(booksPerGenre);
      } catch (error) {
        console.error("Error fetching data for books per genre:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barKeys = [
    { dataKey: "bookCount", fill: "#4bbea0" },
  ];

  if (loading) {
    return <div>Loading books per genre data...</div>;
  }

  return (
    <BaseBarChart
      title="Books per Genre"
      data={data}
      xAxisKey="name"
      barKeys={barKeys}
    />
  );
};

export default BooksPerGenreChart;
