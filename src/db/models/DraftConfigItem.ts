import { DraftConfig, DraftOrder } from '../../model/draft';
import { RankingsVersions } from '../../model/player';
import { TableItem } from './TableItem';

export interface DraftConfigItem extends TableItem {
  draftDateTime: string
  rankingsVersions: RankingsVersions
  config: DraftConfig
  draftOrder: DraftOrder
}