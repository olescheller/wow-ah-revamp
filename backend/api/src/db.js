

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

module.exports = {getItemClassById, getItemById};