// Override Settings
var bcSfFilterSettings = {
  general: {
    limit: bcSfFilterConfig.custom.products_per_page,
    // Optional
    loadProductFirst: true,
    showPlaceholderProductList: true,
    placeholderProductPerRow: 5,
    placeholderProductGridItemClass: 'grid__item small--one-half medium-up--one-third'
  },
  template: {
    skeletonProduct: '<div class="{{wrapClass}} bc-sf-filter-product-skeleton"><a class="product-card"><div class="bc-sf-filter-skeleton-image" style="padding-top: {{paddingTop}}%"></div><div class="bc-sf-filter-skeleton-meta"><span class="bc-sf-filter-skeleton-text bc-sf-filter-skeleton"></span><span class="bc-sf-filter-skeleton-text bc-sf-filter-skeleton-width1"></span></div></a></div>',
  }
};

var bcSfFilterTemplate = {
    'btnSmallClass': 'btn--narrow',

    'vendorHtml': '<div class="produc-card__brand">{{itemVendorLabel}}</div>',
    'salePriceHtml': '<div class="produc-price">{{itemSalePrice}}</div>',
    'comparePriceHtml': '<div class="produc-price">{{itemComparePrice}}</div>',
    'retailPriceHtml': '<div class="produc-price">{{itemRetailPrice}}</div>',
    'firstLevelDiscountHtml': '<span class="collection-first-discount">extra {{itemFirstDiscount}} % off</span>',
    'saleLabelHtml': '<div class="product-tag product-tag--absolute" aria-hidden="true">' + bcSfFilterConfig.label.sale + '</div>',
    'soldOutLabelHtml': '<div class="product-card__availability">' + bcSfFilterConfig.label.sold_out + '</div>',

    // Grid
    'productGridItemHtml': '<div class="grid__item small--one-half medium-up--one-third">' +
                                '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
                                '<a href="{{itemUrl}}" class="product-card">' +
                                    '<div class="product-card__image-wrapper">' +
                                        '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}" class="product-card__image">' +
                                    '</div>' +
                                    '<div class="product-card__info text-center">' +
                                        '<div class="product-card__brand">{{itemVendor}}</div>' +
                                        '<div class="product-card__name">{{itemTitle}}</div>' +
                                        '<div class="product-card__price">{{itemPrice}}</div>' +
  '<div class="product-card__price " style="display: none;">sale price: {{itemSalePrice}}</div>' +
   '<div class="product-card__price" style="display: none;">compare price: {{itemComparePrice}}</div>' +
     '<div class="product-card__price" style="display: none;">retail price: {{itemRetailPrice}}</div>' +
  '<div class="product-card__price">{{itemFirstDiscount}}</div>' +
                                        '<div class="product-card__availability">{{itemSoldOutLabel}}</div>' +
                                    '</div>' +
                                    '{{itemSaleLabel}}' +
                                    '<div class="product-card__overlay">' +
                                       // '<span class="btn product-card__overlay-btn {{btnSmallClass}}">' + bcSfFilterConfig.label.view + '</span>' +
                                    '</div>' +
                                '</a>' +
                            '</div>',

    // Pagination Template
    'previousHtml': '<span class="prev"><a href="{{itemUrl}}">&larr;</a></span>',
    'nextHtml': '<span class="next"><a href="{{itemUrl}}">&rarr;</a></span>',
    'pageItemHtml': '<span class="page"><a href="{{itemUrl}}">{{itemTitle}}</a></span>',
    'pageItemSelectedHtml': '<span class="page current">{{itemTitle}}</span>',
    'pageItemRemainHtml': '<span>{{itemTitle}}</span>',
    'paginateHtml': '<div class="pagination">{{previous}}{{pageItems}}{{next}}</div>',

    // Sorting Template
    'sortingHtml': '<label class="collection-sort__label">' + bcSfFilterConfig.label.sorting + '</label><select class="collection-sort__input">{{sortingItems}}</select>'
};

