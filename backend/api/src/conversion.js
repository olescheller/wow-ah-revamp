module.exports = class MongoToGqlConverter {

    constructor(db){
        this.ItemClassesCollection = db.collection('itemclasses');
        this.cachedItemClasses = {};
    }

    async init(){
        this.cachedItemClasses = await this.ItemClassesCollection.find({}).toArray()
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
        return {
            id: mongo_item_class_id,
            name: this.cachedItemClasses[mongo_item_class_id].name
        }
    };

    ItemSubClassMongoToGql (mongo_item_class_id, mongo_item_sub_class) {
        let subclassName = "NOT FOUND"
        for(let subclass of this.cachedItemClasses[mongo_item_class_id].subclasses) {
            if (subclass.id === mongo_item_sub_class) {
                subclassName = subclass.name;
                break;
            }
        }
        return {
            id: mongo_item_sub_class,
            name: subclassName
        }
    }
};