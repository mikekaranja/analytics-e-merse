<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout id="layout-wrap" wrap="true">
        <div style="width:100%;margin-bottom: 20px;display: -webkit-box;">
          <div>
            <h1 style="margin: 15px;">Shop Analytics Data
              <!-- <span style="font-size: medium;color: dimgrey;font-weight: 300;"> (Select different shops to view shop analytics data)</span>
             -->
            </h1>
          </div>
          <div style="margin-left: 12%; width: 200px;">
            <v-select @input="getShopData" light color="black" :items="items" v-model="e1" label="Shop" single-line></v-select>
          </div>
          <div style="margin-left: 3%; width: 250px;">
            <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="290px">
              <v-text-field slot="activator" v-model="startdate" label="Select Start Date" prepend-icon="event" readonly></v-text-field>
              <v-date-picker @input="dateChange" :max="maxDate" v-model="startdate"></v-date-picker>
            </v-menu>
          </div>
          <div style="margin-left: 3%; width: 250px;">
            <v-menu ref="menu3" :close-on-content-click="false" v-model="menu3" :nudge-right="40" :return-value.sync="date2" lazy transition="scale-transition" offset-y full-width min-width="290px">
              <v-text-field slot="activator" v-model="enddate" label="Select End Date" prepend-icon="event" readonly></v-text-field>
              <v-date-picker @input="dateChange" :max="maxDate" v-model="enddate"></v-date-picker>
            </v-menu>
          </div>
        </div>
        <v-flex xs4>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">{{ total }}</div>
              <div style="width: 100%;margin-bottom: 54px;">Number of leads.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">{{ users }}</div>
              <div style="width: 100%;margin-bottom: 54px;">Number of users.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs4>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">{{ conversionRate }} %</div>
              <div style="width: 100%;margin-bottom: 54px;">Lead conversion rate.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">{{ bouncerate }}%</div>
              <div style="width: 100%;margin-bottom: 54px;">Bounce rate.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" dark color="primary">
            <v-card-title primary-title>
              <div style="width: 100%;font-size: 48px;">{{ averageduration }} Minutes</div>
              <div style="width: 100%;margin-bottom: 54px;">Average Duration.</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" light>
            <div class="Chartjs">
              <h3>Top Traffic Sources (by pageview)</h3>
              <figure class="Chartjs-figure" id="chart-5-container"></figure>
              <ol class="Chartjs-legend" id="legend-5-container"></ol>
            </div>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card :style="{ visibility: enter, opacity: op }" class="card-leads-1" light>
            <div class="Chartjs">
              <h3>Top Browsers (by pageview)</h3>
              <figure class="Chartjs-figure" id="chart-6-container"></figure>
              <ol class="Chartjs-legend" id="legend-6-container"></ol>
            </div>
          </v-card>
        </v-flex>
        <!-- <div style="width:100%;margin-top: 40px;">
          <hr style="width: 100%;border: 1px solid gray;margin-bottom: 20px;">
        </div> -->

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
const config = {
  apiKey: 'AIzaSyC76Juw8rMxbeVDbIm_ABL-IIhssVDDDn8',
  authDomain: 'e-merse.firebaseapp.com',
  databaseURL: 'https://e-merse.firebaseio.com',
  projectId: 'e-merse',
  storageBucket: 'e-merse.appspot.com',
  messagingSenderId: '662994060989'
}

// const CLIENT_ID =
//   '662994060989-alo8n62l7629hc6n6d095uvq8c69e1h8.apps.googleusercontent.com'

// let dataids = ''
// let dateRange1 = ''

