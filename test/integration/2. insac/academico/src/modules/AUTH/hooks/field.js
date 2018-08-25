const { Field } = require(global.INSAC)

Field.use('LIMIT', Field.LIMIT({
  validate: { isInt: true, min: 1, max: 1000 }
}))

Field.use('BEARER_AUTHORIZATION', Field.TEXT({
  comment : 'Credenciales del acceso. <code>Bearer [accessToken]</code>',
  example : 'Bearer s83hs7.sdf423.f23f'
}))
