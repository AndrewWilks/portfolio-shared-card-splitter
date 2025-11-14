import { z } from "zod";

export class ApiResponse<T> implements IApiResponse<T> {
  public readonly data: T;
  public readonly message?: string;

  constructor({ data, message }: TApiResponseData<T>) {
    this.data = data;
    this.message = message;
  }

  static parse<T>(
    data: unknown,
    schema: z.ZodTypeAny,
    message?: string
  ): ApiResponse<T> {
    const parsed = schema.parse(data);
    return new ApiResponse<T>({ data: parsed as T, message });
  }

  static safeParse<T>(data: unknown, schema: z.ZodTypeAny, message?: string) {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      return {
        successful: false,
        error: parsed.error,
      };
    }

    return {
      successful: true,
      data: new ApiResponse<T>({
        data: parsed.data as T,
        message,
      }),
    };
  }

  toString(): string {
    return `ApiResponse: [data=${JSON.stringify(this.data)}]`;
  }

  serialize(): string {
    return JSON.stringify(this.data);
  }

  toJSON() {
    return {
      data: this.data,
      message: this.message,
    };
  }
}

export type TApiResponse<T> = IApiResponse<T>;

type TApiResponseData<T> = {
  data: T;
  message?: string;
};

interface IApiResponse<T> {
  data: T;
  message?: string;

  toString(): string;
  serialize(): string;
}
