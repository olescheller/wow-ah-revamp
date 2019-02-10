
const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:12345/';
const DB_NAME = 'wow_data';

const {getUserByNameAndRealm, getItemById, getItemsByPartialName} = require('../src/db');
const MongoToGqlConverter = require("../src/conversion");


let mongoDB;
let db;
let converter;

beforeAll(async (done) => {

    mongoDB = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true})
    if (mongoDB) {
        console.log('Successfully connected to db');
        db = mongoDB.db(DB_NAME);
        converter = new MongoToGqlConverter(db);
        await converter.init();
    }
    else {
        throw('connection fo db failed')
    }
    done();
});

afterAll(async (done) => {
    mongoDB.close();
    done();
});

describe('Test database functions', () => {

    beforeEach(() => {
        let result = null;
    });

    test('getUserByNameAndRealm - non-existing user and user realm', async (done) => {
        result = await getUserByNameAndRealm(db, "Hans", "HansRealm");
        expect(result).toBeNull();
        done();
    });

    test('getUserByNameAndRealm - existing user and user realm', async(done) => {
        result = await getUserByNameAndRealm(db, "Elandura", "Silvermoon");
        expect(result.name).toEqual("Elandura-Silvermoon");
        expect(result.money).toBeDefined();
        done();
    })

    test('getItemById - non-existing itemId', async(done) => {
        result = await getItemById(converter, db, 0);
        expect(result).toBeNull();
        done();
    });

    test('getItemById - existing itemId', async(done) => {
        result = await getItemById(converter, db, 25);
        expect(result.id).toBeDefined();
        expect(result.icon).toBeDefined();
        expect(result.is_stackable).toBeDefined();
        expect(result.name).toBeDefined();
        expect(result.item_sub_class).toBeDefined();
        expect(result.item_class).toBeDefined();
        expect(result.item_sub_class.name).toBeDefined();
        expect(result.item_class.name).toBeDefined();
        done();
    });

    test('getItemsByPartialName - existing', async(done) => {
        const partial = 'wool'
        result = await getItemsByPartialName(db, partial);
        expect(result.length).toBeGreaterThan(0);
        for(let res of result) {
            expect(res.name.toLowerCase()).toMatch(partial)
        }
        done();
    });

    test('getItemsByPartialName - nonExisting', async(done) => {
        const partial = 'dxuwwe'
        result = await getItemsByPartialName(db, partial);
        expect(result.length).toBe(0);
        done();
    });


});