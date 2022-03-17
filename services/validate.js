import Validator from 'validatorjs';
import HttpError from 'http-errors';

export default function validate(input, rules, customMessages) {
  const data = new Validator(input, rules, customMessages);
  if (data.fails()) {
    throw HttpError(422, data.errors);
  }
}
