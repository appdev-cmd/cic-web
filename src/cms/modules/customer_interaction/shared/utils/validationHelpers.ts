// Validation helper functions

import { ValidationError, ValidationResult } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Vietnamese phone number format
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateRequired = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return true;
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

export const validatePattern = (value: string, pattern: string): boolean => {
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch {
    return false;
  }
};

export const buildValidationResult = (errors: ValidationError[]): ValidationResult => {
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const sanitizeFieldKey = (label: string): string => {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

export const generateCode = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};
