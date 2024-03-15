import {
  Validate,
  Length,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsLowercase
} from "class-validator";
import { ValidURL } from "../validations/urlValidator";

export class ResourceDTO {
  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  title: string = "";

  @IsNotEmpty()
  @IsLowercase()
  @Validate(ValidURL)
  url: string = "";

  @IsOptional()
  @IsString()
  description: string = "";

  @IsUrl()
  @IsNotEmpty()
  link: string = "";

  @IsOptional()
  @IsString()
  functions: Array<String> = [];

  @IsOptional()
  @IsString()
  keywords: Array<String> = [];
}
