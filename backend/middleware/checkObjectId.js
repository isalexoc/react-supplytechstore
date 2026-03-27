import { isValidObjectId } from "mongoose";

function checkObjectId(req, res, next) {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      message: `Invalid Object Id: ${req.params.id}`,
    });
  }
  next();
}

export default checkObjectId;
