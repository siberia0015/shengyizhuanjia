import { PageRequest } from './page-request';
import { SortedRequest } from './sorted-request';

export interface ProductResultRequest extends PageRequest, SortedRequest {
    searchText?: string;
    searchCategoryId?: number;
}