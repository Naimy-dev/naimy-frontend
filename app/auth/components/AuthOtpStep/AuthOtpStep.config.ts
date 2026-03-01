export const otpLength = 6;

export function getFormattedPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  const localPhone = digits.slice(-9);
  const firstPart = localPhone.slice(0, 2);
  const middlePart = localPhone.slice(2, 5);
  const tailOne = localPhone.slice(5, 7);
  const tailTwo = localPhone.slice(7, 9);

  return `+375 (${firstPart}) ${middlePart}-${tailOne}-${tailTwo}`;
}
