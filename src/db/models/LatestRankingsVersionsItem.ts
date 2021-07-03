import { RankingsVersions } from "../../model/player";
import { TableItem } from "./TableItem";

export interface LatestRankingsVersions extends TableItem {
  versions: RankingsVersions
}