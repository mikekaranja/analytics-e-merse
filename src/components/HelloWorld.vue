<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout id="layout-wrap" wrap="true">
        <div style="width:100%;margin-bottom: 20px;">
          <h1>Lead Generation Data</h1>
        </div>
        <v-flex xs4>
          <v-card style="margin-right: 20px;" dark color="primary">
            <v-card-title primary-title>
              <div class="headline">E-merse Shop Leads</div>
              <div>Select a shop from the drop down to view today's number of leads.</div>
              <v-select @input="getLeads" dark color="white" :items="items" v-model="e1" label="Select" single-line></v-select>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">38</div>
              <div style="width: 100%;margin-bottom: 54px;">Today's number of leads.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-2" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">12 %</div>
              <div style="width: 100%;margin-bottom: 10px;">Today's lead conversion rate.</div>
              <div style="width: 100%;margin-bottom: 23px;">Number of users to website 234.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <div style="width:100%;margin-top: 40px;">
          <hr style="width: 100%;border: 1px solid gray;margin-bottom: 20px;">
        </div>
        <div style="width:100%;">
          <h1>Google Analytics Data
            <span style="font-size: large;color: dimgrey;font-weight: 300;"> (Select different accounts to view analytics data)</span>
          </h1>
        </div>
        <div class="top-top-header">
          <div style="display:none;" id="embed-api-auth-container"></div>
        </div>
        <div class="top-header">
          <div id="view-name"></div>
          <div id="active-users-container"></div>
        </div>
        <div class="second-header">
          <div id="view-selector-container"></div>
        </div>
        <div class="Chartjs">
          <h3>This Week vs Last Week (by sessions)</h3>
          <figure class="Chartjs-figure" id="chart-1-container"></figure>
          <ol class="Chartjs-legend" id="legend-1-container"></ol>
        </div>
        <div class="Chartjs">
          <h3>This Year vs Last Year (by users)</h3>
          <figure class="Chartjs-figure" id="chart-2-container"></figure>
          <ol class="Chartjs-legend" id="legend-2-container"></ol>
        </div>
        <div class="Chartjs">
          <h3>Top Browsers (by pageview)</h3>
          <figure class="Chartjs-figure" id="chart-3-container"></figure>
          <ol class="Chartjs-legend" id="legend-3-container"></ol>
        </div>
        <div class="Chartjs">
          <h3>Top Countries (by sessions)</h3>
          <figure class="Chartjs-figure" id="chart-4-container"></figure>
          <ol class="Chartjs-legend" id="legend-4-container"></ol>
        </div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
const CLIENT_ID =
  '662994060989-alo8n62l7629hc6n6d095uvq8c69e1h8.apps.googleusercontent.com'

