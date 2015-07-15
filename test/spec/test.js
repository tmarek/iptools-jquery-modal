'use strict';
/* jshint undef: false */
(function() {
  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      modalClass: 'test'
    };

    var pluginName = 'plugin_iptModal';
    var selector = '.js_trigger-modal';
    var object = null;

    describe('init', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      afterEach(function() {
        object.data(pluginName).destroy();
      });

      it('expected to construct object', function() {
        return expect(object).to.be.an.object;
      });

      it('expected to set height to ' + config.height, function() {
        return expect(object.data(pluginName).getSettings().height).to.equal(config.height);
      });

      it('expected to set width to ' + config.width, function() {
        return expect(object.data(pluginName).getSettings().width).to.equal(config.width);
      });

      it('expected to have static modal ID', function() {
        object.attr('href', '#test').trigger('click');
        var id = object.data(pluginName).getModal().attr('id');
        return expect(id).to.eql('test');
      });

      it('expected to have static modal type', function() {
        object.attr('href', '#test').trigger('click');
        var type = object.data(pluginName).getModal().data('type');
        return expect(type).to.eql('static');
      });

      it('expected to have dynamic modal reference', function() {
        object.attr('href', 'http://google.com').trigger('click');
        var type = object.data(pluginName).getModal().data('type');
        return expect(type).to.eql('dynamic');
      });

    });

    describe('open', function() {

      context('with static modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config);
        });

        afterEach(function() {
          object.data(pluginName).destroy();
        });

        it('expected to have class ' + config.modalClass + '--active', function() {
          object.attr('href', '#test').trigger('click');
          return expect($('#test').hasClass(config.modalClass + '--active')).to.be.ok;
        });

        it('expected to toggle visibility', function() {
          object.attr('href', '#test').trigger('click');
          return expect($('#test').is(':visible')).to.be.ok;
        });

        it('expected to throw error if modal is not in DOM', function() {
          function injectIncorrectHash() {
            object.data(pluginName).open('#i20395vajdf409394fadfeadfvfwew');
          }
          return expect(injectIncorrectHash).to.throw();
        });

      });

      context('with dynamic modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config);
          $('#test').hide();
        });

        afterEach(function() {
          object.data(pluginName).destroy();
        });

        it('expected to keep static modal hidden', function() {
          object.attr('href', 'http://google.com').trigger('click');
          return expect($('#test').is(':hidden')).to.be.ok;
        });

      });

    });

    describe('destroy', function() {

      beforeEach(function() {
        object = $(selector).iptModal(config);
      });

      it('expected to remove data', function() {
        object.data(pluginName).destroy();
        return expect(object.data(pluginName)).to.not.be.ok;
      });

    });

  });
})();
