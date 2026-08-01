import { ApiError } from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  let input;
  if (source === 'params') {
    input = req.params;
  } else if (source === 'query') {
    input = req.query;
  } else {
    input = req.body;
  }

  const result = schema.safeParse(input);
  if (!result.success) {
    const messages = result.error.issues.map((issue) => {
      const path = issue.path.join('.');
      return `${path ? `${path}: ` : ''}${issue.message}`;
    });
    return next(new ApiError(400, messages.join('; ')));
  }

  if (source === 'params') {
    req.params = result.data;
  } else if (source === 'query') {
    req.query = result.data;
  } else {
    req.body = result.data;
  }
  next();
};

export default validate;
