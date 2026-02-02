import { Pageable } from "./pageable";
import { Sort } from "./sort";

export interface PagedResponse<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  empty: boolean;
}
