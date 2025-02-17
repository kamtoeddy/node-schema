import { type FieldKey, isEqual, sortKeys } from '../../utils';
import type {
  ErrorPayload,
  FieldError,
  IErrorTool,
  ValidationErrorMessage,
} from './types';

export { DefaultErrorTool };

class DefaultErrorTool<PayloadKeys extends FieldKey = FieldKey>
  implements IErrorTool<{ payload: ErrorPayload<PayloadKeys> }>
{
  private _payload: ErrorPayload<PayloadKeys> = {};

  constructor(private message: ValidationErrorMessage) {}

  get data() {
    return { message: this.message, payload: sortKeys(this._payload) };
  }

  get fields() {
    return Object.keys(this._payload);
  }

  get isLoaded() {
    return Object.keys(this._payload).length > 0;
  }

  set(field: PayloadKeys, value: FieldError) {
    if (!(field in this._payload)) {
      this._payload[field] = value;

      return this;
    }

    const currentValues = this._payload[field]!;

    const metadata = value.metadata;

    if (metadata && !isEqual(currentValues?.metadata, metadata))
      currentValues.metadata = {
        ...(currentValues?.metadata ?? {}),
        ...metadata,
      };

    this._payload[field] = currentValues;

    return this;
  }

  setMessage(message: ValidationErrorMessage) {
    this.message = message;

    return this;
  }
}
