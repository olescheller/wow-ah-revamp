module.exports = class MongoToGqlConverter {

    constructor(db){
        this.ItemClassesCollection = db.collection('itemclasses');
        this.cachedItemClasses = {};
    }

    init(){
        this.ItemClassesCollection.find({}).toArray((err, itemClasses) => {
            if(err) return;
            this.cachedItemClasses = itemClasses;
        });
    }


    ItemMongoToGql(mongo_item) {
        return {
            id: mongo_item.id,
            name: mongo_item.name,
            icon: mongo_item.icon,
            is_stackable: mongo_item.is_stackable,
            item_class: this.ItemClassMongoToGql(mongo_item.item_class),
            item_sub_class: this.ItemSubClassMongoToGql(mongo_item.item_class, mongo_item.item_sub_class)
        }
    };

    ItemClassMongoToGql(mongo_item_class_id){
        let className = "NOT FOUND"
        for(let itemclass of this.cachedItemClasses) {
            if(itemclass.id === mongo_item_class_id) {
                className = itemclass.name;
                break;
            }
        }
        return {
            id: mongo_item_class_id,
            name: className,
        }
    };

    ItemSubClassMongoToGql (mongo_item_class_id, mongo_item_sub_class) {
        let subclassName = "NOT FOUND"
        for(let itemClass of this.cachedItemClasses) {
            if(itemClass.id === mongo_item_class_id) {
                for(let subclass of itemClass.subclasses) {
                    if (subclass.id === mongo_item_sub_class) {
                        subclassName = subclass.name;
                        break;
                    }
                }
                break;
            }
        }
        return {
            id: mongo_item_sub_class,
            name: subclassName
        }
    }
};