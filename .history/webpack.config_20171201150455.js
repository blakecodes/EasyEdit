var path = require('path');

module.exports = env => {
    env.Mode = 'Unit'; // Production (Prod), Development (Dev), Unit Testing (Unit)

    return {
        context: path.join(__dirname, 'src', 'scripts'),
        entry: {
            visualizer: './editor/visualizer.js',
            formBuilder: './FormBuilder/FormBuild.js'
        },

        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].bundle.js'
        }
    }
}