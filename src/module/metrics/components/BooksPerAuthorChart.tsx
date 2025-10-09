import React from "react";
import { BaseBarChart } from "@module/metrics/components/BaseBarChart";
import { fetchBooks, fetchAuthors, calculateBooksPerAuthor } from "@module/metrics/application/services/metrics.utils";
import { useEffect, useState } from "react";

interface ChartData {
  name: string;
  bookCount: number;
  totalMetrics: number;
}

const BooksPerAuthorChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await fetchBooks();
        const authors = await fetchAuthors();
        const booksPerAuthor = calculateBooksPerAuthor(authors, books);
        setData(booksPerAuthor);
      } catch (error) {
        console.error("Error fetching data for books per author:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const barKeys = [
    { dataKey: "bookCount", fill: "#2656fc" },
  ];

  if (loading) {
    return <div>Loading books per author data...</div>;
  }

  return (
    <BaseBarChart
      title="Books per Author"
      data={data}
      xAxisKey="name"
      barKeys={barKeys}
    />
  );
};

export default BooksPerAuthorChart;
