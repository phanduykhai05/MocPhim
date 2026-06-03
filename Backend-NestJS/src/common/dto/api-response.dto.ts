export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export class ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;

  static ok<T>(data: T, message = 'Success', pagination?: Pagination): ApiResponse<T> {
    return { status: true, message, data, pagination };
  }

  static fail(message: string): ApiResponse<null> {
    return { status: false, message, data: null };
  }
}
