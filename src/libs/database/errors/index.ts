// Base Error Types
export { DatabaseError } from "./base/database-error";
export { ErrorCode } from "./base/error-code";
export { ErrorSeverity } from "./base/error-severity";

// Domain Errors
export { ValidationError } from "./domain/validation-error";
export { NotFoundError } from "./domain/not-found-error";
export { ConflictError } from "./domain/conflict-error";
export { ConnectionError } from "./domain/connection-error";

// Error Mapping
export { MySQLErrorMapper } from "./mapping/my-sql-error-mapper";
export type { MySQLError, ErrorContext } from "./mapping/error-context";
