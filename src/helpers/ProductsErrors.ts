import { IError } from './index';
export enum ERROR_PRODUCTS_ENUMS {
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  PRODUCT_NOT_EXISTS = 'PRODUCT_NOT_EXISTS',
  PRODUCT_DATA_INVALID = 'PRODUCT_DATA_INVALID',
  UNKNOWN = 'UNKNOWN',
}

export interface IErrorProduct extends IError<ERROR_PRODUCTS_ENUMS> {}
