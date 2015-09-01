(function($, window, document) {

  'use strict';

  var pluginName = 'iptModal';

  function IPTModal(element, options) {

    /*
     * Component handles modals of 2 types:
     *   - Static. Detect container by ID of href hash.
     *   - Dynamic. Create container on the fly for URI href.
     *   - Unobtrusive. Create container on the fly for jquery-ujs.
     */
    var TYPES = {
      STATIC: 'static',
      DYNAMIC: 'dynamic',
      UNOBTRUSIVE: 'unobtrusive'
    };

    var classes = {
      activeModifier: '--active',
      effectModifierPrefix: '--effect-',
      modal: 'modal',
      overlay: 'overlay',
      spinnerModifier: '--default',
      elements: {
        closeButton: '__button-close',
        spinner: '__spinner',
        content: '__content'
      }
    };

    var dataAttributes = {
      effect: 'modal-effect'
    };

    var defaults = {
      animationDuration: 500,
      closeOnESC: true,
      closeOnClickOutside: true,
      closeButton: true,
      height: 'auto',
      modalClass: classes.modal,
      modalId: classes.modal,
      modifiers: '',
      overlayClass: classes.overlay,
      showSpinner: true,
      spinnerClass: classes.modal + classes.elements.spinner + classes.spinnerModifier,
      spinnerHTML: '',
      width: 'auto',
      zIndex: 102
    };

    this.element = $(element);

    var settings = $.extend({}, defaults, options);
    var contentLink = null;
    var $spinner = null;
    var $closeButton = null;
    var $modal = null;
    var $overlay = null;
    var effect = null;
    var loaded = false;
    var type = TYPES.STATIC;
    var self = this;

    this.getSettings = function() {
      return settings;
    };

    this.getModal = function() {
      return $modal;
    };

    this.getOverlay = function() {
      return $overlay;
    };

    this.getEffect = function() {
      return effect;
    };

    this.active = function() {
      return $modal.hasClass(classes.modal + classes.activeModifier);
    };

    this.destroy = function() {
      unbindTemporaryEvents();
      unbindUnobtrusiveEvents();
      removeModal();
      removeOverlay();
      this.element.off(getNamespacedEvent('click')).removeData('plugin_' + pluginName);
    };

    this.open = function(data) {
      if (!data) {
        throw new Error('Data for modal launch missing!');
      } else if (!data.link) {
        throw new Error('Link for modal content missing!');
      }
      addOverlay();
      $modal = buildModal(data).appendTo('body');
      setTimeout(setContentHeight, 0);
      triggerReady();
      switch (type) {
        case TYPES.STATIC:
          self.setContent($(contentLink).html());
          triggerSuccess();
          break;
        case TYPES.DYNAMIC:
          $.get(contentLink).done(function(html) {
            self.setContent(html);
            triggerSuccess();
          }).fail(function() {
            triggerError();
          });
          break;
        case TYPES.UNOBTRUSIVE:
          bindUnobtrusiveEvents();
          break;
        default:
          throw new Error('Erroneous modal type!');
      }
    };

    this.close = function() {
      hideModal();
      unbindTemporaryEvents();
      unbindUnobtrusiveEvents();
      hideOverlay();
      removeModal();
    };

    this.setContent = function(content) {
      $modal.find('.' + settings.modalClass + classes.elements.content).html(content);
    };

    function getModalContentContainer() {
      return $modal.find('.' + settings.modalClass + classes.elements.content);
    }

    function getModifiers() {
      return settings.modifiers.length > 0 ? ' ' + settings.modifiers : '';
    }

    function removeModal() {
      if ($modal) {
        $modal.remove();
        $modal = null;
      }
    }

    function unbindUnobtrusiveEvents() {
      self.element.off('ajax:complete').off('ajax:success').off('ajax:error');
    }

    function unbindTemporaryEvents() {
      $(document).off(getNamespacedEvent('keydown') + ' ' + getNamespacedEvent('mouseup'));
      $(window).off(getNamespacedEvent('resize'));
    }

    function addEventListeners() {
      self.element.on(getNamespacedEvent('click'), handleModalLinkClicked);
    }

    function handleModalLinkClicked(event) {
      event.preventDefault();
      var $trigger = $(event.currentTarget);
      self.open({
        link: $trigger.attr('href'),
        unobtrusive: $trigger.data('remote')
      });
    }

    function buildModal(data) {
      removeModal();
      type = detectModalType(data);
      var $modalContent = $('<div/>')
        .addClass(settings.modalClass + classes.elements.content);
      return $('<div/>', {
          id: settings.modalId,
          width: settings.width,
          height: settings.height,
          class: settings.modalClass + getModifiers()
        })
        .data('type', type)
        .append($modalContent);
    }

    function triggerReady() {
      loaded = false;
      showOverlay();
      if (settings.showSpinner) {
        showSpinner();
      }
      self.element.trigger(getNamespacedEvent('ready'));
    }

    function triggerComplete() {
      hideSpinner();
      self.element.trigger(getNamespacedEvent('complete'));
    }

    function triggerSuccess() {
      triggerComplete();
      loaded = true;
      addCloseButton();
      bindTemporaryEvents();
      showModal();
      self.element.trigger(getNamespacedEvent('success'));
    }

    function triggerError() {
      triggerComplete();
      hideOverlay();
      self.element.trigger(getNamespacedEvent('error'));
    }

    function getNamespacedEvent(name) {
      return name + '.' + pluginName;
    }

    function showModal() {
      if (effect) {
        $modal.addClass(settings.modalClass + classes.effectModifierPrefix + effect);
      }
      center();
      $modal.addClass(settings.modalClass + classes.activeModifier);
    }

    function hideModal() {
      $modal.removeClass(settings.modalClass + classes.activeModifier);
    }

    function detectModalType(data) {
      if (data.unobtrusive) {
        return TYPES.UNOBTRUSIVE;
      } else if (data.link && data.link.charAt(0) === '#' && !data.unobtrusive) {
        if ($(data.link).length === 0) {
          throw new Error('Modal content not found!');
        }
        return TYPES.STATIC;
      } else {
        return TYPES.DYNAMIC;
      }
    }

    function addCloseButton() {
      if (settings.closeButton) {
        $closeButton = $('<div/>')
          .addClass(settings.modalClass + classes.elements.closeButton)
          .appendTo($modal);
      }
    }

    function addOverlay() {
      if (settings.overlay && !$overlay) {
        $overlay = $('<div/>')
          .addClass(settings.overlayClass)
          .appendTo('body');
      }
    }

    function removeOverlay() {
      if ($overlay) {
        $overlay.remove();
        $overlay = null;
      }
    }

    function showOverlay() {
      if (settings.overlay) {
        if (!$overlay) {
          addOverlay();
        }
        $overlay.fadeIn(settings.animationDuration);
      }
    }

    function hideOverlay() {
      if (settings.overlay && $overlay) {
        $overlay.fadeOut(settings.animationDuration);
      }
    }

    function showSpinner() {
      if (!$spinner) {
        $spinner = $('<div/>')
          .addClass(settings.modalClass + classes.elements.spinner)
          .addClass(settings.spinnerClass)
          .append(settings.spinnerHTML);
      }
      $('body').append($spinner);
      $spinner.show();
    }

    function hideSpinner() {
      if ($spinner) {
        $spinner.hide();
        $spinner.remove();
      }
    }

    function center() {
      $modal.css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginTop: -$modal.outerHeight() * 0.5,
        marginLeft: -$modal.outerWidth() * 0.5,
        zIndex: settings.zIndex
      });
    }

    function setContentHeight() {
      var $content = getModalContentContainer().css('height', 'auto');
      var modalHeight = $modal.height();
      var contentHeight = $content.innerHeight();
      var padding = $modal.innerHeight() - $modal.height();
      var height = modalHeight < contentHeight ? $modal.innerHeight() - padding + 'px' : 'auto';
      $content.css('height', height);
      center();
    }

    function bindTemporaryEvents() {
      if ($closeButton) {
        $closeButton.on(getNamespacedEvent('click'), self.close);
      }

      if (settings.closeOnESC) {
        $(document).on(getNamespacedEvent('keydown'), handleKeyDown);
      }

      if (settings.closeOnClickOutside) {
        $(document).on(getNamespacedEvent('mouseup'), handleBodyClick);
      }

      $(window).on(getNamespacedEvent('resize'), self, handleResize);
    }

    function bindUnobtrusiveEvents() {
      self.element.on('ajax:complete', handleUnobtrusiveAjaxComplete)
        .on('ajax:success', handleUnobtrusiveAjaxSuccess)
        .on('ajax:error', handleUnobtrusiveAjaxError);
    }

    function handleUnobtrusiveAjaxComplete() {
      triggerComplete();
    }

    function handleUnobtrusiveAjaxSuccess() {
      triggerSuccess();
    }

    function handleUnobtrusiveAjaxError() {
      triggerError();
    }

    function handleKeyDown(event) {
      if (event.which === 27) {
        self.close();
      }
    }

    function handleBodyClick(event) {
      if (!$modal.is(event.target) && $modal.has(event.target).length === 0) {
        self.close();
      }
    }

    function handleResize(event) {
      var target = event.data;
      if (typeof(target.resizeTimeout) !== 'undefined') {
        clearTimeout(target.resizeTimeout);
      }
      target.resizeTimeout = setTimeout(function() {
        center();
        setContentHeight();
      }, 250);
    }

    function init() {
      effect = self.element.data(dataAttributes.effect);
      contentLink = self.element.attr('href');
      addEventListeners();
    }

    init();
  }

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new IPTModal(this, options));
      }
    });
  };

})(jQuery, window, document);
