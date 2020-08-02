module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany({__v: 0}, {$set: {public: false}});
  },

  async down(db, client) {
    await db.collection('products').updateMany({__v: 0}, {$set: {public: null}});
  }
};
