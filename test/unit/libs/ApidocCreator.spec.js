/* global describe it expect */
const path          = require('path')
const util          = require('../../../lib/tools/util')
const ApidocCreator = require('../../../lib/libs/ApidocCreator')
const Field         = require('../../../lib/libs/FieldCreator')

describe('\n - Clase: ApidocCreator\n', () => {
  describe(` Método: router`, () => {
    it('verificando métodos', () => {
      const router = ApidocCreator.router()
      expect(router).to.have.property('get')
      expect(router).to.have.property('post')
      expect(router).to.have.property('put')
      expect(router).to.have.property('delete')
    })
    it('get sin parámetros', () => {
      const router = ApidocCreator.router((route) => {
        expect(route.method).to.equal('get')
        expect(route.path).to.equal('/libros')
        expect(route.name).to.equal('[get] /libros')
        expect(route.group).to.equal('API')
        expect(route.description).to.equal('[get] /libros')
        expect(route.version).to.equal(1)
        expect(route.apidoc).to.have.an('string')
        expect(route.apidoc.includes('* @api {get} /libros [get] /libros')).to.equal(true)
        expect(route.apidoc.includes('* @apiName [get] /libros')).to.equal(true)
        expect(route.apidoc.includes('* @apiGroup API')).to.equal(true)
        expect(route.apidoc.includes('* @apiDescription [get] /libros')).to.equal(true)
        expect(route.apidoc.includes('* @apiVersion 1.0.0')).to.equal(true)
      })
      router.get('/libros', {})
    })
    it('put con parámetros', async () => {
      let apidocContent = ''
      const router = ApidocCreator.router((route) => {
        apidocContent = route.apidoc
        expect(route.method).to.equal('put')
        expect(route.path).to.equal('/libros/custom/:id')
        expect(route.name).to.equal('custom name')
        expect(route.group).to.equal('custom group')
        expect(route.description).to.equal('custom description')
        expect(route.version).to.equal(2)
        expect(route).to.have.property('middlewares')
        expect(route).to.have.property('controller')
        expect(route.apidoc).to.have.an('string')
        let basicProperties = ``
        basicProperties += `/**\n`
        basicProperties += `* @api {put} /libros/custom/:id custom name\n`
        basicProperties += `* @apiName custom name\n`
        basicProperties += `* @apiGroup custom group\n`
        basicProperties += `* @apiDescription custom description\n`
        basicProperties += `* @apiVersion 2.0.0\n`
        expect(route.apidoc.includes(basicProperties)).to.equal(true)

        let params = ``
        params += `* @apiHeader (Datos de entrada - headers) {String} authorization token de acceso <br><strong>len: </strong><code>0,255</code>\n`
        params += `* @apiParam (Datos de entrada - params) {Integer} id ID del libro <br><strong>isInt: </strong><code>true</code>, <strong>min: </strong><code>0</code>, <strong>max: </strong><code>2147483647</code>\n`
        params += `* @apiParam (Datos de entrada - query) {String} [fields] Campos a devolver en el resultado <br><strong>len: </strong><code>0,255</code>\n`
        params += `* @apiParam (Datos de entrada - body) {String} titulo Título del libro <br><strong>len: </strong><code>0,255</code>\n`
        params += `* @apiParam (Datos de entrada - body) {Object} editorial Datos del objeto **editorial**\n`
        params += `* @apiParam (Datos de entrada - body) {String} [editorial.nombre] Nombre de la editorial <br><strong>len: </strong><code>0,255</code>\n`
        params += `* @apiParam (Datos de entrada - body) {Object[]} autores Lista de objetos **autores**\n`
        params += `* @apiParam (Datos de entrada - body) {Object} autores Datos del objeto **autores**\n`
        params += `* @apiParam (Datos de entrada - body) {String} [autores.nombre] Nombre del autor <br><strong>len: </strong><code>0,255</code>\n`
        params += `* @apiParam (Datos de entrada - body) {String} [autores.email] Email del autor <br><strong>len: </strong><code>0,255</code>, <strong>isEmail: </strong><code>true</code>\n`
        expect(route.apidoc.includes(params)).to.equal(true)

        let paramExample = ``
        paramExample += `* @apiParamExample {json} Ejemplo Petición \n`
        paramExample += `* {\n`
        paramExample += `*   "titulo": "text",\n`
        paramExample += `*   "editorial": {\n`
        paramExample += `*     "nombre": "text"\n`
        paramExample += `*   },\n`
        paramExample += `*   "autores": [\n`
        paramExample += `*     {\n`
        paramExample += `*       "nombre": "text",\n`
        paramExample += `*       "email": "text"\n`
        paramExample += `*     }\n`
        paramExample += `*   ]\n`
        paramExample += `* }\n`
        expect(route.apidoc.includes(paramExample)).to.equal(true)

        let successes = ``

        successes += `* @apiSuccess (Respuesta - body) {String} [titulo] Título del libro \n`
        successes += `* @apiSuccess (Respuesta - body) {Integer} [id_editorial] ID de la editorial \n`
        successes += `* @apiSuccess (Respuesta - body) {Integer[]} [ids_autores] Ids autores \n`
        expect(route.apidoc.includes(successes)).to.equal(true)

        let successExample = ``
        successExample += `* @apiSuccessExample {json} Respuesta Exitosa\n`
        successExample += `* {\n`
        successExample += `*   "titulo": "text",\n`
        successExample += `*   "id_editorial": 1,\n`
        successExample += `*   "ids_autores": [\n`
        successExample += `*     1,\n`
        successExample += `*     2\n`
        successExample += `*   ]\n`
        successExample += `* }\n`
        expect(route.apidoc.includes(successExample)).to.equal(true)

        let defineAdmin = ``
        defineAdmin += `* @apiDefine admin Rol: ADMIN\n`
        defineAdmin += `* Solo los usuarios que tengan este rol pueden acceder al recurso.\n`
        expect(route.apidoc.includes(defineAdmin)).to.equal(true)

        let defineUser = ``
        defineUser += `* @apiDefine user Rol: USER\n`
        defineUser += `* Solo los usuarios que tengan este rol pueden acceder al recurso.\n`
        expect(route.apidoc.includes(defineUser)).to.equal(true)

        let customParamExample = ``
        customParamExample += `* @apiParamExample {json} Ejemplo Petición Personalizado\n`
        customParamExample += `* {\n`
        customParamExample += `*   "titulo": "El gato negro",\n`
        customParamExample += `*   "editorial": {\n`
        customParamExample += `*     "nombre": "Sin nombre"\n`
        customParamExample += `*   },\n`
        customParamExample += `*   "autores": [\n`
        customParamExample += `*     {\n`
        customParamExample += `*       "nombre": "Edgar Allan Poe",\n`
        customParamExample += `*       "email": "edgar.allan.poe@gmail.com"\n`
        customParamExample += `*     }\n`
        customParamExample += `*   ]\n`
        customParamExample += `* }\n`
        expect(route.apidoc.includes(customParamExample)).to.equal(true)

        let customSuccessExample = ``
        customSuccessExample += `* @apiSuccessExample {json} Respuesta Exitosa Personalizada\n`
        customSuccessExample += `* {\n`
        customSuccessExample += `*   "titulo": "El gato negro",\n`
        customSuccessExample += `*   "id_editorial": 100,\n`
        customSuccessExample += `*   "ids_autores": [\n`
        customSuccessExample += `*     1000,\n`
        customSuccessExample += `*     2000\n`
        customSuccessExample += `*   ]\n`
        customSuccessExample += `* }\n`
        expect(route.apidoc.includes(customSuccessExample)).to.equal(true)
      })
      const AUTHORIZATION    = Field.STRING({ comment: 'token de acceso' })
      const FIELDS           = Field.STRING({ comment: 'Campos a devolver en el resultado' })
      const ID_LIBRO         = Field.INTEGER({ comment: 'ID del libro' })
      const TITULO_LIBRO     = Field.STRING({ comment: 'Título del libro' })
      const NOMBRE_EDITORIAL = Field.STRING({ comment: 'Nombre de la editorial' })
      const NOMBRE_AUTOR     = Field.STRING({ comment: 'Nombre del autor' })
      const EMAIL_AUTOR      = Field.STRING({ comment: 'Email del autor', validate: { isEmail: true } })
      const ID_EDITORIAL     = Field.INTEGER({ comment: 'ID de la editorial' })
      const IDS_AUTORES      = Field.ARRAY(Field.INTEGER({ comment: `ID's de los autores` }))

      router.put('/libros/custom/:id', {
        name        : 'custom name',
        group       : 'custom group',
        description : 'custom description',
        version     : 2,
        permissions : ['admin', 'user'],
        input       : {
          headers: {
            authorization: Field.clone(AUTHORIZATION, { allowNull: false })
          },
          params: {
            id: Field.clone(ID_LIBRO, { allowNull: false })
          },
          query: {
            fields: Field.clone(FIELDS)
          },
          body: {
            titulo    : Field.clone(TITULO_LIBRO, { allowNull: false }),
            editorial : {
              nombre: Field.clone(NOMBRE_EDITORIAL)
            },
            autores: [{
              nombre : Field.clone(NOMBRE_AUTOR),
              email  : Field.clone(EMAIL_AUTOR)
            }]
          }
        },
        output: {
          titulo       : Field.clone(TITULO_LIBRO),
          id_editorial : Field.clone(ID_EDITORIAL),
          ids_autores  : Field.clone(IDS_AUTORES)
        },
        middlewares: [
          (req, res, next) => { next() }
        ],
        controller: (req, res, next) => {
          return res.status(200).json({ msg: 'ok' })
        },
        inputExamples: [
          {
            title : 'Ejemplo Petición Personalizado',
            data  : {
              titulo    : 'El gato negro',
              editorial : {
                nombre: 'Sin nombre'
              },
              autores: [
                {
                  nombre : 'Edgar Allan Poe',
                  email  : 'edgar.allan.poe@gmail.com'
                }
              ]
            }
          }
        ],
        outputExamples: [
          {
            title : 'Respuesta Exitosa Personalizada',
            data  : {
              titulo       : 'El gato negro',
              id_editorial : 100,
              ids_autores  : [ 1000, 2000 ]
            }
          }
        ]
      })
      await createApidoc(apidocContent)
    })
  })
})

async function createApidoc (apidocContent) {
  const TMP = path.resolve(__dirname, '.tmp')
  const INPUT = path.resolve(TMP, 'input')
  const OUTPUT = path.resolve(TMP, 'output')
  util.mkdir(INPUT)
  util.writeFile(`${INPUT}/apidoc.js`, apidocContent)
  await util.cmd(`node "../../../../node_modules/apidoc/bin/apidoc" -i "${INPUT}" -o "${OUTPUT}"`, TMP)
  expect(true).to.equal(true)
}
