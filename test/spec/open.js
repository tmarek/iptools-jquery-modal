'use strict';

/* jshint undef: false, expr: true */

(function() {

  describe('iptModal', function() {

    var config = {
      height: 500,
      width: 500,
      modalClass: 'modal-test',
      modalId: 'modal-test'
    };

    var pluginName = 'plugin_iptModal';
    var selector = '.js_trigger-modal';
    var object = null;
    var data = null;

    describe('open', function() {

      context('with static modal', function() {

        beforeEach(function() {
          data = {link: '#test'};
          object = $(selector).iptModal(config);
        });

        afterEach(function() {
          object.off('success.iptModal').off('complete.iptModal').off('error.iptModal');
          object.data(pluginName).destroy();
        });

        it('expected to have ID', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().attr('id')).to.equal(config.modalId);
        });

        it('expected to have correct type', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().data('type')).to.equal('static');
        });

        it('expected to have class ' + config.modalClass + '--active', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().hasClass(config.modalClass + '--active')).to.be.ok;
        });

        it('expected to toggle visibility', function() {
          object.attr('href', '#test').trigger('click');
          return expect(object.data(pluginName).getModal().is(':visible')).to.be.ok;
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
            object.data(pluginName).open(data);
          }
          return expect(test).to.not.throw();
        });

        it('expected to emit ready event', function(done) {
          var ready = false;
          object.on('ready.iptModal', function() {
            ready = true;
          })
          .on('complete.iptModal', function() {
            expect(ready).to.be.ok;
            done();
          }).trigger('click');
        });

        it('expected to emit complete event', function(done) {
          object.on('complete.iptModal', function() {
            done();
          }).data(pluginName).open(data);
        });

        it('expected to emit success event', function(done) {
          object.on('success.iptModal', function() {
            done();
          }).data(pluginName).open(data);
        });

        it('expected to have single close button', function(done) {
          object.on('success.iptModal', function() {
            expect($('.' + config.modalClass +  '__button-close:visible')).to.have.length(1);
            done();
          }).data(pluginName).open(data);
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.' + config.modalClass + '__button-close').trigger('click');
            expect(object.data(pluginName).getModal()).to.not.exist;
            done();
          }).data(pluginName).open(data);
        });

        context('with default effect', function() {
          it('expected to have single defined effect', function(done) {
            var defaultEffect = 'scale';
            object.on('success.iptModal', function() {
              var effectClass = config.modalClass + '--effect-' + defaultEffect;
              var modalClasses = object.data(pluginName).getModal().attr('class');
              expect(modalClasses).to.include(effectClass) && expect(modalClasses.match(/\w+--effect-\w+/g)).to.have.length(1);
              done();
            }).data(pluginName).open(data);
          });
        });

        context('with slideinright effect', function() {

          before(function() {
            $(selector).data('modal-effect', 'slideinright');
            object = $(selector).iptModal(config);
          });

          after(function() {
            $(selector).data('modal-effect', 'scale');
          });

          it('expected to have single effect', function(done) {
            var effect = 'slideinright';
            object.on('success.iptModal', function() {
              var effectClass = config.modalClass + '--effect-' + effect;
              var modalClasses = object.data(pluginName).getModal().attr('class');
              expect(modalClasses).to.include(effectClass) && expect(modalClasses.match(/\w+--effect-\w+/g)).to.have.length(1);
              done();
            }).data(pluginName).open(data);
          });

        });

        context('with slideinbottom effect', function() {

          var effect = 'slideinbottom';

          before(function() {
            $(selector).data('modal-effect', effect);
            object = $(selector).iptModal(config);
          });

          after(function() {
            $(selector).data('modal-effect', 'scale');
          });

          it('expected to have single effect', function(done) {
            object.on('success.iptModal', function() {
              var effectClass = config.modalClass + '--effect-' + effect;
              var modalClasses = object.data(pluginName).getModal().attr('class');
              expect(modalClasses).to.include(effectClass) && expect(modalClasses.match(/\w+--effect-\w+/g)).to.have.length(1);
              done();
            }).data(pluginName).open(data);
          });

        });

      });

      describe('with dynamic modal', function() {

        beforeEach(function() {
          object = $(selector).iptModal(config).attr('href', 'dummy.html');
          $('#test').hide();
        });

        afterEach(function() {
          object.off('success.iptModal').off('complete.iptModal').off('error.iptModal');
          object.data(pluginName).destroy();
        });

        it('expected to have class name for ID by default', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: config.modalClass
          };
          object = $(selector).iptModal(mockConfig).attr('href', 'dummy.html');
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.equal(mockConfig.modalClass);
            done();
          }).trigger('click');
        });

        it('expected to have correct ID', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.equal(config.modalClass);
            done();
          }).trigger('click');
        });

        it('expected to display spinner on modal ready', function(done) {
          object.on('ready.iptModal', function() {
            expect($('.' + config.modalClass + '__spinner').is(':visible')).to.be.ok;
          }).on('complete.iptModal', function() {
            // Consider done only on complete event, not sooner.
            // Otherwise conflicts with following test.
            done();
          }).trigger('click');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.equal('dynamic');
            done();
          }).trigger('click');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.be.ok;
            done();
          }).trigger('click');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass)).to.have.length(1);
            done();
          }).trigger('click');
        });

        it('expected to have content post success event', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: config.modalClass
          };
          object = $(selector).attr('href', 'dummy.html').iptModal(mockConfig);
          object.on('success.iptModal', function() {
            var actual = $('.' + mockConfig.modalClass).find('.' + mockConfig.modalClass + '__content').html();
            expect(actual).to.match(/<h1>Dummy content<\/h1>/);
            done();
          }).trigger('click');
        });

        it('expected to have close button', function(done) {
          object.on('success.iptModal', function() {
            expect($('.' + config.modalClass +  '__button-close:visible')).to.have.length(1);
            done();
          }).trigger('click');
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.' + config.modalClass + '__button-close').trigger('click');
            expect(object.data(pluginName).getModal()).to.not.exist;
            done();
          }).trigger('click');
        });

      });

      context('with unobtrusive modal', function() {

        beforeEach(function() {
          $('#test').hide();
          $(selector).attr('href', 'dummy.html').data('remote', true);
          object = $(selector).iptModal(config);
          // XXX: Fake success for UJS. Do not trigger AJAX Complete directly after click.
          setTimeout(function() {
            object.trigger('ajax:success');
          }, 0);
        });

        afterEach(function() {
          object.off('success.iptModal').off('complete.iptModal').off('error.iptModal').data(pluginName).destroy();
          $(selector).data('remote', null);
        });

        it('expected to display spinner on modal ready', function(done) {
          var visible = false;
          // XXX: mock-trigger jquery-ujs ajax:complete at the end
          object.on('ready.iptModal', function() {
            visible = $('.' + config.modalClass + '__spinner').is(':visible');
          }).on('complete.iptModal', function() {
            // XXX: Consider done only on complete event to prevent conflicts in further tests.
            expect(visible).to.be.ok;
            done();
          }).trigger('click');
        });

        it('expected to have class name for ID by default', function(done) {
          var mockConfig = {
            height: 500,
            width: 500,
            modalClass: config.modalClass
          };
          object = $(selector).iptModal(mockConfig).attr('href', 'dummy.html');
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.equal(config.modalClass);
            done();
          }).trigger('click');
        });

        it('expected to have correct ID', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().attr('id')).to.equal(config.modalId);
            done();
          }).trigger('click');
        });

        it('expected to have correct type', function(done) {
          object.on('complete.iptModal', function() {
            expect(object.data(pluginName).getModal().data('type')).to.equal('unobtrusive');
            done();
          }).trigger('click');
        });

        it('expected to keep static modal hidden', function(done) {
          object.on('complete.iptModal', function() {
            expect($('#test').is(':hidden')).to.be.ok;
            done();
          }).trigger('click');
        });

        it('expected to have single modal instance', function(done) {
          object.on('complete.iptModal', function() {
            expect($('.' + config.modalClass)).to.have.length(1);
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
            expect($('.' + config.modalClass +  '__button-close:visible')).to.have.length(1);
            done();
          }).trigger('click');
        });

        it('expected to have functional close button', function(done) {
          object.on('success.iptModal', function() {
            $('.' + config.modalClass + '__button-close').trigger('click');
            expect(object.data(pluginName).getModal()).to.not.exist;
            done();
          }).trigger('click');
        });

      });

    });

  });
})();