import type { SqlValue } from "@/background/handlers/handler-types";

declare module "sql.js" {
  export type { SqlValue };

  export interface Statement {
    run(params?: SqlValue[]): void;
    bind(params?: SqlValue[]): boolean;
    step(): boolean;
    getAsObject(): Record<string, SqlValue>;
    free(): void;
  }

  export interface Database {
    run(sql: string, params?: SqlValue[]): Database;
    exec(sql: string): QueryExecResult[];
    prepare(sql: string): Statement;
    close(): void;
    export(): Uint8Array;
  }

  export interface QueryExecResult {
    columns: string[];
    values: SqlValue[][];
  }

  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number>) => Database;
  }

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<SqlJsStatic>;
}