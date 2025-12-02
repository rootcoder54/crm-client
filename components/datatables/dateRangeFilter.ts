import { FilterFn, Row } from "@tanstack/react-table";

export const dateRangeFilter = <TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: [string | undefined, string | undefined] | undefined
) => {
  if (!filterValue || filterValue.length !== 2) return true;

  const value = new Date(row.getValue(columnId) as string);
  const [from, to] = filterValue.map((d) => (d ? new Date(d) : undefined));

  if (isNaN(value.getTime())) return false;

  if (from && to) return value >= from && value <= to;
  if (from) return value >= from;
  if (to) return value <= to;

  return true;
};

export const unionFilter: FilterFn<unknown> = (row, columnId, filterValues) => {
  const filters = Array.isArray(filterValues) ? filterValues : [filterValues];

  if (filters.length === 0) return true;
  const cellValue = String(row.getValue(columnId)).toLowerCase();
  // 🔥 Approximation : on vérifie si la cellule contient AU MOINS un des filtres
  return filters.some((f) => cellValue.includes(String(f).toLowerCase()));
};