export default {
  data () {
    return {
      e1: '',
      enter: 'hidden',
      op: 0,
      items: [
        { text: 'Backyardshoez', db: 'backyardshoez' },
        { text: 'Backyardmens', db: 'backyardmens' },
        { text: 'Citywalk', db: 'citywalk' },
        { text: 'My Curves', db: 'Wendy Waweru' },
        { text: 'Salute Holdings', db: 'salute' }
      ]
    }
  },
  methods: {
    getLeads () {
      this.enter = 'hidden'
      this.op = 0
      setTimeout(() => {
        this.enter = 'visible'
        this.op = 1
      }, 1000)
      console.log(this.e1.text)
    }
  },
  mounted () {
    window.gapi.analytics.ready(function () {
      /**
       * Authorize the user immediately if the user has already granted access.
       * If no access has been created, render an authorize button inside the
       * element with the ID "embed-api-auth-container".
       */
      window.gapi.analytics.auth.authorize({
        container: 'embed-api-auth-container',
        clientid: CLIENT_ID
      })

      /**
       * Create a new ActiveUsers instance to be rendered inside of an
       * element with the id "active-users-container" and poll for changes every
       * five seconds.
       */
      let activeUsers = new window.gapi.analytics.ext.ActiveUsers({
        container: 'active-users-container',
        pollingInterval: 5
      })

      /**
       * Add CSS animation to visually show the when users come and go.
       */
      activeUsers.once('success', function () {
        // let element = this.container.firstChild
        let timeout

        this.on('change', function (data) {
          let element = this.container.firstChild
          let animationClass =
            data.delta > 0 ? 'is-increasing' : 'is-decreasing'
          element.className += ' ' + animationClass

          clearTimeout(timeout)
          timeout = setTimeout(function () {
            element.className = element.className.replace(
              / is-(increasing|decreasing)/g,
              ''
            )
          }, 3000)
        })
      })

      /**
       * Create a new ViewSelector2 instance to be rendered inside of an
       * element with the id "view-selector-container".
       */
      let viewSelector = new window.gapi.analytics.ext.ViewSelector2({
        container: 'view-selector-container'
      }).execute()

      /**
       * Update the activeUsers component, the Chartjs charts, and the dashboard
       * title whenever the user changes the view.
       */
      viewSelector.on('viewChange', function (data) {
        let title = document.getElementById('view-name')
        title.textContent = data.property.name + ' (' + data.view.name + ')'

        // Start tracking active users for this view.
        activeUsers.set(data).execute()

        // Render all the of charts for this view.
        renderWeekOverWeekChart(data.ids)
        renderYearOverYearChart(data.ids)
        renderTopBrowsersChart(data.ids)
        renderTopCountriesChart(data.ids)
      })

      /**
       * Draw the a chart.js line chart with data from the specified view that
       * overlays session data for the current week over session data for the
       * previous week.
       */
      function renderWeekOverWeekChart (ids) {
        // Adjust `now` to experiment with different days, for testing only...
        let now = window.moment() // .subtract(3, 'day');

        let thisWeek = query({
          ids: ids,
          dimensions: 'ga:date,ga:nthDay',
          metrics: 'ga:sessions',
          'start-date': window
            .moment(now)
            .subtract(1, 'day')
            .day(0)
            .format('YYYY-MM-DD'),
          'end-date': window.moment(now).format('YYYY-MM-DD')
        })

        let lastWeek = query({
          ids: ids,
          dimensions: 'ga:date,ga:nthDay',
          metrics: 'ga:sessions',
          'start-date': window
            .moment(now)
            .subtract(1, 'day')
            .day(0)
            .subtract(1, 'week')
            .format('YYYY-MM-DD'),
          'end-date': window
            .moment(now)
            .subtract(1, 'day')
            .day(6)
            .subtract(1, 'week')
            .format('YYYY-MM-DD')
        })

        Promise.all([thisWeek, lastWeek]).then(function (results) {
          let data1 = results[0].rows.map(function (row) {
            return +row[2]
          })
          let data2 = results[1].rows.map(function (row) {
            return +row[2]
          })
          let labels = results[1].rows.map(function (row) {
            return +row[0]
          })

          labels = labels.map(function (label) {
            return window.moment(label, 'YYYYMMDD').format('ddd')
          })

          let data = {
            labels: labels,
            datasets: [
              {
                label: 'Last Week',
                fillColor: 'rgba(220,220,220,0.5)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                data: data2
              },
              {
                label: 'This Week',
                fillColor: 'rgba(151,187,205,0.5)',
                strokeColor: 'rgba(151,187,205,1)',
                pointColor: 'rgba(151,187,205,1)',
                pointStrokeColor: '#fff',
                data: data1
              }
            ]
          }

          new window.Chart(makeCanvas('chart-1-container')).Line(data)
          generateLegend('legend-1-container', data.datasets)
        })
      }

      /**
       * Draw the a chart.js bar chart with data from the specified view that
       * overlays session data for the current year over session data for the
       * previous year, grouped by month.
       */
      function renderYearOverYearChart (ids) {
        // Adjust `now` to experiment with different days, for testing only...
        let now = window.moment() // .subtract(3, 'day');

        let thisYear = query({
          ids: ids,
          dimensions: 'ga:month,ga:nthMonth',
          metrics: 'ga:users',
          'start-date': window
            .moment(now)
            .date(1)
            .month(0)
            .format('YYYY-MM-DD'),
          'end-date': window.moment(now).format('YYYY-MM-DD')
        })

        let lastYear = query({
          ids: ids,
          dimensions: 'ga:month,ga:nthMonth',
          metrics: 'ga:users',
          'start-date': window
            .moment(now)
            .subtract(1, 'year')
            .date(1)
            .month(0)
            .format('YYYY-MM-DD'),
          'end-date': window
            .moment(now)
            .date(1)
            .month(0)
            .subtract(1, 'day')
            .format('YYYY-MM-DD')
        })

        Promise.all([thisYear, lastYear])
          .then(function (results) {
            let data1 = results[0].rows.map(function (row) {
              return +row[2]
            })
            let data2 = results[1].rows.map(function (row) {
              return +row[2]
            })
            let labels = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
            ]

            // Ensure the data arrays are at least as long as the labels array.
            // Chart.js bar charts don't (yet) accept sparse datasets.
            for (let i = 0, len = labels.length; i < len; i++) {
              if (data1[i] === undefined) data1[i] = null
              if (data2[i] === undefined) data2[i] = null
            }

            let data = {
              labels: labels,
              datasets: [
                {
                  label: 'Last Year',
                  fillColor: 'rgba(220,220,220,0.5)',
                  strokeColor: 'rgba(220,220,220,1)',
                  data: data2
                },
                {
                  label: 'This Year',
                  fillColor: 'rgba(151,187,205,0.5)',
                  strokeColor: 'rgba(151,187,205,1)',
                  data: data1
                }
              ]
            }

            new window.Chart(makeCanvas('chart-2-container')).Bar(data)
            generateLegend('legend-2-container', data.datasets)
          })
          .catch(function (err) {
            console.error(err.stack)
          })
      }

      /**
       * Draw the a chart.js doughnut chart with data from the specified view that
       * show the top 5 browsers over the past seven days.
       */
      function renderTopBrowsersChart (ids) {
        query({
          ids: ids,
          dimensions: 'ga:browser',
          metrics: 'ga:pageviews',
          sort: '-ga:pageviews',
          'max-results': 5
        }).then(function (response) {
          let data = []
          let colors = ['#4D5360', '#949FB1', '#D4CCC5', '#E2EAE9', '#F7464A']

          response.rows.forEach(function (row, i) {
            data.push({ value: +row[1], color: colors[i], label: row[0] })
          })

          new window.Chart(makeCanvas('chart-3-container')).Doughnut(data)
          generateLegend('legend-3-container', data)
        })
      }

      /**
       * Draw the a chart.js doughnut chart with data from the specified view that
       * compares sessions from mobile, desktop, and tablet over the past seven
       * days.
       */
      function renderTopCountriesChart (ids) {
        query({
          ids: ids,
          dimensions: 'ga:country',
          metrics: 'ga:sessions',
          sort: '-ga:sessions',
          'max-results': 5
        }).then(function (response) {
          let data = []
          let colors = ['#4D5360', '#949FB1', '#D4CCC5', '#E2EAE9', '#F7464A']

          response.rows.forEach(function (row, i) {
            data.push({
              label: row[0],
              value: +row[1],
              color: colors[i]
            })
          })

          new window.Chart(makeCanvas('chart-4-container')).Doughnut(data)
          generateLegend('legend-4-container', data)
        })
      }

      /**
       * Extend the Embed APIs `gapi.analytics.report.Data` component to
       * return a promise the is fulfilled with the value returned by the API.
       * @param {Object} params The request parameters.
       * @return {Promise} A promise.
       */
      function query (params) {
        return new Promise(function (resolve, reject) {
          let data = new window.gapi.analytics.report.Data({ query: params })
          data
            .once('success', function (response) {
              resolve(response)
            })
            .once('error', function (response) {
              reject(response)
            })
            .execute()
        })
      }

      /**
       * Create a new canvas inside the specified element. Set it to be the width
       * and height of its container.
       * @param {string} id The id attribute of the element to host the canvas.
       * @return {RenderingContext} The 2D canvas context.
       */
      function makeCanvas (id) {
        let container = document.getElementById(id)
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')

        container.innerHTML = ''
        canvas.width = container.offsetWidth
        canvas.height = container.offsetHeight
        container.appendChild(canvas)

        return ctx
      }

      /**
       * Create a visual legend inside the specified element based off of a
       * Chart.js dataset.
       * @param {string} id The id attribute of the element to host the legend.
       * @param {Array.<Object>} items A list of labels and colors for the legend.
       */
      function generateLegend (id, items) {
        let legend = document.getElementById(id)
        legend.innerHTML = items
          .map(function (item) {
            let color = item.color || item.fillColor
            let label = item.label
            return (
              '<li><i style="background:' +
              color +
              '"></i>' +
              escapeHtml(label) +
              '</li>'
            )
          })
          .join('')
      }

      // Set some global Chart.js defaults.
      window.Chart.defaults.global.animationSteps = 60
      window.Chart.defaults.global.animationEasing = 'easeInOutQuart'
      window.Chart.defaults.global.responsive = true
      window.Chart.defaults.global.maintainAspectRatio = false

      /**
       * Escapes a potentially unsafe HTML string.
       * @param {string} str An string that may contain HTML entities.
       * @return {string} The HTML-escaped string.
       */
      function escapeHtml (str) {
        let div = document.createElement('div')
        div.appendChild(document.createTextNode(str))
        return div.innerHTML
      }
    })
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-top-header {
  display: -webkit-box;
  width: 100%;
  padding-bottom: 10px;
}
.top-header {
  display: -webkit-box;
  width: 89%;
  padding-bottom: 20px;
}
#view-name {
  margin-right: auto;
  font-size: 24px;
}
.second-header {
  width: 100%;
}
#layout-wrap {
  background: white;
  padding: 16px;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
#view-selector-container .ViewSelector2 {
  background: beige;
}
select * {
  border: 1px solid darkgray;
  border-radius: 2px;
  padding: 7px;
  -webkit-appearance: menulist-button;
}
.Chartjs h3 {
  padding: 40px;
}
.card-leads-1 {
  margin-right: 20px;
  text-align: center;
  transition: visibility 0s, opacity 0.5s linear;
}
.card-leads-2 {
  text-align: center;
  transition: visibility 0s, opacity 0.5s linear;
}
</style>
