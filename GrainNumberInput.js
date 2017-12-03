import { html } from '../grain-lit-element/GrainLitElement.js';
import GrainInput from '../grain-input/GrainInput.js';
import GrainTranslate from '../grain-translate/GrainTranslate.js';

export default class GrainNumberInput extends GrainInput {

  static get properties() {
    return Object.assign(super.properties, {
      intlOptions: {
        type: 'Json',
        reflectToAttribute: 'intl-options',
        value: {}
      },
      intlLanguage: {
        type: 'String',
        value: 'auto',
        reflectToAttribute: 'intl-language',
        observer: '_onIntlLanguageChange'
      },
    });
  }

  constructor() {
    super();
    this.grainTranslate = new GrainTranslate();

    this.formatter = new Intl.NumberFormat(this.intlLanguage, this.intlOptions);
    this._guessFormatter = new Intl.NumberFormat(this.intlLanguage);
    this._guessFormat();
    this._onIntlLanguageChange();
  }

  _onIntlLanguageChange() {
    if (this.grainTranslate && this.intlLanguage === 'auto') {
      this.intlLanguage = this.grainTranslate.language;
    }
    if (this.lightDomRendered) {
      this.formatter = new Intl.NumberFormat(this.intlLanguage, this.intlOptions);
      this._guessFormatter = new Intl.NumberFormat(this.intlLanguage);
      this.rawValue = this.getRawValue(this.formattedValue);
      this._guessFormat();
      this.formattedValue = this.getFormattedValue(this.rawValue);
    }
  }

  _guessFormat() {
    this._decimal = this._guessFormatter.format(0.5).match(/[^0-9]+/)[0];
    this._rawPattern = new RegExp(`[0-9\\${this._decimal}]`, 'g');
  }

  getRawValue(value) {
    let rawValue = value.match(this._rawPattern);
    if (rawValue && rawValue.length > 0) {
      return rawValue.join('').replace(this._decimal, '.');
    }
    return value;
  }

  getFormattedValue(value) {
    let formatted = this.formatter.format(value);
    if (value.substr(-1) === '.') {
      return formatted + this._decimal;
    }
    if (value.indexOf('.') !== -1 && value.substr(-1) === '0') {
      return formatted + '0';
    }
    return formatted;
  }

}