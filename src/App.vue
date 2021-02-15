<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      prominent
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="logo"
          transition="scale-transition"
          width="150"
        />

        <!-- <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        /> -->
        
      </div>
      <v-spacer></v-spacer>
      <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
      <v-menu absolute>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on"><v-icon>mdi-help-circle</v-icon></v-btn>
        </template>
        <v-card>
          <v-card-title class="text-break">
            RESERVEER JOUW PLEKJE VOOR DE EERSTVOLGENDE RUGBYRSL TRAININGEN
          </v-card-title>
          <v-card-text>
            Overeenkomstig de huidige covidregels voorzien we op dit moment een verplichte vooraf-inschrijving voor wie de training wil meevolgen. 
            We mogen met maximaal 10 mensen tegelijk op het veld staan wat heel beperkt is. Bovendien moeten we accuraat bijhouden wie wanneer komt trainen. 
            Daartoe rekenen we op jou om je hier in te schrijven vooraf. 
            Het aantal nog beschikbare plaatsen voor jouw leeftijdsgroep zal je online kunnen volgen. Wees er dus snel bij.
          </v-card-text>



        </v-card>
      </v-menu>
      
      <v-btn icon :to="{ name: 'Edit' }"><v-icon>mdi-pencil</v-icon></v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    
  </v-app>
</template>

<script>

export default {
  name: 'App',

  components: {
  },
  created() {
    document.title = 'Rugby RSL Covid registratie'
  },

  data: () => ({
    //
    logo: require("./assets/logo.svg")
  }),
};
</script>
