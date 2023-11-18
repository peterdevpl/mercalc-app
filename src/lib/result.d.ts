export type Result<Value, Error> =
  | {
  success: false,
  error: Error
}
  | {
  success: true,
  value: Value
}
