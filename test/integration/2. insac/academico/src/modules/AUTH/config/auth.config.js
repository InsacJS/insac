const AUTH = {
  sendGridApiKey : process.env.SENDGRID_API_KEY  || 'SG.WOZ...',
  header         : {
    system  : `Sistema <system@example.com>`,
    support : `Equipo de soporte <support@example.com>`
  }
}

module.exports = AUTH
