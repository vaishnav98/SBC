module.exports.address = 'mongodb://localhost/ardtemp'
module.exports.secret = 'rainthesecrets'

module.exports.pluginUpdate =  function timestamp(schema) {

var Admin = require('../models/admin')  
  
    // Create a pre-save hook
    schema.pre('save', function (next) {
      let now = Date.now()
     
      this.updatedAt = now
  
      // Set a value for createdAt only if it is null
      if (!this.createdAt) {
        this.createdAt = now
      }
      Admin.findById(this.admin,function(err,adm){
        this.adminName = adm.email
      })


  
     // Call the next function in the pre-save chain
     next()    
    })
    /* schema.pre('init',function(next){
      counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
        var doc = this
        if(error)
            return next(error);
        doc.testvalue = counter.seq;
        next();
        });
  
     // Call the next function in the pre-save chain
     next()    
    }) */
  }