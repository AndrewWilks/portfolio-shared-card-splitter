import { uuid, object } from "zod";
export type EntityAction = "create" | "update";

export default class Entity {
  public readonly _id: string;

  constructor({ id }: { id?: string }) {
    const parsed = Entity.createSchema.parse({ id });
    this._id = parsed.id;
  }

  toJSON() {
    return {
      id: this._id,
    };
  }

  static get idSchema() {
    return uuid("Entity ID must be a valid UUID");
  }

  static get createSchema() {
    return object({
      id: this.idSchema.optional().default(() => crypto.randomUUID()),
    });
  }

  static get updateSchema() {
    return object({ id: this.idSchema });
  }

  static get schema() {
    return object({ id: this.idSchema });
  }
}
