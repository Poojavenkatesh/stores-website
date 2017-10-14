const mongoose = require('mongoose');
const Store = mongoose.model('Store');
exports.homePage =(req, res) => {
    console.log(req.name);
    res.render('index', {title: 'Stores Page'}); // index.pug file in the views folder
};

exports.addStore = (req,res) => {
  res.render('editStore', {title: 'Add Store'});
  //res.send('It Works!');
};

//createStore async function is wrapped in catchError function which handles he error when something goes wrong.
exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`); // when the user creates a store he/she is being redirected to the route localhost:7777/store/store-name(store.slug)
    console.log('It Worked!');
};

exports.getStores = async (req,res) => {
  // Query the database for a list of all stores
  const stores = await Store.find();
  //console.log(stores);
  res.render('stores', {title: 'Stores', stores});// stores(property name): stores(variable name) is equivalent to just stores
};

exports.editStore = async (req, res) => {
  //1. Find the store given the ID
  const store = await Store.findOne({_id: req.params.id}); //awaiting for the promise to return the id
//  res.json(store); displaying the json store details depending on the id
  //2. Confirm they are the owner of the store
  //3. Render out the edit form so the user can update their store
  res.render('editStore', {title: `Edit ${store.name}`, store});
}
 exports.updateStore = async(req,res) => {
   //find and update the store
   const store = await Store.findOneAndUpdate({_id:req.params.id},req.body,
     {
     new: true, //return the new store instead of the old One
     runValidators: true // force the model to run the required validators
   }).exec(); //exec() will make sure to run the query
   req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -> </a>`);
   res.redirect(`/stores/${store._id}/edit`);
   //Redirect them the store and tell them it Worked

 }
