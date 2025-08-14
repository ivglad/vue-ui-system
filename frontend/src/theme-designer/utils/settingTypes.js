/**
 * Setting types and constants
 * Defines the types of settings available in the theme designer
 */

// Setting Types Constants
export const SettingTypes = {
  COLOR: 'color',
  SIZE: 'size',
  SPACING: 'spacing',
  BORDER_RADIUS: 'borderRadius',
  FONT_SIZE: 'fontSize',
  FONT_WEIGHT: 'fontWeight',
  SHADOW: 'shadow',
  TRANSITION: 'transition',
  SELECT: 'select',
  BOOLEAN: 'boolean',
  RANGE: 'range'
}

// Unit Constants
export const Units = {
  PX: 'px',
  REM: 'rem',
  EM: 'em',
  PERCENT: '%',
  VW: 'vw',
  VH: 'vh',
  NONE: ''
}

// Default units for each setting type
export const DefaultUnits = {
  [SettingTypes.SIZE]: [Units.PX, Units.REM, Units.EM],
  [SettingTypes.SPACING]: [Units.PX, Units.REM, Units.EM],
  [SettingTypes.BORDER_RADIUS]: [Units.PX, Units.REM, Units.PERCENT],
  [SettingTypes.FONT_SIZE]: [Units.PX, Units.REM, Units.EM],
  [SettingTypes.SHADOW]: [Units.PX],
  [SettingTypes.TRANSITION]: [Units.NONE]
}