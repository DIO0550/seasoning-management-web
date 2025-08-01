// Base Error Types
export { DatabaseError } from "./base/DatabaseError";
export { ErrorCode } from "./base/ErrorCode";
export { ErrorSeverity } from "./base/ErrorSeverity";

// Domain Errors
export { ValidationError } from "./domain/ValidationError";
export { NotFoundError } from "./domain/NotFoundError";
export { ConflictError } from "./domain/ConflictError";
export { ConnectionError } from "./domain/ConnectionError";

// Error Mapping
export { MySQLErrorMapper } from "./mapping/MySQLErrorMapper";
export type { MySQLError, ErrorContext } from "./mapping/ErrorContext";
