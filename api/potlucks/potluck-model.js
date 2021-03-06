const db = require('../data/db-config')

function getPotlucks() {
    return db('potlucks as p')
        .join('users as u', 'p.organizer', 'u.user_id')
        // another .join() for getting guests, items?
        .select('p.*', 'u.username')
}

//on put for a editing a potluck, use the jwtdecoded object on the req
function getPotluckById(id) {
    return db('potlucks as p')
        .join('users as u', 'p.organizer', 'u.user_id')
        // another .join() for getting guests, items?
        .select('p.*', 'u.username')
        .where('potluck_id', id)
        .first()
}


// add public/private boolean
async function create(id, potluck) {
    const newPotluck = { ...potluck, organizer: id}
    return await db('potlucks as p')
        .insert(newPotluck, ['p.*'])
}

async function editPotluck(potluck, edits) {
 
    if (edits.date) {
         await db('potlucks as p')
            .update({
                date: edits.date
            })
        .where('p.potluck_id', potluck)
    } if (edits.time) {
        await db('potlucks as p')
            .update({
                time: edits.time
            })
        .where('p.potluck_id', potluck)
    } if (edits.location) {
        await db('potlucks as p')
        .update({
            location: edits.location
        })
    .where('p.potluck_id', potluck)
    }
    return getPotluckById(potluck)
}

async function remove(potluck) {
    await db('potlucks')
        .where('potluck_id', potluck)
        .del()
}

function getUserByUsername(username) {
    return db('users as u')
        .where('u.username', username)
        .first()
}

async function addGuest(potluck, username) {
    const { user_id } = await getUserByUsername(username)
    
    await db('potluck_users')
        .insert({
            potluck_id: potluck,
            user_id: user_id
        })

    return getGuests(potluck)
}

function getItem(id) {
    return db('items as i')
        .join('potluck_items as pi', 'pi.item_id', 'i.item_id')
        .select('i.*', 'pi.confirmed', 'pi.user_bringing')
        .where('i.item_id', id)
}

async function addItem(item, potluck) {
    const [newItem] = await db('items').insert(item, ['items.*'])
    
    const itemToAdd = { 
        item_id: newItem.item_id,
        potluck_id: potluck,
    }
    await db('potluck_items as pi').insert(itemToAdd)
    return getItem(newItem.item_id)
}

function getItems(potluck) {
    return db('items as i')
        .join('potluck_items as pi', 'pi.item_id', 'i.item_id')
        .select('i.item_name', 'pi.confirmed', 'pi.user_bringing')
        .where('pi.potluck_id', potluck)
}

function getGuests(potluck) {
    return db('potluck_users as pu')
        .join('users as u', 'pu.user_id', 'u.user_id')
        .where('pu.potluck_id', potluck)
        .select('u.username', 'pu.confirmed')
}

async function confirm(rsvp) {
    const { username, potluck_id, item_name } = rsvp
    
    const {user_id} = await getUserByUsername(username)

    const [item] =  await addItem({item_name: item_name}, potluck_id)
    
    const list = await getGuests(potluck_id)
    
    if (list.some(user => user.username === username )) {
        await db('potluck_users as pu')
        .where({
            'pu.potluck_id': potluck_id,
            'pu.user_id': user_id
        })
        .update({
            confirmed: true
        })
    } else {
        await addGuest(potluck_id, username)
        await db('potluck_users as pu')
        .where({
            'pu.potluck_id': potluck_id,
            'pu.user_id': user_id
        })
        .update({
            confirmed: true
        })
    }

    await db('potluck_items as pi')
        .where({
            'pi.potluck_id': potluck_id,
            'pi.item_id': item.item_id
        })    
        .update({
                confirmed: true,
                user_bringing: user_id
            })

    return ({username: username, item: item.item_name})
}

module.exports = {
    getPotlucks,
    getPotluckById,
    create,
    editPotluck,
    addGuest,
    addItem,
    getItems,
    getGuests,
    confirm,
    remove
}