/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import 'vaadin-grid/vaadin-grid.js';
import 'vaadin-grid/vaadin-grid-selection-column.js';
import 'vaadin-grid/vaadin-grid-sorter.js';
import 'px-spinner/px-spinner.js';
import './px-data-grid.js';
import './px-data-grid-column.js';
import './px-auto-filter-field.js';
import './px-data-grid-navigation.js';
import './px-data-grid-theme.js';
import './px-data-grid-selection-column.js';
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js';
import './px-data-grid-string-renderer.js';
import './px-data-grid-cell-content-wrapper.js';
import './css/px-data-grid-paginated-styles.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Base } from '@polymer/polymer/polymer-legacy.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
{
  /**
   * `<px-data-grid-paginated>` - Predix UI component which defines a paginated data grid.
   *
   * Due to incompatibility of paginated grid with features in the list below, these won't
   * be available for px-data-grid-paginated:
   *
   * - Group By Column
   * - Select All checkbox in `<px-data-grid-selection-column>`
   */
  class DataGridPaginatedElement extends mixinBehaviors([AppLocalizeBehavior], PolymerElement) {
    static get template() {
      return html`
    <style include="px-data-grid-paginated-styles"></style>

    <px-data-grid remote-data-provider="{{_currentDataProvider}}" selection-mode="{{selectionMode}}" selected-items="{{selectedItems}}" hide-selection-column="{{hideSelectionColumn}}" resizable="{{resizable}}" striped="{{striped}}" ellipsis="{{ellipsis}}" multi-sort="{{multiSort}}" columns="{{columns}}" column-reordering-allowed="{{columnReorderingAllowed}}" hide-column-filter="{{hideColumnFilter}}" hide-action-menu="{{hideActionMenu}}" language="{{language}}" resources="{{resources}}" auto-filter="{{autoFilter}}" grid-height="{{gridHeight}}" item-id-path="{{itemIdPath}}" table-actions="{{tableActions}}" item-actions="{{itemActions}}" offer-filter-saving="{{offerFilterSaving}}" filterable="{{filterable}}" editable="{{editable}}" highlight="{{highlight}}" default-column-width="{{defaultColumnWidth}}" default-column-flex-grow="{{defaultColumnFlexGrow}}" disable-all-columns-filter="{{disableAllColumnsFilter}}" string-comparators="{{stringComparators}}" number-comparators="{{numberComparators}}">
    </px-data-grid>

    <px-data-grid-navigation total-item-count="[[size]]" on-navigation-change="_onNavigationChange" selectable-page-sizes="[[selectablePageSizes]]" page-size="[[pageSize]]" current-page="[[page]]" number-of-pages="[[_calcNumPages(size, pageSize)]]" hide-page-list="[[_hidePageList(autoHidePageList, size, pageSize)]]" hide-page-size-select="[[_hidePageSizeSelect(autoHidePageSizeSelect, size, selectablePageSizes)]]" language="[[language]]" resources="[[resources]]">
    </px-data-grid-navigation>
`;
    }

    static get is() {
      return 'px-data-grid-paginated';
    }

    static get properties() {
      return {
        // UNIQUE PROPERTIES FOR PX-DATA-GRID-PAGINATED

        /**
         * Array of selectable page sizes offered to the user.
         */
        selectablePageSizes: {
          type: Array,
          value: [10, 20, 30]
        },

        /**
         * Current page number of displayed items. Page 1 should be the minimum value.
         */
        page: {
          type: Number,
          value: 1,
          observer: '_onPageChange'
        },

        /**
         * Set to automatically hide the page numbers when there is only
         * 1 page available.
         */
        autoHidePageList: {
          type: Boolean,
          value: false
        },

        /**
         * Set to automatically hide the page size select when there is only
         * 1 page available and it's smaller or equal to the smallest of the selectable page sizes.
         */
        autoHidePageSizeSelect: {
          type: Boolean,
          value: false
        },


        // PROPERTIES SHARED WITH PX-DATA-GRID

        /**
         * Data for the table to display.
         *
         * Pass an array of objects. Each object will be rendered as a row
         * in the grid. The objects should share many of the same keys.
         * Each key will be used to group data into columns.
         *
         * Use the `columns` property to control which keys are displayed
         * to the user and which are not, and to control how the grid
         * handles the data for each column. By default if no `columns` are
         * defined the grid will automatically create columns from all of
         * the keys found in the first object.
         *
         * Example data:
         *
         * ```
         * [
         *   {
         *     first: 'Elizabeth',
         *     last: 'Wong',
         *     email: 'sika@iknulber.cl'
         *   },
         *   {
         *     first: 'Jeffrey',
         *     last: 'Hamilton',
         *     email: 'cofok@rac.be'
         *   },
         *   {
         *     first: 'Alma',
         *     last: 'Martin',
         *     email: 'dotta@behtam.la'
         *   }
         * ]
         * ```
         */
        tableData: {
          type: Array,
          notify: true
        },

        /**
         * Set to hide the selection checkbox for each row.
         *
         * By default, if the `selectionMode` property is set to `'single'`
         * or `'multi'` the grid shows a checkbox/radio button the user
         * can click to select or deselect a row. When this property is
         * enabled, the checkbox is hidden and the user can click directly
         * on row contents to select or deselect a row.
         */
        hideSelectionColumn: {
          type: Boolean,
          value: false
        },

        /**
         * Array of selected items. Automatically updated by the grid when
         * the user selects items. Each item will be a reference to the
         * `tableData` item that was passed to render the row.
         *
         * Add references to `tableData` items to programmatically select
         * items from your application.
         */
        selectedItems: {
          type: Array,
          value: () => [],
          notify: true
        },

        // @TODO: Improve docs for size
        /**
         * The total number of items
         */
        size: {
          type: Number,
          value: undefined,
          observer: '_ensureValidPageNumber'
        },

        /**
         * For paginated grid, the number of items visible in a single
         * page. Set to a higher number to show more items.
         *
         * `pageSize` is also used to set the number of items fetched
         * during each request to the `remoteDataProvider` if one is used.
         * See the `remoteDataProvider` property for more information.
         */
        pageSize: {
          type: Number,
          value: 10,
          observer: '_onPageSizeChange'
        },

        /**
         * When `true`, user can sort by multiple columns
         */
        multiSort: {
          type: Boolean,
          value: false
        },

        /**
         * Sets the current selection mode for the grid. Valid modes are:
         *
         *   * `'none'` - User can't select any rows
         *   * `'single'` - User can select one row at a time
         *   * `'multi'` - User can select multiple rows at the same time
         */
        selectionMode: {
          type: String,
          value: 'none'
        },

        // @TODO: Improve docs for activeItem
        /**
         * The item user has last interacted with. Turns to `null` after user deactivates
         * the item by re-interacting with the currently active item.
         */
        activeItem: {
          type: Object,
          notify: true,
          value: null
        },

        /**
         * Set to `true` to allow the user to resize columns.
         */
        resizable: {
          type: Boolean,
          value: false
        },

        /**
         * Set to allow users to edit data in the grid. You must also
         * explicitly set the `columns.editable` property to true for each
         * column the user can edit in the grid.
         *
         * When the user starts or stops editing a row the
         * `editing-item-changed` event will be fired. `event.detail.item`
         * will contain a reference to the row being edited.
         *
         * After a user finishes editing a row the `item-edited` event
         * will be fired. `event.detail` will contain information about
         * what the user changed.
         */
        editable: {
          type: Boolean,
          value: false
        },

        /**
         * Set to `true` to allow the user to re-order columns by dragging
         * and dropping them. Can't be combined with some other states like
         * group-by-value.
         */
        columnReorderingAllowed: {
          type: Boolean,
          value: false
        },

        /**
         * An array containing references to the expanded rows.
         *
         * Automatically updated by the grid in the following cases:
         *
         *   * When a `row-details` template is provided to create expandable
         *     rows the grid will add rows to this list when they are
         *     expanded by the user, and remove rows when they are collapsed
         *     by the user.
         *   * When the user groups rows by column the grid will add rows
         *     that the user expands and remove rows the user collapses.
         *
         * Set this value to references to rows to expand or collapse
         * the rows programmatically.
         */
        expandedItems: {
          type: Array,
          value: []
        },

        /**
         * If set, will remove the "Any column" filter from the Advanced Filter dialog.
         */
        disableAllColumnsFilter: {
          type: Boolean,
          value: false
        },

        /**
         * Set to hide the action menu button displayed at the top right of
         * the grid.
         *
         * If the action menu is hidden, the user will not be able to unhide
         * any hidden columns.
         */
        hideActionMenu: {
          type: Boolean,
          value: false
        },

        /**
         * Defines the columns the grid should render. If no columns are
         * passed, the grid generates columns from the `tableData` passed
         * in. Columns are rendered in the same order as the array.
         *
         * ## `column` options
         *
         * The following options are available for all column types. Only
         * `name` and `path` are required, all others are optional:
         *
         *   * `{string} name` - Human-readable name displayed in the column
         *     header
         *
         *   * `{string} path` - Key used to get the column data from each
         *     of the `tableData` objects
         *
         *   * `{string} id='column.path[column.type]'` - Unique identifier
         *     of the column. By default, px-data-grid will automatically
         *     generate it from `column.path` and `column.type`. There can't
         *     be 2 columns with the same id. The value `-any-` is a
         *     reserved keyword that you cannot use for any column `id`.
         *
         *   * `{string} type=('string'|'number'|'date')` - Type of data
         *     in the column. Used in the advanced filter UI to show
         *     different filter options for each data type. Does not change
         *     the renderer or impact sorting.
         *
         *   * `{string} renderer` - The name of the web component used to
         *     render each cell in the column. There are three built-in
         *     renderers available: `'px-data-grid-string-renderer'` (the
         *     default renderer), `'px-data-grid-number-renderer'`, and
         *     `'px-data-grid-date-renderer'`. You can also create a custom
         *     renderer and use its name here. If no renderer is specified,
         *     the column cannot be edited by the user.
         *
         *   * `{object} rendererConfig` - Settings to pass to the renderer
         *     that change how data is displayed to the user. See the
         *     examples below for information on which options are available
         *     for each built-in renderer.
         *
         * The following options are available for columns of type `date`:
         *
         *   * `{array} dateRanges` - List of pre-defined date ranges that
         *     will appear in advanced filter dropdown for this column.
         *     See the examples below for examples on how to format
         *     each date range.
         *
         * The following options are available for columns of type `number`:
         *
         *   * `{number} minBound` - Defines a minimum bound of a number in
         *     the advanced filter field for this column. If both minBound
         *     and maxBound properties are defined, the advanced filter will
         *     display a slider instead of a condition dropdown.
         *
         *   * `{number} maxBound` - Defines a maximum bound of a number in
         *     the advanced filter field for this column.
         *
         *   * `{boolean} hidden=false` - Hides the column from the user
         *     when the grid is rendered. Automatically updated when the
         *     user shows/hides columns using action menu(s).
         *
         *   * `{boolean} frozen=false` - Freezes the column. When the user
         *     scrolls the grid horizontally frozen columns will not move.
         *     Automatically updated when the user freezes/unfreezes columns
         *     using action menu(s).
         *
         *   * `{boolean} required=false` - Used in renderers during editing.
         *     If the column is required, the user will not be allowed to
         *     enter a blank value.
         *
         *   * `{number} flexGrow=1` - Sets the relative size of the column
         *     compared to other columns in the grid. Equivalent to the CSS
         *     `flex-grow` property.
         *
         *
         * ## `column.dateFormat` options
         *
         * The following options can be set in the `dateFormat` for
         * columns of type `date`. All formats should be set to a valid
         * [moment.js format string](https://momentjs.com/docs/#/parsing/string-format/)
         * or to 'ISO':
         *
         *   * `{string} dateFormat.format='YYYY-MM-DD"T"HH:mm:ss.SSSS'` -
         *     Format used to read the date/timestamp data.
         *
         *   * `{string} dateFormat.timezone='UTC'` -
         *     Timezone used to read the date/timestamp data.
         *
         * Date parsing uses moment's [forgiving mode](https://momentjs.com/guides/#/parsing/forgiving-mode/), which can produce
         * silent but highly undesirable parsing errors if the date format does not match the source data.
         * If your source data is formatted differently to ISO8601, it is critical that you
         * configure the `format` property correctly.
         *
         * ## `column.rendererConfig` options
         *
         * The following options can be set in the `rendererConfig` for
         * columns of type `date`. All formats should be set to a valid
         * [moment.js format string](https://momentjs.com/docs/#/parsing/string-format/)
         * or to 'ISO':
         *
         *   * `{string} rendererConfig.displayFormat='YYYY-MM-DD'` -
         *     Format used to display the date for the user.
         *
         *   * `{string} rendererConfig.dataFormat='YYYY-MM-DD'` - Format
         *     the grid expects data in when reading it from `tableData`.
         *
         *   * `{string} rendererConfig.datePickerDateFormat='YYYY-MM-DD'` -
         *     Format used for the px-datetime-picker date when the user
         *     edits cells in the column.
         *
         *   * `{string} rendererConfig.datePickerTimeFormat='HH:MM:SS'` -
         *     Format used for the px-datetime-picker time when the user
         *     edits cells in the column.
         *
         *   * `{boolean} rendererConfig.hideDate=false` - Hides the date
         *     section of the px-datetime-picker when the user edits cells
         *     in the column.
         *
         *   * `{boolean} rendererConfig.hideTime=true` - Hides the time
         *     section of the px-datetime-picker when the user edits cells
         *     in the column.
         *
         * The following options can be set in the `rendererConfig` for
         * columns of type `number`:
         *
         *   * `{?string} rendererConfig.displayFormat=null` - Format used to
         *     display numbers in this column. Set to a valid
         *     [numbro.js format string](http://numbrojs.com/format.html).
         *     Set to `null` to display the number exactly as it appears
         *     in the `tableData` by coercing it to string.
         *
         *   * `{string} rendererConfig.displayCulture='en-US'` - Changes the
         *     way numbers in this column are displayed to the user by
         *     localizing to get the correct format for commas, decimals,
         *     etc. See [numbro.js languages](http://numbrojs.com/languages.html)
         *     for a list of valid options.
         *
         *   * `{boolean} rendererConfig.displayIsCurrency=false` - Set to
         *     `true` if the data in this column should be formatted as
         *     currency. Will use `rendererConfig.displayFormat` to figure
         *     out how to display the currency, or fall back to a localized
         *     default based on `rendererConfig.displayCulture`.
         *
         *   * `{string} displayZeroFormat` - Used to format numbers equal
         *     to `0` in this column. See [numbro.js docs](http://numbrojs.com/format.html)
         *     for a list of valid options.
         *
         * ## Examples
         *
         * Example format for a single column with all configurations used:
         *
         * ```javascript
         * {
         *   id: 'first[string]',
         *   name: 'First Name',
         *   path: 'first',
         *   type: 'string',
         *   renderer: 'px-data-grid-string-renderer',
         *   rendererConfig: {
         *     customInfo: 'some info',
         *     customInfo2: 42
         *   },
         *   dateRanges: [
         *     {
         *       name: 'Last 7 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(7, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Fixed range',
         *       range: {
         *         dateTo: '1996-11-10',
         *         dateFrom: '1985-12-19'
         *       }
         *     }
         *   ],
         *   minBound: 1,
         *   maxBound: 10,
         *   hidden: false,
         *   frozen: false,
         *   required: false,
         *   flexGrow: 1
         * }
         * ```
         *
         * Example format for column of type `date` with custom `dateRanges`:
         *
         * ```javascript
         * {
         *   name: 'Birth date',
         *   path: 'birth_date',
         *   type: 'date',
         *   editable: true,
         *   renderer: 'px-data-grid-date-renderer',
         *   rendererConfig: {
         *     hideTime: true,
         *     displayFormat: 'YYYY/MM/DD',
         *     dataFormat: 'YYYY-MM-DD'
         *   },
         *   dateRanges: [
         *     {
         *       name: 'Last 7 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(7, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Last 14 days',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(14, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'This month',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(31, 'd').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Last month',
         *       getRange: () => {
         *         return {
         *           // use timezone of source data
         *           dateTo: window.moment().tz('UTC').subtract(1, 'M').format(),
         *           dateFrom: window.moment().tz('UTC').subtract(2, 'M').format()
         *         };
         *       }
         *     },
         *     {
         *       name: 'Fixed range',
         *       range: {
         *         dateTo: '1996-11-10',
         *         dateFrom: '1985-12-19'
         *       }
         *     }
         *   ]
         * }
         * ```
         */
        columns: {
          type: Array
        },

        /**
         * A valid IETF language tag as a string that `app-localize-behavior`
         * will use to localize this component.
         *
         * See https://github.com/PolymerElements/app-localize-behavior for
         * API documentation and more information.
         */
        language: {
          type: String,
          value: 'en'
        },

        /**
         * Use the key for localization if value for that language is missing.
         * Should always be true for Predix components.
         */
        useKeyIfMissing: {
          type: Boolean,
          value: true
        },

        /**
         * Library object of hardcoded strings used in this application.
         * Used by `app-localize-behavior` in conjunction with `language`.
         */
        resources: {
          type: Object,
          value: () => {
            return {
              'en': {
                'Rows per page': 'Rows per page',
                'of {total}': 'of {total}'
              },
              'fr': {
                'Rows per page': 'Lignes par page',
                'of {total}': 'sur {total}'
              },
              'fi': {
                'Rows per page': 'Riviä / sivu',
                'of {total}': '/ {total}'
              }
            };
          }
        },

        /**
         * A list of custom actions that are shown when the user taps the
         * action menu button at the top right of the grid. If the
         * `hideActionMenu` property is enabled the action menu won't be
         * shown to the user.
         *
         * Each array entry should be an object with the following properties:
         *
         *   * `{string} name` - Label shown in the action menu, should
         *     prompt the user to do something (e.g. "Export CSV")
         *   * `{string} id` - Unique identifier that will be included in the
         *     event fired when the user taps an action in the menu
         *
         * When the user taps an action in the menu the grid will fire the
         * `table-action` event. `event.detail.id` will be the action ID.
         *
         * Example actions:
         *
         * ```javascript
         * [
         *   {
         *     name: 'Export CSV',
         *     id: 'CSV'
         *   }
         *   {
         *     name: 'Export Excel',
         *     id: 'Excel'
         *   }
         * ]
         * ```
         */
        tableActions: {
          type: Array,
        },

        /**
         * Set to `true` to allow the user to hide the column filter/selector in
         * the action menu.
         */
        hideColumnFilter: {
          type: Boolean,
          value: false
        },

        /**
         * A list of custom actions that are shown in the actions menu
         * for each data row. The action menu button appears to the right
         * of each row when the user hovers over the row.
         *
         * Each array entry should be an object with the following properties:
         *
         *   * `{string} name` - Label shown in the action menu, should
         *     prompt the user to do something (e.g. "Add Row After")
         *   * `{string} id` - Unique identifier that will be included in the
         *     event fired when the user taps an action in the menu
         *
         * When the user taps an action in the menu the grid will fire the
         * `item-action` event. `event.detail.id` will be the action ID and
         * `event.detail.item` will be a reference to the row the user
         * took action on (from `tableData`).
         *
         * Example actions:
         *
         * ```javascript
         * [
         *   {
         *     name: 'Add Row After',
         *     id: 'add-after'
         *   }
         *   {
         *     name: 'Delete Row',
         *     id: 'delete'
         *   }
         * ]
         * ```
         */
        itemActions: {
          type: Array
        },

        /**
         * Function that provides items lazily. Receives arguments `params`, `callback`:
         *
         * `params.page` Requested page index
         *
         * `params.pageSize` Current page size
         *
         * `params.filters` Currently applied filters
         *
         * `params.sortOrders` Currently applied sorting orders
         *
         * `params.parentItem` When expandable table is used, and sublevel items
         * are requested, reference to parent item of the requested sublevel.
         * Otherwise `undefined`.
         *
         * `callback(items, size)` Callback function with arguments:
         *   - `items` Current page of items
         *   - `size` Total number of items.
         *
         * `<px-data-grid>` calls this function lazily, only when it needs more data
         * to be displayed.
         *
         * __Also, note that when using function data providers, the total number of items
         * needs to be set manually. The total number of items can be returned
         * in the second argument of the data provider callback:__
         *
         * ```javascript
         * pxDataGrid.dataProvider = function(params, callback) {
         *   var url = 'https://api.example/data' +
         *       '?page=' + params.page +        // the requested page index
         *       '&per_page=' + params.pageSize; // number of items on the page
         *   var xhr = new XMLHttpRequest();
         *   xhr.onload = function() {
         *     var response = JSON.parse(xhr.responseText);
         *     callback(
         *       response.employees, // requested page of items
         *       response.totalSize  // total number of items
         *     );
         *   };
         *   xhr.open('GET', url, true);
         *   xhr.send();
         * };
         * ```
         *
         * __Alternatively, you can use the `size` property to set the total number of items:__
         *
         * ```javascript
         * pxDataGrid.size = 200; // The total number of items
         * pxDataGrid.dataProvider = function(params, callback) {
         *   var url = 'https://api.example/data' +
         *       '?page=' + params.page +        // the requested page index
         *       '&per_page=' + params.pageSize; // number of items on the page
         *   var xhr = new XMLHttpRequest();
         *   xhr.onload = function() {
         *     var response = JSON.parse(xhr.responseText);
         *     callback(response.employees);
         *   };
         *   xhr.open('GET', url, true);
         *   xhr.send();
         * };
         * ```
         */
        remoteDataProvider: {
          type: Function,
          observer: '_remoteDataProviderChanged'
        },

        _currentDataProvider: {
          type: Function
        },

        /**
         * Set to add a background color to every other row in the grid.
         * Can make it easier for users to scan across long rows. Striping
         * is disabled in group-by-column mode.
         */
        striped: {
          type: Boolean,
          value: false
        },

        /**
         * Set to show an ellipsis and truncate text for columns where the
         * text doesn't fit in the column.
         *
         * Do not enable wrap mode while ellipsis mode is enabled.
         */
        ellipsis: {
          type: Boolean,
          value: false
        },

        /**
         * Number of milliseconds to wait before showing the loading spinner
         * when requesting new data from the `remoteDataProvider`.
         */
        loadingSpinnerDebounce: {
          type: Number,
          value: 500
        },

        /**
         * Set to `true` to enable simple filtering. When enabled, a search
         * box will be shown at the top of the grid. The user can type
         * in the search box to hide rows that don't include the stringified
         * value they're looking for. The grid will search all columns and
         * treat all column types as strings for matching purposes.
         *
         * See `filterable` property for a more advanced filter option.
         */
        autoFilter: {
          type: Boolean,
          value: false
        },

        /**
         * List of rules used to highligh specific columns, rows, or cells.
         *
         * Pass an array of objects. Each object should have the following
         * properties:
         *
         *   * `{string} type` - If the highlight condition returns `true`,
         *     the type determines what the grid will highlight. Set to
         *     `'cell'` to highlight only the cell that passed the highlight
         *     rule, `'row'` to highlight the row that holds the matching
         *     cell, or `'column'` to highlight the column that holds the
         *     matching cell.
         *   * `{Function} condition` - Function that will be called by the
         *     grid for each cell. If the function returns `true`, the
         *     highlight rule will be triggered. If the function returns a
         *     falsey value, the highlight rule will not be used. The function
         *     will be passed three arguments: `cellContent` containing
         *     the text of the cell, `column` containing a reference to the
         *     `columns` object for the cell's column, and `item` as a reference
         *     to the `tableData` item used to create the cell's row.
         *   * `{string} color` - A valid CSS color (e.g. hex code or color
         *     name). If the highlight condition returns `true`, the color
         *     will be used to set the background color of the matching
         *     cell, column, or row.
         *
         * Example highlight rules:
         *
         * ```javascript
         * [
         *   {
         *     type: 'cell',
         *     condition: (cellContent, column, item) => { return cellContent == 'John Doe' },
         *   },
         *   {
         *     type: 'row',
         *     condition: (cellContent, item) => { return cellContent[0] == 'a' },
         *     color: '#a8a8a8'
         *   },
         *   {
         *     type: 'column',
         *     condition (column, item) => { return column.name == 'age' },
         *     color: 'pink'
         *   }
         * ]
         * ```
         */
        highlight: {
          type: Array
        },

        /**
         * When true data provider is local, when false external (remote) and
         * when undefined it defined yet.
         */
        _hasLocalDataProvider: {
          type: Boolean
        },

        /**
         * Default width for columns. Defaults to `100px` if undefined.
         *
         * Column sizes should also be configured using the
         * `defaultColumnFlexGrow` and `columns.flexGrow` properties to
         * change how each column sizes itself relative to other columns in
         * the grid.
         *
         * When column flex-grow properties are set to non-zero values,
         * this size behaves as a minimum width for the column.
         */
        defaultColumnWidth: {
          type: String
        },

        /**
         * Default flex-grow value for columns if none is defined in
         * `columns.flexGrow`. Equivalent to the CSS flex-grow property.
         */
        defaultColumnFlexGrow: {
          type: Number
        },

        /**
         * Defines the height of grid.
         *
         *   * Set to `'auto'` if the grid should grow to fit all of its rows
         *   * Set to `'default'` or undefined to use the default height
         *   * Set to any other valid CSS height valid (e.g. `400px`) to
         *     define a static height for the grid area inside the
         *     px-data-grid. This height will not include the table action
         *     menu and other elements of the grid.
         *
         * See the `flexToSize` property for a different strategy that sizes
         * the grid based on its parent element's height.
         */
        gridHeight: {
          type: String,
          value: 'auto'
        },

        /**
         * Path to a `tableData` item sub-property that serves as a unique
         * identifier for the item. Should be defined if the grid allows
         * user editing so the grid can pair new versions of each item
         * with the original data.
         *
         * Path must be unique for each item, must exist for every item,
         * and should not be changed or be user editable.
         */
        itemIdPath: {
          type: String
        },

        /**
         * Set to allow users to save filters created in the advanced filter
         * dialog. If enabled, the grid will fire `save-filters` events when
         * the user taps the save filter button.
         */
        offerFilterSaving: {
          type: Boolean
        },

        /**
         * Set to enable advanced filtering. When enabled, a filter
         * button will be shown at the top of the grid. When the user clicks
         * on the filter button, a modal will be shown and the user can
         * filter visible items using different UI patterns.
         *
         * Columns should have the right `columns.type` set to ensure the
         * advanced filtering works as expected. See the `columns` property
         * for more information on setting the type, and for more advanced
         * filtering options that can be customized for `number` and `date`
         * type columns.
         */
        filterable: {
          type: Boolean,
          value: false
        },

        /**
         * Comparison options shown in the advanced filtering UI for columns
         * of type `string`. Valid options are:
         *
         *   * `'equals'`
         *   * `'contains'`
         *   * `'starts_with'`
         *   * `'ends_with'`
         *   * `'wildcard'`
         *
         * If this array is undefined or empty, all options will be shown.
         */
        stringComparators: {
          type: Array
        },

        /**
         * Comparison options shown in the advanced filtering UI for columns
         * of type `number`. Valid options are:
         *
         *   * `'less_than'`
         *   * `'equals'`
         *   * `'not_equal'`
         *   * `'equal_or_greater_than'`
         *   * `'equal_or_less_than'`
         *   * `'greater_than'`
         *
         * If this array is undefined or empty, all options will be shown.
         */
        numberComparators: {
          type: Array
        }
      };
    }

    static get observers() {
      return [
        '_tableDataChanged(tableData, tableData.*, isAttached)'
      ];
    }

    ready() {
      super.ready();
      this._resolvePxDataGrid();
    }

    _resolvePxDataGrid() {
      if (this._pxDataGrid === undefined) {
        this._pxDataGrid = this.shadowRoot.querySelector('px-data-grid');
      }
      return this._pxDataGrid;
    }

    _tableDataChanged(tableData, splices, isAttached) {
      if (!isAttached) {
        return;
      }

      if (this.selectedItems.length > 0) {
        this.selectedItems = [];
      }

      if (tableData) {
        this._hasLocalDataProvider = true;
        this._currentDataProvider = this._wrapDataProvider(this._localDataProvider);
      }
    }

    _remoteDataProviderChanged(provider) {
      this._hasLocalDataProvider = false;
      this._currentDataProvider = this._wrapDataProvider(provider);
    }

    /**
     * Wrap the supplied data provider in order to manipulate the request and data
     * to work with our pagination state.
     */
    _wrapDataProvider(provider) {
      // TODO: fix this... doesn't work without assigning to 'this', not sure why
      this._baseDataProvider = provider;

      const wrappedProvider = function(params, callback) {
        // override page and page size params with ours
        params.page = this.page - 1;
        params.pageSize = this.pageSize;
        // wrap the callback
        this._baseDataProvider(params, function(items, size) {
          // keep a reference to the total number of items (needed for pagination ui)
          this.size = size;
          // pass the vaadin grid the page size (or items size if less) so that
          // vaadin grid only displays this many items at a time (aka a single page of rows)
          const numDisplayedRows = (items.length > params.pageSize) ? params.pageSize : items.length;
          callback(items, numDisplayedRows);
          this._resolvePxDataGrid()._populateTableColumns(items);
        }.bind(this));
      }.bind(this);

      return wrappedProvider;
    }

    _localDataProvider(params, callback) {
      // Just to make sure _pxDataGrid has been resolved
      this._resolvePxDataGrid();

      const items = Array.isArray(this.tableData) ? this.tableData : [];
      const response = this._localDataResolver(params, items);
      callback(response.items, response.total);
    }

    _localDataResolver(params, items) {
      if (params.filters) {
        const autoFilters = params.filters.filter(filter => filter.value.isAutoFilter);

        if (autoFilters.length && this._pxDataGrid._vaadinGrid._checkPaths(autoFilters, 'filtering', items)) {
          items = this._pxDataGrid._applyAutoFilter(items, params.filters);
        }

        const advancedFilters = params.filters
          .filter(filter => filter.value.isAdvancedFilter)
          .map(filter => filter.value.filter);

        if (advancedFilters && advancedFilters.length != 0) {
          items = this._pxDataGrid._applyCustomFilter(items, this._pxDataGrid.columns, advancedFilters);
        }
      }

      if (params.sortOrders
        && params.sortOrders.length
        && this._pxDataGrid._vaadinGrid._checkPaths(this._pxDataGrid._sorters, 'sorting', items)) {
        const multiSort = (a, b) => {
          return params.sortOrders.map(sort => {
            if (sort.direction === 'asc') {
              return this._pxDataGrid._compare(Base.get(sort.path, a), Base.get(sort.path, b));
            } else if (sort.direction === 'desc') {
              return this._pxDataGrid._compare(Base.get(sort.path, b), Base.get(sort.path, a));
            }
            return 0;
          }).reduce((p, n) => {
            return p ? p : n;
          }, 0);
        };

        items = items.slice(0).sort(multiSort);
      }

      const total = items.length;
      const start = params.page * params.pageSize;
      const end = start + params.pageSize;

      return {
        items: items.slice(start, end),
        total: total
      };
    }

    /**
     * Will return all local items after filter (no ordering applied)
     */
    _getAllLocalItems() {
      if (this._hasLocalDataProvider) {
        const items = (Array.isArray(this.tableData) ? this.tableData : []).slice(0);
        return this._localDataResolver({
          page: 0,
          pageSize: this.tableData.length
        }, items);
      } else {
        return [];
      }
    }

    /**
     * Listener for px-data-grid-navigation component
     */
    _onNavigationChange(event) {
      // update page size
      if (this.pageSize !== event.detail.pageSize) {
        this.pageSize = event.detail.pageSize;
      }
      // update current page number
      if (this.page !== event.detail.currentPage) {
        this.page = event.detail.currentPage;
      }
    }

    _onPageSizeChange(pageSize) {
      this._ensureValidPageSize();
      this._ensureValidPageNumber();
      this._updateGridData();
    }

    _onPageChange(page) {
      this._ensureValidPageNumber();
      this._updateGridData();
    }

    /**
     * Update grid data via the current data provider.
     */
    _updateGridData() {
      // clear grid cache to force loading data from data provider
      if (this._pxDataGrid) {
        this._pxDataGrid._vaadinGrid.clearCache();
      }
    }

    /**
     * Checks if current page is smaller than the total number of pages
     * and larger than 0.
     * If it is not valid, then reset it to 1.
     */
    _ensureValidPageNumber() {
      const numPages = this._calcNumPages(this.size, this.pageSize);
      // page must be at least 1
      this.page = (this.page > 0) ? this.page : 1;
      // page cannot be greater than total number of pages
      this.page = (numPages < this.page) ? 1 : this.page;
    }

    /**
     * Ensure page size is valid (greater than 0). If page size in invalid,
     * page size will be set to 10.
     */
    _ensureValidPageSize() {
      this.pageSize = (this.pageSize > 0) ? this.pageSize : 10;
    }

    /**
     * Calculates the number pages based on  total number of rows and the page size
     */
    _calcNumPages(numItems, pageSize) {
      let numPages = 1;
      if (pageSize) {
        numPages = Math.ceil(numItems / pageSize);
      }
      return numPages;
    }

    _hidePageList(autoHidePageList, size, pageSize) {
      return autoHidePageList && this._calcNumPages(size, pageSize) === 1;
    }

    _hidePageSizeSelect(autoHidePageSizeSelect, size, selectablePageSizes) {
      return autoHidePageSizeSelect &&
        this._calcNumPages(size, Math.min.apply(null, selectablePageSizes)) === 1;
    }

    /**
     * Get data current shown on grid
     */
    getData(visibleOnly) {
      return this._pxDataGrid.getData(visibleOnly);
    }

    /**
     * Get current visible columns in grid
     */
    getVisibleColumns() {
      return this._pxDataGrid.getVisibleColumns();
    }

    /**
     * Helper method to check if header is defined, if not use name
     */
    resolveColumnHeader(column) {
      return this._pxDataGrid.resolveColumnHeader(column);
    }
  }
  customElements.define(DataGridPaginatedElement.is, DataGridPaginatedElement);

  Predix.DataGridPaginatedElement = DataGridPaginatedElement;
}