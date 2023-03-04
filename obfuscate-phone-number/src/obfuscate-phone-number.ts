export const obfuscatePhoneNumber = (number: string): string => {
    if (!new RegExp('^\\d{3}-\\d{3}-\\d{4}$').test(number)) return '';
    return number.replace(new RegExp('\\d(?=(?:-?\\d){0,5}$)', 'g'), 'X');
}