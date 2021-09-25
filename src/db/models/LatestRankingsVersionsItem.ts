import { RankingsVersions } from "../../model/player";
import { TableItem } from "./TableItem";

export interface LatestRankingsVersionsItem extends TableItem {
  versions: RankingsVersions
}