BCSfFilter.prototype.buildProductGridItem = function(data) {
    /*** Prepare data ***/
    var images = data.images_info;
     // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add onSale label
    //var itemSaleLabelHtml = onSale ? bcSfFilterTemplate.saleLabelHtml : '';
    //itemHtml = itemHtml.replace(/{{itemSaleLabel}}/g, itemSaleLabelHtml);

    // Add soldOut label
    var itemSoldOutHtml = soldOut ? bcSfFilterTemplate.soldOutLabelHtml : '';
    itemHtml = itemHtml.replace(/{{itemSoldOutLabel}}/g, itemSoldOutHtml);

    // Add Thumbnail
    var itemThumbUrl = this.getFeaturedImage(images, '480x480');
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Vendor
    var itemVendorHtml = bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.vendorHtml.replace(/{{itemVendorLabel}}/g, data.vendor) : '';
    itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);
  
//   sale price
  var salePriceHtml =   bcSfFilterConfig.custom.vendor_enable ? bcSfFilterTemplate.salePriceHtml.replace(/{{itemSalePrice}}/g, data.price) : '';
    itemHtml = itemHtml.replace(/{{itemSalePrice}}/g, salePriceHtml);
  
  //   compare price
  var comparePriceHtml =  bcSfFilterTemplate.comparePriceHtml.replace(/{{itemComparePrice}}/g, data.compare_at_price_max);
    itemHtml = itemHtml.replace(/{{itemComparePrice}}/g, comparePriceHtml);
  
    //   retail price
  var retailPriceHtml;
  if(2<1){
  
   retailPriceHtml =  bcSfFilterTemplate.retailPriceHtml.replace(/{{itemRetailPrice}}/g, data.metafields.retail-price.value);
  } else{
  
  	retailPriceHtml = "";
  }
  itemHtml = itemHtml.replace(/{{itemRetailPrice}}/g, retailPriceHtml);
  
    //   first level discount
  if(data.compare_at_price_max > data.price ){
  	var firstDiscountHtml =  bcSfFilterTemplate.firstLevelDiscountHtml.replace(/{{itemFirstDiscount}}/g, ((((data.compare_at_price_max - data.price) / data.compare_at_price_max).toFixed(2)) * 100).toFixed(0));
  } else{
    
  	firstDiscountHtml = "";
    //bcSfFilterTemplate.retailPriceHtml = "<span>{{itemFirstDiscount}} test</span>";

     
  }
  if(data.compare_at_price_max < data.price){
  firstDiscountHtml = "";
   
  		
  }
    itemHtml = itemHtml.replace(/{{itemFirstDiscount}}/g, firstDiscountHtml);
  


    // Add Price
    var itemPriceHtml = '';
    if(soldOut) {}
    else{
      if (onSale) {
        if (priceVaries) {
            itemPriceHtml = (bcSfFilterConfig.label.sale_from_price).replace(/{{ price }}/g, this.formatMoney(data.price_min, this.moneyFormat));
        } else {
            itemPriceHtml = '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
            itemPriceHtml += '<s class="product-card__regular-price">' + this.formatMoney(data.compare_at_price_min, this.moneyFormat)  + '</s> ';
            itemPriceHtml += '<span class="visually-hidden">' + bcSfFilterConfig.label.sale_price + '</span>';
            itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        }
      } else {
        if (priceVaries) {
            itemPriceHtml = (bcSfFilterConfig.label.from_price).replace(/{{ price }}/g, this.formatMoney(data.price_min, this.moneyFormat));
        } else {
            itemPriceHtml = '<span class="visually-hidden">' + bcSfFilterConfig.label.regular_price + '</span>';
            itemPriceHtml += this.formatMoney(data.price_min, this.moneyFormat);
        }
    }
  }
    itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);
  


    // Add data json
    var self = this;
    var itemJson = {
      "id": data.id,
      "title": data.title,
      "handle": data.handle,
      "vendor": data.vendor,
      "variants": data.variants,
      "url": self.buildProductItemUrl(data),
      "options_with_values": data.options_with_values,
      "images": data.images,
      "available": data.available,
      "price_min": data.price_min,
  		"price_max": data.price_max,
  		"compare_at_price_min": data.compare_at_price_min,
  		"compare_at_price_max": data.compare_at_price_max
    };
    itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

    // Add main attribute
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

    return itemHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.pagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousHtml : '';
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage -1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextHtml : '';
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.pagination).html(paginationHtml);
    }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
    if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
        jQ(this.selector.topSorting).html('');

        var sortingArr = this.getSortingList();
        if (sortingArr) {
            // Build content
            var sortingItemsHtml = '';
            for (var k in sortingArr) {
                sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
            jQ(this.selector.topSorting).html(html);

            // Set current value
            jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
        }
    }
};

