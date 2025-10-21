import { Row } from "@tanstack/react-table";

export const dateRangeFilter = <TData,>(
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
