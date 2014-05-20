module.exports.restrictAccess = function (req, res, next) {
  if (req.session.user) {
  	console.log("Allowed access to user " + req.session.user);
  	next();
  } else {
  	console.log("Access denied!");
    res.redirect('/');
  }
} 