// Build Show Limit block
BCSfFilter.prototype.buildFilterShowLimit = function() {
    if (bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
        jQ(this.selector.topShowLimit).html('');

        var numberList = this.getSettingValue('general.showLimitList');
        if (numberList != '') {
            // Build content
            var showLimitItemsHtml = '';
            var arr = numberList.split(',');
            for (var k = 0; k < arr.length; k++) {
                showLimitItemsHtml += '<option value="' + arr[k] +'">' + arr[k] + '</option>';
            }
            var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
            jQ(this.selector.topShowLimit).html(html);

            // Set value
            jQ(this.selector.topShowLimit + ' select').val(this.queryParams.limit);
        }
    }
};


// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
    /* start-initialize-bc-al */
    var self = this;
    var alEnable = true;
    if(self.getSettingValue('actionlist.qvEnable') != '' || self.getSettingValue('actionlist.atcEnable') != ''){
      alEnable = self.getSettingValue('actionlist.qvEnable') || self.getSettingValue('actionlist.atcEnable');
    }
    if (alEnable === true && typeof BCActionList !== 'undefined') {
        if (typeof bcActionList === 'undefined') {
            bcActionList = new BCActionList();
        }else{
          if (typeof bcAlParams !== 'undefined' && typeof bcSfFilterParams !== 'undefined') {
              bcActionList.initFlag = false;
              bcActionList.alInit(bcSfFilterParams, bcAlParams);
          } else {
              bcActionList.alInit();
          }
        }
    }
    /* end-initialize-bc-al */};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {};


// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b} BCSfFilter.prototype.buildDefaultElements = function(a) { var self = this; if (jQ(self.getSelector('bottomPagination')).length > 0) { jQ(self.getSelector('bottomPagination')).show(); } if (jQ(self.getSelector('topSorting')).length > 0) { jQ(self.getSelector('topSorting')).hide(); } jQ(self.getSelector('products')).attr('data-bc-sort',''); self.removePlaceholderForFilterTree(); };

BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data[k]['variants'].filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if(data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0){ data[k].tags = data[k]['original_tags'].slice(0); }} return data };




// click show in mobile

var count = 0;

function deferFilterjQuery() {
    if (window.jQuery) {
        $(function(){
        //$('.filter-mobile').find('#bc-sf-filter-top-sorting').toggleClass('filter-toggle-show')
          $(document).on('click', '#bc-sf-filter-tree-mobile', function(e){
            count++
            
            $('.filter-mobile').find('.mobile-filter-sort').toggleClass('filter-toggle-show');
            $('.collection-sort__label').toggleClass('filter-toggle-hide filter-toggle-open');
            $('.bc-sf-filter-block-title').find('span').toggleClass('up');
            $('.bc-sf-filter-block-content').css('display','none')
           // $('.collection-sort__input').toggleClass('bc-sf-filter-block-content');
            

            
           // $('.collection-sort__input').css('display','none');
            
            if(count==1){
          //	$('.collection-sort__input').css('display','block');
            $('.filter-mobile').find('#bc-sf-filter-top-sorting').prepend("<div class='bc-sf-filter-block-title filter-toggle-show filter-toggle-close'><h3><span class='up'>Sort by</span></h3></div>");


            };
            
            

            e.preventDefault();
          });
         
       
   var resizeTimer; // Set resizeTimer to empty so it resets on page load
    function resizeFunction() {
        // Stuff that should happen on resize
   if($("body").width() < 770){ 

          $(document).on('click', '#bc-sf-filter-top-sorting', function(e){

            if($(this).find('.collection-sort__input').is(':hidden')){
             
             $(this).find('.collection-sort__input').slideDown('fast');
               $(this).find('.bc-sf-filter-block-title span').removeClass('up');
              
             }
          else{
           $(this).find('.collection-sort__input').slideUp('fast');
           $(this).find('.bc-sf-filter-block-title span').toggleClass('up');
          }
            
            
             e.preventDefault();
          });
         }
      
    };
    // On resize, run the function and reset the timeout
    // 250 is the delay in milliseconds. Change as you see fit.
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeFunction, 200);
    });
    resizeFunction();
          
     
          

      });
   

 
      
      
      
      
    }
    else {
        setTimeout(function() { deferFilterjQuery() }, 50);
    }
}


