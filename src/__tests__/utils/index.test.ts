import {
  getDeepValue,
  getUnique,
  getUniqueBy,
  serialize,
} from "../../utils/getUniqueBy";
import { belongsTo } from "../../utils/functions";
import { isEqual } from "../../utils/isEqual";

import { commonUtilTests } from "../common-tests/utils";

commonUtilTests({
  belongsTo,
  getDeepValue,
  getUnique,
  getUniqueBy,
  serialize,
  isEqual,
});
