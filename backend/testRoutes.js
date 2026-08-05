const routes = require('./routes/patientPortalRoutes');
console.log('Routes stack:');
routes.stack.forEach(layer => {
    if (layer.route) {
        console.log(Object.keys(layer.route.methods).join(', ').toUpperCase() + ' ' + layer.route.path);
    }
});
