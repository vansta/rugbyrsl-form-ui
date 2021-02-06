<template>
  <v-container class="mt-16">
    <v-card>
      <v-card-text>
        <v-tabs grow v-model="selectedAgeGroupIndex" dark @change="getTrainings">
          <v-tab v-for="ageGroup in ageGroups" :key="ageGroup.id">{{ ageGroup.name }}</v-tab>
        </v-tabs>
        <v-data-table
          :headers="headers"
          :items="trainings"
          item-key="id"
          @click:row="showRegistries"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-card v-if="registries.length > 0">
      <v-card-title>
        Aanwezigheden
      </v-card-title>
      <v-card-text>
        <v-row v-for="trainingRegistry in registries" :key="trainingRegistry.id">
          <v-col cols="3">{{ trainingRegistry.name }}</v-col>
          <v-col cols="9">{{ trainingRegistry.remark }}</v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row>
      <v-col cols="4" sm="2">
        <v-menu v-model="startTimeMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-text-field v-on="on" v-model="newTrainingsModel.startTime" readonly label="Start uur"></v-text-field>
          </template>
          <v-time-picker format="24hr" v-model="newTrainingsModel.startTime"></v-time-picker>
        </v-menu>
        
      </v-col>
      <v-col cols="4" sm="2">
        <v-menu v-model="endTimeMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-text-field v-on="on" v-model="newTrainingsModel.endTime" readonly label="Eind uur"></v-text-field>
          </template>
          <v-time-picker format="24hr" v-model="newTrainingsModel.endTime"></v-time-picker>
        </v-menu>
        
      </v-col>
      <v-col cols="4" sm="2">
        <v-text-field type="number" v-model="newTrainingsModel.maxRegistries" :value="10" label="Maximum spelers"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-date-picker full-width multiple v-model="newTrainingsModel.dates"></v-date-picker>
      </v-col>
    </v-row>
    <v-btn block color="primary" @click="postNewTrainings" :loading="loading">Trainingen toevoegen</v-btn>
    
  </v-container>
  
</template>

<script>
  export default {
    name: 'Edit',
    computed: {
      selectedAgeGroupId() {
        if (this.ageGroups.length > 0){
          return this.ageGroups[this.selectedAgeGroupIndex].id
        }
        else{
          return null
        }
      },
      trainingSelected() {
        return Object.keys(this.selectedTraining).length !== 0
      }
    },
    methods: {
      getTrainings(){
        this.$api.getTrainings(this.selectedAgeGroupId)
          .then(resp => this.trainings = resp.data)
      },
      getAgeGroups(){
        this.$api.getAgeGroups()
          .then(resp => this.ageGroups = resp.data)
          .then(() => this.getTrainings())
      },
      postNewTrainings(){
        this.loading = true
        this.newTrainingsModel.ageGroupId = this.selectedAgeGroupId
        this.$api.postNewTrainings(this.newTrainingsModel)
          .then(() => {
            this.getTrainings()
          })
          .finally(() => this.loading = false)
      },
      showRegistries(item){
        this.$api.getRegistries(item.id)
          .then(resp => this.registries = resp.data)
      }
    },

    data: () => ({
      headers: [
        {
          text: "Groep",
          value: "ageGroup"
        },
        {
          text: "Datum",
          value: "dateString"
        },
        {
          text: "Start",
          value: "startTime"
        },
        {
          text: "Einde",
          value: "endTime"
        },
        {
          text: "Beschikbare plaatsen",
          value: "availableSpaces"
        }
      ],
      trainings: [],
      ageGroups: [],
      selectedAgeGroupIndex: 0,
      snackbar: {},
      newTrainingsModel: {
        dates: [],
        startTime: null,
        endTime: null,
        maxRegistries: 10
      },
      
      startTimeMenu: null,
      endTimeMenu: null,
      loading: false,
      registries: []
    }),
    mounted() {
      this.getAgeGroups()
    }
  }
</script>
