// ConvertToRJSF.ts
import { JSONSchema7 } from "json-schema";

export function convertApplicationFormFields(
  applicationForm: any[]
): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  applicationForm.forEach((field: any) => {
    schema.properties![field.name] = {
      type: field.type === "text" ? "string" : "string",
      title: field.label,
      oneOf: field.options
        ? field.options.map((opt: any) => ({
            const: opt.value,
            title: opt.label,
          }))
        : undefined,
    };
  });

  return schema;
}

export function convertEligibilityFields(eligibility: any[]): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  eligibility.forEach((eligibilityField: any) => {
    schema.properties![eligibilityField.name] = {
      type: "string",
      title: eligibilityField.label,
      enum:
        eligibilityField.criteria.conditionValues instanceof Array
          ? eligibilityField.criteria.conditionValues
          : [eligibilityField.criteria.conditionValues],
    };
  });

  return schema;
}

export function convertDocumentFields(documents: any[]): JSONSchema7 {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  documents.forEach((doc: any) => {
    schema.properties![doc.documentType] = {
      type: "string",
      title: doc.documentType,
      enum: doc.allowedproofs,
    };
  });

  return schema;
}
