<template>
  <v-app>
    <v-toolbar app :clipped-left="clipped" dark color="primary">
      <v-icon>dashboard</v-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <div id="embed-api-auth-container"></div>
    </v-toolbar>
    <v-content style="background: #e5e6e6;">
      <router-view/>
    </v-content>
    <v-footer style="background: #e5e6e6;" :fixed="fixed" app>
      <span style="margin: auto;">Emerse&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
const CLIENT_ID =
  '662994060989-alo8n62l7629hc6n6d095uvq8c69e1h8.apps.googleusercontent.com'

export default {
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
    })
  },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'E-merse Shop Analytics Dashboard'
    }
  },
  name: 'App'
}
</script>
