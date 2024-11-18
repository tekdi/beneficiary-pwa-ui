import { JSONSchema7 } from "json-schema";

interface ApplicationFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}

interface EligibilityFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  clause?: string;
  evidence?: string;
  criteria?: {
    name: string;
    condition: string;
    conditionValues: string[] | string;
  };
  allowedProofs?: string[];
}
interface Document {
  documentType: string;
  isRequired: boolean;
  allowedProofs: string[];
}

interface ScholarshipSchema {
  applicationForm: ApplicationFormField[];
  eligibility: EligibilityFormField[];
  documents: Document[];
}

// export const convertToRJSFFormat = (schema: ScholarshipSchema) => {
//   const rjsfSchema: any = {
//     title: "Pre-Matric Scholarship Application",
//     type: "object",
//     properties: {},
//   };

//   const fieldNames: Set<string> = new Set();
//   const checkUniqueField = (name: string) => {
//     if (fieldNames.has(name)) {
//       console.log(`Duplicate field found and deleted: ${name}`);
//       return true;
//     }
//     fieldNames.add(name);
//     return false;
//   };

//   if (Array.isArray(schema.applicationForm)) {
//     schema.applicationForm.forEach((field) => {
//       let fieldSchema: any = {
//         type: "string",
//         title: field.label,
//       };

//       if (field.type === "radio" || field.type === "select") {
//         fieldSchema.enum = field.options?.map((option) => option.value);
//         fieldSchema.enumNames = field.options?.map((option) => option.label);
//         fieldSchema.enumSeparator = field.multiple ? "," : undefined;
//       }

//       if (field.required) {
//         fieldSchema.required = true;
//       }

//       rjsfSchema.properties[field.name] = fieldSchema;
//       console.log(
//         `Added field to schema: ${field.name}`,
//         rjsfSchema.properties[field.name]
//       );
//     });
//   }

//   if (Array.isArray(schema.eligibility)) {
//     schema.eligibility.forEach((eligibility) => {
//       const eligibilitySchema: any = {
//         type: "string",
//         title: eligibility.criteria?.name,
//         required: !!eligibility.allowedproofs?.length,
//         // format: "data-url",
//       };
//       if (eligibility.criteria) {
//         const conditionValues = Array.isArray(
//           eligibility.criteria.conditionValues
//         )
//           ? eligibility.criteria.conditionValues
//           : [eligibility.criteria.conditionValues];

//         eligibilitySchema.enum = conditionValues;
//         // eligibilitySchema.enumNames = conditionValues;
//       }

//       if (eligibility.allowedproofs) {
//         eligibilitySchema.allowedProofs = eligibility.allowedproofs;
//       }

//       if (eligibility.evidence) {
//         rjsfSchema.properties[eligibility.evidence] = eligibilitySchema;
//       }
//     });
//   }

//   if (Array.isArray(schema.documents)) {
//     schema.documents.forEach((document) => {
//       const documentSchema: any = {
//         type: "string",
//         title: document.documentType,
//         format: "data-url",
//       };
//       rjsfSchema.properties[document.documentType] = documentSchema;
//     });
//   }

//   console.log("Converted RJSF Schema:", rjsfSchema);
//   return rjsfSchema;
// };
const rjsfSchema: any = {
  title: "",
  type: "object",
  properties: {},
};
export const convertApplicationFormFields = (
  applicationForm: ApplicationFormField[]
) => {
  applicationForm.forEach((field) => {
    let fieldSchema: any = {
      type: "string",
      title: field.label,
    };

    if (field.type === "radio" || field.type === "select") {
      fieldSchema.enum = field.options?.map((option) => option.value);
      fieldSchema.enumNames = field.options?.map((option) => option.label);
      fieldSchema.enumSeparator = field.multiple ? "," : undefined;
    }

    if (field.required) {
      fieldSchema.required = true;
    }

    rjsfSchema.properties[field.name] = fieldSchema;
    console.log(
      `Added field to schema: ${field.name}`,
      rjsfSchema.properties[field.name]
    );
  });
  return rjsfSchema;
};

export const convertEligibilityFields = (eligibility: any[]): JSONSchema7 => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  eligibility.forEach((eligibilityField: any) => {
    const fieldLabel = `Upload document for ${eligibilityField.evidence}${
      eligibilityField.allowedProofs
        ? ` (${eligibilityField.allowedProofs.join(", ")})`
        : ""
    }`;
    schema.properties![eligibilityField.name] = {
      type: "string",
      title: fieldLabel,
      enum: eligibilityField.allowedProofs || [],
    };
  });

  return schema;
};
export const convertDocumentFields = (documents: Document[]): JSONSchema7 => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  documents.forEach((doc: any) => {
    schema.properties![doc.documentType] = {
      type: "string",
      title: `Upload document for ${doc.documentType}${
        doc.allowedproofs ? ` (${doc.allowedproofs.join(", ")})` : ""
      }`,
      format: "data-url",
    };
  });

  return schema;
};
export function checkUniqueField<T>(schemaArray: T[], field: keyof T): boolean {
  const seen = new Set();
  for (const item of schemaArray) {
    const value = item[field];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
  }
  return true;
}
