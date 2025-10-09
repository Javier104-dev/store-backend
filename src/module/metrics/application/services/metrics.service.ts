import { IApiRecord } from '@/module/adminjs/app/interfaces/api-record';
import { Book } from '@/module/book/domain/book.entity';
import { IGetMetrics } from '@/module/metrics/application/interfaces/IGetMetrics';
import { IGetRolesMetrics } from '@/module/metrics/application/interfaces/IGetRolesMetrics';
import { IMetricsService } from '@/module/metrics/application/interfaces/services/IMetricsService';
import {
  calculateGenreMetrics,
  fetchAuthors,
  fetchBooks,
  fetchGenres,
  organizeGenresByBookCount,
} from '@/module/metrics/application/services/metrics.utils';

class MetricsService implements IMetricsService {
  async getBooksMetrics(): Promise<IGetMetrics[]> {
    const books = await fetchBooks();

    const booksWithAuthors = books.filter(
      (book: IApiRecord<Book>) => book.params.authorId,
    ).length;

    const booksWithoutAuthors = books.length - booksWithAuthors;

    const booksWithGenres = books.filter(
      (book: IApiRecord<Book>) =>
        book.params.genres && book.params.genres.length > 0,
    ).length;

    const booksWithoutGenres = books.length - booksWithGenres;

    const avgGenresPerBook =
      books.length > 0
        ? books.reduce(
            (sum, book: IApiRecord<Book>) =>
              sum + (book.params.genres?.length || 0),
            0,
          ) / books.length
        : 0;

    return [
      { title: 'Total Books', value: books.length },
      { title: 'Books with Authors', value: booksWithAuthors },
      { title: 'Books without Authors', value: booksWithoutAuthors },
      { title: 'Books with Genres', value: booksWithGenres },
      { title: 'Books without Genres', value: booksWithoutGenres },
      {
        title: 'Avg Genres per Book',
        value: parseFloat(avgGenresPerBook.toFixed(1)),
      },
    ];
  }

  async getAuthorsMetrics(): Promise<IGetMetrics[]> {
    const authors = await fetchAuthors();
    const books = await fetchBooks();

    const authorsWithBooks = authors.filter((author) => {
      return books.some(
        (book: IApiRecord<Book>) => book.params.authorId === author.params.id,
      );
    }).length;

    const authorsWithoutBooks = authors.length - authorsWithBooks;

    const avgBooksPerAuthor =
      authors.length > 0
        ? books.filter((book) => book.params.authorId).length / authors.length
        : 0;

    const authorBookCounts = authors.map((author) => {
      const bookCount = books.filter(
        (book: IApiRecord<Book>) => book.params.authorId === author.params.id,
      ).length;
      return { author, bookCount };
    });

    const maxBooksPerAuthor =
      authorBookCounts.length > 0
        ? Math.max(...authorBookCounts.map((item) => item.bookCount))
        : 0;

    return [
      { title: 'Total Authors', value: authors.length },
      { title: 'Authors with Books', value: authorsWithBooks },
      { title: 'Authors without Books', value: authorsWithoutBooks },
      {
        title: 'Avg Books per Author',
        value: parseFloat(avgBooksPerAuthor.toFixed(1)),
      },
      { title: 'Max Books per Author', value: maxBooksPerAuthor },
    ];
  }

  async getGenreMetrics(): Promise<IGetMetrics[]> {
    const genres = await fetchGenres();
    const books = await fetchBooks();
    return calculateGenreMetrics(genres, books);
  }

  async getGenresMetrics(): Promise<IGetRolesMetrics> {
    const genres = await fetchGenres();
    const books = await fetchBooks();
    return organizeGenresByBookCount(genres, books);
  }
}

export const metricsService = new MetricsService();
