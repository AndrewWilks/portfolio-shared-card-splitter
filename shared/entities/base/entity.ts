import { object, uuid } from "zod";
import { ApiResponse } from "../api/apiResponse.ts";
export type EntityAction = "create" | "update";

export default class Entity {
  public readonly id: string;

  constructor({ id }: { id?: string }) {
    const parsed = Entity.idSchema.parse(id);
    this.id = parsed;
  }

  toJSON() {
    return {
      id: this.id,
    };
  }

  static get idSchema() {
    return uuid("Entity ID must be a valid UUID");
  }

  static get schema() {
    return object({ id: this.idSchema });
  }

  // API Request Helpers
  static get ApiCreateRequestSchema() {
    return this.schema.omit({ id: true });
  }

  static get ApiUpdateRequestSchema() {
    return this.schema;
  }

  // API Response Helpers
  static parseSingleResponse(data: unknown) {
    return ApiResponse.parse(data, this.schema);
  }

  static parseArrayResponse(data: unknown) {
    const arraySchema = this.schema.array();
    return ApiResponse.parse(data, arraySchema);
  }

  static createSingleResponse(
    entity: Entity,
    message = "Entity retrieved successfully",
  ) {
    return new ApiResponse({
      data: entity.toJSON(),
      message,
    });
  }

  static createArrayResponse(
    entities: Entity[],
    message = "Entities retrieved successfully",
  ) {
    return new ApiResponse({
      data: entities.map((entity) => entity.toJSON()),
      message,
    });
  }
}
