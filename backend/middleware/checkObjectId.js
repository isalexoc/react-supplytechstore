import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400);
    throw new Error("Invalid Object Id of: ${req.params.id}");
  }
  next();
}

export default checkObjectId;
