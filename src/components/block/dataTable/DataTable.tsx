'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import TextZbl from '@components/ui/textZbl/TextZbl';
import './data-table.scss';

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  truncate?: boolean;
};

type DataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchKeys?: (keyof T)[];
  renderActions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = false,
  searchKeys,
  renderActions,
  emptyMessage = 'Aucun résultat',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const keysToSearch = searchKeys ?? (columns.map((col) => col.key) as (keyof T)[]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return data;
    return data.filter((row) =>
      keysToSearch.some((key) =>
        String(row[key] ?? '')
          .toLowerCase()
          .includes(term)
      )
    );
  }, [data, search, keysToSearch]);

  return (
    <div className="data-table">
      {searchable && (
        <div className="data-table__search">
          <Search size={16} className="data-table__search-icon" />
          <input
            className="data-table__search-input"
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      <div className="data-table__wrapper">
        <table className="data-table__table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className="data-table__th">
                  {col.label}
                </th>
              ))}
              {renderActions && <th className="data-table__th data-table__th--actions" />}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  className="data-table__empty"
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                >
                  <TextZbl jetbrains className="data-table__empty-text">
                    {emptyMessage}
                  </TextZbl>
                </td>
              </tr>
            ) : (
              filtered.map((row, rowIndex) => (
                <tr key={rowIndex} className="data-table__row">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`data-table__td${col.truncate ? ' data-table__td--truncate' : ''}`}
                    >
                      {(() => {
                        const content = col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? '-');
                        if (typeof content === 'string' || typeof content === 'number') {
                          return (
                            <TextZbl jetbrains className="data-table__td-text">
                              {content}
                            </TextZbl>
                          );
                        }
                        return content;
                      })()}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="data-table__td data-table__td--actions">{renderActions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