export default {
  data () {
    return {
      date: null,
      date2: null,
      startdate: '',
      enddate: '',
      menu: false,
      modal: false,
      menu2: false,
      menu3: false,
      e1: '',
      e2: '',
      enter: 'hidden',
      op: 0,
      leads: [],
      total: '',
      users: '',
      bouncerate: '',
      averageduration: '',
      items: [
        { text: 'Backyardshoez', db: 'backyardshoez', id: '157142203' },
        { text: 'Backyardmens', db: 'backyardmens', id: '174121249' },
        { text: 'Citywalk', db: 'citywalk', id: '156430690' },
        { text: 'Salute Holdings', db: 'salute', id: '166305779' }
      ]
    }
  },
  computed: {
    maxDate () {
      let today = new Date()
      let year = today.getFullYear()
      let month =
        (today.getMonth() < 10 ? '0' : '') +
        (parseInt(today.getMonth().toString()) + 1)
      let day = (today.getDate() < 10 ? '0' : '') + today.getDate()
      let date = year + '-' + month + '-' + day
      this.startdate = date
      this.enddate = date
      return date
    },
    conversionRate () {
      let div = parseInt(this.total) / parseInt(this.users)
      let con = div * 100
      return con.toString().substring(0, 4)
    }
  },
  methods: {
    dateChange () {
      if (this.startdate && this.enddate && this.e1.id) {
        this.getShopData()
      }
    },
    dateOf (myDate) {
      myDate = myDate.split('-')
      var newDate = myDate[0] + '/' + myDate[1] + '/' + myDate[2]
      return new Date(newDate).getTime()
    },
    dateOf1 (time) {
      let today = new Date(time)
      let day =
        today.getDate() + ' ' + today.getFullYear() + ' ' + today.getMonth()
      return day
    },
    getShopData () {
      this.total = ''
      this.enter = 'hidden'
      this.op = 0
      setTimeout(() => {
        this.enter = 'visible'
        this.op = 1
      }, 3200)
      // request analytics data
      this.queryReports1(this.e1.id)
      // get data for browsers
      setTimeout(() => {
        this.queryReports2(this.e1.id)
      }, 1000)
      // get data traffic sources
      setTimeout(() => {
        this.queryReports3(this.e1.id)
      }, 1000)
      // get leads from firebase
      if (this.startdate === this.enddate) {
        window.firebase
          .database()
          .ref(`vendorsleads/${this.e1.db}`)
          .once('value')
          .then(snapshot => {
            this.leads = snapshot.val()
          })
          .then(() => {
            let today = new Date()
            let day =
              today.getDate() +
              ' ' +
              today.getFullYear() +
              ' ' +
              today.getMonth()
            const leads = Object.values(this.leads).filter(
              item => this.dateOf1(item.startedAt) === day
            )
            this.total = leads.length
          })
      } else {
        window.firebase
          .database()
          .ref(`vendorsleads/${this.e1.db}`)
          .orderByChild('startedAt')
          .startAt(this.dateOf(this.startdate))
          .endAt(this.dateOf(this.enddate))
          .once('value')
          .then(snapshot => {
            console.log('got the data!', snapshot.val())
            const data = Object.values(snapshot.val())
            this.total = data.length
          })
      }
    },
    // Query the API and print the results to the page.
    queryReports1 (id) {
      window.gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [
              {
                viewId: id,
                dateRanges: [
                  {
                    startDate: this.startdate,
                    endDate: this.enddate
                  }
                ],
                metrics: [
                  {
                    expression: 'ga:users'
                  },
                  {
                    expression: 'ga:bounceRate'
                  },
                  {
                    expression: 'ga:avgSessionDuration'
                  }
                ]
              }
            ]
          }
        })
        .then(this.displayResults1, console.error.bind(console))
    },
    displayResults1 (response) {
      this.users = response.result.reports[0].data.totals[0].values[0]
      this.bouncerate = response.result.reports[0].data.totals[0].values[1]
        .toString()
        .substring(0, 4)
      let time = response.result.reports[0].data.totals[0].values[2]
      this.averageduration = Math.floor(time / 60)
        .toString()
        .substring(0, 4)
    },
    // Query the API and print the results to the page.
    queryReports2 (id) {
      window.gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [
              {
                viewId: id,
                dateRanges: [
                  {
                    startDate: this.startdate,
                    endDate: this.enddate
                  }
                ],
                metrics: [
                  {
                    expression: 'ga:pageviews'
                  }
                ],
                dimensions: [
                  {
                    name: 'ga:browser'
                  }
                ]
              }
            ]
          }
        })
        .then(this.displayResults2, console.error.bind(console))
    },
    displayResults2 (response) {
      let browserdata = response.result.reports[0].data.rows
      console.log(browserdata)
      this.renderTopBrowsersChart(browserdata)
    },
    /**
     * Draw the a chart.js doughnut chart with data from the specified view that
     * show the top 5 browsers over the past seven days.
     */
    renderTopBrowsersChart (browserdata) {
      let data = []
      let colors = [
        '#4D5360',
        '#949FB1',
        '#D4CCC5',
        '#E2EAE9',
        '#F7464A',
        '#e57373',
        '#D81B60',
        '#673AB7',
        '#000'
      ]

      browserdata.some(function (row, i, _arr) {
        data.push({
          value: +row.metrics[0].values[0],
          color: colors[i],
          label: row.dimensions[0]
        })
        return i === 9
      })

      // Set some global Chart.js defaults.
      window.Chart.defaults.global.animationSteps = 60
      window.Chart.defaults.global.animationEasing = 'easeInOutQuart'
      window.Chart.defaults.global.responsive = true
      window.Chart.defaults.global.maintainAspectRatio = false
      // render chart
      new window.Chart(this.makeCanvas('chart-6-container')).Doughnut(data)
      this.generateLegend('legend-6-container', data)
    },
    // Query the API and print the results to the page.
    queryReports3 (id) {
      window.gapi.client
        .request({
          path: '/v4/reports:batchGet',
          root: 'https://analyticsreporting.googleapis.com/',
          method: 'POST',
          body: {
            reportRequests: [
              {
                viewId: id,
                dateRanges: [
                  {
                    startDate: this.startdate,
                    endDate: this.enddate
                  }
                ],
                metrics: [
                  {
                    expression: 'ga:pageviews'
                  }
                ],
                dimensions: [
                  {
                    name: 'ga:source'
                  }
                ]
              }
            ]
          }
        })
        .then(this.displayResults3, console.error.bind(console))
    },
    displayResults3 (response) {
      let trafficdata = response.result.reports[0].data.rows
      console.log(trafficdata)
      this.renderTopTrafficSourceChart(trafficdata)
    },
    /**
     * Draw the a chart.js doughnut chart with data from the specified view that
     * show the top 5 browsers over the past seven days.
     */
    renderTopTrafficSourceChart (trafficdata) {
      let data = []
      let colors = [
        '#4D5360',
        '#949FB1',
        '#D4CCC5',
        '#E2EAE9',
        '#F7464A',
        '#e57373',
        '#D81B60',
        '#673AB7',
        '#03DAC6',
        '#018786',
        '#000'
      ]

      trafficdata.some(function (row, i, _arr) {
        data.push({
          value: +row.metrics[0].values[0],
          color: colors[i],
          label: row.dimensions[0]
        })
        return i === 9
      })

      // Set some global Chart.js defaults.
      window.Chart.defaults.global.animationSteps = 60
      window.Chart.defaults.global.animationEasing = 'easeInOutQuart'
      window.Chart.defaults.global.responsive = true
      window.Chart.defaults.global.maintainAspectRatio = false
      // render chart
      new window.Chart(this.makeCanvas('chart-5-container')).Doughnut(data)
      this.generateLegend('legend-5-container', data)
    },
    /**
     * Create a new canvas inside the specified element. Set it to be the width
     * and height of its container.
     * @param {string} id The id attribute of the element to host the canvas.
     * @return {RenderingContext} The 2D canvas context.
     */
    makeCanvas (id) {
      let container = document.getElementById(id)
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')

      container.innerHTML = ''
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
      container.appendChild(canvas)

      return ctx
    },

    generateLegend (id, items) {
      let legend = document.getElementById(id)
      legend.innerHTML = items
        .map(function (item) {
          let color = item.color || item.fillColor
          let label = item.label
          return (
            '<li><i style="background:' + color + '"></i>' + label + '</li>'
          )
        })
        .join('')
    },

    escapeHtml (str) {
      let div = document.createElement('div')
      div.appendChild(document.createTextNode(str))
      return div.innerHTML
    }
  },
  mounted () {
    window.firebase.initializeApp(config)
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
  margin-bottom: 20px;
  margin-right: 20px;
  text-align: center;
  transition: visibility 0s, opacity 0.5s linear;
}
</style>
