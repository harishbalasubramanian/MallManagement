const pool = require('./db')
const queries = require('./queries')

// getAll --> display the shop
const getAll = (req,res) => {
    pool.query(queries.getShops,(err,results) => {
        if(err)
        {
            res.send('An error happened when displaying the results')
        }
        else{
            console.log(results.rows.length)
            if(results.rows.length == 0)
            {
                console.log('here')
                res.send('The Mall doesn\'t have any shops')
            }
            let output = '';
            for(let i = 0; i < results.rows.length; i++)
            {
                let schedule = ''
                for(let j = 0; j < results.rows[i].schedule.length; j++)
                {
                    schedule += `Week ${j+1}: `+results.rows[i].schedule[j]+', '
                }
                schedule += 'all future weeks are Empty'
                output += results.rows[i].shopname.toString() + '\t' + results.rows[i].currentrenter.toString() + '\t' + schedule
                if(i != results.rows.length - 1)
                {
                    output += '\n'
                }
            }
            res.send(output)
        }
    })
}
// getNext --> take in shop name and return next timeslot
const getNext = (req,res) => {
    const shopname = req.params.shopname;
    pool.query(queries.getShopByName,[shopname],(err,results) => {
        const noShopFound = !results.rows.length
        if(noShopFound)
        {
            res.send('No Shop Has the Name You Provided')
        }
        else{
            let schedule = results.rows[0].schedule
            let time = 0
            for(let i = 0; i < schedule.length; i++)
            {
                console.log(schedule[i].toString())
                if(schedule[i].toString() == 'Empty')
                {
                    time = i + 1;
                    break;
                }
                if(i == schedule.length - 1)
                {
                    time = i + 1;
                }
            }
            res.send(`${shopname} has a free timeslot on Week ${time}`)
        }
    })
}
// addShop
const addShop = (req,res) => {
    const {shopname} = req.body;

    pool.query(queries.addShop,[shopname,'Empty',['Empty']],(err,results) => {
        if(err)
        {
            res.send('Shop was not created')
        }
        else
        {
            res.status(201).send('Shop created successfully')
        }
    })
}
// deleteShop
const deleteShop = (req,res) => {
    const shopname = req.params.shopname;
    pool.query(queries.getShopByName,[shopname],(err,results) => {
        const noShopFound = !results.rows.length
        if(noShopFound)
        {
            res.send('No Shop Has the Name You Provided')
        }
        else{
            pool.query(queries.deleteShop,[shopname],(error,delete_results) => {
                if(error)
                {
                    res.send('Shop wasn\'t deleted')
                }
                res.status(200).send('Shop was deleted')
            })
        }
    })
}
// bookShop --> allow the owner to book the shop 1 week at a time (pass in the index of the array to where they want to add their booking)
const bookShop = (req,res) => {
    const shopname = req.params.shopname;
    let {businessOwner, time} = req.body; 
    time--;
    pool.query(queries.getUserByName,[businessOwner],(user_error,user_results) => {
        if(user_results.rows.length == 0)
        {
            res.send('User doesn\'t exist')
        }
        else
        {
            pool.query(queries.getBannedUser,[businessOwner],(e,r) => {
                if(r.rows.length > 0)
                {
                    res.send('User is Banned')
                }
                else{
                    pool.query(queries.getShopByName,[shopname],(err,results) => {
                        const noShopFound = !results.rows.length
                        if(noShopFound)
                        {
                            res.send('No Shop Has the Name You Provided')
                        }
                        else{
                            let schedule = results.rows[0].schedule
                            let currentrenter = results.rows[0].currentrenter
                            if(time < schedule.length && schedule[time].toString() != 'Empty')
                            {
                                res.send('That time is already booked')
                            }
                            else{
                                if(time >= schedule.length)
                                {
                                    let curLen = schedule.length;
                                    for(let i = curLen; i <= time - 1; i++)
                                    {
                                        schedule[i] = 'Empty'
                                    }
                                    schedule[time] = businessOwner
                                }
                                else
                                {
                                    schedule[time] = businessOwner
                                }
                                currentrenter = schedule[0]
                                pool.query(queries.bookShop,[schedule, currentrenter, shopname],(error,update_results) => {
                                    if(error)
                                    {
                                        res.send('The booking could not be done')
                                    }
                                    else
                                    {
                                        res.send(`${businessOwner} now has a booking for shop ${shopname} on Week ${time+1}`)
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    })
    
    
}
// banOwner
const banOwner = (req,res) => {
    const {name} = req.body;
    console.log(name);
    pool.query(queries.getUserByName,[name],(err,results) => {
        if(results.rows.length == 0)
        {
            res.send('No User Has the Name You Provided')
        }
        else{
            pool.query(queries.banOwner,[name],(error,ban_results) => {
                if(error)
                {
                    res.send('User wasn\'t banned')
                }
                else{
                    pool.query(queries.getShops,(errors,shop_results) => {
                        if(errors)
                        {
                            res.send('An error occurred')
                        }
                        else
                        {
                            for(let i = 0; i < shop_results.rows.length; i++)
                            {
                                let shopname = shop_results.rows[i].shopname
                                let currentrenter = shop_results.rows[i].currentrenter
                                let schedule = shop_results.rows[i].schedule;
                                for(let j = 0; j < schedule.length; j++)
                                {
                                    if(schedule[j].toString() == name) 
                                    {
                                        schedule[j] = 'Empty'
                                    }
                                }
                                console.log(schedule);
                                currentrenter = schedule[0];
                                pool.query(queries.bookShop,[schedule,currentrenter,shopname],(e,update_results) => {
                                    if(e)
                                    {
                                        return res.send('An error occurred')
                                    }
                                    else
                                    {
                                        return res.status(201).send('User was banned')
                                    }
                                })
                            }
                            
                        }
                        
                    })
                    
                }
            })
        }
    })
}
// registerOwner
const registerUser = (req,res) => {
    const {name} = req.body;

    pool.query(queries.registerUser,[name],(err,results) => {
        if(err)
        {
            res.send('User was not registered')
        }
        else
        {
            res.status(201).send('User registered successfully')
        }
    })
}
module.exports = {addShop,deleteShop,getNext,getAll,bookShop,registerUser,banOwner}