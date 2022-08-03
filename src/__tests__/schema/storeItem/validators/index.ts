import { IStringOptions } from "../../../../utils/interfaces";
import { IOtherMeasureUnit, IStoreItem } from "../interfaces";

import { isArrayOk, isNumberOk, isStringOk } from "../../../../validate";
import { findBy } from "../../../../utils/getUniqueBy";

export const validateString = (
  errorMessage = "",
  options: IStringOptions = {}
) => {
  return (val: any) => {
    let { reasons, valid, validated } = isStringOk(val, options);

    if (!valid && errorMessage) reasons = [errorMessage];

    return { reasons, valid, validated };
  };
};

export const validateOtherUnit = (value: any) => {
  const { valid: validCoeff, validated: coefficient } = isNumberOk(
    value?.coefficient,
    { range: { bounds: [0], inclusiveBottom: false } }
  );
  const { valid: validName, validated: name } = isStringOk(value?.name);

  if (!validCoeff || !validName)
    return {
      reasons: ["Invalid other unit"],
      valid: false,
      validated: undefined,
    };

  return { reasons: [], valid: true, validated: { coefficient, name } };
};

export const validateOtherUnits = async (value: any) => {
  return await isArrayOk(value, {
    empty: true,
    filter: (v) => validateOtherUnit(v).valid,
    modifier: (v) => validateOtherUnit(v).validated,
    uniqueKey: "name",
  });
};

export const validatePrice = (value: any) =>
  isNumberOk(value, { range: { bounds: [0] } });

export const validateQuantity = (value: any) =>
  isNumberOk(value, { range: { bounds: [0] } });

export const validateOtherQuantity = (value: any, ctx: IStoreItem) => {
  const mu = getMeasureUnit(ctx.otherMeasureUnits!, value?.name);

  const { valid: validQty, validated: quantity } = isNumberOk(value?.quantity, {
    range: { bounds: [0], inclusiveBottom: false },
  });

  if (!mu || !validQty)
    return {
      reasons: ["Invalid other quantity"],
      valid: false,
      validated: undefined,
    };

  return {
    reasons: [],
    valid: true,
    validated: { name: value.name, quantity },
  };
};

export const validateQuantities = async (value: any, ctx: IStoreItem) => {
  return isArrayOk(value, {
    empty: true,
    unique: false,
    filter: (v) => validateOtherQuantity(v, ctx).valid,
    modifier: (v) => validateOtherQuantity(v, ctx).validated,
  });
};

const getMeasureUnit = (
  otherMeasureUnits: IOtherMeasureUnit[],
  name: string
) => {
  return findBy(otherMeasureUnits, { name });
};

export const onQuantitiesChange = ({
  quantity,
  quantities,
  otherMeasureUnits,
}: IStoreItem) => {
  const _quantity = quantities!.reduce((prev, { name, quantity }) => {
    const mu = getMeasureUnit(otherMeasureUnits!, name);

    if (!mu) return prev;

    return (prev += quantity * mu.coefficient);
  }, quantity!);

  return { quantity: _quantity };
};
