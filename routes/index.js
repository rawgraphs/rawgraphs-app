
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.partial = function (req, res) {
  var id = req.params.id;
  res.render('partials/partial' + id);
};