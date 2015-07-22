'use strict';
/* jshint undef: false */
(function() {
  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      modalClass: 'test',
      modalId: 'test'
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

      context('when multiple instances', function() {

        var config2 = {
          height: 600,
          width: 600,
          modalClass: 'test2',
          modalId: 'test2'
        };
        var object2 = null;
        var selector2 = '.js_trigger-modal2';

        before(function() {
          object2 = $(selector2).iptModal(config2);
        });

        after(function() {
          object2.data(pluginName).destroy();
        });

        it('expected to construct 2 objects', function() {
          return expect(object.data(pluginName)).to.be.an.object && expect(object2.data(pluginName)).to.be.an.object;
        });

        it('expected to set 1st instance width to ' + config.width, function() {
          return expect(object.data(pluginName).getSettings().width).to.equal(config.width);
        });

        it('expected to set 2nd instance width to ' + config2.width, function() {
          return expect(object2.data(pluginName).getSettings().width).to.equal(config2.width);
        });

        it('expected to have correct 1st instance effect', function() {
          return expect(object.data(pluginName).getEffect()).to.equal($(selector).data('modal-effect'));
        });

        it('expected to have correct 2nd instance effect', function() {
          return expect(object2.data(pluginName).getEffect()).to.equal($(selector2).data('modal-effect'));
        });

      });

    });

    describe('open', function() {

      context('with static modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config);
        });

        afterEach(function() {
          object.off().data(pluginName).destroy();
        });

        it('expected to have ID', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().attr('id')).to.eql('test');
        });

        it('expected to have correct type', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().data('type')).to.eql('static');
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
          function test() {
            object.data(pluginName).open('#i20395vajdf409394fadfeadfvfwew');
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives no data', function() {
          function test() {
            object.data(pluginName).open();
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives empty object', function() {
          function test() {
            object.data(pluginName).open({});
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives incorrect object', function() {
          function test() {
            object.data(pluginName).open({something: 'something'});
          }
          return expect(test).to.throw();
        });

        it('expected to throw error if modal open receives incorrect link', function() {
          function test() {
            object.data(pluginName).open({link: '#34902h0bsifdg5049w45u409-asd'});
          }
          return expect(test).to.throw();
        });

        it('expected to not throw error if modal open receives correct link', function() {
          function test() {
            object.data(pluginName).open({link: '#test'});
          }
          return expect(test).to.not.throw();
        });

        it('expected to emit ready event', function(done) {
          object.on('ready.iptModal', function() {
            done();
          }).trigger('click');
        });

        it('expected to emit complete event', function(done) {
          object.on('complete.iptModal', function() {
            done();
          }).trigger('click');
        });

        it('expected to emit success event', function(done) {
          object.on('success.iptModal', function() {
            done();
          }).trigger('click');
        });

        it('expected to have close button', function(done) {
          object.on('success.iptModal', function() {
            expect($('.modal__button-close:visible').length).to.eql(1);
            done();
          }).trigger('click');
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.modal__button-close').trigger('click.iptModal');
            done();
            return expect(object.data(pluginName).active()).to.not.be.ok;
          }).trigger('click');
        });

      });

      describe('with dynamic modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).attr('href', 'dummy.html');
          $('#test').hide();
        });

        afterEach(function() {
          object.off().data(pluginName).destroy();
        });

        it('expected to have class name for ID by default', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: 'test'
          };
          object = $(selector).iptModal(mockConfig).attr('href', 'dummy.html');
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.eql(config.modalClass);
            done();
          }).trigger('click');
        });

        it('expected to have correct ID', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.eql(config.modalId);
            done();
          }).trigger('click');
        });

        it('expected to display spinner on modal ready', function(done) {
          object.on('ready.iptModal', function() {
            expect($('.' + config.modalClass + '__spinner').is(':visible')).to.eql(true);
          }).on('complete.iptModal', function() {
            // Consider done only on complete event, not sooner.
            // Otherwise conflicts with following test.
            done();
          }).trigger('click');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.eql('dynamic');
            done();
          }).trigger('click');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.eql(true);
            done();
          }).trigger('click');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass).length).to.eql(1);
            done();
          }).trigger('click');
        });

        it('expected to have content post success event', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: 'test'
          };
          object = $(selector).attr('href', 'dummy.html').iptModal(mockConfig);
          object.on('success.iptModal', function() {
            expect($('.' + mockConfig.modalClass).html()).to.match(/<h1>Dummy content<\/h1>/);
            done();
          }).trigger('click');
        });

        it('expected to have close button', function(done) {
          object.on('success.iptModal', function() {
            expect($('.' + config.modalClass +  '__button-close:visible').length).to.eql(1);
            done();
          }).trigger('click');
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.' + config.modalClass + '__button-close').trigger('click.iptModal');
            done();
            return expect(object.data(pluginName).active()).to.not.be.ok;
          }).trigger('click');
        });

      });

      context('with unobtrusive modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).attr('href', 'dummy.html').data('remote', true);
          $('#test').hide();
        });

        afterEach(function() {
          object.off().data('remote', null).data(pluginName).destroy();
        });

        it('expected to display spinner on modal ready', function(done) {
          // XXX: mock-trigger jquery-ujs ajax:complete at the end
          object.on('ready.iptModal', function() {
            expect($('.' + config.modalClass + '__spinner').is(':visible')).to.eql(true);
          }).on('complete.iptModal', function() {
            // XXX: Consider done only on complete event to prevent conflicts in further tests.
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have class name for ID by default', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: 'test'
          };
          object = $(selector).iptModal(mockConfig).attr('href', 'dummy.html');
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.eql(config.modalClass);
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have correct ID', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.eql(config.modalId);
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.eql('unobtrusive');
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.eql(true);
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass).length).to.eql(1);
            done();
          }).trigger('click').trigger('ajax:complete');
        });

        // XXX: content not tested as it's being injected externally by jquery-ujs
        it('expected to emit success event', function(done) {
          object.on('success.iptModal', function() {
            done();
          }).trigger('click').trigger('ajax:success');
        });

        it('expected to have close button', function(done) {
          object.on('success.iptModal', function() {
            expect($('.' + config.modalClass +  '__button-close:visible').length).to.eql(1);
            done();
          }).trigger('click').trigger('ajax:success');
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.' + config.modalClass + '__button-close').trigger('click.iptModal');
            done();
            return expect(object.data(pluginName).active()).to.not.be.ok;
          }).trigger('click').trigger('ajax:success');
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
