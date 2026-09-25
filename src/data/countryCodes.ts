export interface CountryCode {
  code: string; // ISO 2-letter (IN, US, GB, etc.)
  name: string;
  dialCode: string; // e.g. +91, +1, +44
  flag: string; // Emoji flag e.g. 🇮🇳
  format: string; // Placeholder e.g. 98765 43210
  digitLength: number; // typical phone number length without dial code (e.g. 10)
  validationRegex: RegExp;
}

export const COUNTRY_CODES: CountryCode[] = [
  {
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    format: '98765 43210',
    digitLength: 10,
    validationRegex: /^[6-9]\d{9}$/
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '(555) 000-0000',
    digitLength: 10,
    validationRegex: /^\d{10}$/
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    flag: '🇬🇧',
    format: '7911 123456',
    digitLength: 10,
    validationRegex: /^\d{10,11}$/
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    format: '(555) 000-0000',
    digitLength: 10,
    validationRegex: /^\d{10}$/
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    format: '50 123 4567',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    dialCode: '+966',
    flag: '🇸🇦',
    format: '50 123 4567',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    flag: '🇸🇬',
    format: '8123 4567',
    digitLength: 8,
    validationRegex: /^[89]\d{7}$/
  },
  {
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    flag: '🇦🇺',
    format: '412 345 678',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    flag: '🇩🇪',
    format: '151 12345678',
    digitLength: 10,
    validationRegex: /^\d{10,11}$/
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    format: '6 12 34 56 78',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'NP',
    name: 'Nepal',
    dialCode: '+977',
    flag: '🇳🇵',
    format: '9841234567',
    digitLength: 10,
    validationRegex: /^9[78]\d{8}$/
  },
  {
    code: 'BD',
    name: 'Bangladesh',
    dialCode: '+880',
    flag: '🇧🇩',
    format: '1712 345678',
    digitLength: 10,
    validationRegex: /^1[3-9]\d{8}$/
  },
  {
    code: 'LK',
    name: 'Sri Lanka',
    dialCode: '+94',
    flag: '🇱🇰',
    format: '71 234 5678',
    digitLength: 9,
    validationRegex: /^7\d{8}$/
  },
  {
    code: 'PK',
    name: 'Pakistan',
    dialCode: '+92',
    flag: '🇵🇰',
    format: '300 1234567',
    digitLength: 10,
    validationRegex: /^3\d{9}$/
  },
  {
    code: 'MY',
    name: 'Malaysia',
    dialCode: '+60',
    flag: '🇲🇾',
    format: '12 345 6789',
    digitLength: 9,
    validationRegex: /^\d{9,10}$/
  },
  {
    code: 'JP',
    name: 'Japan',
    dialCode: '+81',
    flag: '🇯🇵',
    format: '90 1234 5678',
    digitLength: 10,
    validationRegex: /^\d{10}$/
  },
  {
    code: 'KR',
    name: 'South Korea',
    dialCode: '+82',
    flag: '🇰🇷',
    format: '10 1234 5678',
    digitLength: 10,
    validationRegex: /^\d{10}$/
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    dialCode: '+64',
    flag: '🇳🇿',
    format: '21 123 4567',
    digitLength: 9,
    validationRegex: /^\d{8,10}$/
  },
  {
    code: 'IE',
    name: 'Ireland',
    dialCode: '+353',
    flag: '🇮🇪',
    format: '85 123 4567',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'NL',
    name: 'Netherlands',
    dialCode: '+31',
    flag: '🇳🇱',
    format: '6 12345678',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'CH',
    name: 'Switzerland',
    dialCode: '+41',
    flag: '🇨🇭',
    format: '79 123 45 67',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'QA',
    name: 'Qatar',
    dialCode: '+974',
    flag: '🇶🇦',
    format: '3312 3456',
    digitLength: 8,
    validationRegex: /^\d{8}$/
  },
  {
    code: 'KW',
    name: 'Kuwait',
    dialCode: '+965',
    flag: '🇰🇼',
    format: '9123 4567',
    digitLength: 8,
    validationRegex: /^\d{8}$/
  },
  {
    code: 'OM',
    name: 'Oman',
    dialCode: '+968',
    flag: '🇴🇲',
    format: '9123 4567',
    digitLength: 8,
    validationRegex: /^\d{8}$/
  },
  {
    code: 'ZA',
    name: 'South Africa',
    dialCode: '+27',
    flag: '🇿🇦',
    format: '71 123 4567',
    digitLength: 9,
    validationRegex: /^\d{9}$/
  },
  {
    code: 'NG',
    name: 'Nigeria',
    dialCode: '+234',
    flag: '🇳🇬',
    format: '802 123 4567',
    digitLength: 10,
    validationRegex: /^\d{10}$/
  },
  {
    code: 'BR',
    name: 'Brazil',
    dialCode: '+55',
    flag: '🇧🇷',
    format: '11 91234 5678',
    digitLength: 11,
    validationRegex: /^\d{10,11}$/
  }
];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // India (+91)

/**
 * Detects if typed phone number string starts with any known country dial code
 * (e.g. "+91", "91", "+1", "+44", etc.) or matches country name / code.
 */
export function detectCountryFromInput(input: string): { country: CountryCode; cleanedNumber: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check if input begins with + followed by digits
  if (trimmed.startsWith('+')) {
    // Sort by longest dialCode first so +971 matches before +9
    const sorted = [...COUNTRY_CODES].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) {
      if (trimmed.startsWith(c.dialCode)) {
        const remaining = trimmed.slice(c.dialCode.length).trim();
        return { country: c, cleanedNumber: remaining };
      }
    }
  }

  // Check if starts with digits of dial code without plus e.g. "919876543210"
  if (trimmed.startsWith('91') && trimmed.length >= 12) {
    return { country: COUNTRY_CODES[0], cleanedNumber: trimmed.slice(2) };
  }

  return null;
}
