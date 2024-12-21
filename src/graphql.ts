
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface MonthFilterInput {
    month: string;
}

export interface PaginationInput {
    limit: number;
    offset: number;
}

export interface SearchSongsInput {
    pagination?: Nullable<PaginationInput>;
    query: string;
}

export interface Album {
    createdAt: DateTime;
    id: string;
    releaseYear?: Nullable<number>;
    songs: Song[];
    title: string;
    updatedAt: DateTime;
}

export interface Artist {
    createdAt: DateTime;
    id: string;
    name: string;
    songs: Song[];
    updatedAt: DateTime;
}

export interface MonthlyPlay {
    createdAt: DateTime;
    id: string;
    month: string;
    playCount: number;
    song: Song;
    updatedAt: DateTime;
}

export interface IQuery {
    popularAlbums(filter?: Nullable<MonthFilterInput>, pagination?: Nullable<PaginationInput>): Nullable<Album[]> | Promise<Nullable<Album[]>>;
    popularSongs(filter?: Nullable<MonthFilterInput>, pagination?: Nullable<PaginationInput>): Nullable<Song[]> | Promise<Nullable<Song[]>>;
    searchSongs(input: SearchSongsInput): Nullable<Song[]> | Promise<Nullable<Song[]>>;
    songsByYear(year: number): Nullable<Song[]> | Promise<Nullable<Song[]>>;
}

export interface Song {
    album?: Nullable<Album>;
    artists: Artist[];
    createdAt: DateTime;
    id: string;
    monthlyPlays: MonthlyPlay[];
    releaseYear?: Nullable<number>;
    title: string;
    updatedAt: DateTime;
    writers: Writer[];
}

export interface Writer {
    createdAt: DateTime;
    id: string;
    name: string;
    songs: Song[];
    updatedAt: DateTime;
}

export type DateTime = any;
type Nullable<T> = T | null;
