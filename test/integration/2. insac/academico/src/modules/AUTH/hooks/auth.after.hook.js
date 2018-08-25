module.exports = async (app) => {
  await app.AUTH.loadComponent(app, 'custom', '.custom.js')
}
