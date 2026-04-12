/**
 * Serializable state interface.
 * Satisfies Constitution VI: "State management MUST use serializable
 * data structures to support snapshot comparison testing."
 *
 * Pure logic - no platform API dependencies.
 */
export interface SerializableState {
  /**
   * Serialize state to a plain JSON object.
   * Return value MUST only contain JSON-compatible types:
   * string, number, boolean, null, array, plain object.
   */
  toJSON(): Record<string, unknown>;

  /**
   * Restore state from a plain JSON object.
   * @param data Data produced by toJSON()
   */
  fromJSON(data: Record<string, unknown>): void;

  /**
   * Create a read-only snapshot of current state.
   * Used for state comparison testing and debugging.
   */
  snapshot(): Readonly<Record<string, unknown>>;
}
