/*
 * jQuery stretchTable 0.1.0 
 * 
 * Created by Bin He at 1/20/2012
 * http://beenhero.com/stretchTable/
 *
 * Licensed under MIT
 *
 */

;(function ( $, window, document, undefined ) {

    var pluginName = 'stretchTable',
        defaults = {
            prev: '#prev',
            next: '#next',
            pagination: "#pager",
            perPage: 2,
            stickyCol: [0],
            slideCol: []
        };

    // The actual plugin constructor
    function StretchTable( element, options ) {
        
        this.element = element;
        this.options = $.extend( {}, defaults, options) ;
        this.vars = {
            currentPage: 1,
            pageSize: 0,
            totalCol: 0,
            slideColSize: 0,
            running: false,
            paused: false,
            stop: false
        };
        this._defaults = defaults;
        this._name = pluginName;
        
        var vars = this.vars,
            options = this.options,
            elem = this.element;
            
        this.showCurrentPage = function () {
            for(var i = (vars.currentPage - 1) * options.perPage; i < vars.currentPage * options.perPage; i++) {
                if(options.slideCol[i])
                    $('th, td', elem).filter(':nth-child('+ (options.slideCol[i]+1) +')').show();
                    //animate({width: "show"});
            }
            // Highlight current page
            $('a.page_nav', elem).removeClass('selected');
            $('a.page_nav:nth-child('+ vars.currentPage +')', elem).addClass('selected');
            //Is the page at either end
            if (vars.currentPage  == 1) {
                $('a.prev_next', elem).removeClass('disabled').filter('#prev').addClass('disabled');
            } else if (vars.currentPage == vars.pageSize) {
                $('a.prev_next', elem).removeClass('disabled').filter('#next').addClass('disabled');
            } else {
                $('a.prev_next', elem).removeClass('disabled');
            }
        };
        
        this.slideToPage = function () {
            var _this = this
            for(var i = 0; i < options.slideCol.length; i++) {
                $('th, td', elem).filter(':nth-child('+ (options.slideCol[i]+1) +')').hide();
                //animate({width: 'hide'}, 50, _this.showCurrentPage);
                _this.showCurrentPage();
            }
        }
        
        this.init();
    }

    StretchTable.prototype.init = function () {
        
        var _this = this;
        var elem = this.element, options = this.options, vars = this.vars;
        
        vars.totalCol = $('tr:nth-child(1) > th', elem).length;
        vars.slideColSize = options.slideCol.length;
        
        if ( vars.slideColSize  == 0 ) { // no slideCol setting by user
            for(var i = 0; i < vars.totalCol; i++) {
                if ($.inArray(i, options.stickyCol) == -1) { // hide all except sticky column
                    $('th, td', elem).filter(':nth-child('+ (i+1) +')').hide();
                    options.slideCol.push(i);
                }
            }
            vars.slideColSize = vars.totalCol - options.stickyCol.length;
        } else {
            for(var j = 0; j < vars.slideColSize; j++) {
                $('th, td', elem).filter(':nth-child('+ (j+1) +')').hide();
            }
        }
        
        vars.pageSize = Math.round( vars.slideColSize/options.perPage );
        
        // Add Pagination
        for(var i = 0; i < vars.pageSize; i++) {
            $(options.pagination).append('<a class="page_nav" rel="'+ (i + 1) +'">'+ (i + 1) +'</a>');
        }
        
        // Todo: bind next/prev/page_nav event
        $('a.page_nav', elem).live('click', function(e){
            e.preventDefault();
            if($(this).hasClass('selected')) return false;
            vars.currentPage = $(this).attr('rel');
            _this.slideToPage();
        });
        
        $(options.prev, elem).live('click', function(e){
            e.preventDefault();
            if($(this).hasClass('disabled') || vars.currentPage == 1) return false;
            vars.currentPage -= 1;
            _this.slideToPage();
        });
        
        $(options.next, elem).live('click', function(e){
            e.preventDefault();
            if($(this).hasClass('disabled') || vars.currentPage == vars.pageSize) return false;
            vars.currentPage += 1;
            _this.slideToPage();
        });
        
        
        this.showCurrentPage();
        
        
    };
    
    
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new StretchTable( this, options ));
            }
        });
    }

})( jQuery, window, document );