// ansicolor: https://github.com/shiena/ansicolor/blob/master/README.md

/**
* Colores para escribir en la consola.
* @const
*/
const colors = {
  BLACK         : `\x1b[30m`,
  RED           : `\x1b[31m`,
  GREEN         : `\x1b[32m`,
  YELLOW        : `\x1b[33m`,
  BLUE          : `\x1b[34m`,
  MAGENTA       : `\x1b[35m`,
  CYAN          : `\x1b[36m`,
  LIGHT_GREY    : `\x1b[90m`,
  LIGHT_RED     : `\x1b[91m`,
  LIGHT_GREEN   : `\x1b[92m`,
  LIGHT_YELLOW  : `\x1b[93m`,
  LIGHT_BLUE    : `\x1b[94m`,
  LIGHT_MAGENTA : `\x1b[95m`,
  LIGHT_CYAN    : `\x1b[96m`,
  LIGHT_WHITE   : `\x1b[97m`
}
colors.WHITE   = colors.LIGHT_WHITE

/**
* Estilos para escribir en la consola.
* @const
*/
const styles = {
  BOLD          : `\x1b[1m`,
  BOLD_OFF      : `\x1b[21m`,
  UNDERLINE     : `\x1b[4m`,
  UNDERLINE_OFF : `\x1b[24m`,
  BLINK         : `\x1b[5m`,
  BLINK_OFF     : `\x1b[25m`
}

colors.PRIMARY = `${styles.BOLD}${colors.LIGHT_BLUE}`
colors.ACCENT  = `${styles.BOLD}${colors.LIGHT_WHITE}`

colors.FATAL   = `${styles.BOLD}${colors.RED}`
colors.ERROR   = `${styles.BOLD}${colors.LIGHT_RED}`
colors.WARN    = `${styles.BOLD}${colors.LIGHT_YELLOW}`
colors.NOTICE  = `${styles.BOLD}${colors.LIGHT_GREEN}`
colors.INFO    = `${styles.BOLD}${colors.LIGHT_WHITE}`
colors.VERBOSE = `${styles.BOLD}${colors.LIGHT_CYAN}`
colors.DEBUG   = `${styles.BOLD}${colors.MAGENTA}`
colors.SILLY   = `${styles.BOLD}${colors.BLUE}`

colors.TEXT    = `${colors.LIGHT_WHITE}`

colors.RESET   = `\x1b[0m`

module.exports = { colors, styles }
