const {Router} = require('express')

const router = Router()
const controller = require('./controller')
router.get('/',(req,res) => {
    res.send('Hello World from Router')
})
router.get('/getNext/:shopname',controller.getNext)
router.post('/addShop',controller.addShop)
router.delete('/deleteShop/:shopname',controller.deleteShop)
router.get('/getAll',controller.getAll)
router.post('/bookShop/:shopname',controller.bookShop)
router.post('/registerUser',controller.registerUser)
router.post('/banOwner',controller.banOwner)
module.exports = router
