import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import JSON5 from 'json5'; 

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatValue (label) {
  return label.toLowerCase().replace(/\s+/g, "-");
};

// 1. Import the library

export function convertStringToJson(valueString) {
  // If the input is null, undefined, or empty, return an empty array.
  if (!valueString) {
    return [];
  }

  try {
    // 2. Use JSON5.parse() to handle the non-standard string directly.
    return JSON5.parse(valueString);
  } catch (error) {
    console.error("Failed to parse the string. Please check the format.", error);
    // Return an empty array on a parsing error.
    return []; 
  }
}