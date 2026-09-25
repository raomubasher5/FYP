const db = require('./BaseRepository');

class PostRepository {
  findAll(filterFn = null) {
    if (typeof filterFn === 'function') {
      return db.data.posts.filter(filterFn);
    }
    return db.data.posts;
  }

  findById(id) {
    return db.data.posts.find(p => p.id === id) || null;
  }

  create(postData) {
    db.data.posts.unshift(postData);
    db.persist();
    return postData;
  }

  update(id, updateData) {
    const index = db.data.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.data.posts[index] = { ...db.data.posts[index], ...updateData };
    db.persist();
    return db.data.posts[index];
  }

  delete(id) {
    const initialLen = db.data.posts.length;
    db.data.posts = db.data.posts.filter(p => p.id !== id);
    const deleted = db.data.posts.length < initialLen;
    if (deleted) db.persist();
    return deleted;
  }
}

module.exports = new PostRepository();
