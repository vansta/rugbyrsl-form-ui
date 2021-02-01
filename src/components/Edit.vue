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
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        
      </v-card-actions>
    </v-card>
    <v-row>
      <v-col cols="3">
        <v-menu v-model="startTimeMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-text-field v-on="on" v-model="newTrainingsModel.startTime" readonly label="Start uur"></v-text-field>
          </template>
          <v-time-picker format="24hr" v-model="newTrainingsModel.startTime"></v-time-picker>
        </v-menu>
        
      </v-col>
      <v-col cols="3">
        <v-menu v-model="endTimeMenu" :close-on-content-click="false">
          <template v-slot:activator="{ on }">
            <v-text-field v-on="on" v-model="newTrainingsModel.endTime" readonly label="Eind uur"></v-text-field>
          </template>
          <v-time-picker format="24hr" v-model="newTrainingsModel.endTime"></v-time-picker>
        </v-menu>
        
      </v-col>
      <v-col cols="6">
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
      },
      
      startTimeMenu: null,
      endTimeMenu: null,
      loading: false
    }),
    mounted() {
      this.getAgeGroups()
    }
  }
</script>
