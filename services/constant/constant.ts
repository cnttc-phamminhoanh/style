export const defaultAppointmentDuration = 30; // 30 minutes

export const defaultServices = [
  { serviceName: "hairCut", price: 40 },
  { serviceName: "trim", price: 80 },
  { serviceName: "extensions", price: 80 },
  { serviceName: "keratine", price: 80 },
  { serviceName: "color", price: 56 },
  { serviceName: "perm", price: 40 },
  { serviceName: "curling", price: 60 },
  { serviceName: "highlights", price: 80 },
  { serviceName: "conditioning", price: 20 },
  { serviceName: "scalpMessage", price: 50 },
];

export const defaultCustomerRequestDuration = 30; // 30 minutes

// Firebase realtime database collections
export enum FRDCollections {
  ROOMS = 'rooms'
}

// Stripe connect account country
export enum ConnectAccountCountry {
  ARGENTINA = 'AR',
  AUSTRALIA = 'AU',
  BELGIUM = 'BE',
  BOLIVIA = 'BO',
  BRAZIL = 'BR',
  BULGARIA = 'BG',
  CANADA = 'CA',
  CHILE = 'CL',
  COLUMBIA = 'CO',
  COSTA_RICA = 'CR',
  CROATIA = 'HR',
  CYPRUS = 'CY',
  CZECH_REPUBLIC = 'CZ',
  DENMARK = 'DK',
  DOMINICAN_REPUBLIC = 'DO',
  ESTONIA = 'EE',
  FINLAND = 'FI',
  FRANCE = 'FR',
  GERMANY = 'DE',
  GREECE = 'GR',
  HONG_KONG_SQR_CHINA = 'HK',
  HUNGARY = 'HU',
  ICELAND = 'IS',
  INDIA = 'IN',
  INDONESIA = 'ID',
  IRELAND = 'IE',
  ISRAEL = 'IL',
  ITALY = 'IT',
  JAPAN = 'JP',
  LATVIA = 'LV',
  LIECHTENSTEIN = 'LI',
  LITHUANIA = 'LT',
  LUXEMBOURG = 'LU',
  MALTA = 'MT',
  MEXICO = 'MX',
  NETHERLANDS = 'NL',
  NEW_ZEALAND = 'NZ',
  NORWAY = 'NO',
  PARAGUAY = 'PY',
  PERU = 'PE',
  POLAND = 'PL',
  PORTUGAL = 'PT',
  ROMANIA = 'RO',
  SINGAPORE = 'SG',
  SLOVAKIA = 'SK',
  SLOVENIA = 'SI',
  SPAIN = 'ES',
  SWEDEN = 'SE',
  SWITZERLAND = 'CH',
  THAILAND = 'TH',
  TRINIDAD_TOBAGO = 'TT',
  UNITED_ARAB_EMIRATES = 'AE',
  UNITED_KINGDOM = 'GB',
  UNITED_STATES = 'US',
  URUGUAY = 'UY'
}

// Stripe connect account business type
export enum ConnectAccountBusinessType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company',
  NON_PROFIT = 'non_profit',
  GOVERNMENT_ENTITY = 'government_entity' // US only
}

// Stripe connect account link type
export enum ConnectAccountLinkType {
  ACCOUNT_ONBOARDING = 'account_onboarding',
  ACCOUNT_UPDATE = 'account_update'
}

export const percentageFeeOnGrossAmount = 0
