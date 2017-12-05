import APIService from '../ApiService/ApiService';
import Assert from '../Assertion/Assert';
import Configuration from '../Configuration/Configuration';

import alpaca from '../../libraries/alpaca/alpaca';


/**
 * @name FormBuilder V1.0
 * @author Blake Connally with Sequoyah Technologies
 * @version 1.0.0
 * @summary This form builder was created to easily intertwine form creation with
 * AlpacaJS, Bootstrap and jQuery. Initially designed to solve the "no-framework"
 * event handling with forms. 
 * 
 * This frameworks primary functions include form building and data binding. 
 */
class FormBuilder {

    /**
     * General configuration implementation
     * @param {object} config
     * @interface
     *  ComponentDirectory: String, //Manages the directory of components for quick selection
     *  EditorSelect: DOM Element, //Selects the editor holder for form implementation
     *      
     */
    constructor(config) {
        // Service management
        this.apiService = new APIService();
        this.Assert = new Assert();
        this.config = new Configuration();

        this.currentVideo = {};
    }

    /**
     * Initial form setup
     * @param {string} componentType
     * schema: http://www.alpacajs.org
     */
    setup(componentType) {
        let options = this.fetch(componentType);
    }

    /**
     * Load the alpaca form with the component structure
     * @param {json} res response from the component fetch
     */
    load(res) {
        let args = res.alpacaArgs;
        this.clean(this.config.alpacaEditor);
        $(this.config.alpacaEditor).alpaca(args);

        this.import();
    }

    /**
     * Destroys the alpaca form to ready for a new install
     * @param {string} form form identifier
     */
    clean(form) {
        $(form).alpaca('destroy');
    }

    /**
     * 
     * @param {string} componentType 
     * @param {function} callback 
     * @returns {JSON} response for the components alpaca schematic
     */
    fetch(componentType, callback = function () {}) {
        let self = this;
        this.apiService.get('/src/app/components/singles/' + componentType + '/component.json', function (res) {
            self.load(res);
            self.currentVideo = res;
        });
    }

    /**
     * Takes the selected identifier and saves the form content
     * @param {string} identifier submit the entire form to save it's parameters 
     */
    save() {
        let self = this;

        $(this.config.alpacaEditor + ' input').each(function () {
            let name = $(this).attr('name');
            let val = $(this).val();

            let target = $('.selected-content div[data-fill="' + name + '"]');

            self.typeDefinition(name, target, val);
        });
    }

    /**
     * Import the current values for a component
     * Currently sets the values by DOM identifiers, this should be changed
     * to update via AlpacaJS API in the future
     * @param {DOM Element} element container for the elemnts values
     */
    import () {
        let self = this;

        $('.selected-content [data-fill]').each(function () {
            let dataAttr = $(this).data('fill');
            let val = $(this).html();

            /**
             * Fill the value in Alpaca
             * Addiitonal timeout is added to account for initial load 
             * of the form
             */
            setTimeout(function () {
                let target = $(self.config.alpacaEditor + ' [name="' + dataAttr + '"]');
                target.val(val);
            }, 200);
        });
    }

    /**
     * @param {string} name the value of the field name
     * @param {DOM Element} target determine what type of component
     * @param {string} value value to replace in the component
     * Text: No modification
     * Image: IMG src modified
     * Video: JWPlayer source is modified
     */
    typeDefinition(name, target, value) {
        let type = this.currentVideo.alpacaArgs.schema.properties[name].componentType;

        switch (type) {
            case 'text':
                target.html(value);
                break;
            case 'video':
                this.videoHandler(value);
                break;
            case 'image':
                break;
            default:
                break;
        }
    }

    /**
     * Handler for parsing the JWPlayer out of the
     * currently selected component
     * @param {string} value new video URL to update the player with
     */
    videoHandler(value) {
        let currentVideo = $('.selected-content .jwplayer').attr('id');

        jwplayer(currentVideo).load([{
            file: value
        }]);
    }

    /**
     * Handler for setting the value of an image element
     */
    imageHandler(target, value) {
        console.log('Replacing image value');
        target.attr('src', value);
    }
}

export default FormBuilder;