export interface ColumnInfo {
  slug: string;
  label: string;
}

export const COLUMN_MAP: Record<string, ColumnInfo> = {
  '跨境税务与 CRS': { slug: 'tax-crs', label: '跨境税务与 CRS' },
  '企业出海与原产地合规': { slug: 'outbound-compliance', label: '企业出海与原产地合规' },
  '跨境资金与账户合规': { slug: 'cross-border-funds', label: '跨境资金与账户合规' },
};

export function columnOf(category: string): ColumnInfo {
  return COLUMN_MAP[category] ?? { slug: 'articles', label: category };
}
