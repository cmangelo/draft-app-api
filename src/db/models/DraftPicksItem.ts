import { DraftPicks } from '../../model/draft';
import { TableItem } from './TableItem';

export interface DraftPicksItem extends TableItem {
  picks: DraftPicks
}