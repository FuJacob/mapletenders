import { industries, experienceLevels, contractSizes, companySizes } from "./profileConstants";

export const getIndustryDisplay = (value: string) => {
  const industry = industries.find((i) => i.value === value);
  return industry ? industry.label : "Unknown Industry";
};

export const getExperienceDisplay = (value: string) => {
  const experience = experienceLevels.find((e) => e.value === value);
  return experience ? experience.label : "Unknown Experience";
};

export const getContractSizeDisplay = (value: string) => {
  const size = contractSizes.find((s) => s.value === value);
  return size ? size.label : "Unknown Size";
};

export const getCompanySizeDisplay = (value: string) => {
  const size = companySizes.find((s) => s.value === value);
  return size ? size.label : "Unknown Size";
};