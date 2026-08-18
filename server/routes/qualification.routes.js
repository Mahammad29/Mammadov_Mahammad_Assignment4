import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.isAdmin, qualificationCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, qualificationCtrl.removeAll)

router.route('/api/qualifications/:id')
  .get(qualificationCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.isAdmin, qualificationCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.isAdmin, qualificationCtrl.remove)

export default router
