import { ActionType } from '@module/metrics/domain/action-type.enum';
import { ResourceType } from '@module/metrics/domain/resource-type.enum';
import { ApiClient } from 'adminjs';

import { IApiRecord } from '@/module/adminjs/app/interfaces/api-record';
import { RECORDS_PER_PAGE } from '@/module/adminjs/constant/pagination.constants';
import { Author } from '@/module/author/domain/author.entity';
import { Book } from '@/module/book/domain/book.entity';
import { Genre } from '@/module/genre/domain/genre.entity';
import { IGetMetrics } from '@/module/metrics/application/interfaces/IGetMetrics';

const api = new ApiClient();

export async function fetchResource(
  resource: string,
  action: ActionType,
  filters?: Record<string, unknown>,
) {
  const response = await api.resourceAction({
    resourceId: resource,
    actionName: action,
    params: {
      filters,
      perPage: RECORDS_PER_PAGE,
      sort: { direction: 'asc', sortBy: 'name' },
    },
  });
  return response.data.records;
}

export async function fetchBooks(
  filters?: Record<string, unknown>,
): Promise<IApiRecord<Book>[]> {
  return fetchResource(ResourceType.BOOK, ActionType.LIST, filters);
}

export async function fetchAuthors(
  filters?: Record<string, unknown>,
): Promise<IApiRecord<Author>[]> {
  return fetchResource(ResourceType.AUTHOR, ActionType.LIST, filters);
}

export async function fetchGenres(
  filters?: Record<string, unknown>,
): Promise<IApiRecord<Genre>[]> {
  return fetchResource(ResourceType.GENRE, ActionType.LIST, filters);
}

export function calculateBooksPerAuthor(
  authors: IApiRecord<Author>[],
  books: IApiRecord<Book>[],
) {
  return authors.map((author: IApiRecord<Author>) => {
    const authorBooks = books.filter(
      (book: IApiRecord<Book>) => book.params.authorId === author.params.id,
    );

    return {
      name: author.title,
      totalMetrics: authorBooks.length,
      bookCount: authorBooks.length,
    };
  });
}

export function calculateBooksPerGenre(
  genres: IApiRecord<Genre>[],
  books: IApiRecord<Book>[],
) {
  return genres.map((genre: IApiRecord<Genre>) => {
    const genreBooks = books.filter((book: IApiRecord<Book>) => {
      const bookGenres = book.params.genres || [];
      return bookGenres.some((g) => g.id === genre.params.id);
    });

    return {
      name: genre.title,
      totalMetrics: genreBooks.length,
      bookCount: genreBooks.length,
    };
  });
}

export function organizeGenresByBookCount(
  genres: IApiRecord<Genre>[],
  books: IApiRecord<Book>[],
) {
  const genresWithBooks = {};

  genres.forEach((genre) => {
    const genreBooks = books.filter((book: IApiRecord<Book>) => {
      const bookGenres = book.params.genres || [];
      return bookGenres.some((g) => g.id === genre.params.id);
    });

    genresWithBooks[genre.title] = {
      maxMetrics: books.length,
      members: [
        {
          name: genre.title,
          totalMetrics: books.length,
          bookCount: genreBooks.length,
        },
      ],
    };
  });

  return genresWithBooks;
}

export function calculateGenreMetrics(
  genres: IApiRecord<Genre>[],
  books: IApiRecord<Book>[],
): IGetMetrics[] {
  const totalGenres = genres.length;

  const genresWithBooks = genres.filter((genre) => {
    const genreBooks = books.filter((book: IApiRecord<Book>) => {
      const bookGenres = book.params.genres || [];
      return bookGenres.some((g) => g.id === genre.params.id);
    });
    return genreBooks.length > 0;
  }).length;

  const genresWithoutBooks = totalGenres - genresWithBooks;

  const avgBooksPerGenre =
    totalGenres > 0
      ? books.reduce((sum, book: IApiRecord<Book>) => {
          const genreCount = book.params.genres?.length || 0;
          return sum + genreCount;
        }, 0) / totalGenres
      : 0;

  const genreBookCounts = genres.map((genre) => {
    const bookCount = books.filter((book: IApiRecord<Book>) => {
      const bookGenres = book.params.genres || [];
      return bookGenres.some((g) => g.id === genre.params.id);
    }).length;
    return { genre, bookCount };
  });

  const maxBooksInGenre =
    genreBookCounts.length > 0
      ? Math.max(...genreBookCounts.map((item) => item.bookCount))
      : 0;

  return [
    { title: 'Total Genres', value: totalGenres },
    { title: 'Genres with Books', value: genresWithBooks },
    { title: 'Genres without Books', value: genresWithoutBooks },
    {
      title: 'Avg Books per Genre',
      value: parseFloat(avgBooksPerGenre.toFixed(1)),
    },
    { title: 'Max Books in Genre', value: maxBooksInGenre },
  ];
}

export function fetchAllGenres() {
  return fetchGenres().then((genres) => {
    return { genres };
  });
}
