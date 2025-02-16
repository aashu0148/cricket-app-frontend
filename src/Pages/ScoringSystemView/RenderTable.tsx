import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

import { TableStructure } from "./utility/constants";

const RenderTable = ({ table }: { table: TableStructure }) => {
  const { headers, rows, exceptions, note } = table;

  return (
    <div className="flex flex-col gap-1">
      <div className="pl-4">
        {table.definition && (
          <p className="text-sm">
            <span className="font-semibold">Definition:</span>{" "}
            {table.definition}
          </p>
        )}
        {table.formula && (
          <p className="text-sm">
            <span className="font-semibold">Formula:</span> {table.formula}
          </p>
        )}
      </div>

      <div className="w-fit rounded-md p-3 pb-1 border flex gap-0 flex-col max-w-full overflow-x-auto">
        <h3 className="font-medium px-2">{table.tableName}</h3>
        <Table
          className="w-fit"
          style={{ minWidth: `${160 * table.headers.length}px` }}
        >
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold w-[180px]">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="w-[180px]">
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {exceptions?.length || note ? (
        <div className="pl-4 flex flex-col gap-2">
          {exceptions && exceptions.length > 0 ? (
            <ul className="list-disc pl-4">
              {exceptions.map((exception, index) => (
                <li key={index} className="text-sm">
                  {exception}
                </li>
              ))}
            </ul>
          ) : null}

          {typeof note === "string" ? (
            <p className="text-sm">Note: {note}</p>
          ) : (
            note
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RenderTable;
