export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connect to db
    const request = window.indexedDB.open('shop-shop', 1);
    // db name is shop-shop and version is 1

    // ref db, transaction, and object store
    let db, ts, store;

    // if version has changed or first time run
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data
      // set primary key index to be the '_id' of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // error handle
    request.onerror = function(e) {
      console.log('Sorry, there was an error!');
    };

    // db open success
    request.onsuccess = function(e) {
      // save ref of db to the db variable
      db = request.result;
      // open tx to what is passed into 'storeName' as long as it matches object store name
      tx = db.transaction(storeName, 'readwrite');
      // save a ref to that object store
      store = tx.objectStore(storeName);

      //error handle
      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // close connect after tx is complete
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