deferFilterjQuery();

// Fix image url issue of swatch option
function getFilePath(fileName, ext, version) {
    var self = bcsffilter;
    var ext = typeof ext !== 'undefined' ? ext : 'png';
    var version = typeof version !== 'undefined' ? version : '1';
    var prIndex = self.fileUrl.lastIndexOf('?');
    if (prIndex > 0) {
        var filePath = self.fileUrl.substring(0, prIndex);
    } else {
        var filePath = self.fileUrl;
    }
    filePath += fileName + '.' + ext + '?v=' + version;
    return filePath;
}

BCSfFilter.prototype.getFilterData=function(eventType,errorCount){function BCSend(eventType,errorCount){var self=bcsffilter;var errorCount=typeof errorCount!=="undefined"?errorCount:0;self.showLoading();if(typeof self.buildPlaceholderProductList=="function"){self.buildPlaceholderProductList(eventType)}self.beforeGetFilterData(eventType);self.prepareRequestParams(eventType);self.queryParams["callback"]="BCSfFilterCallback";self.queryParams["event_type"]=eventType;var url=self.isSearchPage()?self.getApiUrl("search"):self.getApiUrl("filter");var script=document.createElement("script");script.type="text/javascript";var timestamp=(new Date).getTime();script.src=url+"?t="+timestamp+"&"+jQ.param(self.queryParams);script.id="bc-sf-filter-script";script.async=true;var resendAPITimer,resendAPIDuration;resendAPIDuration=2e3;script.addEventListener("error",function(e){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}if(errorCount<3){errorCount++;if(resendAPITimer){clearTimeout(resendAPITimer)}resendAPITimer=setTimeout(self.getFilterData("resend",errorCount),resendAPIDuration)}else{self.buildDefaultElements(eventType)}});document.getElementsByTagName("head")[0].appendChild(script);script.onload=function(){if(typeof document.getElementById(script.id).remove=="function"){document.getElementById(script.id).remove()}else{document.getElementById(script.id).outerHTML=""}}}this.requestFilter(BCSend,eventType,errorCount)};BCSfFilter.prototype.requestFilter=function(sendFunc,eventType,errorCount){sendFunc(eventType,errorCount)};


/* start-boost-2.4.8 */
BCSfFilter.prototype.buildFilterOptionItem=function(html,iLabel,iValue,fOType,fOId,fOLabel,fODisplayType,fOSelectType,fOItemValue,fOData){var keepValuesStatic=fOData.hasOwnProperty("keepValuesStatic")?fOData.keepValuesStatic:false;if(fOType=="review_ratings"&&this.getSettingValue("general.ratingSelectionStyle")=="text"){var title=this.getReviewRatingsLabel(fOItemValue.from)}else{var title=this.customizeFilterOptionLabel(iLabel,fOData.prefix,fOType)}if(keepValuesStatic===true)var productNumber=null;else var productNumber=fOItemValue.hasOwnProperty("doc_count")?fOItemValue.doc_count:0;html=html.replace(/{{itemLabel}}/g,this.buildFilterOptionLabel(iLabel,productNumber,fOData));html=html.replace(/{{itemLink}}/g,this.buildFilterOptionLink(fOId,iValue,fOType,fODisplayType,fOSelectType,keepValuesStatic));html=html.replace(/{{itemValue}}/g,encodeURIParamValue(iValue));html=html.replace(/{{itemTitle}}/g,title);html=html.replace(/{{itemFunc}}/g,"onInteractWithFilterOptionValue(event, this, '"+fOType+"', '"+fODisplayType+"', '"+fOSelectType+"', '"+keepValuesStatic+"')");html=this.checkFilterOptionSelected(fOId,iValue,fOType,fODisplayType)?html.replace(/{{itemSelected}}/g,"selected"):html.replace(/{{itemSelected}}/g,"");var htmlElement=jQ(html);htmlElement.children().attr({"data-id":fOId,"data-value":encodeURIParamValue(iValue),"data-parent-label":fOLabel,"data-title":title,"data-count":productNumber});if(fOType!="collection"){htmlElement.children().attr("rel","nofollow")}if(fOType=="collection")htmlElement.children().attr("data-collection-scope",fOItemValue.key);return jQ(htmlElement)[0].outerHTML};
/* end-boost-2.4.8 */
/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
