import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";

@ValidatorConstraint({ name: "isValidURL", async: false })
export class ValidURL implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const regexp = /^[a-zA-Z0-9-]+$/;

    return regexp.test(text);
    // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return "URL should only contain alphanumeric and hyphen value";
  }
}
