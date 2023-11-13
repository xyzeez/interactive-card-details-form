// Elements
const cards = document.querySelectorAll('.card');
const cardFront = document.querySelector('#cardFront');
const cardBack = document.querySelector('#cardBack');
const cardNumber = document.querySelector('#cardNumber');
const cardName = document.querySelector('#cardName');
const cardMonth = document.querySelector('#cardMonth');
const cardYear = document.querySelector('#cardYear');
const cardCvv = document.querySelector('#cardCvv');
const form = document.querySelector('#form');
const formFields = document.querySelector('#formFields');
const formInputs = document.querySelectorAll('input.form__input');
const cardNameInput = document.querySelector('#cardNameInput');
const cardNumberInput = document.querySelector('#cardNumberInput');
const expDateInputs = document
  .querySelector('.date-field__form-input')
  .querySelectorAll('.form__input');
const expMonthInput = document.querySelector('#expMonthInput');
const expYearInput = document.querySelector('#expYearInput');
const cvvInput = document.querySelector('#cvvInput');
const successState = document.querySelector('.success');
const successBtn = document.querySelector('#successBtn');

// Variables
let formSubmitted = false;
const nameRegex = /^[A-Za-z]+$/;
const numberFieldsRegex = /^[0-9]+$/;
const cardNumberRegex = /^(?!0+$)\d{16}$/;
const expDateRegex = /^(?!00)[0-9]{2}$/;
const cvvRegex = /^[0-9]{3}$/;

// Functions
// Sets validation error messages for the give input field.
const setValidationMessages = (input, errorMessage) => {
  const errorMessageID = `#${input.getAttribute('aria-errormessage')}`;
  document.querySelector(errorMessageID).textContent = errorMessage;
};

// Validates if a field is valid and sets its ARIA attributes accordingly
const isFieldValid = (field, condition) => {
  field.setAttribute('aria-invalid', !condition);
  return condition;
};

// Validates an input field using a regex and displays error messages.
const isValid = (input, regex, errorMessage) => {
  const value = input.value;
  const condition = regex.test(value);
  setValidationMessages(input, condition ? '' : errorMessage);
  return isFieldValid(input, condition);
};

// Monitors the input for the cardholder name and validates it.
const monitorNameInput = () => {
  const errorMessage = 'Please enter a valid name';
  return isValid(cardNameInput, nameRegex, errorMessage);
};

// Monitors the input for numeric fields and validates them.
const monitorNumberFieldsInput = (input) => {
  const errorMessage = 'Enter a numeric characters';
  isValid(input, numberFieldsRegex, errorMessage);
};

// Validates the card number input.
const validateCardNumberInput = () => {
  const errorMessage = 'Please enter a valid 16-digit card number';
  return isValid(cardNumberInput, cardNumberRegex, errorMessage);
};

// Validates the expiration date input.
const validateExpDateInput = () => {
  const errorMessage = 'Please enter a valid date';

  expDateInputs.forEach((input) => {
    isValid(input, expDateRegex, errorMessage);
  });

  const validation =
    isValid(expMonthInput, expDateRegex, errorMessage) &&
    isValid(expYearInput, expDateRegex, errorMessage);

  return validation;
};

// Validates the CVV input.
const validateCvvInput = () => {
  const errorMessage = 'Enter a valid CVV';
  return isValid(cvvInput, cvvRegex, errorMessage);
};

// Validates all input fields in the form.
const validateInputs = () => {
  const validation =
    monitorNameInput() &&
    validateCardNumberInput() &&
    validateExpDateInput() &&
    validateCvvInput();

  return validation;
};

// Monitors the focusout event on input fields and triggers appropriate validation.
const monitorInput = (input) => {
  input.addEventListener('blur', () => {
    if (input === cardNameInput) {
      monitorNameInput();
    } else {
      monitorNumberFieldsInput(input);
    }
  });
};

const resetErrorMessages = () => {
  formInputs.forEach((input) => {
    input.setAttribute('aria-invalid', false);
    setValidationMessages(input, '');
  });

  setValidationMessages(cardNumberInput, 'Wrong format, numbers only');
  expDateInputs.forEach((input) => {
    setValidationMessages(input, "Can't be blank");
  });

  setValidationMessages(cvvInput, "Can't be blank");
};

const clearInputsValue = () => {
  formInputs.forEach((input) => (input.textContent = ''));
};

const forwardCard = (card) => {
  cards.forEach((card) => {
    card.classList.remove('card_forward');
  });

  card.classList.add('card_forward');
};

const hideSection = (section) => {
  form.classList.remove('hide');
  successState.classList.remove('hide');
  section.classList.add('hide');
};

const resetFormState = () => {
  resetErrorMessages();
  forwardCard(cardFront);
  cards.forEach((card) => card.classList.remove('card_blur'));
  hideSection(successState);
};

const submitForm = () => {
  const formData = new FormData(form);
  cards.forEach((card) => card.classList.add('card_blur'));
  hideSection(form);
  clearInputsValue();
};

const reformatString = (string) => {
  return string
    .replace(/\s/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
};

const render = (value, field) => {
  const input = value;
  field.textContent = input;
};

const renderInputs = (field) => {
  if (field === cardNameInput) {
    render(cardNameInput.value, cardName);
  }

  if (field === cardNumberInput) {
    const value = reformatString(cardNumberInput.value);
    render(value, cardNumber);
  }

  if (field === expMonthInput) {
    render(expMonthInput.value, cardMonth);
  }

  if (field === expYearInput) {
    render(expYearInput.value, cardYear);
  }

  if (field === cvvInput) {
    render(cvvInput.value, cardCvv);
  }
};

// Events
formFields.addEventListener('focusin', (e) => {
  const targetField = e.target;

  if (targetField === cvvInput) {
    forwardCard(cardBack);
    return;
  }

  forwardCard(cardFront);
});

form.addEventListener('input', (e) => {
  const targetField = e.target;

  if (formSubmitted) resetFormState();

  renderInputs(targetField);
  monitorInput(targetField);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  formSubmitted = true;

  if (!validateInputs()) {
    monitorNameInput();
    validateCardNumberInput();
    validateExpDateInput();
    validateCvvInput();
    return;
  }

  submitForm();
});

successBtn.addEventListener('click', () => location.reload());
