const addShop = "INSERT INTO shops (shopname, currentrenter, schedule) VALUES ($1, $2, $3)"
const getShopByName = "SELECT * FROM shops WHERE shopname = $1"
const deleteShop = "DELETE FROM shops WHERE shopname = $1"
const getShops = "SELECT * FROM shops"
const bookShop = "UPDATE shops SET schedule = $1, currentrenter = $2 WHERE shopname = $3"
const registerUser = "INSERT INTO allusers (name) VALUES ($1)"
const getUserByName = "SELECT * FROM allusers WHERE name = $1"
const banOwner = "INSERT INTO bannedusers (banneduser) VALUES ($1)"
const getBannedUser = "SELECT * FROM bannedusers WHERE banneduser = $1"

module.exports = {
    addShop,getShopByName,deleteShop,getShops,bookShop,registerUser,getUserByName,banOwner,
    getBannedUser,
}
