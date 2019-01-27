

/**
 * get a user by its name and realm
 * @param db
 * @param name
 * @param realm
 * @returns {Promise}
 */
function getUserByNameAndRealm(db, name, realm) {
  return new Promise((resolve, reject) => {
    const Users = db.collection('users');
    Users.findOne({name: `${name}-${realm}`},
        (err, user) => {
          if(err) reject(err);
          resolve(user)
        });
  });
}

/**
 * get an item object by its id
 * @param db
 * @param itemId
 * @returns {Promise}
 */
function getItemById(db, itemId) {
  return new Promise((resolve, reject) => {
    const Items = db.collection('items');
    Items.findOne({id: itemId},
        async (err, item) => {
          if (err) reject(err);
          if (item === null) resolve(null);

          const itemClasses = await getItemClassById(db, item.item_class, item.item_sub_class);
          resolve({...item, ...itemClasses})
        }
    )
  });
}

/**
 * get an item object by its name
 * @param db
 * @param itemName
 * @returns {Promise}
 */
function getItemByName(db, itemName) {
  return new Promise((resolve, reject) => {
    const Items = db.collection('items');
    Items.findOne({name: itemName},
        async (err, item) => {
          if (err) reject(err);
          if (item === null) resolve(null);

          const itemClasses = await getItemClassById(db, item.item_class, item.item_sub_class);
          resolve({...item, ...itemClasses})
        }
    )
  });
}

/**
 * Get a class by its id
 * @param db: database object
 * @param classId: id of the class
 * @param subClassId: id of the subclass, retrieved from the item
 * @returns {Promise}
 */
function getItemClassById(db, classId, subClassId) {
  return new Promise((resolve, reject) => {
    const ItemClasses = db.collection('itemclasses');
    ItemClasses.findOne({id: classId}, async (err, itemClass) => {
      if (err) reject(err);

      const itemSubClass = itemClass.subclasses.filter(i => i.id === subClassId)[0];
      let item_sub_class;
      const item_class = {name: itemClass.name, id: itemClass.id};
      if (itemSubClass) {
        item_sub_class = {name: itemSubClass.name, id: itemSubClass.id};
      }

      resolve({item_class, item_sub_class})
    });
  })
}

/**
 * Get the supply of a given item
 * @param db: database object
 * @param itemName: name of the item requested
 * @returns {Promise} item supply object
 */
function getItemSupplyByName(db, itemName) {
  return new Promise((resolve, reject) => {
    getItemByName(db, itemName).then((item) => {
      const SellOrders = db.collection('sellorders');
      SellOrders.find({item_id: item.id}).toArray((err, sellOrders) => {
        if(err) reject(err);
        if(sellOrders.length === 0) resolve(null);
        const quantity = sellOrders.reduce((acc, curr) => {
          return  acc + curr.quantity;
        }, 0);
        const prices = sellOrders.map(s => s.price);
        const min_price = Math.min(...prices);
        resolve({
          id: item.id,
          item: item,
          quantity,
          min_price
        })
      });
    });
  })
}


module.exports = {getItemClassById, getItemById, getUserByNameAndRealm, getItemSupplyByName};