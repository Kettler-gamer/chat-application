import { ObjectId } from "mongoose";

export function isObjectIdValid(id) {
  return ObjectId.isValid(id)
    ? String(new ObjectId(id) === id)
      ? true
      : false
    : false;
}
