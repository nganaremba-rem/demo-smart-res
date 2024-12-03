import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return '';

      for (const rule of rules) {
        if (rule.required && !value) {
          return rule.message || 'This field is required';
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message || 'Invalid format';
        }
        if (rule.minLength && value.length < rule.minLength) {
          return (
            rule.message || `Minimum ${rule.minLength} characters required`
          );
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return rule.message || `Maximum ${rule.maxLength} characters allowed`;
        }
        if (rule.min && Number(value) < rule.min) {
          return rule.message || `Minimum value is ${rule.min}`;
        }
        if (rule.max && Number(value) > rule.max) {
          return rule.message || `Maximum value is ${rule.max}`;
        }
        if (rule.custom && !rule.custom(value)) {
          return rule.message || 'Invalid value';
        }
      }
      return '';
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    },
    [validateField]
  );

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(validationRules).forEach((name) => {
      newErrors[name] = validateField(name, values[name]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  }, [values, validateField, validationRules]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setValues,
  };
};
